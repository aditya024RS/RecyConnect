package com.recyconnect.review.controller;

import com.recyconnect.auth.model.User;
import com.recyconnect.review.dto.ReviewResponseDto;
import com.recyconnect.review.dto.SubmitReviewRequestDto;
import com.recyconnect.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Endpoint for a user to SUBMIT a new review
    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@Valid @RequestBody SubmitReviewRequestDto request, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            ReviewResponseDto newReview = reviewService.submitReview(request, currentUser);
            return new ResponseEntity<>(newReview, HttpStatus.CREATED);
        } catch (Exception e) {
            // Catch potential exceptions from the service (e.g., already reviewed, not completed)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint to GET all reviews for a specific NGO
    @GetMapping("/ngos/{ngoId}/reviews")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsForNgo(@PathVariable Long ngoId) {
        List<ReviewResponseDto> reviews = reviewService.getReviewsForNgo(ngoId);
        return ResponseEntity.ok(reviews);
    }
}