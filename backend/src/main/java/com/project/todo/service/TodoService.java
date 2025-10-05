package com.project.todo.service;

import com.project.todo.dto.TodoRequest;
import com.project.todo.dto.TodoResponse;
import com.project.todo.model.Todo;
import com.project.todo.model.User;
import com.project.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.jsoup.safety.Safelist;
import org.jsoup.Jsoup;
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
                .map(todo -> new TodoResponse(todo.getId(), todo.getTitle(), todo.isCompleted(), todo.getUser().getUsername()))
                .collect(Collectors.toList());
    }

    public TodoResponse createTodo(TodoRequest request, User user) {
      String safeTitle = Jsoup.clean(request.getTitle(), Safelist.basic());
    if (safeTitle == null || safeTitle.trim().isEmpty()) {
        throw new IllegalArgumentException("Todo title cannot be empty or unsafe");
    }
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setCompleted(false);
        todo.setUser(user);
        Todo saved = todoRepository.save(todo);
        return new TodoResponse(saved.getId(), saved.getTitle(), saved.isCompleted(), saved.getUser().getUsername());
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {

      // ✅ sanitize
    String safeTitle = Jsoup.clean(request.getTitle(), Safelist.basic());
    if (safeTitle == null || safeTitle.trim().isEmpty()) {
        throw new IllegalArgumentException("Todo title cannot be empty or unsafe");
    }

        Todo existing = todoRepository.findById(id).orElseThrow();
        existing.setTitle(request.getTitle());
        existing.setCompleted(request.isCompleted());
        Todo updated = todoRepository.save(existing);
        return new TodoResponse(updated.getId(), updated.getTitle(), updated.isCompleted(), updated.getUser().getUsername());
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
