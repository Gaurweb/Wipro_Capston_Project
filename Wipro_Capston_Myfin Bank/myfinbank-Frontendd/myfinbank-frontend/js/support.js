/**
 * support.js
 * Customer support query page logic.
 */

guardRoute("customer");

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("myfin_user") || "Customer";
  const navUser = document.getElementById("nav-username");
  if (navUser) navUser.textContent = user;

  loadMySupportTickets();
});

async function submitSupportTicket() {
  const subject = document.getElementById("support-subject").value.trim();
  const message = document.getElementById("support-message").value.trim();

  if (!subject || !message) {
    showToast("Please enter subject and message", "error");
    return;
  }

  try {
    const result = await createSupportTicket(subject, message);
    showToast(result || "Query submitted successfully", "success");

    document.getElementById("support-subject").value = "";
    document.getElementById("support-message").value = "";

    await loadMySupportTickets();
  } catch (error) {
    showToast(error.message || "Unable to submit query", "error");
  }
}

async function loadMySupportTickets() {
  const box = document.getElementById("support-ticket-list");

  try {
    const tickets = await getMySupportTickets();

    if (!tickets || tickets.length === 0) {
      box.innerHTML = `<p style="font-size:0.9rem;">No support queries yet.</p>`;
      return;
    }

    box.innerHTML = tickets.map(ticket => `
      <div class="card" style="margin-bottom:14px;">
        <h3 style="margin-bottom:8px;">${escapeHtml(ticket.subject)}</h3>
        <p><b>Your Message:</b> ${escapeHtml(ticket.message)}</p>
        <p><b>Status:</b> ${ticket.status}</p>
        <p><b>Admin Reply:</b> ${
          ticket.adminReply ? escapeHtml(ticket.adminReply) : "No reply yet"
        }</p>
        <p style="font-size:0.78rem; opacity:0.75;">
          Created: ${formatDate(ticket.createdAt)}
        </p>
      </div>
    `).join("");

  } catch (error) {
    box.innerHTML = `<p>${escapeHtml(error.message || "Unable to load queries")}</p>`;
  }
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
