package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.model.Todo;
import com.example.todo.model.User;
import com.example.todo.repository.TodoRepository;
import com.example.todo.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public Todo createTodo(TodoRequest todoRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Todo todo = new Todo();
        todo.setTitle(todoRequest.getTitle());
        todo.setCompleted(false);
        todo.setUser(user);

        return todoRepository.save(todo);
    }

    public List<Todo> getTodosForCurrentUser(User currentUser) {
        if (currentUser.getRole().name().equals("ADMIN")) {
            return todoRepository.findAll();
        }
        return todoRepository.findByUser(currentUser);
    }

    public Todo updateTodo(Long id, TodoRequest request) {
        Todo existing = todoRepository.findById(id).orElseThrow();
        existing.setTitle(request.getTitle());
        return todoRepository.save(existing);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
