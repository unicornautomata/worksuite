package com.project.todo.service;

import com.project.todo.dto.UserDTO;
import com.project.todo.model.User;
import com.project.todo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CachedUserService {

    private final UserRepository userRepository;

    public CachedUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Return UserDTO including password for internal login validation
    public UserDTO getUserByUsernameCached(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return null;

        return UserDTO.fromEntity(user); // Use the mapper
    }
}
