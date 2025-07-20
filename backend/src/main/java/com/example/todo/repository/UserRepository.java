package com.example.todo.repository;

import com.example.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // ✅ New: Find user by email
   Optional<User> findByEmail(String email);



   // ✅ New: Check if email already exists (for signup validation)
   boolean existsByEmail(String email);
}
