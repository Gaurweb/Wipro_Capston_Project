/**
 * ui.js — Shared UI Utilities
 * ============================
 * Reusable helper functions used across ALL pages.
 * Import this file in every HTML page.
 *
 * Includes:
 *  - showToast()   → small pop-up notification (success / error)
 *  - showLoader()  → shows a full-page spinner
 *  - hideLoader()  → hides it
 *  - formatCurrency() → formats numbers as ₹1,23,456
 *  - formatDate()  → formats ISO date strings nicely
 *  - guardRoute()  → redirects unauthenticated users to login
 */

// =============================================================
//  TOAST NOTIFICATION
//  Shows a small box at the bottom-right of the screen.
//  Auto-disappears after 3 seconds.
// =============================================================

/**
 * showToast — display a short notification message
 * @param {string} message  - Text to show
 * @param {"success"|"error"|"info"} type - Controls color
 */
function showToast(message, type = "success") {
  // Create the toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}</span>
    <span class="toast-msg">${message}</span>
  `;

  // Add to page (the CSS positions it fixed bottom-right)
  document.body.appendChild(toast);

  // Small delay then animate IN
  setTimeout(() => toast.classList.add("toast-show"), 10);

  // After 3 seconds, animate OUT then remove
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// =============================================================
//  FULL-PAGE LOADER
//  Shows a spinner overlay while an API call is in progress.
// =============================================================

/** Show the loading spinner overlay */
function showLoader() {
  let loader = document.getElementById("global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p class="loader-text">Processing...</p>
    `;
    document.body.appendChild(loader);
  }
  loader.style.display = "flex";
}

/** Hide the loading spinner overlay */
function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.style.display = "none";
}

// =============================================================
//  CURRENCY FORMATTER
//  Formats a number into Indian Rupee style: ₹1,23,456.78
// =============================================================

/**
 * formatCurrency — format a number as Indian Rupees
 * @param {number} amount
 * @returns {string}  e.g. "₹1,23,456.00"
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// =============================================================
//  DATE FORMATTER
//  Converts "2024-01-15T10:30:00" → "15 Jan 2024, 10:30 AM"
// =============================================================

/**
 * formatDate — convert ISO date string to readable format
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// =============================================================
//  ROUTE GUARD
//  Called at the top of every protected page.
//  Redirects to login if no token found.
// =============================================================

/**
 * guardRoute — ensure user is logged in before showing page
 * @param {"customer"|"admin"} expectedRole
 */
function guardRoute(expectedRole) {
  const token = getToken();   // from api.js
  const role  = getRole();    // from api.js

  if (!token) {
    // No token → go to login
    window.location.href = expectedRole === "admin"
      ? "../pages/admin-login.html"
      : "../pages/login.html";
    return;
  }

  if (expectedRole && role !== expectedRole) {
    // Wrong role → redirect to correct home
    window.location.href = role === "admin"
      ? "../pages/admin-dashboard.html"
      : "../pages/dashboard.html";
  }
}

// =============================================================
//  LOGOUT HELPER
// =============================================================

function logout() {
  clearToken();   // from api.js
  window.location.href = "../index.html";
}
