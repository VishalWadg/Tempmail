package com.tempmail.smtp;

import com.tempmail.service.MailReceiverService;
import com.tempmail.service.MimeParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.subethamail.smtp.MessageContext;
import org.subethamail.smtp.MessageHandler;
import org.subethamail.smtp.MessageHandlerFactory;

@Component
@RequiredArgsConstructor
public class CatchAllMessageHandlerFactory implements MessageHandlerFactory {
    private final MailReceiverService mailReceiverService;
    private final MimeParserService mimeParserService;
    @Override
    public MessageHandler create(MessageContext messageContext) {
        return new CatchAllMessageHandler(mailReceiverService, mimeParserService);
    }
}
