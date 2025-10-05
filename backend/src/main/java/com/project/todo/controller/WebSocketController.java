package com.project.todo.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    // Receives messages sent to /app/notify
    @MessageMapping("/notify")
    @SendTo("/topic/admin-notifications")
    public String notifyAdmin(String message) {
        // Simply returns the message to all subscribers of /topic/admin-notifications
        return message;
    }
}
