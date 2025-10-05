package com.project.todo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;
import com.project.todo.config.AppConstants;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String username, String token, String type) {
        String mess = "";
        String subject = "";
        String body = "";

        System.out.println("Email Type field: " + type);

        if ("EMAIL".equals(type)) {
            mess = "verification";
            subject = "Verify your account";
            body = "Hello " + username + ",\n\n" +
                   "Please verify your account by clicking the link below:\n\n" +
                   AppConstants.REACT_URL + "/verify-email?token=" + token + "\n\n" +
                   "This link will expire in 24 hours.\n\nThank you!";
        } else {
            mess = "reset password";
            subject = "Reset your password";
            body = "Hello " + username + ",\n\n" +
                   "Please reset your password by clicking the link below:\n\n" +
                   AppConstants.REACT_URL + "/newpassword?token=" + token + "&username=" + username + "\n\n" +
                   "This link will expire in 24 hours.\n\nThank you!";
        }

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send " + mess + " email", e);
        }
    }
}
