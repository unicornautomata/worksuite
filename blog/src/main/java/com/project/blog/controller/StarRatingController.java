package com.project.blog.controller;

import com.project.blog.model.StarRating;
import com.project.blog.service.StarRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StarRatingController {

    private final StarRatingService starRatingService;

    /**
     * Submit or update a star rating for a blog post
     * POST /api/blogs/{blogId}/rate
     * Body: { "rating": 4 }
     */
    @PostMapping("/{blogId}/rate")
    public ResponseEntity<?> rateBlogPost(
            @PathVariable Long blogId,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {

        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Please login to rate this post");
        }

        String username = authentication.getName();
        Integer rating = request.get("rating");

        // Validate rating
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        try {
            StarRating starRating = starRatingService.addOrUpdateRating(blogId, username, rating);

            // Create success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rating submitted successfully");
            response.put("rating", starRating.getRating());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get the current user's rating for a blog post
     * GET /api/blogs/{blogId}/rating
     */
    @GetMapping("/{blogId}/rating")
    public ResponseEntity<?> getUserRating(
            @PathVariable Long blogId,
            Authentication authentication) {

        // If not logged in, return rating as 0
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("rating", 0));
        }

        String username = authentication.getName();
        Integer rating = starRatingService.getUserRating(blogId, username);

        return ResponseEntity.ok(Map.of("rating", rating != null ? rating : 0));
    }
}
