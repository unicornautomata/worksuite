package com.project.todo.controller;

import com.project.todo.model.AcnTyp;
import com.project.todo.model.Role;
import com.project.todo.model.User;
import com.project.todo.model.VerificationToken;
import com.project.todo.repository.UserRepository;
import com.project.todo.repository.VerificationTokenRepository;
import com.project.todo.service.EmailService;
import com.project.todo.service.CachedUserService;
import com.project.todo.service.TodoProducer;
import com.project.todo.config.AppConstants;
import com.project.todo.config.KeyManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import static java.util.Map.entry;

import org.springframework.security.core.Authentication;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.project.todo.dto.UserDTO;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
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
    private CachedUserService cachedUserService;

    @Autowired
    private KeyManager keyManager;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private final TodoProducer todoProducer;

    public AuthController(TodoProducer todoProducer) {
        this.todoProducer = todoProducer;
    }

    // 🔹 Check Username
    @PostMapping("/checkuser")
    public ResponseEntity<?> checkuser(@RequestBody Map<String, String> body) {
        String username = body.get("username");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Username is valid"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username not found"));
    }

    // 🔹 Check Email
    @PostMapping("/checkemail")
    public ResponseEntity<?> checkemail(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Email is valid"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email not found"));
    }

    // 🔹 Update Password
    @PostMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        // ✅ Validate inputs
        if ((username == null || username.isBlank()) && (email == null || email.isBlank())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email is required"));
        }
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token is required"));
        }
        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
        }

        // ✅ Find user
        User user = (username != null && !username.isBlank())
                ? userRepository.findByUsername(username).orElse(null)
                : userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        // ✅ Validate token
        VerificationToken resetToken = verificationTokenRepository.findByUserAndType(user, "RESET_PASSWORD").orElse(null);

        if (resetToken == null || !resetToken.getToken().equals(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or missing token"));
        }
        if (resetToken.isExpired()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token expired"));
        }

        // ✅ Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // ✅ Expire token
        resetToken.setTokenExpired(true);
        verificationTokenRepository.save(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // 🔹 Reset Password Request
    @PostMapping("/resetpassword")
    public ResponseEntity<?> resetpassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");

        // ✅ Fetch user
        User user = (username == null || username.isBlank())
                ? userRepository.findByEmail(email).orElse(null)
                : userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        // ✅ Delete existing RESET_PASSWORD token
        verificationTokenRepository.findByUserAndType(user, "RESET_PASSWORD")
                .ifPresent(existing -> verificationTokenRepository.delete(existing));

        // ✅ Create new token
        String token = UUID.randomUUID().toString();
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime expiresAt = createdAt.plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES);

        VerificationToken resetToken = new VerificationToken(token, user, "RESET_PASSWORD", createdAt, expiresAt, false);
        verificationTokenRepository.save(resetToken);

        // ✅ Send email
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token, "RESET_PASSWORD");

        return ResponseEntity.ok(Map.of("message", "Reset password email sent. Please check your inbox."));
    }

    // 🔹 Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        Role role = Role.valueOf(body.getOrDefault("role", "USER").toUpperCase());
        AcnTyp acntyp = AcnTyp.valueOf(body.getOrDefault("acntyp", "PERSONAL").toUpperCase());

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username taken"));
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered"));
        }

        // ✅ Account expiry
        LocalDateTime expiresAt = (acntyp == AcnTyp.PERSONAL)
                ? LocalDateTime.of(9999, 12, 31, 0, 0)
                : null;

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setAcntyp(acntyp);
        user.setExpiresAt(expiresAt);
        user.setUserExpired(false);
        user.setRole(role);
        user.setEmailVerified(false);

        // Optional fields
        user.setFullname(body.getOrDefault("fullname", null));
        user.setAddress(body.getOrDefault("address", null));
        user.setOccupation(body.getOrDefault("occupation", null));
        user.setSkills(body.getOrDefault("skills", null));
        user.setNotes(body.getOrDefault("notes", null));
        user.setExperience(body.getOrDefault("experience", null));

        // ✅ Create verification token
        String token = UUID.randomUUID().toString();
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime tokenExpiresAt = createdAt.plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES);

        VerificationToken verificationToken = new VerificationToken(token, user, "EMAIL", createdAt, tokenExpiresAt, false);

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token, "EMAIL");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email send error: " + e));
        }

        userRepository.save(user);
        verificationTokenRepository.save(verificationToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User created. Please verify your email.",
                "username", username,
                "email", email,
                "acntyp", acntyp,
                "role", role.name()
        ));
    }

    // 🔹 Verify Email
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

    // 🔹 Update Profile
    @PostMapping("/updateprofile")
    public ResponseEntity<?> updateprofile(@RequestBody Map<String, String> body, Authentication authentication) {
        String loggedInUsername = authentication.getName();
        User user = userRepository.findByUsername(loggedInUsername).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid user"));
        }

        String fullname = body.get("fullname");
        String address = body.get("address");
        String email = body.get("email");
        String occupation = body.get("occupation");
        String skills = body.get("skills");
        String notes = body.get("notes");
        String experience = body.get("experience");
        String education = body.get("education");

        // ✅ Email change
        boolean emailChanged = (email != null && !email.equalsIgnoreCase(user.getEmail()));
        if (emailChanged) {
            user.setEmail(email);
            user.setEmailVerified(false);

            verificationTokenRepository.findByUserAndType(user, "EMAIL")
                    .ifPresent(existing -> verificationTokenRepository.delete(existing));

            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = new VerificationToken(
                    token, user, "EMAIL",
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES),
                    false
            );

            verificationTokenRepository.save(verificationToken);
            emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token, "EMAIL");
        }

        // ✅ Update other fields
        user.setFullname(fullname);
        user.setAddress(address);
        user.setOccupation(occupation);
        user.setSkills(skills);
        user.setNotes(notes);
        user.setExperience(experience);
        user.setEducation(education);

        userRepository.save(user);

        if (emailChanged) {
            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated! A verification email has been sent.",
                    "username", user.getUsername(),
                    "email", email,
                    "fullname", fullname,
                    "address", address,
                    "notes", notes,
                    "experience", experience,
                    "emailVerificationSent", true
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully!",
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullname", fullname,
                    "address", address,
                    "notes", notes,
                    "experience", experience
            ));
        }
    }

    // 🔹 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing or invalid Authorization header"));
        }

        try {
            String base64Credentials = authHeader.substring("Basic ".length()).trim();
            byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
            String credentials = new String(credDecoded);
            final String[] values = credentials.split(":", 2);

            if (values.length != 2) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid Basic authentication format"));
            }

            // ✅ Sanitize credentials
        String username = Jsoup.clean(values[0], Safelist.none());
        String password = Jsoup.clean(values[1], Safelist.none());

            System.out.println("[DEBUG POINT]: User field (sanitized): " + username);

            // ✅ Use cached service instead of hitting DB directly
            UserDTO user = cachedUserService.getUserByUsernameCached(username);
if (user == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid user"));
}
            if (user == null) {
               System.out.println("[DEBUG POINT]: user is null");
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

            // ✅ JWT Token
            String token = Jwts.builder()
                    .setSubject(user.getUsername())
                    .claim("userid", user.getId())
                    .claim("role", user.getRole())
                    .claim("acntyp", user.getAcntyp())
                    .claim("fullName", user.getFullname())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // 1 hour
                    .signWith(keyManager.getPrivateKey(), SignatureAlgorithm.RS256)
                    .compact();

            todoProducer.publishTodoEvent("user.login", username);

            return ResponseEntity.ok(Map.of(
                "message", "Login successful!",
                "token", token,
                "userInfo", user.getUsername() + ":" + user.getRole() + ":" +
                             (user.getEducation() != null ? user.getEducation() : "") + ":" +
                             (user.getOccupation() != null ? user.getOccupation() : ""),
                "email", user.getEmail(),
                "fullname", user.getFullname() != null ? user.getFullname() : "",
                "skills", user.getSkills() != null ? user.getSkills() : "",
                "address", user.getAddress() != null ? user.getAddress() : "",
                "notes", user.getNotes() != null ? user.getNotes() : "",
                "experience", user.getExperience() != null ? user.getExperience() : "",
                "picture", user.getPicture() != null ? user.getPicture() : ""
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // 🔹 Resend Verification
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

        verificationTokenRepository.findByUser(user).ifPresent(existing -> verificationTokenRepository.delete(existing));

        String token = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(AppConstants.VERIFICATION_TOKEN_EXPIRATION_MINUTES);

        VerificationToken newToken = new VerificationToken(token, user, "EMAIL", now, expiresAt, false);
        verificationTokenRepository.save(newToken);

        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), token, "EMAIL");

        return ResponseEntity.ok(Map.of("message", "Verification email sent. Please check your inbox."));
    }
}
