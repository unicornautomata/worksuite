package com.example.todo.controller;

import com.example.todo.model.Role;
import com.example.todo.model.User;
import com.example.todo.model.VerificationToken;
import com.example.todo.repository.UserRepository;
import com.example.todo.repository.VerificationTokenRepository;
import com.example.todo.service.EmailService;
import com.example.todo.config.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");
        Role role = Role.valueOf(body.getOrDefault("role", "USER").toUpperCase());

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username taken"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered"));
        }

        User user = new User(username, passwordEncoder.encode(password), email, role);
        userRepository.save(user);

        // Create verification token
        String token = UUID.randomUUID().toString();
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime expiresAt = createdAt.plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES);

        VerificationToken verificationToken = new VerificationToken(token, user, createdAt, expiresAt, false);
        verificationTokenRepository.save(verificationToken);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), token);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "User created. Please verify your email.",
            "username", username,
            "email", email,
            "role", role.name()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid verification token"));
        }

        VerificationToken verificationToken = optionalToken.get();

        if (verificationToken.isExpired()) {
            return ResponseEntity.status(HttpStatus.GONE).body(Map.of("error", "Verification token expired"));
        }

        User user = verificationToken.getUser();

        if (user.isEmailVerified()) {
            return ResponseEntity.ok(Map.of("message", "Email already verified"));
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setTokenExpired(true);
        verificationTokenRepository.save(verificationToken);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authHeader) {
        String base64Credentials = authHeader.substring("Basic ".length()).trim();
        byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(credDecoded);
        final String[] values = credentials.split(":", 2);

        String username = values[0];
        String password = values[1];

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid user"));
        }

        if (!user.isEmailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "Email not verified. Please verify your email before logging in.",
                "username", user.getUsername(),
                "resendAvailable", true
            ));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Login successful!",
            "username", user.getUsername(),
            "role", user.getRole().name()
        ));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        if (user.isEmailVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already verified"));
        }

        verificationTokenRepository.findByUser(user).ifPresent(existing -> {
            verificationTokenRepository.delete(existing);
        });

        String token = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES);

        VerificationToken newToken = new VerificationToken(token, user, now, expiresAt, false);
        verificationTokenRepository.save(newToken);

        emailService.sendVerificationEmail(user.getEmail(), token);

        return ResponseEntity.ok(Map.of("message", "Verification email sent. Please check your inbox."));
    }
}
