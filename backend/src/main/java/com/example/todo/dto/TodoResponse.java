package com.example.todo.dto;

public class TodoResponse {
    private Long id;
    private String title;
    private boolean completed;

    public TodoResponse(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public boolean isCompleted() { return completed; }
}
