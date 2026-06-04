/**
 * login.js — Customer Login & Register Logic
 * ============================================
 * Handles:
 *   1. Tab switching (Login ↔ Register)
 *   2. Login form submission → calls loginCustomer() from api.js
 *   3. Register form submission → calls registerCustomer() from api.js
 *
 * After successful login:
 *   JWT token is saved in localStorage
 *   User is redirected to dashboard.html
 */

// =============================================================
//  TAB SWITCHER
// =============================================================

function switchTab(tabName) {
  // Hide all forms
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.remove("active");
  });

  // Remove active style from all tab buttons
  document.querySelectorAll(".tab-btn").forEach(el => {
    el.classList.remove("active");
  });

  // Show selected form
  document.getElementById(`tab-${tabName}`).classList.add("active");

  // Get login/register buttons
  const buttons = document.querySelectorAll(".tab-btn");

  // First button is Login
  if (tabName === "login") {
    buttons[0].classList.add("active");
  }

  // Second button is Register
  if (tabName === "register") {
    buttons[1].classList.add("active");
  }
}

// =============================================================
//  LOGIN HANDLER
// =============================================================

async function handleLogin() {
  // Read email and password from login form
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  // Check empty fields
  if (!email || !password) {
    showToast("Please enter email and password.", "error");
    return;
  }

  showLoader();

  try {
    /*
     * loginCustomer() is inside api.js
     *
     * It sends this body to backend:
     * {
     *   username: email,
     *   password: password
     * }
     *
     * Backend may return token in two ways:
     *
     * 1. Plain string:
     *    "eyJhbGciOiJIUzI1..."
     *
     * 2. JSON object:
     *    { token: "eyJhbGciOiJIUzI1..." }
     *
     * So below code supports both.
     */

    const response = await loginCustomer(email, password);

    const token =
      typeof response === "string"
        ? response
        : response.token;

    /*
     * If token is not received,
     * we stop login and show error.
     */
    if (!token) {
      throw new Error("Token not received from backend");
    }

    /*
     * Save JWT token in browser localStorage.
     * Dashboard APIs will use this token in Authorization header.
     */
    saveToken(token);

    /*
     * Save role and user email for frontend use.
     */
    saveRole("customer");
    localStorage.setItem("myfin_user", email);

    showToast("Login successful! Redirecting...", "success");

    /*
     * Redirect user to customer dashboard.
     */
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);

  } catch (error) {
    /*
     * Any backend error will come here:
     * Invalid credentials, 403, 500, service down, etc.
     */
    showToast(error.message || "Login failed. Please try again.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  REGISTER HANDLER
// =============================================================

async function handleRegister() {
  // Read register form values
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;

  // Check empty fields
  if (!name || !email || !password) {
    showToast("All fields are required.", "error");
    return;
  }

  // Simple password validation
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  showLoader();

  try {
    /*
     * registerCustomer() is inside api.js
     *
     * It sends this body:
     * {
     *   username: email,
     *   fullName: name,
     *   email: email,
     *   password: password,
     *   phone: "9999999999"
     * }
     *
     * Backend creates customer and bank account.
     */

    const message = await registerCustomer(name, email, password);

    showToast(message || "Account created! Please login.", "success");

    /*
     * Auto-fill login email after registration.
     */
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = "";

    /*
     * Switch to login tab after register success.
     */
    setTimeout(() => {
      switchTab("login");
    }, 1200);

  } catch (error) {
    showToast(error.message || "Registration failed.", "error");
  } finally {
    hideLoader();
  }
}

// =============================================================
//  ENTER KEY SUPPORT
// =============================================================

document.addEventListener("keydown", (e) => {
  // If key is not Enter, do nothing
  if (e.key !== "Enter") {
    return;
  }

  // Find active tab
  const activeTab = document.querySelector(".tab-content.active").id;

  // If login tab is active, login
  if (activeTab === "tab-login") {
    handleLogin();
  }

  // If register tab is active, register
  if (activeTab === "tab-register") {
    handleRegister();
  }
});