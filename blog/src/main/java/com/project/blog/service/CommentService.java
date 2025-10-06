package com.project.blog.service;

import com.project.blog.model.Comment;
import com.project.blog.model.BlogPost;
import com.project.blog.repository.CommentRepository;
import com.project.blog.repository.BlogPostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogPostRepository blogPostRepository; // You'll need this

    public CommentService(CommentRepository commentRepository, BlogPostRepository blogPostRepository) {
        this.commentRepository = commentRepository;
        this.blogPostRepository = blogPostRepository;
    }

    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    // New method to add comment with user info
    public Comment addComment(Long blogId, Long userId, String username, String fullname, Comment commentRequest) {
        // Find the blog post
        BlogPost blogPost = blogPostRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));

        // Set up the comment
        Comment comment = new Comment();
        comment.setBlogPost(blogPost);
        comment.setUserId(userId);
        comment.setUsername(username);      // ✅ Set username
        comment.setFullname(fullname);      // ✅ Set fullName
        comment.setComment(commentRequest.getComment());
        comment.setDatePosted(java.time.LocalDateTime.now());
        comment.setApproved(false); // Default to not approved

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByBlogPost(Long blogId) {
        return commentRepository.findByBlogPost_Id(blogId);
    }

    // New method to get only approved comments
    public List<Comment> getApprovedComments(Long blogId) {
        return commentRepository.findByBlogPost_IdAndApprovedTrue(blogId);
    }

    public Comment approveComment(Long commentId, Long adminUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setApproved(true);
        comment.setApprovedBy(adminUserId);
        return commentRepository.save(comment);
    }

    public Comment unapproveComment(Long commentId) {
    Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

    comment.setApproved(false);
    comment.setApprovedBy(null); // optional, clears the approver
    return commentRepository.save(comment);
}

public void deleteComment(Long commentId) {
if (!commentRepository.existsById(commentId)) {
    throw new RuntimeException("Comment not found");
}
commentRepository.deleteById(commentId);
}
}
