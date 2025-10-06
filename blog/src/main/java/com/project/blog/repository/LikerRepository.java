package com.project.blog.repository;

import com.project.blog.model.Liker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikerRepository extends JpaRepository<Liker, Long> {
    Optional<Liker> findByBlogIdAndUserId(Long blogId, String userId);
    long countByBlogId(Long blogId);
}
