package com.myfin.customer.controller;

import com.myfin.customer.dto.LoanRequest;
import com.myfin.customer.entity.Loan;
import com.myfin.customer.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/apply")
    public ResponseEntity<String> apply(Authentication auth,
            @RequestBody LoanRequest req) {
        return ResponseEntity.ok(loanService.applyLoan(auth.getName(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Loan>> myLoans(Authentication auth) {
        return ResponseEntity.ok(loanService.myLoans(auth.getName()));
    }
}
