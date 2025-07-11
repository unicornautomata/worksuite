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
    public String login() {
        return "Login successful!";
    }
}
