package com.recyconnect.booking.controller;

import com.recyconnect.booking.dto.BookingResponseDto;
import com.recyconnect.booking.service.NgoBookingService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.recyconnect.booking.dto.OtpVerificationRequestDto;
import jakarta.validation.Valid;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/ngo/bookings")
@PreAuthorize("hasRole('NGO')") // Secure the entire controller for NGOs
public class NgoBookingController {

    private final NgoBookingService ngoBookingService;

    @GetMapping("/requests")
    public ResponseEntity<List<BookingResponseDto>> getBookingRequests() {
        List<BookingResponseDto> requests = ngoBookingService.getActiveBookingsForCurrentNgo(); // 👈 Call the renamed method
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/{bookingId}/accept")
    public ResponseEntity<BookingResponseDto> acceptBooking(@PathVariable Long bookingId) {
        BookingResponseDto updatedBooking = ngoBookingService.acceptBooking(bookingId);
        return ResponseEntity.ok(updatedBooking);
    }

    // NEW ENDPOINT: Resend OTP
    @PostMapping("/{bookingId}/resend-otp")
    public ResponseEntity<Void> resendOtp(@PathVariable Long bookingId) {
        ngoBookingService.resendOtp(bookingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponseDto> completeBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody OtpVerificationRequestDto request) {
        BookingResponseDto completedBooking = ngoBookingService.completeBookingWithOtp(bookingId, request);
        return ResponseEntity.ok(completedBooking);
    }

    @PostMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(@PathVariable Long bookingId) {
        BookingResponseDto response = ngoBookingService.rejectBooking(bookingId);
        return ResponseEntity.ok(response);
    }
}