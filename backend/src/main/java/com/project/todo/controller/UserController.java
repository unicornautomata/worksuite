package com.project.todo.controller;

import com.project.todo.model.User;
import com.project.todo.repository.UserRepository;
import com.project.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // ✅ DTO for picture upload
    public static class PictureRequest {
        private String pictureBase64;

        public String getPictureBase64() {
            return pictureBase64;
        }

        public void setPictureBase64(String pictureBase64) {
            this.pictureBase64 = pictureBase64;
        }
    }

    // ✅ Upload or update profile picture (Base64 stored in DB)
    @PostMapping("/{id}/upload-picture")
    public ResponseEntity<?> uploadPicture(
            @PathVariable Long id,
            @RequestBody PictureRequest pictureRequest,
            Authentication authentication) {
        try {
            // 🔐 Get logged-in user
            User currentUser = userService.getUserByUsername(authentication.getName());

            // Owner or ADMIN check
            if (!currentUser.getId().equals(id) && !currentUser.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(403).body("You are not allowed to update this picture");
            }

            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();

            // ✅ Validate and store Base64
            if (pictureRequest.getPictureBase64() == null || pictureRequest.getPictureBase64().isBlank()) {
                return ResponseEntity.badRequest().body("Picture data is missing");
            }

            try {
                // Decode just to validate it's a valid Base64 string
                byte[] imageBytes = Base64.getDecoder().decode(pictureRequest.getPictureBase64());
                // Encode back (optional, ensures consistency)
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                user.setPicture(base64Image);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid Base64 string");
            }

            userRepository.save(user);

            return ResponseEntity.ok("Profile picture uploaded successfully (Base64)");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading picture: " + e.getMessage());
        }
    }

    // ✅ Get profile picture as Base64 (safe for JSON/React frontend)
    @GetMapping("/{id}/picture")
    public ResponseEntity<?> getPicture(@PathVariable Long id, Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());

        // Only owner or admin can view
        if (!currentUser.getId().equals(id) && !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body("You are not allowed to view this picture");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (user.getPicture() == null) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Return as JSON object
        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "userId", user.getId(),
                        "username", user.getUsername(),
                        "pictureBase64", user.getPicture()
                )
        );
    }
}
