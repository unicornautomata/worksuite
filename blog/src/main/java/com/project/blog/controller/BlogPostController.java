package com.project.blog.controller;

import com.project.blog.model.BlogPost;
import com.project.blog.service.BlogPostService;
import com.project.blog.config.PublicKeyProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.*;
import java.util.stream.Collectors;
import com.project.blog.model.Comment;
@RestController
@RequestMapping("/api/blogs")
public class BlogPostController {

    private final BlogPostService service;
    private final PublicKeyProvider publicKeyProvider;

    public BlogPostController(BlogPostService service, PublicKeyProvider publicKeyProvider) {
        this.service = service;
        this.publicKeyProvider = publicKeyProvider;
    }

    private Claims extractClaims(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return Jwts.parserBuilder()
                .setSigningKey(publicKeyProvider.getPublicKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Create blog (ADMIN only, includes summary)
    @PostMapping
    public ResponseEntity<?> createBlog(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody BlogPost blog) {
        Claims claims = extractClaims(authHeader);
        String role = claims.get("role", String.class);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only ADMIN users can create blogs.");
        }

        String username = claims.getSubject(); // `sub` claim = username
        BlogPost saved = service.createBlog(blog, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ Get blog summaries with auth (title, datePosted, category, labels, id)
    @GetMapping("/summaries")
    public ResponseEntity<?> getBlogSummaries(@RequestHeader("Authorization") String authHeader) {
        Claims claims = extractClaims(authHeader);
        String username = claims.getSubject(); // logged-in user (optional usage)

        var summaries = service.getAllBlogs().stream()
                .map(blog -> new Object() {
                    public final Long blogId = blog.getId();
                    public final String title = blog.getTitle();
                    public final String category = blog.getCategory();
                    public final String labels = blog.getLabels();
                    public final String datePosted =
                            blog.getDatePosted() != null ? blog.getDatePosted().toString() : null;
                })
                .toList();

        return ResponseEntity.ok(summaries);
    }

    // ✅ Add this endpoint inside BlogPostController
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestBlog() {
        return service.getLatestBlog()
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No blog posts found"));
    }

    // ✅ Get blog by ID (digits only)
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getBlogById(@PathVariable("id") Long id) {
        return service.getBlogById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Blog post not found with id " + id));
    }

    // ✅ Update Blog by id
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBlog(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id,
                                        @RequestBody Map<String, Object> updates) {
        Claims claims = extractClaims(authHeader);
        String role = claims.get("role", String.class);

        if (!"ROLE_ADMIN".equals("ROLE_" + role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only ADMIN users can update blogs.");
        }

        Optional<BlogPost> optionalBlog = service.getBlogById(id);
        if (optionalBlog.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Blog post not found with id " + id);
        }

        BlogPost existing = optionalBlog.get();

        if (updates.containsKey("title")) {
            existing.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("content")) {
            existing.setContent((String) updates.get("content"));
        }
        if (updates.containsKey("category")) {
            existing.setCategory((String) updates.get("category"));
        }
        if (updates.containsKey("labels")) {
            existing.setLabels((String) updates.get("labels"));
        }

        BlogPost updated = service.updateBlog(id, existing);
        return ResponseEntity.ok(updated);
    }

    // ✅ Get all blogs (no role restriction)
    @GetMapping
    public ResponseEntity<?> getAllBlogs() {
        return ResponseEntity.ok(service.getAllBlogs());
    }

    // ✅ Like blog
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeBlog(@RequestHeader("Authorization") String authHeader,
                                      @PathVariable("id") Long id) {
        Claims claims = extractClaims(authHeader);
        String userId = claims.getSubject();

        boolean liked = service.likeBlog(id, userId);

        if (!liked) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User " + userId + " already liked blog " + id);
        }

        long likeCount = service.getLikesCount(id);

        return ResponseEntity.ok("Blog " + id + " liked successfully by user " + userId +
                ". Total likes: " + likeCount);
    }

    // ✅ Public endpoint: Get blog posts by label (with summary included, with debugging)
    @GetMapping("/public/by-label")
    public ResponseEntity<?> getBlogsByLabel(@RequestParam("label") String label) {

        // normalize the search term
        String normalizedLabel = label.trim().toLowerCase();
        System.out.println("[DEBUG POINT]: Searching blogs for label: [" + normalizedLabel + "]");

        var summaries = service.getAllBlogs().stream()
                .filter(blog -> {
                    if (blog.getLabels() == null) {
                        System.out.println("[DEBUG POINT] Blog " + blog.getId() + " has no labels.");
                        return false;
                    }

                    System.out.println("[DEBUG POINT]Blog " + blog.getId() + " labels raw: [" + blog.getLabels() + "]");

                    String[] splitLabels = blog.getLabels().split(",");
                    for (String l : splitLabels) {
                        String processed = l == null ? "" : l.trim().toLowerCase();
                        System.out.println(" [DEBUG POINT] → Checking label piece: [" + processed + "]");
                        if (processed.equals(normalizedLabel)) {
                            System.out.println("[DEBUG POINT]  ✅ Match found for blog " + blog.getId());
                            return true;
                        }
                    }

                    System.out.println(" [DEBUG POINT] ❌ No match for blog " + blog.getId());
                    return false;
                })
                .map(blog -> new Object() {
                    public final Long blogId = blog.getId();
                    public final String title = blog.getTitle();
                    public final String category = blog.getCategory();
                    public final String labels = blog.getLabels();
                    public final String summary = blog.getSummary();
                    public final String datePosted =
                            blog.getDatePosted() != null ? blog.getDatePosted().toString() : null;
                })
                .toList();

        System.out.println("Total blogs matched: " + summaries.size());

        return ResponseEntity.ok(summaries);
    }

    // ✅ Public endpoint: Get all normalized labels with blog counts
    @GetMapping("/public/labels-with-counts")
    public ResponseEntity<?> getLabelsWithCounts() {
        Map<String, Long> labelCounts = service.getAllBlogs().stream()
                .filter(blog -> blog.getLabels() != null && !blog.getLabels().isBlank())
                .flatMap(blog -> Arrays.stream(blog.getLabels().split(",")))
                .map(String::trim)
                .filter(label -> !label.isEmpty())
                .map(String::toLowerCase) // normalize case
                .collect(Collectors.groupingBy(label -> label, Collectors.counting()));

        // Convert to list of objects for clean JSON response
        var result = labelCounts.entrySet().stream()
                .map(entry -> new Object() {
                    public final String label = entry.getKey();
                    public final Long count = entry.getValue();
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    // ✅ Public endpoint: Get blog posts by category (with summary included, with debugging)
    @GetMapping("/public/by-category")
    public ResponseEntity<?> getBlogsByCategory(@RequestParam("category") String category) {

        // normalize the search term
        String normalizedCategory = category;
        System.out.println("[DEBUG POINT]: Searching blogs for category: [" + normalizedCategory + "]");

        var summaries = service.getAllBlogs().stream()
                .filter(blog -> {
                    if (blog.getCategory() == null) {
                        System.out.println("[DEBUG POINT] Blog " + blog.getId() + " has no category.");
                        return false;
                    }

                    System.out.println("[DEBUG POINT]Blog " + blog.getId() + " categories raw: [" + blog.getCategory() + "]");
                    if (blog.getCategory().equals(normalizedCategory)) {
                        System.out.println("[DEBUG POINT]  ✅ Match found for blog " + blog.getId());
                        return true;
                    }



                    System.out.println(" [DEBUG POINT] ❌ No match for blog " + blog.getId());
                    return false;
                })
                .map(blog -> new Object() {
                    public final Long blogId = blog.getId();
                    public final String title = blog.getTitle();
                    public final String category = blog.getCategory();
                    public final String labels = blog.getLabels();
                    public final String summary = blog.getSummary();
                    public final String datePosted =
                            blog.getDatePosted() != null ? blog.getDatePosted().toString() : null;
                })
                .toList();

        System.out.println("Total blogs matched: " + summaries.size());

        return ResponseEntity.ok(summaries);
    }
    // ✅ Public endpoint: Get all normalized categories with blog counts
    @GetMapping("/public/categories-with-counts")
    public ResponseEntity<?> getCategoriesWithCounts() {
        Map<String, Long> categoryCounts = service.getAllBlogs().stream()
                .filter(blog -> blog.getCategory() != null && !blog.getCategory().isBlank())
                .map(blog -> blog.getCategory().trim()) // normalize case
                .collect(Collectors.groupingBy(category -> category, Collectors.counting()));

        // Convert to list of objects for clean JSON response
        var result = categoryCounts.entrySet().stream()
                .map(entry -> new Object() {
                    public final String category = entry.getKey();
                    public final Long count = entry.getValue();
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    // ✅ Public endpoint: Search blog posts by keyword (title, summary, content)
@GetMapping("/public/search")
public ResponseEntity<?> searchBlogs(@RequestParam("keyword") String keyword) {
    if (keyword == null || keyword.trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Keyword cannot be empty");
    }

    String normalizedKeyword = keyword.trim().toLowerCase();
    System.out.println("[DEBUG POINT]: Searching blogs with keyword: [" + normalizedKeyword + "]");

    var summaries = service.getAllBlogs().stream()
            .filter(blog -> {
                // Defensive: avoid NPE
                String title = blog.getTitle() != null ? blog.getTitle().toLowerCase() : "";
                String summary = blog.getSummary() != null ? blog.getSummary().toLowerCase() : "";
                String content = blog.getContent() != null ? blog.getContent().toLowerCase() : "";

                boolean match = title.contains(normalizedKeyword)
                        || summary.contains(normalizedKeyword)
                        || content.contains(normalizedKeyword);

                if (match) {
                    System.out.println("[DEBUG POINT] ✅ Match found in blog " + blog.getId());
                }
                return match;
            })
            .map(blog -> new Object() {
                public final Long blogId = blog.getId();
                public final String title = blog.getTitle();
                public final String category = blog.getCategory();
                public final String labels = blog.getLabels();
                public final String summary = blog.getSummary();
                public final String datePosted =
                        blog.getDatePosted() != null ? blog.getDatePosted().toString() : null;
            })
            .toList();

    System.out.println("Total blogs matched: " + summaries.size());

    return ResponseEntity.ok(summaries);
}

@GetMapping("/public/latest-titles")
public ResponseEntity<?> getLatestBlogTitles() {
    var latest = service.getAllBlogs().stream()
            .filter(blog -> blog.getDatePosted() != null)
            .sorted(Comparator.comparing(BlogPost::getDatePosted).reversed())
            .limit(5)
            .map(blog -> new Object() {
                public final Long id = blog.getId();
                public final String title = blog.getTitle();
            })
            .toList();

    return ResponseEntity.ok(latest);
}




}
