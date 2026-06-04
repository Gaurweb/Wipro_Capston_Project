package com.myfin.customer.service;

import com.myfin.customer.dto.LoanRequest;
import com.myfin.customer.entity.*;
import com.myfin.customer.exception.CustomerNotFoundException;
import com.myfin.customer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final CustomerRepository customerRepo;
    private final LoanRepository loanRepo;

    public String applyLoan(String username, LoanRequest req) {
        Customer c = customerRepo.findByUsername(username)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        double r = req.getInterestRate() / 12 / 100;
        double emi = (req.getLoanAmount() * r * Math.pow(1 + r, req.getTenureMonths()))
                / (Math.pow(1 + r, req.getTenureMonths()) - 1);
        emi = Math.round(emi * 100.0) / 100.0;
        Loan loan = Loan.builder()
                .loanAmount(req.getLoanAmount())
                .interestRate(req.getInterestRate())
                .tenureMonths(req.getTenureMonths())
                .emiAmount(emi)
                .status(LoanStatus.PENDING)
                .customer(c).build();
        loanRepo.save(loan);
        return "Loan application submitted! Monthly EMI: Rs." + emi + ". Awaiting admin approval.";
    }

    public List<Loan> myLoans(String username) {
        Customer c = customerRepo.findByUsername(username)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        return loanRepo.findByCustomer(c);
    }
}
