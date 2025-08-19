package com.recyconnect.booking.repository;

import com.recyconnect.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find all bookings for a specific user ID
    List<Booking> findByUserIdOrderByBookingDateDesc(Integer userId);
}