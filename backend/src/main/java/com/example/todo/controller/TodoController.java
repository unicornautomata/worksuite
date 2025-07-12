package com.example.todo.controller;

import com.example.todo.dto.TodoRequest;
import com.example.todo.model.Todo;
import com.example.todo.model.User;
import com.example.todo.repository.UserRepository;
import com.example.todo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Todo> getAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return todoService.getTodosForCurrentUser(user);
    }

    @PostMapping
    public Todo create(@RequestBody TodoRequest todoRequest) {
        return todoService.createTodo(todoRequest);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody TodoRequest todoRequest) {
        // You can enhance this with permission checks
        Todo todo = todoService.updateTodo(id, todoRequest);
        return todo;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
