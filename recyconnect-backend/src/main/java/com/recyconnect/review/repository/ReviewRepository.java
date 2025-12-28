package com.recyconnect.review.repository;

import com.recyconnect.review.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a specific NGO
    List<Review> findByNgoId(Long ngoId);

    // Check if a review for a specific booking already exists
    boolean existsByBookingId(Long bookingId);

    // NEW: Calculate average rating directly in DB
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.ngo.id = :ngoId")
    Double getAverageRatingByNgoId(Long ngoId);
}