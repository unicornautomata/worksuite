package com.project.blog.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // blogpost id

    private String title;
    @Column(name = "category")
    private String category;

    // ✅ Just a plain column for comma-separated labels
    @Column(name = "labels")
    private String labels;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    private String summary;

    @Column(name = "posted_by")
    private String postedBy;

    @Column(name = "date_posted")
    private LocalDateTime datePosted;

    // Counters
    private int likesCount;
    private int sharesCount;
    private int commentsCount;

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
private List<Comment> comments;



    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sharer> sharers;

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StarRating> ratings;
}
