package com.ordex.entities;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetCode(String toEmail, String resetCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Code de réinitialisation de mot de passe - Ordex");
        message.setText("Votre code de réinitialisation est : " + resetCode + "\nCe code est valide pendant 10 minutes.");
        message.setFrom("votreemail@gmail.com"); // Remplacez par votre email
        mailSender.send(message);
    }
}