package com.example.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.todo.model.VerificationToken;
import com.example.todo.model.User;

import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    // ✅ Add this method to find token by user
    Optional<VerificationToken> findByUser(User user);
}
