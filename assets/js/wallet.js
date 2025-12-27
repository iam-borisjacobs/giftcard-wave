// Wallet page JS (demo only)
// Reuses the same USER localStorage key as the dashboard.

const WALLET_KEYS = {
  USER: "p2p_user_v1",
  ESCROWS: "p2p_escrows_v1",
  WALLET_TX: "p2p_wallet_tx_v1",
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
const wEl = (id) => document.getElementById(id);

// Load or init user
let walletUser =
  JSON.parse(localStorage.getItem(WALLET_KEYS.USER) || "null") || {
    id: "user_me",
    name: "You",
    balances: { NGN: 0, BTC: 0, USDT: 0 },
  };
localStorage.setItem(WALLET_KEYS.USER, JSON.stringify(walletUser));

// Load escrows (for stats only)
function loadEscrowsForStats() {
  return JSON.parse(localStorage.getItem(WALLET_KEYS.ESCROWS) || "[]");
}

// Wallet tx helpers
function loadWalletTx() {
  return JSON.parse(localStorage.getItem(WALLET_KEYS.WALLET_TX) || "[]");
}
function saveWalletTx(list) {
  localStorage.setItem(WALLET_KEYS.WALLET_TX, JSON.stringify(list));
}
function addWalletTx({ type, currency, amount, direction, note }) {
  const list = loadWalletTx();
  list.push({
    id: "W" + Date.now() + Math.floor(Math.random() * 999),
    type,
    currency,
    amount,
    direction,
    note: note || "",
    createdAt: new Date().toISOString(),
  });
  saveWalletTx(list);
}

// Refresh balances on screen
function refreshWalletBalances() {
  wEl("wallet-username").textContent = walletUser.name || "You";
  wEl("wallet-balance-ng").textContent = Number(
    walletUser.balances.NGN || 0
  ).toLocaleString();
  wEl("wallet-balance-btc").textContent = Number(
    walletUser.balances.BTC || 0
  );
  wEl("wallet-balance-usdt").textContent = Number(
    walletUser.balances.USDT || 0
  );

  // Simple demo fiat estimation (USDT at 1500, BTC at 40m)
  const ngn = Number(walletUser.balances.NGN || 0);
  const usdt = Number(walletUser.balances.USDT || 0) * 1500;
  const btc = Number(walletUser.balances.BTC || 0) * 40000000;
  const total = ngn + usdt + btc;
  wEl("wallet-total-fiat").textContent =
    "NGN " + Math.round(total).toLocaleString();

  // Escrow stats
  const escrows = loadEscrowsForStats();
  const open = escrows.filter(
    (e) => e.status && e.status !== "COMPLETED" && e.status !== "CANCELLED"
  ).length;
  const completed = escrows.filter((e) => e.status === "COMPLETED").length;
  wEl("wallet-open-escrows").textContent = open;
  wEl("wallet-completed-trades").textContent = completed;
}

// Render wallet history table
function renderWalletHistory() {
  const body = wEl("wallet-tx-body");
  const empty = wEl("wallet-tx-empty");
  if (!body || !empty) return;

  const txs = loadWalletTx().slice().reverse(); // newest first

  body.innerHTML = "";
  if (!txs.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  txs.forEach((t) => {
    const tr = document.createElement("tr");
    const date = new Date(t.createdAt);
    const timeStr = date.toLocaleString();

    tr.innerHTML = `
      <td>${timeStr}</td>
      <td>${t.type}</td>
      <td>${t.currency}</td>
      <td>${Number(t.amount).toLocaleString()}</td>
      <td>${t.direction === "IN" ? "Credit" : "Debit"}</td>
      <td>${escapeHtml(t.note || "")}</td>
    `;
    body.appendChild(tr);
  });
}

// ESCAPE helper
function escapeHtml(s) {
  if (!s) return "";
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Tabs logic
(function initTabs() {
  const tabButtons = document.querySelectorAll(".wallet-tab");
  const panels = {
    deposit: wEl("tab-deposit"),
    withdraw: wEl("tab-withdraw"),
    transfer: wEl("tab-transfer"),
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      Object.keys(panels).forEach((key) => {
        if (!panels[key]) return;
        panels[key].classList.toggle("active", key === tab);
      });
    });
  });
})();

// Deposit form
const depositForm = wEl("deposit-form");
if (depositForm) {
  depositForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currency = wEl("deposit-currency").value;
    const amount = Number(wEl("deposit-amount").value || 0);
    const method = wEl("deposit-method").value;
    const note = wEl("deposit-note").value.trim();

    if (!currency || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    walletUser.balances[currency] =
      Number(walletUser.balances[currency] || 0) + amount;
    localStorage.setItem(WALLET_KEYS.USER, JSON.stringify(walletUser));

    addWalletTx({
      type: "DEPOSIT",
      currency,
      amount,
      direction: "IN",
      note: `${method.toUpperCase()} ${note ? "• " + note : ""}`,
    });

    refreshWalletBalances();
    renderWalletHistory();
    depositForm.reset();
    alert("Demo deposit added.");
  });
}

// Withdraw form
const withdrawForm = wEl("withdraw-form");
if (withdrawForm) {
  withdrawForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currency = wEl("withdraw-currency").value;
    const amount = Number(wEl("withdraw-amount").value || 0);
    const dest = wEl("withdraw-destination").value.trim();

    if (!currency || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const current = Number(walletUser.balances[currency] || 0);
    if (amount > current) {
      alert("Insufficient balance.");
      return;
    }

    walletUser.balances[currency] = current - amount;
    localStorage.setItem(WALLET_KEYS.USER, JSON.stringify(walletUser));

    addWalletTx({
      type: "WITHDRAW",
      currency,
      amount,
      direction: "OUT",
      note: dest ? "To: " + dest : "",
    });

    refreshWalletBalances();
    renderWalletHistory();
    withdrawForm.reset();
    alert("Demo withdrawal created.");
  });
}

// Transfer form
const transferForm = wEl("transfer-form");
if (transferForm) {
  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const from = wEl("transfer-from").value;
    const to = wEl("transfer-to").value;
    const amount = Number(wEl("transfer-amount").value || 0);
    const note = wEl("transfer-note").value.trim();

    if (!from || !to || from === to) {
      alert("Choose two different wallets.");
      return;
    }
    if (amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const currentFrom = Number(walletUser.balances[from] || 0);
    if (amount > currentFrom) {
      alert("Insufficient balance in " + from);
      return;
    }

    walletUser.balances[from] = currentFrom - amount;
    walletUser.balances[to] =
      Number(walletUser.balances[to] || 0) + amount;

    localStorage.setItem(WALLET_KEYS.USER, JSON.stringify(walletUser));

    addWalletTx({
      type: "TRANSFER_OUT",
      currency: from,
      amount,
      direction: "OUT",
      note: `To ${to}${note ? " • " + note : ""}`,
    });
    addWalletTx({
      type: "TRANSFER_IN",
      currency: to,
      amount,
      direction: "IN",
      note: `From ${from}${note ? " • " + note : ""}`,
    });

    refreshWalletBalances();
    renderWalletHistory();
    transferForm.reset();
    alert("Demo transfer added.");
  });
}

// Clear history
const clearBtn = wEl("wallet-clear-history");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear all wallet history? This cannot be undone.")) return;
    saveWalletTx([]);
    renderWalletHistory();
  });
}

// Initial render
refreshWalletBalances();
renderWalletHistory();
