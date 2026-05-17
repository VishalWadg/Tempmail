package com.tempmail.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;


public class EmailNotFoundException extends RuntimeException{
    public EmailNotFoundException(String address, String id) {
        super("No email found with id: " + id +
                " in inbox: " + address);
    }
}
