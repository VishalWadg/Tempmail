package com.tempmail.service;

import com.tempmail.model.Email;
import com.tempmail.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService implements MailReceiverService {
    private final MimeParserService mimeParserService;
    private final EmailRepository emailRepository;

    @Override
    public void onEmailReceived(Email cleanEmail){
            emailRepository.save(cleanEmail.getTo(), cleanEmail);
            log.info("Parsed email: id={}, subject={}, from={}",
                    cleanEmail.getId(), cleanEmail.getSubject(), cleanEmail.getFrom());
    }
}
