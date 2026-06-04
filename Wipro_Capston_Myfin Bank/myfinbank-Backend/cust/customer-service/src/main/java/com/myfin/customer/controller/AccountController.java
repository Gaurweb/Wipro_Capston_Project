package com.myfin.customer.controller;

import com.myfin.customer.dto.*;
import com.myfin.customer.entity.*;
import com.myfin.customer.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/details")
    public ResponseEntity<Account> details(Authentication auth) {
        return ResponseEntity.ok(accountService.getDetails(auth.getName()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(Authentication auth,
            @RequestBody DepositWithdrawRequest req) {
        return ResponseEntity.ok(accountService.deposit(auth.getName(), req));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(Authentication auth,
            @RequestBody DepositWithdrawRequest req) {
        return ResponseEntity.ok(accountService.withdraw(auth.getName(), req));
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(Authentication auth,
            @RequestBody TransferRequest req) {
        return ResponseEntity.ok(accountService.transfer(auth.getName(), req));
    }

    @PostMapping("/invest/rd")
    public ResponseEntity<String> rd(Authentication auth,
            @RequestBody InvestmentRequest req) {
        return ResponseEntity.ok(accountService.investRD(auth.getName(), req));
    }

    @PostMapping("/invest/fd")
    public ResponseEntity<String> fd(Authentication auth,
            @RequestBody InvestmentRequest req) {
        return ResponseEntity.ok(accountService.investFD(auth.getName(), req));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> transactions(Authentication auth) {
        return ResponseEntity.ok(accountService.getTransactions(auth.getName()));
    }

    @GetMapping("/emi")
    public ResponseEntity<Map<String, Double>> emi(
            @RequestParam Double principal,
            @RequestParam Double annualRate,
            @RequestParam Integer months) {
        double result = accountService.calcEMI(principal, annualRate, months);
        return ResponseEntity.ok(Map.of("emiPerMonth", result));
    }
}
