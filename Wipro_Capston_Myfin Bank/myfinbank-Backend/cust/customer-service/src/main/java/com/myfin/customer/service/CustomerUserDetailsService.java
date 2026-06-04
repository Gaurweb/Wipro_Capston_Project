package com.myfin.customer.service;

import com.myfin.customer.entity.Customer;
import com.myfin.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Step 1: First try searching by exact username string matches
        Optional<Customer> customerOpt = customerRepository.findByUsername(usernameOrEmail);
        
        // Step 2: Fallback to cross-check search by email if username yielded empty
        if (!customerOpt.isPresent()) {
            customerOpt = customerRepository.findByEmail(usernameOrEmail); // 👈 Changed findBYEmail to findByEmail
        }
        
        // Step 3: Handle the missing state gracefully with clean exceptions
        Customer c = customerOpt.orElseThrow(() -> 
                new UsernameNotFoundException("User records not found matching: " + usernameOrEmail));

        if (!c.isActive()) {
            throw new UsernameNotFoundException("Account is deactivated");
        }

        return User.builder()
                .username(c.getUsername())
                .password(c.getPassword())
                .roles("CUSTOMER")
                .build();
    }
}