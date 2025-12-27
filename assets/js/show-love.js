// show-love.js

const LOVE_HISTORY_KEY = "p2p_love_history_v1";

// Load love history and save to localStorage
function loadLoveHistory() {
  return JSON.parse(localStorage.getItem(LOVE_HISTORY_KEY) || "[]");
}


// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}

function saveLoveHistory(history) {
  localStorage.setItem(LOVE_HISTORY_KEY, JSON.stringify(history));
}

// Render love history
function renderLoveHistory() {
  const loveHistory = loadLoveHistory();
  const historyList = document.getElementById("love-history-list");
  const emptyMessage = document.getElementById("no-love-history");

  historyList.innerHTML = "";

  if (loveHistory.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  loveHistory.forEach((love) => {
    const card = document.createElement("article");
    card.className = "love-history-card";

    card.innerHTML = `
      <div class="love-history-card-header">
        <div><strong>${love.recipient}</strong></div>
        <div class="muted small">${new Date(love.date).toLocaleString()}</div>
      </div>
      <div class="love-history-card-body">
        <p><strong>Message:</strong> ${love.message}</p>
      </div>
      <div class="love-footer-row">
        <button class="btn btn-outline btn-sm" onclick="viewLoveDetails('${love.id}')">View</button>
      </div>
    `;
    historyList.appendChild(card);
  });
}

// Show details of a "Show Love" action
function viewLoveDetails(loveId) {
  const loveHistory = loadLoveHistory();
  const love = loveHistory.find((l) => l.id === loveId);
  if (!love) return;

  alert(`Message to ${love.recipient}: ${love.message}`);
}

// Handle show love submission
function handleShowLove(event) {
  event.preventDefault();

  const recipient = document.getElementById("love-recipient").value.trim();
  const message = document.getElementById("love-message").value.trim();

  if (!recipient || !message) {
    alert("Please enter a recipient and a message.");
    return;
  }

  const loveHistory = loadLoveHistory();
  const newLove = {
    id: "L" + Date.now(),
    recipient,
    message,
    date: new Date().toISOString(),
  };

  loveHistory.push(newLove);
  saveLoveHistory(loveHistory);

  renderLoveHistory();
  document.getElementById("show-love-form").reset();
  alert("Your love message has been sent!");
}

// Add event listener for the Show Love form
document.getElementById("show-love-form").addEventListener("submit", handleShowLove);

// Initial render of love history
renderLoveHistory();
