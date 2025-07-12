package com.example.todo.controller;

import com.example.todo.model.Role;
import com.example.todo.model.Todo;
import com.example.todo.model.User;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private UserRepository userRepository;

    // 🟢 Get all todos (filtered by user unless admin)
    @GetMapping
    public List<Todo> getAll(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();

        if (user.getRole() == Role.ADMIN) {
            return todoRepository.findAll();
        } else {
            return todoRepository.findByUser(user);
        }
    }

    // 🟢 Create a new todo (assign logged-in user)
    @PostMapping
    public Todo create(@RequestBody Todo todo, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        todo.setUser(user);
        return todoRepository.save(todo);
    }

    // 🟢 Update a todo (only your own unless admin)
    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo updatedTodo, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        Todo todo = todoRepository.findById(id).orElseThrow();

        if (!todo.getUser().equals(user) && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized");
        }

        todo.setTitle(updatedTodo.getTitle());
        todo.setCompleted(updatedTodo.isCompleted());
        return todoRepository.save(todo);
    }

    // 🟢 Delete a todo (only your own unless admin)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElseThrow();
        Todo todo = todoRepository.findById(id).orElseThrow();

        if (!todo.getUser().equals(user) && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized");
        }

        todoRepository.deleteById(id);
    }
}
