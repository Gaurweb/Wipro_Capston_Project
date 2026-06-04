package com.myfin.admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RestTemplate restTemplate;

    @Value("${customer.service.url}")
    private String customerServiceUrl;

    public Object getAllCustomers() {
        return restTemplate.getForObject(
                customerServiceUrl + "/api/admin-bridge/customers", Object.class);
    }

    public String setCustomerStatus(Long id, boolean active) {
        String action = active ? "activate" : "deactivate";
        String url = customerServiceUrl + "/api/admin-bridge/customers/" + id + "/" + action;
        restTemplate.exchange(url, HttpMethod.PUT, HttpEntity.EMPTY, String.class);
        return "Customer " + action + "d successfully";
    }

    public Object getPendingLoans() {
        return restTemplate.getForObject(
                customerServiceUrl + "/api/admin-bridge/loans/pending", Object.class);
    }

    public String approveLoan(Long loanId) {
        String url = customerServiceUrl + "/api/admin-bridge/loans/" + loanId + "/approved";
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.PUT, HttpEntity.EMPTY, String.class);
        return response.getBody();
    }

    public String denyLoan(Long loanId) {
        String url = customerServiceUrl + "/api/admin-bridge/loans/" + loanId + "/denied";
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.PUT, HttpEntity.EMPTY, String.class);// 1. What action to take (PUT request)
        return response.getBody();                                   // 3. No body or headers are being sent
    }

    public Object getAllSupportTickets() {
        return restTemplate.getForObject(
                customerServiceUrl + "/api/admin-bridge/support/all",
                Object.class
        );
    }

    public String replySupportTicket(Long ticketId, Object replyRequest) {
        String url = customerServiceUrl + "/api/admin-bridge/support/reply/" + ticketId;

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                new HttpEntity<>(replyRequest),
                String.class
        );

        return response.getBody();
    }

    public String closeSupportTicket(Long ticketId) {
        String url = customerServiceUrl + "/api/admin-bridge/support/close/" + ticketId;

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.PUT,
                HttpEntity.EMPTY,
                String.class
        );

        return response.getBody();
    }
    public Object searchCustomers(String keyword) {

        String url =
                customerServiceUrl
                        + "/api/admin-bridge/customers/search?keyword={keyword}";

        return restTemplate.getForObject(
                url,
                Object.class,
                keyword
        );
    }
}