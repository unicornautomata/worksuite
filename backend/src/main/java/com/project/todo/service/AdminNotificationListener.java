package com.project.todo.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AdminNotificationListener {

    private final SimpMessagingTemplate messagingTemplate;

    public AdminNotificationListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "user-login-events", groupId = "admin-notifications")
    public void handleUserLogin(String message) {
        // Push to WebSocket topic
        messagingTemplate.convertAndSend("/topic/admin-notifications", message);
    }
}
