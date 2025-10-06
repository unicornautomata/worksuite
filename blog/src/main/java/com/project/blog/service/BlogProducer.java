package com.project.blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class BlogProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    /**
     * Publishes an event to a Kafka topic
     * @param topic - The Kafka topic name (e.g., "comment.created")
     * @param message - The message to send (e.g., "User John commented on Blog Post X")
     */
    public void publishBlogEvent(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("📤 Published to Kafka topic [" + topic + "]: " + message);
    }
}
