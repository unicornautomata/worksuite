package com.project.todo.service;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class TodoProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public TodoProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTodoEvent(String eventType, String username) {
        String message = String.format("Event: %s | User: %s", eventType, username);
        kafkaTemplate.send("user-login-events", message);
    }
}
