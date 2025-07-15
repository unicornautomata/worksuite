package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.model.Todo;
import com.example.todo.model.User;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoResponse> getTodosForCurrentUser(User user) {
        List<Todo> todos;

        if (user.getRole().name().equals("ADMIN")) {
            todos = todoRepository.findAll();
        } else {
            todos = todoRepository.findByUser(user);
        }

        return todos.stream()
                .map(todo -> new TodoResponse(todo.getId(), todo.getTitle(), todo.isCompleted()))
                .collect(Collectors.toList());
    }

    public TodoResponse createTodo(TodoRequest request, User user) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setCompleted(false);
        todo.setUser(user);
        Todo saved = todoRepository.save(todo);
        return new TodoResponse(saved.getId(), saved.getTitle(), saved.isCompleted());
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo existing = todoRepository.findById(id).orElseThrow();
        existing.setTitle(request.getTitle());
        existing.setCompleted(request.isCompleted());  // Add this line
        Todo updated = todoRepository.save(existing);
        return new TodoResponse(updated.getId(), updated.getTitle(), updated.isCompleted());
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
