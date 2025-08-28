package com.recyconnect.booking.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.auth.repository.UserRepository;
import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.model.Booking;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoBookingService {

    private final BookingRepository bookingRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getPendingBookingsForCurrentNgo() {
        Ngo currentNgo = getCurrentNgo();
        List<Booking> bookings = bookingRepository.findByNgoIdAndStatusOrderByBookingDateAsc(currentNgo.getId(), BookingStatus.PENDING);
        return bookings.stream().map(this::mapToBookingResponseDto).collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto updateBookingStatus(Long bookingId, String newStatusStr) {
        Ngo currentNgo = getCurrentNgo();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + bookingId));

        // Security check: Ensure the booking belongs to the logged-in NGO
        if (!booking.getNgo().getId().equals(currentNgo.getId())) {
            throw new AccessDeniedException("You are not authorized to update this booking.");
        }

        BookingStatus newStatus = BookingStatus.valueOf(newStatusStr.toUpperCase());
        booking.setStatus(newStatus);
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
}