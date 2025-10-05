package com.project.todo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "verification_token",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "type"})
    }
)
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // e.g. "EMAIL_VERIFICATION", "RESET_PASSWORD"

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private boolean tokenExpired;

    public VerificationToken() {}

    public VerificationToken(String token, User user, String type,
                             LocalDateTime createdAt, LocalDateTime expiresAt,
                             boolean tokenExpired) {
        this.token = token;
        this.user = user;
        this.type = type;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.tokenExpired = tokenExpired;
    }

    // --- Utility ---
    public boolean isExpired() {
        return tokenExpired || LocalDateTime.now().isAfter(expiresAt);
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isTokenExpired() {
        return tokenExpired;
    }

    public void setTokenExpired(boolean tokenExpired) {
        this.tokenExpired = tokenExpired;
    }
}
