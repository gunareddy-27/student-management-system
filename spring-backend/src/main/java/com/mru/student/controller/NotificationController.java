package com.mru.student.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Triggered by frontend sending a message to /app/broadcast
    @MessageMapping("/broadcast")
    @SendTo("/topic/notifications")
    public Map<String, Object> broadcast(Map<String, Object> message) {
        return message;
    }

    // Triggered by backend logic (REST API) to push to all clients
    @PostMapping("/api/notifications/push")
    public void pushNotification(@RequestBody Map<String, Object> notification) {
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}
