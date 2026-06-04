package com.myfin.customer.service;

import com.myfin.customer.dto.*;
import com.myfin.customer.entity.*;
import com.myfin.customer.exception.*;
import com.myfin.customer.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final CustomerRepository customerRepo;
    private final AccountRepository accountRepo;
    private final TransactionRepository txRepo;

    private Customer getCustomer(String username) {
        return customerRepo.findByUsername(username)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found: " + username));
    }

    private Account getAccount(Customer c) {
        return accountRepo.findByCustomer(c)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
    }

    public Account getDetails(String username) {
        return getAccount(getCustomer(username));
    }

    @Transactional
    public String deposit(String username, DepositWithdrawRequest req) {
        Account acc = getAccount(getCustomer(username));
        acc.setBalance(acc.getBalance() + req.getAmount());
        accountRepo.save(acc);
        Transaction tx = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(req.getAmount())
                .description(req.getDescription() != null ? req.getDescription() : "Deposit")
                .account(acc).build();
        txRepo.save(tx);
        return "Deposited Rs." + req.getAmount() + " successfully | TxnID: " + tx.getTransactionId();
    }

    @Transactional
    public String withdraw(String username, DepositWithdrawRequest req) {
        Account acc = getAccount(getCustomer(username));
        if (acc.getBalance() < req.getAmount())
            throw new InsufficientBalanceException("Insufficient balance. Available: Rs." + acc.getBalance());
        acc.setBalance(acc.getBalance() - req.getAmount());
        accountRepo.save(acc);
        Transaction tx = Transaction.builder()
                .type(TransactionType.WITHDRAW)
                .amount(req.getAmount())
                .description(req.getDescription() != null ? req.getDescription() : "Withdrawal")
                .account(acc).build();
        txRepo.save(tx);
        return "Withdrawn Rs." + req.getAmount() + " successfully | TxnID: " + tx.getTransactionId();
    }

    @Transactional
    public String transfer(String username, TransferRequest req) {
        Account sender = getAccount(getCustomer(username));
        if (sender.getBalance() < req.getAmount())
            throw new InsufficientBalanceException("Insufficient balance for transfer");
        Account receiver = accountRepo.findByAccountNumber(req.getTargetAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException(
                        "Target account not found: " + req.getTargetAccountNumber()));
        sender.setBalance(sender.getBalance() - req.getAmount());
        receiver.setBalance(receiver.getBalance() + req.getAmount());
        accountRepo.save(sender);
        accountRepo.save(receiver);
        Transaction tx = Transaction.builder()
                .type(TransactionType.FUND_TRANSFER)
                .amount(req.getAmount())
                .description("Fund Transfer to " + req.getTargetAccountNumber())
                .targetAccountNumber(req.getTargetAccountNumber())
                .account(sender).build();
        txRepo.save(tx);
        return "Transferred Rs." + req.getAmount() + " to " + req.getTargetAccountNumber()
                + " | TxnID: " + tx.getTransactionId();
    }

    @Transactional
    public String investRD(String username, InvestmentRequest req) {
        Account acc = getAccount(getCustomer(username));
        if (acc.getBalance() < req.getAmount())
            throw new InsufficientBalanceException("Insufficient balance for RD");
        acc.setBalance(acc.getBalance() - req.getAmount());
        acc.setRdAmount(acc.getRdAmount() + req.getAmount());
        accountRepo.save(acc);
        Transaction tx = Transaction.builder()
                .type(TransactionType.RECURRING_DEPOSIT)
                .amount(req.getAmount())
                .description("Recurring Deposit Investment")
                .account(acc).build();
        txRepo.save(tx);
        return "RD Investment of Rs." + req.getAmount() + " done | TxnID: " + tx.getTransactionId();
    }

    @Transactional
    public String investFD(String username, InvestmentRequest req) {
        Account acc = getAccount(getCustomer(username));
        if (acc.getBalance() < req.getAmount())
            throw new InsufficientBalanceException("Insufficient balance for FD");
        acc.setBalance(acc.getBalance() - req.getAmount());
        acc.setFdAmount(acc.getFdAmount() + req.getAmount());
        accountRepo.save(acc);
        Transaction tx = Transaction.builder()
                .type(TransactionType.FIXED_DEPOSIT)
                .amount(req.getAmount())
                .description("Fixed Deposit Investment")
                .account(acc).build();
        txRepo.save(tx);
        return "FD Investment of Rs." + req.getAmount() + " done | TxnID: " + tx.getTransactionId();
    }

    public List<Transaction> getTransactions(String username) {
        return txRepo.findByAccountOrderByTimestampDesc(getAccount(getCustomer(username)));
    }

    public double calcEMI(double principal, double annualRate, int months) {
        double r = annualRate / 12 / 100;
        double emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        return Math.round(emi * 100.0) / 100.0;
    }
}
