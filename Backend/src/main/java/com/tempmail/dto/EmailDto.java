package com.tempmail.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class EmailDto {
    private String id;
    private String from;
    private String to;
    private String subject;
    private String htmlBody;
    private String textBody;
    private Instant receivedAt;
    private List<String> attachmentNames;
}
