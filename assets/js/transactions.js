// Transactions page JS (demo logic)

// Use the same USER and TRANSACTION keys
const TX_KEYS = {
  USER: "p2p_user_v1",
  TRANSACTIONS: "p2p_transactions_v1",
};

// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}

// Helper to get element
const el = (id) => document.getElementById(id);

// Load user and transactions data
let user = JSON.parse(localStorage.getItem(TX_KEYS.USER) || "{}");
let transactions = JSON.parse(localStorage.getItem(TX_KEYS.TRANSACTIONS) || "[]");

// Render transaction table
function renderTransactions() {
  const filterType = el("filter-type").value;
  const filterStatus = el("filter-status").value;
  const body = el("transaction-body");
  const empty = el("transaction-empty");

  body.innerHTML = "";
  const filteredTxs = transactions.filter((tx) => {
    const matchesType =
      filterType === "all" || tx.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus =
      filterStatus === "all" || tx.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesType && matchesStatus;
  });

  if (!filteredTxs.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  filteredTxs.forEach((tx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(tx.date).toLocaleString()}</td>
      <td>${tx.type}</td>
      <td>${tx.amount}</td>
      <td>${tx.status}</td>
      <td><button class="btn btn-outline btn-sm" onclick="showTransactionDetails('${tx.id}')">Details</button></td>
    `;
    body.appendChild(tr);
  });
}

// Show transaction details in modal
function showTransactionDetails(txId) {
  const tx = transactions.find((t) => t.id === txId);
  if (!tx) return;

  const modal = el("transaction-details-modal");
  const body = el("transaction-details-body");

  body.innerHTML = `
    <p><strong>Transaction ID:</strong> ${tx.id}</p>
    <p><strong>Date:</strong> ${new Date(tx.date).toLocaleString()}</p>
    <p><strong>Type:</strong> ${tx.type}</p>
    <p><strong>Amount:</strong> ${tx.amount}</p>
    <p><strong>Status:</strong> ${tx.status}</p>
    <p><strong>Details:</strong> ${tx.details}</p>
  `;
  modal.style.display = "flex";
}

// Close the modal
el("modal-close")?.addEventListener("click", () => {
  el("transaction-details-modal").style.display = "none";
});

// Filter event listeners
el("filter-type").addEventListener("change", renderTransactions);
el("filter-status").addEventListener("change", renderTransactions);

// Initial render
renderTransactions();
