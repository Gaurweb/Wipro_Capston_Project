/**
 * dashboard.js — Customer Dashboard Logic
 * =========================================
 * Handles:
 *   1. Route guard (redirect if not logged in)
 *   2. Load + display account details on page load
 *   3. Deposit, Withdraw, Fund Transfer operations
 *
 * All API calls use functions from api.js.
 * All UI feedback (toast, loader) uses functions from ui.js.
 */

// =============================================================
//  PAGE INITIALIZATION
//  Called automatically when the page loads.
// =============================================================

// guardRoute() is in ui.js → redirects to login if no token
guardRoute("customer");

// As soon as the page is ready, load the account data
document.addEventListener("DOMContentLoaded", loadAccountDetails);

// =============================================================
//  LOAD ACCOUNT DETAILS
//  Calls GET /api/account/details
//  Response shape: { accountNumber, balance, accountType, active }
// =============================================================

async function loadAccountDetails() {
  try {
    // getAccountDetails() is in api.js
    const account = await getAccountDetails();

    // Populate the balance hero card
    document.getElementById("balance-amount").textContent  = formatCurrency(account.balance);
    document.getElementById("balance-account").textContent = `Account No: ${account.accountNumber}`;

    // Populate the stat chips
    document.getElementById("stat-accno").textContent  = account.accountNumber || "—";
    document.getElementById("stat-type").textContent   = account.accountType   || "Savings";
    document.getElementById("stat-status").textContent = "Active ✓";
    document.getElementById("stat-status").style.color = "var(--success)";

    // Show customer name in navbar
    document.getElementById("nav-username").textContent = localStorage.getItem("myfin_user") || "Customer";

  } catch (error) {
    // If token is expired the backend sends 401/403
    showToast("Session expired. Please login again.", "error");
    setTimeout(() => {
      clearToken();
      window.location.href = "login.html";
    }, 1500);
  }
}

// =============================================================
//  DEPOSIT HANDLER
//  Reads amount input → calls deposit() in api.js
//  On success: refreshes account details and shows toast
// =============================================================

async function handleDeposit() {
  const amount = parseFloat(document.getElementById("deposit-amount").value);

  if (!amount || amount <= 0) {
    showToast("Please enter a valid deposit amount.", "error");
    return;
  }

  showLoader();
  try {
    // deposit(amount) → POST /api/account/deposit
    const msg = await deposit(amount);
    showToast(msg || "Deposit successful!", "success");

    // Clear the input field
    document.getElementById("deposit-amount").value = "";

    // Refresh balance display
    await loadAccountDetails();

  } catch (error) {
    showToast(error.message || "Deposit failed.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  WITHDRAW HANDLER
//  Similar to deposit but calls withdraw() in api.js.
//  Backend will throw InsufficientBalanceException if balance < amount.
// =============================================================

async function handleWithdraw() {
  const amount = parseFloat(document.getElementById("withdraw-amount").value);

  if (!amount || amount <= 0) {
    showToast("Please enter a valid withdrawal amount.", "error");
    return;
  }

  showLoader();
  try {
    // withdraw(amount) → POST /api/account/withdraw
    const msg = await withdraw(amount);
    showToast(msg || "Withdrawal successful!", "success");

    document.getElementById("withdraw-amount").value = "";
    await loadAccountDetails();

  } catch (error) {
    // Backend throws "Insufficient balance" → shown here
    showToast(error.message || "Withdrawal failed.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  FUND TRANSFER HANDLER
//  Sends money to another account number.
//  Calls transfer(toAccountNumber, amount) in api.js.
// =============================================================

async function handleTransfer() {
  const toAccount = document.getElementById("transfer-to").value.trim();
  const amount    = parseFloat(document.getElementById("transfer-amount").value);

  if (!toAccount) {
    showToast("Please enter a recipient account number.", "error");
    return;
  }
  if (!amount || amount <= 0) {
    showToast("Please enter a valid transfer amount.", "error");
    return;
  }

  showLoader();
  try {
    // transfer(toAccountNumber, amount) → POST /api/account/transfer
    const msg = await transfer(toAccount, amount);
    showToast(msg || "Transfer successful!", "success");

    document.getElementById("transfer-to").value     = "";
    document.getElementById("transfer-amount").value = "";
    await loadAccountDetails();

  } catch (error) {
    showToast(error.message || "Transfer failed.", "error");
  } finally {
    hideLoader();
  }
}
