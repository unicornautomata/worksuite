package com.project.task.controller;

import com.project.task.model.Task;
import com.project.task.service.TaskService;
import com.project.task.config.PublicKeyProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;
    private final PublicKeyProvider publicKeyProvider;

    public TaskController(TaskService service, PublicKeyProvider publicKeyProvider) {
        this.service = service;
        this.publicKeyProvider = publicKeyProvider;
    }

    // ✅ Utility method to extract userId from Authorization header
    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKeyProvider.getPublicKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userid", Long.class);
    }

    @GetMapping
    public List<Task> getAllTasks(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        return service.getAllTasksByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@RequestHeader("Authorization") String authHeader,
                                            @PathVariable Long id) {
        Long userId = extractUserId(authHeader);
        return service.getTaskByIdForUser(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@RequestHeader("Authorization") String authHeader,
                           @RequestBody Task task) {
        Long userId = extractUserId(authHeader);
        return service.createTaskForUser(task, userId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long id,
                                           @RequestBody Task task) {
        Long userId = extractUserId(authHeader);
        return service.updateTaskForUser(id, task, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@RequestHeader("Authorization") String authHeader,
                                           @PathVariable Long id) {
        Long userId = extractUserId(authHeader);
        boolean deleted = service.deleteTaskForUser(id, userId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
