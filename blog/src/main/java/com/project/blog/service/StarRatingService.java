package com.project.blog.service;

import com.project.blog.model.BlogPost;
import com.project.blog.model.StarRating;
import com.project.blog.repository.BlogPostRepository;
import com.project.blog.repository.StarRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StarRatingService {

    private final StarRatingRepository starRatingRepository;
    private final BlogPostRepository blogPostRepository;

    /**
     * Add a new rating or update an existing rating for a blog post
     * @param blogPostId The ID of the blog post being rated
     * @param username The username of the person rating
     * @param rating The rating value (1-5)
     * @return The saved StarRating entity
     */
    @Transactional
    public StarRating addOrUpdateRating(Long blogPostId, String username, int rating) {
        // Validate rating value
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check if blog post exists
        BlogPost blogPost = blogPostRepository.findById(blogPostId)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));

        // Check if user already rated this post
        Optional<StarRating> existingRating = starRatingRepository
                .findByBlogPostIdAndUsername(blogPostId, username);

        if (existingRating.isPresent()) {
            // Update existing rating
            StarRating starRating = existingRating.get();
            starRating.setRating(rating);
            return starRatingRepository.save(starRating);
        } else {
            // Create new rating
            StarRating newRating = StarRating.builder()
                    .username(username)
                    .rating(rating)
                    .blogPost(blogPost)
                    .build();
            return starRatingRepository.save(newRating);
        }
    }

    /**
     * Get a user's rating for a specific blog post
     * @param blogPostId The blog post ID
     * @param username The username
     * @return The rating value (1-5) or null if user hasn't rated
     */
    public Integer getUserRating(Long blogPostId, String username) {
        return starRatingRepository.findByBlogPostIdAndUsername(blogPostId, username)
                .map(StarRating::getRating)
                .orElse(null);
    }

    /**
     * Check if a user has rated a specific blog post
     * @param blogPostId The blog post ID
     * @param username The username
     * @return true if user has rated, false otherwise
     */
    public boolean hasUserRated(Long blogPostId, String username) {
        return starRatingRepository.existsByBlogPostIdAndUsername(blogPostId, username);
    }
}
