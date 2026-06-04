package com.myfin.customer.repository;

import com.myfin.customer.entity.Account;
import com.myfin.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByCustomer(Customer customer);
    Optional<Account> findByAccountNumber(String accountNumber);
}
