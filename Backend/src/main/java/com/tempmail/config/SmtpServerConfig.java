package com.tempmail.config;

import com.tempmail.smtp.CatchAllMessageHandlerFactory;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.subethamail.smtp.server.SMTPServer;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SmtpServerConfig {
    @Value("${tempmail.smtp.port}")
    private int smtpPort;
    private SMTPServer smtpServer;
    private final CatchAllMessageHandlerFactory handlerFactory;

    @PostConstruct
    public void startSmtpServer(){
        smtpServer = SMTPServer.port(smtpPort)
                .messageHandlerFactory(handlerFactory)
                .build();
        smtpServer.start();
        log.info("SMTP server started on port {}", smtpPort);
    }

    @PreDestroy
    public void stopSmtpServer(){
        if(smtpServer != null) smtpServer.stop();
        log.info("SMTP Server Stopped");
    }
}
