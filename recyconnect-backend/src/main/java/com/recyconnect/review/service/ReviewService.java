package com.recyconnect.review.service;

import com.recyconnect.auth.model.User;
import com.recyconnect.booking.model.Booking;
import com.recyconnect.booking.model.BookingStatus;
import com.recyconnect.booking.repository.BookingRepository;
import com.recyconnect.review.dto.ReviewResponseDto;
import com.recyconnect.review.dto.SubmitReviewRequestDto;
import com.recyconnect.review.model.Review;
import com.recyconnect.review.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ReviewResponseDto submitReview(SubmitReviewRequestDto request, User currentUser) {
        // 1. Find the booking the review is for
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with ID: " + request.getBookingId()));

        // 2. Perform validation checks
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("You can only review completed bookings.");
        }
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to review this booking.");
        }
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new IllegalStateException("A review for this booking has already been submitted.");
        }

        // 3. Create and save the new review
        Review newReview = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(currentUser)
                .ngo(booking.getNgo())
                .booking(booking)
                .build();

        Review savedReview = reviewRepository.save(newReview);
        return ReviewResponseDto.fromEntity(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getReviewsForNgo(Long ngoId) {
        List<Review> reviews = reviewRepository.findByNgoId(ngoId);
        return reviews.stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}