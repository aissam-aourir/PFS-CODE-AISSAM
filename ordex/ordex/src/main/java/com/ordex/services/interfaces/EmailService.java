package com.ordex.services.interfaces;
public interface EmailService {
    void sendResetCode(String toEmail, String resetCode);
}