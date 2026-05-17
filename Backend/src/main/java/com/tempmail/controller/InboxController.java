package com.tempmail.controller;

import com.tempmail.dto.EmailDto;
import com.tempmail.service.InboxService;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/inbox")
@Validated
public class InboxController {
    private final InboxService inboxService;

    @GetMapping("/{address}")
    public ResponseEntity<List<EmailDto>> getInbox(@PathVariable @Email String address){
        return ResponseEntity.ok(inboxService.getInbox(address));
    }
    @GetMapping("/{address}/{id}")
    public ResponseEntity<EmailDto> getMail(@PathVariable @Email String address, @PathVariable String id){
        return ResponseEntity.ok(inboxService.getMailById(address, id));
    }

    @DeleteMapping("/{address}")
    public ResponseEntity<Void> deleteInbox(@PathVariable @Email String address){
        inboxService.deleteInbox(address);
        return ResponseEntity.noContent().build();
    }
}
