package com.project.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.todo.model.VerificationToken;
import com.project.todo.model.User;

import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    // Find token by its unique value
    Optional<VerificationToken> findByToken(String token);

    // Find all tokens for a user
    Optional<VerificationToken> findByUser(User user);

    // Find a token by user and type (EMAIL_VERIFICATION or RESET_PASSWORD)
    Optional<VerificationToken> findByUserAndType(User user, String type);
}
