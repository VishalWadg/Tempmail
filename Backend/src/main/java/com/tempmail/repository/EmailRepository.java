package com.tempmail.repository;

import com.tempmail.model.Email;

import java.util.List;
import java.util.Optional;

public interface EmailRepository {
    void save(String address, Email email);
    List<Email> findAll(String address);
    Optional<Email> findById(String address, String id);
    void delete(String address);
}
