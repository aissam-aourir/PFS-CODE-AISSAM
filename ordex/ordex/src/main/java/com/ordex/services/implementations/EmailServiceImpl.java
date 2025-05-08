package com.ordex.services.implementations;

import com.ordex.services.interfaces.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendResetCode(String toEmail, String resetCode) {
        System.out.println("ici dans sendResetCode");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🔐 Code de réinitialisation - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🔐 Ordex - Réinitialisation</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour,</p>"
                    + "<p style='font-size:16px;color:#444;'>Voici votre code de réinitialisation :</p>"
                    + "<div style='font-size:24px;font-weight:bold;color:#007bff;text-align:center;margin:20px 0;'>" + resetCode + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Ce code est <strong>valide pendant 10 minutes</strong>. Ne le partagez avec personne.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l'image logo2.png depuis le même dossier (resources)
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("ici dans après mailSender.send");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }
}
