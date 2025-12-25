package com.recyconnect.booking.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.model.Booking;
import com.recyconnect.auth.service.EmailService;
import com.recyconnect.booking.dto.OtpVerificationRequestDto;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recyconnect.review.repository.ReviewRepository;
import com.recyconnect.stats.dto.NotificationDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoBookingService {

    private final BookingRepository bookingRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ReviewRepository reviewRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getActiveBookingsForCurrentNgo() { // 👈 Renamed for clarity
        Ngo currentNgo = getCurrentNgo();
        // Fetch bookings that are either PENDING or ACCEPTED
        List<BookingStatus> statuses = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);
        List<Booking> bookings = bookingRepository.findByNgoIdAndStatusInOrderByBookingDateAsc(currentNgo.getId(), statuses);
        return bookings.stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto rejectBooking(Long bookingId) {
        Ngo currentNgo = getCurrentNgo();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        // Security Check
        if (!booking.getNgo().getId().equals(currentNgo.getId())) {
            throw new AccessDeniedException("You are not authorized to reject this booking.");
        }

        // Logic Check
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected.");
        }

        booking.setStatus(BookingStatus.REJECTED);

        // Optional: Notify User via WebSocket
        String destination = "/queue/notifications/" + booking.getUser().getId();
        messagingTemplate.convertAndSend(destination, new com.recyconnect.stats.dto.NotificationDto("Your booking with " + currentNgo.getName() + " was declined."));

        Booking savedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(savedBooking);
    }

    @Transactional
    public BookingResponseDto acceptBooking(Long bookingId) {
        Ngo currentNgo = getCurrentNgo();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + bookingId));

        // Security check
        if (!booking.getNgo().getId().equals(currentNgo.getId())) {
            throw new AccessDeniedException("You are not authorized to update this booking.");
        }

        // Workflow check: Can only accept PENDING bookings
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("This booking cannot be accepted as it is not pending.");
        }

        // Update status and generate OTP
        booking.setStatus(BookingStatus.ACCEPTED);
        String otp = generateOtp();
        booking.setOtp(otp);
        booking.setOtpExpiryDate(LocalDateTime.now().plusHours(24));

        // UPDATED CALL: Passing userName and wasteType now
        emailService.sendBookingAcceptedOtpEmail(
                booking.getUser().getEmail(),
                booking.getUser().getName(),
                currentNgo.getName(),
                otp,
                booking.getWasteType()
        );

        // The destination is specific to the user who made the booking
        String destination = "/queue/notifications/" + booking.getUser().getId();

        // Real-time notification
        String notificationMessage = "Your booking with " + currentNgo.getName() + " has been accepted!";

        messagingTemplate.convertAndSend(destination, new NotificationDto(notificationMessage));

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(updatedBooking);
    }

    @Transactional
    public void resendOtp(Long bookingId) {
        Ngo currentNgo = getCurrentNgo();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + bookingId));

        // Security check
        if (!booking.getNgo().getId().equals(currentNgo.getId())) {
            throw new AccessDeniedException("You are not authorized to access this booking.");
        }

        // Logic check: Can only resend OTP for ACCEPTED bookings
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("OTP can only be resent for accepted bookings.");
        }

        // Generate new OTP and extend expiry
        String newOtp = generateOtp();
        booking.setOtp(newOtp);
        booking.setOtpExpiryDate(LocalDateTime.now().plusHours(24));

        // Send email
        emailService.sendBookingAcceptedOtpEmail(
                booking.getUser().getEmail(),
                booking.getUser().getName(),
                currentNgo.getName(),
                newOtp,
                booking.getWasteType()
        );

        bookingRepository.save(booking);
    }

    @Transactional
    public BookingResponseDto completeBookingWithOtp(Long bookingId, OtpVerificationRequestDto request) {
        Ngo currentNgo = getCurrentNgo();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + bookingId));

        // Security check: Ensure the booking belongs to the logged-in NGO
        if (!booking.getNgo().getId().equals(currentNgo.getId())) {
            throw new AccessDeniedException("You are not authorized to complete this booking.");
        }

        // Validation check 1: Ensure OTP is not null and matches
        if (booking.getOtp() == null || !booking.getOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        // Validation check 2: Ensure OTP has not expired
        if (booking.getOtpExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please ask the user for a new one.");
        }

        // 1. Calculate points for this booking
        int points = calculatePoints(booking.getWasteType());

        // 2. Get the user who made the booking
        User user = booking.getUser();

        // 3. Update the user's total points
        user.setEcoPoints(user.getEcoPoints() + points);
        userRepository.save(user);

        // 4. NEW: Award 50% Points to the NGO's User Account
        User ngoUser = currentNgo.getUser();
        int ngoPoints = points / 2; // 50% commission
        ngoUser.setEcoPoints(ngoUser.getEcoPoints() + ngoPoints);
        userRepository.save(ngoUser);

        // All checks passed, complete the booking
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setPointsAwarded(points);
        booking.setOtp(null); // Clear the OTP for security
        booking.setOtpExpiryDate(null);

        // Notify User
        String destination = "/queue/notifications/" + user.getId();
        messagingTemplate.convertAndSend(destination,
                new com.recyconnect.stats.dto.NotificationDto("Pickup Complete! You earned " + points + " EcoPoints."));

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(updatedBooking);
    }

    // Helper method to get the NGO profile of the currently logged-in user
    private Ngo getCurrentNgo() {
        // Get ID string
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fix: Parse ID and find by ID (NOT email)
        return ngoRepository.findByUserId(Integer.parseInt(currentUserId))
                .orElseThrow(() -> new RuntimeException("NGO profile not found for the current user"));
    }

    // Helper to map entity to DTO
    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        boolean hasReview = reviewRepository.existsByBookingId(booking.getId());
        return BookingResponseDto.builder()
                .id(booking.getId())
                .wasteType(booking.getWasteType())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .userName(booking.getUser().getName())
                .ngoName(booking.getNgo().getName())
                .ngoId(booking.getNgo().getId())
                .reviewed(hasReview)
                .build();
    }

    // Helper method to generate a simple 6-digit OTP
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // Helper method here (moved from BookingService)
    private int calculatePoints(String wasteType) {
        if (wasteType == null) return 10;
        return switch (wasteType.toLowerCase()) {
            case "e-waste", "batteries" -> 100;
            case "plastic", "plastics", "metal" -> 50;
            case "paper", "cardboard" -> 25;
            case "clothes", "textiles" -> 40;
            default -> 10;
        };
    }
}