package com.tempmail;

import java.util.Properties;
import jakarta.mail.*;
import jakarta.mail.internet.*;

public class SmtpTestClient {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.host", "localhost");
        props.put("mail.smtp.port", "2525");
        props.put("mail.smtp.auth", "false");

        Session session = Session.getInstance(props);
        session.setDebug(true); // prints full SMTP conversation

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress("sender@test.com"));
        message.setRecipient(
                Message.RecipientType.TO,
                new InternetAddress("hello@localhost")
        );
        message.setSubject("Test Email");
        message.setText("This is a test email body.");

        Transport.send(message);
        System.out.println("Email sent successfully.");
    }
}
