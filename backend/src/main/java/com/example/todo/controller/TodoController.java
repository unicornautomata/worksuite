package com.example.todo.controller;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.model.User;
import com.example.todo.service.TodoService;
import com.example.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<TodoResponse> getAll(Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        return todoService.getTodosForCurrentUser(currentUser);
    }

    @PostMapping
    public TodoResponse create(@RequestBody TodoRequest request, Authentication authentication) {
        User currentUser = userService.getUserByUsername(authentication.getName());
        return todoService.createTodo(request, currentUser);
    }

    @PutMapping("/{id}")
    public TodoResponse update(@PathVariable Long id, @RequestBody TodoRequest request) {
        return todoService.updateTodo(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
