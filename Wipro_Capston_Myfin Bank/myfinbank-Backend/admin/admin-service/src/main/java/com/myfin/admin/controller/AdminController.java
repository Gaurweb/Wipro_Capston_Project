package com.myfin.admin.controller;

import com.myfin.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @PutMapping("/customers/{id}/deactivate")
    public ResponseEntity<String> deactivate(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.setCustomerStatus(id, false));
    }

    @PutMapping("/customers/{id}/activate")
    public ResponseEntity<String> activate(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.setCustomerStatus(id, true));
    }

    @GetMapping("/loans/pending")
    public ResponseEntity<?> pendingLoans() {
        return ResponseEntity.ok(adminService.getPendingLoans());
    }

    @PutMapping("/loans/{id}/approve")
    public ResponseEntity<String> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveLoan(id));
    }

    @PutMapping("/loans/{id}/deny")
    public ResponseEntity<String> deny(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.denyLoan(id));
    }
    @GetMapping("/customers/search")
    public ResponseEntity<?> searchCustomers(@RequestParam String keyword) {
        return ResponseEntity.ok(
                adminService.searchCustomers(keyword)
        );
    }
}
