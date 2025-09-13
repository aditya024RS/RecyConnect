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

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getActiveBookingsForCurrentNgo() { // 👈 Renamed for clarity
        Ngo currentNgo = getCurrentNgo();
        // Fetch bookings that are either PENDING or ACCEPTED
        List<BookingStatus> statuses = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);
        List<Booking> bookings = bookingRepository.findByNgoIdAndStatusInOrderByBookingDateAsc(currentNgo.getId(), statuses);
        return bookings.stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
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

        emailService.sendBookingAcceptedOtpEmail(booking.getUser().getEmail(), currentNgo.getName(), otp);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(updatedBooking);
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

        // All checks passed, complete the booking
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setOtp(null); // Clear the OTP for security
        booking.setOtpExpiryDate(null);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponseDto(updatedBooking);
    }

    // Helper method to get the NGO profile of the currently logged-in user
    private Ngo getCurrentNgo() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ngoRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("NGO profile not found for the current user"));
    }

    // Helper to map entity to DTO
    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .wasteType(booking.getWasteType())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .userName(booking.getUser().getName())
                .build();
    }

    // Helper method to generate a simple 6-digit OTP
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}