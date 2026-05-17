package com.tempmail.service;

import com.tempmail.dto.EmailDto;
import com.tempmail.model.Email;
import com.tempmail.repository.EmailRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InboxService {
    private final EmailRepositoryImpl emailRepositoryImpl;
    private final ModelMapper modelMapper;

    public List<EmailDto> getInbox(String address){

        List<Email> list = emailRepositoryImpl.findAll(address);
        return list.stream().map(mail -> modelMapper.map(mail, EmailDto.class)).toList();
    }

    public EmailDto getMailById(String address, String id){

        return emailRepositoryImpl.findById(address, id)
                .map(mail -> modelMapper.map(mail, EmailDto.class))
                .orElseThrow(() -> new RuntimeException("Email not found"));
    }

    public void deleteInbox(String address){
        emailRepositoryImpl.delete(address);
    }
}
