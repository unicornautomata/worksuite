package com.project.blog.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
    name = "likers",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"blog_id", "user_id"}) // prevent duplicate likes
    }
)
public class Liker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // userId from JWT token (not a FK to Users table)
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "blog_id", nullable = false)
    private Long blogId;   // just a reference

    // When the blog was liked
    @Column(name = "liked_at", nullable = false)
    private LocalDateTime likedAt;
}
