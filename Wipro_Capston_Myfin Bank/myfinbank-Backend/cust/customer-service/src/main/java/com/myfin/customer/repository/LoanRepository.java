package com.myfin.customer.repository;

import com.myfin.customer.entity.Loan;
import com.myfin.customer.entity.LoanStatus;
import com.myfin.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByCustomer(Customer customer);
    List<Loan> findByStatus(LoanStatus status);  
}