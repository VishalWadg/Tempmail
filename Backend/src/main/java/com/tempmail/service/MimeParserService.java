package com.tempmail.service;

import com.tempmail.model.Email;
import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

@Service
@Slf4j
public class MimeParserService {
    public Email parse(String recipient, InputStream rawEmail) throws MessagingException, IOException {
        Session session = Session.getDefaultInstance(new Properties());
        MimeMessage message = new MimeMessage(session, rawEmail);
        Email email = Email.builder()
                .id(UUID.randomUUID().toString())
                .subject(message.getSubject())
                .from(message.getFrom()[0].toString())
                .to(message.getRecipients(Message.RecipientType.TO)[0].toString())
                .receivedAt(message.getReceivedDate() != null
                ? message.getReceivedDate().toInstant() : Instant.now())
                .build();
        List<String> attachmentNames = new ArrayList<>();
        Object content = message.getContent();

        if(content instanceof String text){
            email.setTextBody(text);
        }else if(content instanceof MimeMultipart multipart){
            processMultipart(multipart, email, attachmentNames);
        }
        email.setAttachmentNames(attachmentNames);
        return email;
    }

    private void processMultipart(Multipart multipart,
                                  Email email,
                                  List<String> attachmentNames) throws MessagingException, IOException {

        for (int i = 0; i < multipart.getCount(); i++) {
            BodyPart part = multipart.getBodyPart(i);
            String disposition = part.getDisposition();
            String fileName = part.getFileName();

            // If it explicitly says "attachment" OR if it has a filename, treat it as a file.
            if (Part.ATTACHMENT.equalsIgnoreCase(disposition) || fileName != null) {
                attachmentNames.add(fileName);
                continue; // Skip the rest of the loop so we don't accidentally parse it as text
            }

            // 2. Handle Plain Text (Append if already exists)
            if (part.isMimeType("text/plain")) {
                String content = (String) part.getContent();
                if (email.getTextBody() == null) {
                    email.setTextBody(content);
                } else {
                    // Append subsequent text blocks separated by newlines
                    email.setTextBody(email.getTextBody() + "\n\n" + content);
                }
            }// 3. Handle HTML (Append if already exists)
            else if (part.isMimeType("text/html")) {
                String content = (String) part.getContent();
                if (email.getHtmlBody() == null) {
                    email.setHtmlBody(content);
                } else {
                    // Append subsequent HTML blocks
                    email.setHtmlBody(email.getHtmlBody() + "<br>" + content);
                }
            }// 4. Recursion for nested parts
            else {
                Object content = part.getContent();
                if (content instanceof Multipart nested) {
                    processMultipart(nested, email, attachmentNames);
                }

            }
        }
    }
}
