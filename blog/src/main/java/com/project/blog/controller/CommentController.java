package com.project.blog.controller;

import com.project.blog.model.Comment;
import com.project.blog.service.BlogProducer;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import com.project.blog.service.CommentService;
import com.project.blog.config.PublicKeyProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final PublicKeyProvider publicKeyProvider;
    @Autowired
    private BlogProducer blogProducer;

    public CommentController(CommentService commentService, PublicKeyProvider publicKeyProvider) {
        this.commentService = commentService;
        this.publicKeyProvider = publicKeyProvider;
    }

    // 🔑 Utility to extract claims from token
    private Claims extractClaims(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        String token = authHeader.replace("Bearer ", "");
        return Jwts.parserBuilder()
                .setSigningKey(publicKeyProvider.getPublicKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

 // ✅ Save new comment (registered users only)
@PostMapping("/{blogId}")
public ResponseEntity<?> addComment(@RequestHeader("Authorization") String authHeader,
                                    @PathVariable Long blogId,
                                    @RequestBody Comment comment) {
    try {
        Claims claims = extractClaims(authHeader);
        Long userId = claims.get("userid", Long.class);
        String username = claims.getSubject();
        String fullName = claims.get("fullName", String.class); // ✅ Extract fullName from token

        // ✅ Sanitize comment text
        String sanitizedComment = Jsoup.clean(comment.getComment(), Safelist.basic());
        comment.setComment(sanitizedComment);

        // ✅ Validate comment (use comment.getComment(), not sanitizedComment.getComment())
        if (comment.getComment() == null || comment.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment cannot be empty");
        }
        if (comment.getComment().length() > 1000) {
            return ResponseEntity.badRequest().body("Comment exceeds 1000 characters");
        }

        // ✅ Save sanitized comment
        Comment saved = commentService.addComment(blogId, userId, username, fullName, comment);

        // 🔔 SEND KAFKA NOTIFICATION TO ADMIN
        String notificationMessage = fullName + " (" + username + ") commented on blog #" + blogId;
        blogProducer.publishBlogEvent("comment.created", notificationMessage);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}
    // ✅ Approve a comment (ADMIN only)
    @PostMapping("/{commentId}/approve")
    public ResponseEntity<?> approveComment(@RequestHeader("Authorization") String authHeader,
                                            @PathVariable Long commentId) {
        try {
            Claims claims = extractClaims(authHeader);

            String role = claims.get("role", String.class);
            Long adminId = claims.get("userid", Long.class);

            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only ADMIN can approve comments.");
            }

            Comment approved = commentService.approveComment(commentId, adminId);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // ✅ Unapprove a comment (ADMIN only)
@PostMapping("/{commentId}/unapprove")
public ResponseEntity<?> unapproveComment(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long commentId) {
    try {
        Claims claims = extractClaims(authHeader);
        String role = claims.get("role", String.class);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only ADMIN can unapprove comments.");
        }

        Comment comment = commentService.unapproveComment(commentId);
        return ResponseEntity.ok(comment);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}

// ✅ Delete a comment (ADMIN only)
@DeleteMapping("/{commentId}")
public ResponseEntity<?> deleteComment(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable Long commentId) {
    try {
        Claims claims = extractClaims(authHeader);
        String role = claims.get("role", String.class);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only ADMIN can delete comments.");
        }

        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }
}

    // ✅ Public endpoint - view approved comments for a blog
    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long blogId) {
        List<Comment> comments = commentService.getApprovedComments(blogId);
        return ResponseEntity.ok(comments);
    }

    // ✅ Optional: Get all comments (including unapproved) for ADMIN review
    @GetMapping("/blog/{blogId}/all")
    public ResponseEntity<?> getAllComments(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long blogId) {
        try {
            Claims claims = extractClaims(authHeader);
            String role = claims.get("role", String.class);

            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only ADMIN can view all comments.");
            }

            List<Comment> comments = commentService.getCommentsByBlogPost(blogId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}
