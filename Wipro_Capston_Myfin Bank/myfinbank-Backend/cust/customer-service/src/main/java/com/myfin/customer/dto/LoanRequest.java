package com.myfin.customer.dto;
import lombok.Data;

@Data
public class LoanRequest {
    private Double loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
}
