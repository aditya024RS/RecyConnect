package com.recyconnect.booking.repository;

import com.recyconnect.booking.model.Booking;
import com.recyconnect.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find all bookings for a specific user ID
    List<Booking> findByUserIdOrderByBookingDateDesc(Integer userId);

    // Finds all bookings for a specific NGO and status.
    List<Booking> findByNgoIdAndStatusOrderByBookingDateAsc(Long ngoId, BookingStatus status);

    long countByStatus(BookingStatus status);
}