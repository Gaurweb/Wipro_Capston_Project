package com.myfin.customer.service;

import com.myfin.customer.dto.SupportReplyRequest;
import com.myfin.customer.dto.SupportRequest;
import com.myfin.customer.entity.Customer;
import com.myfin.customer.entity.SupportStatus;
import com.myfin.customer.entity.SupportTicket;
import com.myfin.customer.repository.CustomerRepository;
import com.myfin.customer.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportTicketRepository supportTicketRepository;
    private final CustomerRepository customerRepository;

    public String createTicket(String username, SupportRequest request) {

        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new RuntimeException("Subject is required");
        }

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SupportTicket ticket = SupportTicket.builder()
                .subject(request.getSubject().trim())
                .message(request.getMessage().trim())
                .customer(customer)
                .status(SupportStatus.OPEN)
                .build();

        supportTicketRepository.save(ticket);

        return "Your query has been submitted successfully";
    }

    public List<SupportTicket> getMyTickets(String username) {

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return supportTicketRepository.findByCustomerOrderByCreatedAtDesc(customer);
    }

    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc();
    }

    public String replyToTicket(Long ticketId, SupportReplyRequest request) {

        if (request.getReply() == null || request.getReply().trim().isEmpty()) {
            throw new RuntimeException("Reply is required");
        }

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found"));

        ticket.setAdminReply(request.getReply().trim());
        ticket.setStatus(SupportStatus.REPLIED);
        ticket.setRepliedAt(LocalDateTime.now());

        supportTicketRepository.save(ticket);

        return "Reply sent successfully";
    }

    public String closeTicket(Long ticketId) {

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found"));

        ticket.setStatus(SupportStatus.CLOSED);

        supportTicketRepository.save(ticket);

        return "Ticket closed successfully";
    }
}
