package com.example.todo.dto;

public class TodoResponse {
    private Long id;
    private String title;
    private boolean completed;
    private String username; // ✅ Add this

    public TodoResponse(Long id, String title, boolean completed, String username) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.username = username;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
    public String getUsername() { return username; } // ✅ Add this
}
