package com.tempmail.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EmailNotFoundException.class)
    public ProblemDetail handleEmailNotFoundException(EmailNotFoundException ex){
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler(InboxNotFoundException.class)
    public ProblemDetail handleInboxNotFoundException(InboxNotFoundException ex){
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handConstraintViolation(ConstraintViolationException ex){
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Input validation failed. Please check the errors array for details."
        );
        List<Map<String, String>> errors = ex.getConstraintViolations().stream()
                .map(violation -> {
                    String fieldPath = violation.getPropertyPath().toString();
                    String fieldName = fieldPath.substring(fieldPath.lastIndexOf('.') + 1);
                    return Map.of(
                            "field", fieldName,
                            "message", violation.getMessage()
                    );
                })
                .toList();
        problem.setProperty("errors", errors);
        return  problem;
    }
}
