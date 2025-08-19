package com.recyconnect.booking.controller;

import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.service.NgoBookingService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/ngo/bookings")
@PreAuthorize("hasRole('NGO')") // Secure the entire controller for NGOs
public class NgoBookingController {

    private final NgoBookingService ngoBookingService;

    @GetMapping("/requests")
    public ResponseEntity<List<BookingResponseDto>> getBookingRequests() {
        List<BookingResponseDto> requests = ngoBookingService.getPendingBookingsForCurrentNgo();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/{bookingId}/update-status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(@PathVariable Long bookingId, @RequestBody String status) {
        BookingResponseDto updatedBooking = ngoBookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }
}