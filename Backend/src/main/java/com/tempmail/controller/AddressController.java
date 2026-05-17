package com.tempmail.controller;

import com.tempmail.service.AddressGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/address")
public class AddressController {

    private final AddressGeneratorService addressGeneratorService;

    @GetMapping("/generate")
    public ResponseEntity<String> generateAddress() {
        return ResponseEntity.ok(addressGeneratorService.generateAddress());
    }
}
