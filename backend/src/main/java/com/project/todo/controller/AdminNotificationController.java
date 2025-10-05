package com.project.todo.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class AdminNotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public AdminNotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyAdminLogin(String username) {
        messagingTemplate.convertAndSend("/topic/admin-notifications", "User " + username + " logged in!");
    }
}
