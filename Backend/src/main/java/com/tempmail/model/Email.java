package com.tempmail.model;

import lombok.Builder;
import lombok.Data;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class Email implements Serializable {

    private String id;
    private String from;
    private String to;
    private String subject;
    private String htmlBody;
    private String textBody;
    private Instant receivedAt;
    private List<String> attachmentNames;
}
