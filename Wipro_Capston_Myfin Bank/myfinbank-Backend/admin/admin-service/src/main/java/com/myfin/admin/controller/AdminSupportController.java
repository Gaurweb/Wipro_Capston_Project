package com.myfin.admin.controller;

import com.myfin.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminSupportController {

    private final AdminService adminService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllSupportTickets() {
        return ResponseEntity.ok(adminService.getAllSupportTickets());
    }

    @PutMapping("/reply/{id}")
    public ResponseEntity<String> replySupportTicket(
            @PathVariable Long id,
            @RequestBody Object replyRequest) {

        return ResponseEntity.ok(
                adminService.replySupportTicket(id, replyRequest)
        );
    }

    @PutMapping("/close/{id}")
    public ResponseEntity<String> closeSupportTicket(@PathVariable Long id) {
        return ResponseEntity.ok(
                adminService.closeSupportTicket(id)
        );
    }
}
