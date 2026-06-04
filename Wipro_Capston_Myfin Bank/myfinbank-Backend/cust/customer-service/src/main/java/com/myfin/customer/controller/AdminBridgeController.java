package com.myfin.customer.controller;

import com.myfin.customer.entity.*;
import com.myfin.customer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-bridge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminBridgeController {

    private final LoanRepository loanRepo;
    private final CustomerRepository customerRepo;
    private final AccountRepository accountRepo;

    @GetMapping("/customers")
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        List<Map<String, Object>> customers = customerRepo.findAll().stream()
                .map(c -> Map.<String, Object>of(
                        "id", c.getId(),
                        "username", c.getUsername(),
                        "email", c.getEmail(),
                        "fullName", c.getFullName() == null ? "" : c.getFullName(),
                        "phone", c.getPhone() == null ? "" : c.getPhone(),
                        "active", c.isActive(),
                        "createdAt", c.getCreatedAt() == null ? "" : c.getCreatedAt().toString()
                ))
                .toList();
        return ResponseEntity.ok(customers);
    }

    @PutMapping("/customers/{id}/activate")
    public ResponseEntity<String> activate(@PathVariable Long id) {
        Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        c.setActive(true);
        customerRepo.save(c);
        return ResponseEntity.ok("Customer activated");
    }

    @PutMapping("/customers/{id}/deactivate")
    public ResponseEntity<String> deactivate(@PathVariable Long id) {
        Customer c = customerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        c.setActive(false);
        customerRepo.save(c);
        return ResponseEntity.ok("Customer deactivated");
    }

    @Transactional(readOnly = true)
    @GetMapping("/loans/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingLoans() {
        List<Map<String, Object>> loans = loanRepo.findByStatus(LoanStatus.PENDING).stream()
                .map(l -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", l.getId());
                    row.put("loanAmount", l.getLoanAmount());
                    row.put("interestRate", l.getInterestRate());
                    row.put("tenureMonths", l.getTenureMonths());
                    row.put("emiAmount", l.getEmiAmount());
                    row.put("status", l.getStatus().name());
                    row.put("appliedAt", l.getAppliedAt() == null ? "" : l.getAppliedAt().toString());
                    row.put("customerId", l.getCustomer() == null ? "" : l.getCustomer().getId());
                    row.put("customerUsername", l.getCustomer() == null ? "" : l.getCustomer().getUsername());
                    row.put("customerEmail", l.getCustomer() == null ? "" : l.getCustomer().getEmail());
                    return row;
                })
                .toList();
        return ResponseEntity.ok(loans);
    }

    @Transactional
    @PutMapping("/loans/{id}/approved")
    public ResponseEntity<String> approveLoan(@PathVariable Long id) {
        Loan loan = loanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        Account acc = accountRepo.findByCustomer(loan.getCustomer())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (acc.getBalance() == null) acc.setBalance(0.0);
        if (acc.getLoanAmount() == null) acc.setLoanAmount(0.0);

        acc.setBalance(acc.getBalance() + loan.getLoanAmount());
        acc.setLoanAmount(acc.getLoanAmount() + loan.getLoanAmount());
        accountRepo.save(acc);

        loan.setStatus(LoanStatus.APPROVED);
        loanRepo.save(loan);

        return ResponseEntity.ok("Loan " + id + " approved and Rs. " + loan.getLoanAmount() + " credited to account");
    }

    @PutMapping("/loans/{id}/denied")
    public ResponseEntity<String> denyLoan(@PathVariable Long id) {
        Loan loan = loanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus(LoanStatus.DENIED);
        loanRepo.save(loan);
        return ResponseEntity.ok("Loan " + id + " denied");
    }
    @GetMapping("/customers/search")
    public ResponseEntity<?> searchCustomers(
            @RequestParam String keyword
    ) {

        try {

            Long id = Long.parseLong(keyword);

            return ResponseEntity.ok(

                    customerRepo
                            .findById(id)
                            .map(List::of)
                            .orElse(List.of())

            );

        }

        catch (Exception e) {

            return ResponseEntity.ok(

                    customerRepo
                            .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                                    keyword,
                                    keyword
                            )

            );

        }

    }
}
