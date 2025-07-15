package com.example.todo.controller;

import com.example.todo.model.Role;
import com.example.todo.model.User;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Role role = Role.valueOf(body.getOrDefault("role", "USER").toUpperCase());

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Map.of("error", "Username taken"));
        }

        User user = new User(username, passwordEncoder.encode(password), role);
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(Map.of(
                                 "message", "User created",
                                 "username", username,
                                 "role", role.name()
                             ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authHeader) {
      String base64Credentials = authHeader.substring("Basic ".length()).trim();
      byte[] credDecoded = java.util.Base64.getDecoder().decode(base64Credentials);
      String credentials = new String(credDecoded);
      final String[] values = credentials.split(":", 2);

      String username = values[0];

      User user = userRepository.findByUsername(username).orElse(null);
      if (user == null) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid user"));
        }

        return ResponseEntity.ok(Map.of(
            "message", "Login successful!",
            "username", user.getUsername(),
            "role", user.getRole().name()
            ));
      }
}
