package com.example.todo.controller;

import com.example.todo.model.Role;
import com.example.todo.model.User;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already taken";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER); // default role
        userRepository.save(user);
        return "Signup successful!";
    }

    @PostMapping("/login")
    public String login() {
        return "Login successful!";
    }
}
