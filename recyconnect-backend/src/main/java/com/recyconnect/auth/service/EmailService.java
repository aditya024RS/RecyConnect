package com.recyconnect.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String subject = "RecyConnect - Reset Your Password";
        String body = "You have requested to reset your password.\n\n"
                + "Click the link below to set a new password:\n"
                + resetUrl + "\n\n"
                + "If you did not request this, please ignore this email.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@recyconnect.com"); // Can be any from address

        mailSender.send(message);
    }
}