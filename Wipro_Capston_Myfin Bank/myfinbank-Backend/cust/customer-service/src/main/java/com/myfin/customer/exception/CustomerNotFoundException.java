package com.myfin.customer.exception;
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String msg) { super(msg); }
}
