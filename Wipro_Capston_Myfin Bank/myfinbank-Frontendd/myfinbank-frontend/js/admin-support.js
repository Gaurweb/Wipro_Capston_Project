/**
 * admin-support.js
 * Admin support query page logic.
 */

guardRoute("admin");

document.addEventListener("DOMContentLoaded", () => {
  loadAllSupportTickets();
});

async function loadAllSupportTickets() {
  const box = document.getElementById("admin-support-ticket-list");

  try {
    const tickets = await getAllSupportTickets();

    if (!tickets || tickets.length === 0) {
      box.innerHTML = `<p style="font-size:0.9rem;">No customer queries found.</p>`;
      return;
    }

    box.innerHTML = tickets.map(ticket => `
      <div class="card" style="margin-bottom:16px;">
        <h3 style="margin-bottom:10px;">${escapeHtml(ticket.subject)}</h3>

        <p><b>Customer:</b> ${
          ticket.customer ? escapeHtml(ticket.customer.fullName || ticket.customer.username || "Unknown") : "Unknown"
        }</p>

        <p><b>Email:</b> ${
          ticket.customer ? escapeHtml(ticket.customer.email || "Unknown") : "Unknown"
        }</p>

        <p><b>Message:</b> ${escapeHtml(ticket.message)}</p>

        <p><b>Status:</b> ${ticket.status}</p>

        <p><b>Current Reply:</b> ${
          ticket.adminReply ? escapeHtml(ticket.adminReply) : "No reply yet"
        }</p>

        <div class="form-group">
          <label>Reply</label>
          <textarea id="reply-${ticket.id}" rows="3" placeholder="Write reply to customer"></textarea>
        </div>

        <button class="btn btn-primary" onclick="sendSupportReply(${ticket.id})">
          Send Reply
        </button>

        <button class="btn btn-outline" onclick="markTicketClosed(${ticket.id})">
          Close Ticket
        </button>
      </div>
    `).join("");

  } catch (error) {
    box.innerHTML = `<p>${escapeHtml(error.message || "Unable to load queries")}</p>`;
  }
}

async function sendSupportReply(id) {
  const replyBox = document.getElementById(`reply-${id}`);
  const reply = replyBox.value.trim();

  if (!reply) {
    showToast("Please write reply", "error");
    return;
  }

  try {
    const result = await replySupportTicket(id, reply);
    showToast(result || "Reply sent successfully", "success");
    await loadAllSupportTickets();
  } catch (error) {
    showToast(error.message || "Unable to send reply", "error");
  }
}

async function markTicketClosed(id) {
  try {
    const result = await closeSupportTicket(id);
    showToast(result || "Ticket closed successfully", "success");
    await loadAllSupportTickets();
  } catch (error) {
    showToast(error.message || "Unable to close ticket", "error");
  }
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
