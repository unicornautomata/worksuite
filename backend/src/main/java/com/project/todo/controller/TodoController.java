package com.project.todo.controller;

import com.project.todo.dto.TodoRequest;
import com.project.todo.dto.TodoResponse;
import com.project.todo.model.User;
import com.project.todo.service.TodoService;
import com.project.todo.service.UserService;
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
        System.out.println("[DEBUG POINT]: >>> TODOS endpoint hit. ");
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
