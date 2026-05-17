package com.tempmail.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tempmail.model.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class EmailRepositoryImpl implements EmailRepository{
    @Value("${tempmail.ttl-minutes}")
    private int ttlMinutes;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;


    public void save(String address, Email email){
        try {
            String jsonMail = objectMapper.writeValueAsString(email);
            String key = "inbox:" + address;
            Long listSize = redisTemplate.opsForList().leftPush(key, jsonMail);
            if (listSize != null && listSize == 1) {
                redisTemplate.expire(key, ttlMinutes, TimeUnit.MINUTES);
            }
            redisTemplate.convertAndSend(key, email.getId());

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize email", e);
        }
    }

    public List<Email> findAll(String address){
        String key = "inbox:" + address;
        List<String> jsonMail = redisTemplate.opsForList().range(key, 0, -1);
        if(jsonMail == null) return new ArrayList<>();
        List<Email> inbox = jsonMail.stream().map(mail -> {
            try {
                return objectMapper.readValue(mail, Email.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).toList();
        return inbox;
    }

    public Optional<Email> findById(String address, String id){
        String key = "inbox:" + address;
        List<Email> inbox = findAll(address);
        return inbox.stream()
                .filter(mail -> Objects.equals(mail.getId(), id))
                .findFirst();
    }

    public void delete(String address){
        String key = "inbox:" + address;
        redisTemplate.delete(key);
    }
}
