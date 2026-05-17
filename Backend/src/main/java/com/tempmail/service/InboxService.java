package com.tempmail.service;

import com.tempmail.dto.EmailDto;
import com.tempmail.exception.EmailNotFoundException;
import com.tempmail.exception.InboxNotFoundException;
import com.tempmail.model.Email;
import com.tempmail.repository.EmailRepository;
import com.tempmail.repository.EmailRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InboxService {
    private final EmailRepository emailRepository;
    private final ModelMapper modelMapper;

    public List<EmailDto> getInbox(String address){

        List<Email> list = emailRepository.findAll(address);
        if (list.isEmpty()) {
            throw new InboxNotFoundException(address);
        }
        return list.stream().map(mail -> modelMapper.map(mail, EmailDto.class)).toList();
    }

    public EmailDto getMailById(String address, String id){

        return emailRepository.findById(address, id)
                .map(mail -> modelMapper.map(mail, EmailDto.class))
                .orElseThrow(() -> new EmailNotFoundException(address, id));
    }

    public void deleteInbox(String address){
        emailRepository.delete(address);
    }
}
