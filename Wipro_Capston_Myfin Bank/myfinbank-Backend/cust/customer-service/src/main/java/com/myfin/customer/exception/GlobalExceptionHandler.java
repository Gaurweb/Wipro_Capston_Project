package com.myfin.customer.exception;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<Map<String,Object>> notFound(CustomerNotFoundException e) {
        return build(HttpStatus.NOT_FOUND, e.getMessage());
    }
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Map<String,Object>> balance(InsufficientBalanceException e) {
        return build(HttpStatus.BAD_REQUEST, e.getMessage());
    }
    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Map<String,Object>> account(AccountNotFoundException e) {
        return build(HttpStatus.NOT_FOUND, e.getMessage());
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> general(Exception e) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    private ResponseEntity<Map<String,Object>> build(HttpStatus s, String msg) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", s.value());
        body.put("message", msg);
        return ResponseEntity.status(s).body(body);
    }
}
