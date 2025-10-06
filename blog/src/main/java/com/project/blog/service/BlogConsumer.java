package com.project.blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class BlogConsumer {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Listens to "comment.created" topic from Kafka
     * When a message arrives, it sends it to the WebSocket endpoint
     * so the frontend can receive it
     */
    @KafkaListener(topics = "comment.created", groupId = "blog-group")
    public void consumeCommentCreated(String message) {
        System.out.println("📥 Received from Kafka: " + message);

        // Send to WebSocket - frontend will receive this
        messagingTemplate.convertAndSend("/topic/admin-notifications", message);

        System.out.println("✅ Sent to WebSocket: " + message);
    }
}
