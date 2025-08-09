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

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository; // To fetch the user

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto bookingRequest) {
        // 1. Get the currently logged-in user's email from the security context
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Find the user entity from the database
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + currentUserEmail));

        // 3. Create a new Booking entity
        Booking newBooking = Booking.builder()
                .user(currentUser) // Link the booking to the current user
                .wasteType(bookingRequest.getWasteType())
                .notes(bookingRequest.getNotes())
                .status(BookingStatus.PENDING) // Default status is PENDING
                .bookingDate(LocalDateTime.now())
                .build();

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
}