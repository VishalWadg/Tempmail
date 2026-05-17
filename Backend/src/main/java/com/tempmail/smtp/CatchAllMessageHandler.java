package com.tempmail.smtp;

import com.tempmail.model.Email;
import com.tempmail.service.MailReceiverService;
import com.tempmail.service.MimeParserService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.subethamail.smtp.MessageHandler;
import org.subethamail.smtp.RejectException;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
public class CatchAllMessageHandler implements MessageHandler {

    private String from;
    private String recipient;
    private final MailReceiverService mailReceiverService;
    private final MimeParserService mimeParserService;

    public CatchAllMessageHandler(MailReceiverService mailReceiverService, MimeParserService mimeParserService){
        this.mailReceiverService = mailReceiverService;
        this.mimeParserService = mimeParserService;
    }

    @Override
    public void from(String from) throws RejectException {
        this.from = from;
        log.info("Mail from: {}", from);
    }

    @Override
    public void recipient(String recipient) throws RejectException {
        this.recipient = recipient;
        log.info("Mail to: {}", recipient);
    }

    @Override
    public String data(InputStream inputStream) throws RejectException, IOException {
        log.info("Receiving email data for: {}", recipient);

        try {
            // 1. Parse the messy InputStream right here at the edge
            Email parsedEmail = mimeParserService.parse(recipient, inputStream);

            // 2. Hand the clean object to the core service
            mailReceiverService.onEmailReceived(parsedEmail);

        } catch (MessagingException e) {
            log.error("Failed to parse incoming email", e);
            throw new RejectException(554, "Transaction failed - Parsing error");
        }
        return null;
    }

    @Override
    public void done() {
        log.info("Email delivery complete for: {}", recipient);
    }
}
