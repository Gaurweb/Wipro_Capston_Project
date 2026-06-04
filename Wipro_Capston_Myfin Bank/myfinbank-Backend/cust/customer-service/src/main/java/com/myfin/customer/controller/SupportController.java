package com.myfin.customer.controller;

import com.myfin.customer.dto.SupportRequest;
import com.myfin.customer.entity.SupportTicket;
import com.myfin.customer.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/create")
    public ResponseEntity<String> createTicket(
            Authentication authentication,
            @RequestBody SupportRequest request) {

        return ResponseEntity.ok(
                supportService.createTicket(authentication.getName(), request)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<SupportTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(
                supportService.getMyTickets(authentication.getName())
        );
    }
}
