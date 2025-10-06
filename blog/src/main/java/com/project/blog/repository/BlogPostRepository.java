package com.project.blog.repository;

import com.project.blog.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    // custom queries can go here later if needed

    Optional<BlogPost> findTopByOrderByIdDesc();
}
