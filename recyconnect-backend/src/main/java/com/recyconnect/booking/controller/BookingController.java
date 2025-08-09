package com.recyconnect.booking.controller;

import com.recyconnect.booking.dto.BookingRequestDto;
import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto bookingRequest) {
        BookingResponseDto newBooking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(newBooking);
    }
}