package com.recyconnect.booking.service;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.dto.BookingRequestDto;
import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.model.Booking;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;
import com.recyconnect.review.repository.ReviewRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsForCurrentUser() {
        // 1. Get current User by ID
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        // The repository might need an Integer, so we parse it
        User currentUser = userRepository.findById(Integer.parseInt(currentUserId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(currentUser.getId());
        return bookings.stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
    }

    // Helper method to convert a Booking entity to a DTO
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

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto bookingRequest) {
        // 1. Get current User by ID
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findById(Integer.parseInt(currentUserId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent NGOs from booking services (they are providers, not consumers)
        if (currentUser.getRole() == Role.ROLE_NGO) {
            throw new AccessDeniedException("Service Providers (NGOs) are not authorized to book pickups. Please log in as a standard User.");
        }

        Ngo targetNgo = ngoRepository.findById(bookingRequest.getNgoId())
                .orElseThrow(() -> new EntityNotFoundException("NGO not found with ID: " + bookingRequest.getNgoId()));

        Booking newBooking = Booking.builder()
                .user(currentUser)
                .ngo(targetNgo)
                .wasteType(bookingRequest.getWasteType())
                .notes(bookingRequest.getNotes())
                .status(BookingStatus.PENDING)
                .bookingDate(LocalDateTime.now())
                .pointsAwarded(0) // Default points
                .build();

        Booking savedBooking = bookingRepository.save(newBooking);

        return mapToBookingResponseDto(savedBooking);
    }

    // Simple point calculation logic
    private int calculatePoints(String wasteType) {
        return switch (wasteType.toLowerCase()) {
            case "e-waste", "batteries" -> 100;
            case "plastic", "metal" -> 50;
            case "paper", "cardboard" -> 25;
            case "clothes", "textiles" -> 40;
            default -> 10;
        };
    }
}