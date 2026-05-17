package com.tempmail.exception;

public class InboxNotFoundException extends RuntimeException{
    public InboxNotFoundException(String address){
        super("No inbox found for address: " + address);
    }
}
