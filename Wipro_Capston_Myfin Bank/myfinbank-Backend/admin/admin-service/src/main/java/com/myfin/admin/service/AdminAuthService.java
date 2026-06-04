package com.myfin.admin.service;

import com.myfin.admin.dto.*;
import com.myfin.admin.entity.Admin;
import com.myfin.admin.repository.AdminRepository;
import com.myfin.admin.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepo;
    private final PasswordEncoder encoder; //Encrypts password.
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest req) {
        if (adminRepo.existsByUsername(req.getUsername())) 
            throw new RuntimeException("Admin username already taken");
        Admin admin = Admin.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .email(req.getEmail())
                .build();
        adminRepo.save(admin);
        return "Admin registered successfully";
    }

    public String login(LoginRequest req) {
        authManager.authenticate( //Checks username/password.
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        return jwtUtil.generateToken(req.getUsername());
    }
}
