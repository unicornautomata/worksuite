package com.project.task.service;

import com.project.task.model.Task;
import com.project.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasksByUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Optional<Task> getTaskByIdForUser(Long id, Long userId) {
        return taskRepository.findByIdAndUserId(id, userId);
    }

    public Task createTaskForUser(Task task, Long userId) {
        task.setUserId(userId);
        return taskRepository.save(task);
    }

    public Optional<Task> updateTaskForUser(Long id, Task updatedTask, Long userId) {
        return taskRepository.findByIdAndUserId(id, userId).map(existing -> {
            existing.setTitle(updatedTask.getTitle());
            existing.setDescription(updatedTask.getDescription());
            existing.setDueDate(updatedTask.getDueDate());
            existing.setCompleted(updatedTask.isCompleted());
            return taskRepository.save(existing);
        });
    }

    public boolean deleteTaskForUser(Long id, Long userId) {
        return taskRepository.findByIdAndUserId(id, userId).map(task -> {
            taskRepository.delete(task);
            return true;
        }).orElse(false);
    }
}
