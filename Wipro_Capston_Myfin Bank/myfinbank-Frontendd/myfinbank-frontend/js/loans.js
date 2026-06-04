/**
 * loans.js — Loan Application Page Logic
 * ========================================
 * Handles:
 *   1. Route guard
 *   2. Load & display my existing loans on page load
 *   3. Apply for a new loan
 *
 * APIs used:
 *   - POST /api/loans/apply   → applyLoan(amount, purpose)
 *   - GET  /api/loans/my      → getMyLoans()
 *
 * Loan entity fields: { id, amount, purpose, status, createdAt }
 * LoanStatus enum: PENDING, APPROVED, DENIED
 */

guardRoute("customer");

document.addEventListener("DOMContentLoaded", loadMyLoans);

// =============================================================
//  LOAD MY LOANS
//  Fetches all loan applications for the current user.
// =============================================================

async function loadMyLoans() {
  try {
    // getMyLoans() → GET /api/loans/my  (defined in api.js)
    const loans = await getMyLoans();

    const tbody = document.getElementById("loan-table-body");
    const empty = document.getElementById("loan-empty");

    if (!loans || loans.length === 0) {
      empty.style.display = "block";
      return;
    }

    tbody.innerHTML = loans.map(loan => `
      <tr>
        <td>${formatCurrency(loan.loanAmount)}</td>
        <td style="font-size:0.85rem; color:var(--grey);">${loan.purpose || `${loan.interestRate || 8.5}% / ${loan.tenureMonths || 24} months`}</td>
        <td>${renderLoanStatusBadge(loan.status)}</td>
        <td style="font-size:0.8rem; color:var(--grey);">${formatDate(loan.appliedAt)}</td>
      </tr>
    `).join("");

  } catch (error) {
    showToast("Could not load loans: " + error.message, "error");
  }
}

// =============================================================
//  APPLY FOR LOAN
//  Submits a new loan application to the backend.
//  Admin will then APPROVE or DENY it from their dashboard.
// =============================================================

async function handleApplyLoan() {
  const amount  = parseFloat(document.getElementById("loan-amount").value);
  const purpose = document.getElementById("loan-purpose").value.trim();

  if (!amount || amount < 1000) {
    showToast("Minimum loan amount is ₹1,000.", "error");
    return;
  }
  if (!purpose) {
    showToast("Please enter a loan purpose.", "error");
    return;
  }

  showLoader();
  try {
    // applyLoan(amount, purpose) → POST /api/loans/apply  (defined in api.js)
    const msg = await applyLoan(amount, purpose);
    showToast(msg || "Loan application submitted!", "success");

    // Clear inputs
    document.getElementById("loan-amount").value  = "";
    document.getElementById("loan-purpose").value = "";

    // Refresh the loans list to show the new PENDING entry
    await loadMyLoans();

  } catch (error) {
    showToast(error.message || "Loan application failed.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  HELPER: Render badge based on loan status
//  LoanStatus enum: PENDING, APPROVED, DENIED
// =============================================================

function renderLoanStatusBadge(status) {
  const map = {
    PENDING  : "badge-warning",
    APPROVED : "badge-success",
    DENIED   : "badge-danger",
  };
  const cls = map[status] || "badge-info";
  return `<span class="badge ${cls}">${status || "—"}</span>`;
}
