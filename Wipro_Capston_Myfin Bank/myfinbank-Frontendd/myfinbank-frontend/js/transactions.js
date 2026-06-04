/**
 * transactions.js — Transaction History Page Logic
 * ==================================================
 * Handles:
 *   1. Route guard
 *   2. Fetch all transactions for the logged-in customer
 *   3. Render them in a table with type badges + formatted currency
 *
 * API used: GET /api/account/transactions
 * Each transaction has: { transactionId, type, amount, description, createdAt }
 * TransactionType enum (from backend): DEPOSIT, WITHDRAWAL, TRANSFER, RD, FD, LOAN
 */

// Protect the page
guardRoute("customer");

// Load transactions when page is ready
document.addEventListener("DOMContentLoaded", loadTransactions);

// =============================================================
//  LOAD TRANSACTIONS
// =============================================================

async function loadTransactions() {
  showLoader();
  try {
    // getTransactions() → GET /api/account/transactions  (defined in api.js)
    const txList = await getTransactions();

    const tbody = document.getElementById("tx-table-body");
    const empty = document.getElementById("tx-empty");

    if (!txList || txList.length === 0) {
      // Show the empty state message
      empty.style.display = "block";
      return;
    }

    // Build a <tr> for each transaction
    tbody.innerHTML = txList.map(tx => `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem; color:var(--grey);">
          ${tx.transactionId || "—"}
        </td>
        <td>${renderTypeBadge(tx.type)}</td>
        <td class="${isCreditType(tx.type) ? 'tx-credit' : 'tx-debit'}">
          ${isCreditType(tx.type) ? "+" : "−"}${formatCurrency(tx.amount)}
        </td>
        <td style="color:var(--grey); font-size:0.85rem;">${tx.description || "—"}</td>
        <td style="font-size:0.82rem; color:var(--grey);">${formatDate(tx.timestamp)}</td>
      </tr>
    `).join("");

  } catch (error) {
    showToast("Failed to load transactions: " + error.message, "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  HELPER: Render a colored badge based on transaction type
//  Types from backend enum: DEPOSIT, WITHDRAWAL, TRANSFER, RD, FD, LOAN
// =============================================================

function renderTypeBadge(type) {
  const map = {
    DEPOSIT    : "badge-success",
    WITHDRAW    : "badge-danger",
    FUND_TRANSFER : "badge-info",
    RECURRING_DEPOSIT : "badge-warning",
    FIXED_DEPOSIT : "badge-warning",
    LOAN_PAYMENT : "badge-info",
  };
  const cls = map[type] || "badge-info";
  return `<span class="badge ${cls}">${type || "—"}</span>`;
}

// =============================================================
//  HELPER: Is this transaction type a credit (money in) or debit?
//  Used to color the amount green (+) or red (−)
// =============================================================

function isCreditType(type) {
  return ["DEPOSIT", "LOAN_PAYMENT"].includes(type);
}
