package com.myfin.customer.service;

import com.myfin.customer.dto.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.myfin.customer.entity.*;
import com.myfin.customer.repository.*;
import com.myfin.customer.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // Marks this class as a Spring-managed service bean containing business logic
@RequiredArgsConstructor // Automatically generates a constructor for all final fields to enable Dependency Injection
public class AuthService {

    private final CustomerRepository customerRepo;
    private final AccountRepository accountRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest req) {
        // 1. Validation: Prevent duplicate identity records in the system
        if (customerRepo.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");
        if (customerRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");

        // 2. Encryption & Entity Setup: Build customer profile and securely hash the raw text password
        Customer customer = Customer.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword())) // Encrypts the raw password before database insertion
                .email(req.getEmail())
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .active(true)
                .build();
        customer = customerRepo.save(customer); // Saves customer to the database and generates their ID

        // 3. Financial Provisioning: Auto-generate a linked bank account starting at zero balance
        Account account = Account.builder()
                // Generates an account number tracking code appended with the current timestamp milliseconds
                .accountNumber("MYFIN" + System.currentTimeMillis())
                .balance(0.0)
                .rdAmount(0.0)
                .fdAmount(0.0)
                .loanAmount(0.0)
                .customer(customer) // Binds the foreign key database relationship back to the new customer
                .build();
        accountRepo.save(account); // Commits the account record to the database
        
        return "Registration successful! Your account number: " + account.getAccountNumber();
    }

    public String login(LoginRequest req) {

        // 1. Handshake Initiation: Wrap credentials inside an unauthenticated Spring Security token token
        // 2. Execution: The manager intercepts, verifies credentials against UserDetailsService, and authenticates
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getUsername(),
                        req.getPassword()
                )
        );

        // 3. Extraction: Read the verified principal username out of the successful authentication context
        String username = authentication.getName();

        // 4. Token Provisioning: Generate and return a signed, stateless JWT token back to the user
        return jwtUtil.generateToken(username);
    }
}
