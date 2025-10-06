package com.project.blog.repository;

import com.project.blog.model.StarRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StarRatingRepository extends JpaRepository<StarRating, Long> {
    // Find all ratings for a blog post
    List<StarRating> findByBlogPostId(Long blogId);

    // Find a user's rating for a blog (prevent duplicates)
    Optional<StarRating> findByBlogPostIdAndUsername(Long blogId, String username);

    // Check if a rating exists (more efficient than findBy when you only need true/false)
    boolean existsByBlogPostIdAndUsername(Long blogId, String username);
}
