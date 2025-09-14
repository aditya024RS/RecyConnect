package com.recyconnect.review.repository;

import com.recyconnect.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a specific NGO
    List<Review> findByNgoId(Long ngoId);

    // Check if a review for a specific booking already exists
    boolean existsByBookingId(Long bookingId);
}