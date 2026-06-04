/**
 * investments.js — Investments Page Logic
 * =========================================
 * Handles:
 *   1. Route guard
 *   2. Recurring Deposit (RD) form submission
 *   3. Fixed Deposit (FD) form submission
 *
 * APIs used:
 *   - POST /api/account/invest/rd  → investRD(amount, months)
 *   - POST /api/account/invest/fd  → investFD(amount, months)
 *
 * Both endpoints deduct the amount from the customer's balance
 * and create a transaction of type RD or FD.
 */

guardRoute("customer");

// =============================================================
//  RECURRING DEPOSIT (RD) HANDLER
// =============================================================

async function handleRD() {
  const amount = parseFloat(document.getElementById("rd-amount").value);
  const months = parseInt(document.getElementById("rd-months").value);

  if (!amount || amount < 500) {
    showToast("Minimum RD amount is ₹500.", "error");
    return;
  }
  if (!months || months < 3) {
    showToast("Minimum RD duration is 3 months.", "error");
    return;
  }

  showLoader();
  try {
    // investRD(amount, months) → POST /api/account/invest/rd  (defined in api.js)
    const msg = await investRD(amount, months);
    showToast(msg || `RD of ${formatCurrency(amount)} started for ${months} months!`, "success");

    document.getElementById("rd-amount").value = "";
    document.getElementById("rd-months").value = "";

  } catch (error) {
    showToast(error.message || "RD investment failed.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  FIXED DEPOSIT (FD) HANDLER
// =============================================================

async function handleFD() {
  const amount = parseFloat(document.getElementById("fd-amount").value);
  const months = parseInt(document.getElementById("fd-months").value);

  if (!amount || amount < 1000) {
    showToast("Minimum FD amount is ₹1,000.", "error");
    return;
  }
  if (!months || months < 3) {
    showToast("Minimum FD duration is 3 months.", "error");
    return;
  }

  showLoader();
  try {
    // investFD(amount, months) → POST /api/account/invest/fd  (defined in api.js)
    const msg = await investFD(amount, months);
    showToast(msg || `FD of ${formatCurrency(amount)} locked for ${months} months!`, "success");

    document.getElementById("fd-amount").value = "";
    document.getElementById("fd-months").value = "";

  } catch (error) {
    showToast(error.message || "FD investment failed.", "error");
  } finally {
    hideLoader();
  }
}
