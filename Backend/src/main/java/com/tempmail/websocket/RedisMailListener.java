package com.tempmail.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RedisMailListener implements MessageListener {
    private  final SimpMessagingTemplate messagingTemplate;
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel());
        String address = channel.replace("inbox:", "");
        String emailId = new String(message.getBody());
        messagingTemplate.convertAndSend("topic/inbox/"+ address, emailId);
    }
}
