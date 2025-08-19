package com.recyconnect.booking.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.dto.BookingRequestDto;
import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.model.Booking;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.repository.NgoRepository;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository; // To fetch the user
    private final NgoRepository ngoRepository;

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsForCurrentUser() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(currentUser.getId());

        // Convert the list of entities to a list of DTOs
        return bookings.stream()
                .map(this::mapToBookingResponseDto)
                .collect(Collectors.toList());
    }

    // Helper method to convert a Booking entity to a DTO
    private BookingResponseDto mapToBookingResponseDto(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .wasteType(booking.getWasteType())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .userName(booking.getUser().getName())
                .build();
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto bookingRequest) {
        // 1. Get the currently logged-in user's email from the security context
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Find the user entity from the database
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + currentUserEmail));

        Ngo targetNgo = ngoRepository.findById(bookingRequest.getNgoId())
                .orElseThrow(() -> new EntityNotFoundException("NGO not found with ID: " + bookingRequest.getNgoId()));

        int points = calculatePoints(bookingRequest.getWasteType());

        // 3. Create a new Booking entity
        Booking newBooking = Booking.builder()
                .user(currentUser) // Link the booking to the current user
                .ngo(targetNgo)
                .wasteType(bookingRequest.getWasteType())
                .notes(bookingRequest.getNotes())
                .status(BookingStatus.PENDING) // Default status is PENDING
                .bookingDate(LocalDateTime.now())
                .pointsAwarded(points)
                .build();

        currentUser.setEcoPoints(currentUser.getEcoPoints() + points);
        userRepository.save(currentUser);

        // 4. Save the booking to the database
        Booking savedBooking = bookingRepository.save(newBooking);

        // 5. Create and return the response DTO
        return BookingResponseDto.builder()
                .id(savedBooking.getId())
                .wasteType(savedBooking.getWasteType())
                .status(savedBooking.getStatus().name())
                .bookingDate(savedBooking.getBookingDate())
                .userName(savedBooking.getUser().getName())
                .build();
    }

    // Simple point calculation logic
    private int calculatePoints(String wasteType) {
        return switch (wasteType.toLowerCase()) {
            case "e-waste", "batteries" -> 100;
            case "plastic", "plastics" -> 50;
            case "paper", "cardboard" -> 25;
            case "clothes", "textiles" -> 40;
            default -> 10;
        };
    }
}