package com.myfin.customer.controller;

import com.myfin.customer.dto.SupportReplyRequest;
import com.myfin.customer.entity.SupportTicket;
import com.myfin.customer.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-bridge/support")
@RequiredArgsConstructor
public class AdminSupportBridgeController {

    private final SupportService supportService;

    @GetMapping("/all")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @PutMapping("/reply/{id}")
    public ResponseEntity<String> replyToTicket(
            @PathVariable Long id,
            @RequestBody SupportReplyRequest request) {

        return ResponseEntity.ok(
                supportService.replyToTicket(id, request)
        );
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<String> closeTicket(@PathVariable Long id) {
        return ResponseEntity.ok(
                supportService.closeTicket(id)
        );
    }
}
