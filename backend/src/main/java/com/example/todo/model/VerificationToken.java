package com.example.todo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.Duration;
import com.example.todo.model.User;
@Entity
public class VerificationToken {

    //public static final Duration EXPIRATION = Duration.ofHours(24); // You can override this for testing

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true, nullable = false)
    private String token;

    @OneToOne
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean tokenExpired;

    public VerificationToken() {}
    public boolean isExpired() {
      return tokenExpired || LocalDateTime.now().isAfter(expiresAt);
  }
    public VerificationToken(String token, User user, LocalDateTime createdAt, LocalDateTime expiresAt, boolean tokenExpired) {
        this.token = token;
        this.user = user;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.tokenExpired = tokenExpired;
    }

    // Getters and setters...

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
