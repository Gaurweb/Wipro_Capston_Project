package com.myfin.customer.repository;

import com.myfin.customer.entity.Customer;
import com.myfin.customer.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}
