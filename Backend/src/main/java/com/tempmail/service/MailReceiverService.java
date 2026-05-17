package com.tempmail.service;

import com.tempmail.model.Email;

public interface MailReceiverService {
    void onEmailReceived(Email cleanEmail);
}
