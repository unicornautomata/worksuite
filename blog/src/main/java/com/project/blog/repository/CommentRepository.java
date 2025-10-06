package com.project.blog.repository;

import com.project.blog.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBlogPost_Id(Long blogId);

    List<Comment> findByBlogPost_IdAndApprovedTrue(Long blogId); // New method for approved comments
}
