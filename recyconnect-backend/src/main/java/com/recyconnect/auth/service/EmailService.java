package com.recyconnect.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    // Hardcoded for now based on our DataSeeder
    private static final String ADMIN_EMAIL = "admin@recyconnect.com";

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String subject = "RecyConnect - Reset Your Password";
        String body = "You have requested to reset your password.\n\n"
                + "Click the link below to set a new password:\n"
                + resetUrl + "\n\n"
                + "If you did not request this, please ignore this email.";

        sendEmail(to, subject, body);
    }

    // UPDATED: Now takes User Name and Waste Type for better context
    public void sendBookingAcceptedOtpEmail(String to, String userName, String ngoName, String otp, String wasteType) {
        String subject = "♻️ Pickup Confirmed: " + ngoName + " has accepted your request";

        // Using Java Text Blocks for cleaner formatting
        String body = String.format("""
            Hello %s,
            
            Great news! Your recycling pickup has been accepted.
            
            --------------------------------------------------
            SERVICE DETAILS
            --------------------------------------------------
            Provider:   %s
            Waste Type: %s
            Status:     ACCEPTED (Agent on the way)
            
            --------------------------------------------------
            YOUR SECURE OTP
            --------------------------------------------------
            Code: %s
            
            ⚠️ IMPORTANT:
            Do NOT share this code until the agent has physically collected your items.
            Giving this code completes the transaction.
            
            Thank you for making the planet greener with RecyConnect!
            """, userName, ngoName, wasteType, otp);

        sendEmail(to, subject, body);
    }

    // NEW: Admin Alert Logic
    public void sendNgoApplicationAlert(String ngoName, String applicantEmail, String location) {
        String subject = "🔔 New NGO Application: " + ngoName;

        String body = String.format("""
            ADMIN ALERT
            
            A new organization has applied to join RecyConnect.
            
            Name:     %s
            Email:    %s
            Location: %s
            
            Please log in to the Admin Dashboard to review and approve/reject this application.
            """, ngoName, applicantEmail, location);

        sendEmail(ADMIN_EMAIL, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@recyconnect.com");
        mailSender.send(message);
    }
}