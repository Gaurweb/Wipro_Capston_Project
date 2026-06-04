/**
 * api.js — MyFinBank API Configuration
 * ======================================
 * This file is the SINGLE SOURCE OF TRUTH for all backend URLs.
 * Every API call in the app goes through the functions defined here.
 */

const BASE_URL = "http://localhost:9090";

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/auth/register`,
  LOGIN: `${BASE_URL}/api/auth/login`,

  ACCOUNT_DETAILS: `${BASE_URL}/api/account/details`,
  DEPOSIT: `${BASE_URL}/api/account/deposit`,
  WITHDRAW: `${BASE_URL}/api/account/withdraw`,
  TRANSFER: `${BASE_URL}/api/account/transfer`,
  INVEST_RD: `${BASE_URL}/api/account/invest/rd`,
  INVEST_FD: `${BASE_URL}/api/account/invest/fd`,
  TRANSACTIONS: `${BASE_URL}/api/account/transactions`,
  EMI_CALC: `${BASE_URL}/api/account/emi`,

  LOAN_APPLY: `${BASE_URL}/api/loans/apply`,
  LOAN_MY: `${BASE_URL}/api/loans/my`,

  ADMIN_REGISTER: `${BASE_URL}/api/admin/auth/register`,
  ADMIN_LOGIN: `${BASE_URL}/api/admin/auth/login`,

  ADMIN_CUSTOMERS: `${BASE_URL}/api/admin/customers`,
  ADMIN_DEACTIVATE: (id) => `${BASE_URL}/api/admin/customers/${id}/deactivate`,
  ADMIN_ACTIVATE: (id) => `${BASE_URL}/api/admin/customers/${id}/activate`,
  ADMIN_LOANS_PENDING: `${BASE_URL}/api/admin/loans/pending`,
  ADMIN_LOAN_APPROVE: (id) => `${BASE_URL}/api/admin/loans/${id}/approve`,
  ADMIN_LOAN_DENY: (id) => `${BASE_URL}/api/admin/loans/${id}/deny`,
  ADMIN_CUSTOMER_SEARCH: (keyword) =>
  `${BASE_URL}/api/admin/customers/search?keyword=${encodeURIComponent(keyword)}`,

  SUPPORT_CREATE: `${BASE_URL}/api/support/create`,
  SUPPORT_MY: `${BASE_URL}/api/support/my`,
  ADMIN_SUPPORT_ALL: `${BASE_URL}/api/admin/support/all`,
  ADMIN_SUPPORT_REPLY: (id) => `${BASE_URL}/api/admin/support/reply/${id}`,
  ADMIN_SUPPORT_CLOSE: (id) => `${BASE_URL}/api/admin/support/close/${id}`
};

/**
 * Save JWT token safely.
 *
 * Backend may return:
 * 1. "eyJhbGc..." plain token
 * 2. "Bearer eyJhbGc..." token
 * 3. { token: "eyJhbGc..." }
 */
function saveToken(token) {
  if (typeof token === "object" && token.token) {
    token = token.token;
  }

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.substring(7);
  }

  localStorage.setItem("myfin_token", token);
}

function getToken() {
  return localStorage.getItem("myfin_token");
}

function clearToken() {
  localStorage.removeItem("myfin_token");
  localStorage.removeItem("myfin_role");
  localStorage.removeItem("myfin_user");
}

function saveRole(role) {
  localStorage.setItem("myfin_role", role);
}

function getRole() {
  return localStorage.getItem("myfin_role");
}

/**
 * Every protected API needs:
 * Authorization: Bearer TOKEN
 */
function buildHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };

  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function apiRequest(url, method = "GET", body = null) {
  const options = {
    method: method,
    headers: buildHeaders()
  };

  if (body !== null && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data.message || "Request failed";

    throw new Error(message);
  }

  return data;
}

/* AUTH */

async function registerCustomer(name, email, password) {
  return apiRequest(ENDPOINTS.REGISTER, "POST", {
    username: email,
    fullName: name,
    email: email,
    password: password,
    phone: "9999999999"
  });
}

async function loginCustomer(email, password) {
  return apiRequest(ENDPOINTS.LOGIN, "POST", {
    username: email,
    password: password
  });
}

async function registerAdmin(name, email, password) {
  return apiRequest(ENDPOINTS.ADMIN_REGISTER, "POST", {
    username: email,
    email: email,
    password: password
  });
}

async function loginAdmin(email, password) {
  return apiRequest(ENDPOINTS.ADMIN_LOGIN, "POST", {
    username: email,
    password: password
  });
}

/* ACCOUNT */

async function getAccountDetails() {
  return apiRequest(ENDPOINTS.ACCOUNT_DETAILS);
}

async function deposit(amount) {
  return apiRequest(ENDPOINTS.DEPOSIT, "POST", {
    amount: amount
  });
}

async function withdraw(amount) {
  return apiRequest(ENDPOINTS.WITHDRAW, "POST", {
    amount: amount
  });
}

async function transfer(toAccountNumber, amount) {
  return apiRequest(ENDPOINTS.TRANSFER, "POST", {
    targetAccountNumber: toAccountNumber,
    amount: amount,
    description: `Fund Transfer to ${toAccountNumber}`
  });
}

async function investRD(amount, months) {
  return apiRequest(ENDPOINTS.INVEST_RD, "POST", {
    amount: amount
  });
}

async function investFD(amount, months) {
  return apiRequest(ENDPOINTS.INVEST_FD, "POST", {
    amount: amount
  });
}

async function getTransactions() {
  return apiRequest(ENDPOINTS.TRANSACTIONS);
}

async function calculateEMI(principal, annualRate, months) {
  const url =
    `${ENDPOINTS.EMI_CALC}?principal=${principal}&annualRate=${annualRate}&months=${months}`;

  return apiRequest(url);
}

/* LOANS */

async function applyLoan(amount, purpose) {
  return apiRequest(ENDPOINTS.LOAN_APPLY, "POST", {
    loanAmount: amount,
    interestRate: 8.5,
    tenureMonths: 24
  });
}

async function getMyLoans() {
  return apiRequest(ENDPOINTS.LOAN_MY);
}

/* ADMIN */

async function getAllCustomers() {
  return apiRequest(ENDPOINTS.ADMIN_CUSTOMERS);
}

async function deactivateCustomer(id) {
  return apiRequest(ENDPOINTS.ADMIN_DEACTIVATE(id), "PUT");
}

async function activateCustomer(id) {
  return apiRequest(ENDPOINTS.ADMIN_ACTIVATE(id), "PUT");
}

async function getPendingLoans() {
  return apiRequest(ENDPOINTS.ADMIN_LOANS_PENDING);
}

async function approveLoan(id) {
  return apiRequest(ENDPOINTS.ADMIN_LOAN_APPROVE(id), "PUT");
}

async function denyLoan(id) {
  return apiRequest(ENDPOINTS.ADMIN_LOAN_DENY(id), "PUT");
}

/* SUPPORT / CHAT QUERY */

async function createSupportTicket(subject, message) {
  return apiRequest(ENDPOINTS.SUPPORT_CREATE, "POST", {
    subject: subject,
    message: message
  });
}

async function getMySupportTickets() {
  return apiRequest(ENDPOINTS.SUPPORT_MY);
}

async function getAllSupportTickets() {
  return apiRequest(ENDPOINTS.ADMIN_SUPPORT_ALL);
}

async function replySupportTicket(id, reply) {
  return apiRequest(ENDPOINTS.ADMIN_SUPPORT_REPLY(id), "PUT", {
    reply: reply
  });
}

async function closeSupportTicket(id) {
  return apiRequest(ENDPOINTS.ADMIN_SUPPORT_CLOSE(id), "PUT");
}
async function searchCustomers(keyword) {
  return apiRequest(ENDPOINTS.ADMIN_CUSTOMER_SEARCH(keyword));
}