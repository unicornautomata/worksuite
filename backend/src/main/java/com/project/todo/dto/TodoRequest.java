package com.project.todo.dto;

public class TodoRequest {
    private String title;
    private boolean completed; // ✅ make sure this is here

    public String getTitle() {
        return title;
    }

    public boolean isCompleted() { // ✅ you need this
        return completed;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
