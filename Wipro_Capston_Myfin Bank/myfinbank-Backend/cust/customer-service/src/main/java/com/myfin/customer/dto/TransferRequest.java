package com.myfin.customer.dto;
import lombok.Data;

@Data
public class TransferRequest {
    private String targetAccountNumber;
    private Double amount;
    private String description;
}
