package com.project.blog.service;

import com.project.blog.model.BlogPost;
import com.project.blog.model.Liker;
import com.project.blog.repository.BlogPostRepository;
import com.project.blog.repository.LikerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogPostService {

    private final BlogPostRepository repository;
    private final LikerRepository likerRepository;

    public BlogPostService(BlogPostRepository repository, LikerRepository likerRepository) {
        this.repository = repository;
        this.likerRepository = likerRepository;
    }

    // ✅ Create a new blog post
    public BlogPost createBlog(BlogPost blog, String username) {
        blog.setPostedBy(username);
        blog.setDatePosted(LocalDateTime.now());
        blog.setLikesCount(0);
        blog.setSharesCount(0);
        blog.setCommentsCount(0);
        return repository.save(blog);
    }

    // ✅ Get blog post by ID
    public Optional<BlogPost> getBlogById(Long id) {
        return repository.findById(id);
    }

    // ✅ Get all blog posts
    public List<BlogPost> getAllBlogs() {
        return repository.findAll();
    }
    @Transactional(readOnly = true)   // ✅ FIX: ensures proper transaction for LOB fetch
      public Optional<BlogPost> getLatestBlog() {
          return repository.findTopByOrderByIdDesc();
      }

    // ✅ Update blog
    public BlogPost updateBlog(Long id, BlogPost updatedBlog) {
        updatedBlog.setId(id);
        return repository.save(updatedBlog);
    }

    // ✅ Delete blog
    public void deleteBlog(Long id) {
        repository.deleteById(id);
    }

    // ✅ Like a blog (only once per user)
    public boolean likeBlog(Long blogId, String userId) {
        Optional<Liker> existingLike = likerRepository.findByBlogIdAndUserId(blogId, userId);

        if (existingLike.isPresent()) {
            return false; // already liked
        }

        Liker liker = Liker.builder()
                .blogId(blogId)
                .userId(userId)
                .likedAt(LocalDateTime.now())
                .build();

        likerRepository.save(liker);

        // Increment likes_count in blog_posts
      BlogPost blogPost = repository.findById(blogId)
              .orElseThrow(() -> new RuntimeException("Blog not found"));
      blogPost.setLikesCount(blogPost.getLikesCount() + 1);
      repository.save(blogPost);

        return true;
    }

    // ✅ Count likes
    public long getLikesCount(Long blogId) {
        return likerRepository.countByBlogId(blogId);
    }
}
