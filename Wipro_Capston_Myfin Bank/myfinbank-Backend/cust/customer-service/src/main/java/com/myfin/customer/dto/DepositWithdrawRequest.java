package com.myfin.customer.dto;
import lombok.Data;

@Data
public class DepositWithdrawRequest {
    private Double amount;
    private String description;
}
