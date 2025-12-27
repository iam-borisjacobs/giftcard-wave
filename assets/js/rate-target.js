// rate-target.js

const TARGETS_KEY = "p2p_rate_targets_v1";

// Helper to get an element
const $ = (id) => document.getElementById(id);




// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}

// Load rate targets and save to localStorage
function loadRateTargets() {
  return JSON.parse(localStorage.getItem(TARGETS_KEY) || "[]");
}

function saveRateTargets(targets) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

// Handle setting a new rate target
function setRateTarget(event) {
  event.preventDefault();

  const baseCurrency = $("target-base-currency").value;
  const targetCurrency = $("target-target-currency").value;
  const targetRate = parseFloat($("target-rate").value);
  const targetAmount = parseFloat($("target-amount").value);

  if (isNaN(targetRate) || isNaN(targetAmount) || targetRate <= 0 || targetAmount <= 0) {
    alert("Please enter valid target rate and amount.");
    return;
  }

  const targets = loadRateTargets();
  const newTarget = {
    id: "T" + Date.now(),
    baseCurrency,
    targetCurrency,
    targetRate,
    targetAmount,
    createdAt: new Date().toISOString(),
  };

  targets.push(newTarget);
  saveRateTargets(targets);

  renderRateTargets();
  $("set-target-form").reset();
}

// Render active rate targets
function renderRateTargets() {
  const targets = loadRateTargets();
  const targetsList = $("active-targets-list");
  const emptyMessage = $("no-active-targets");

  targetsList.innerHTML = "";

  if (targets.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  targets.forEach((target) => {
    const targetCard = document.createElement("article");
    targetCard.className = "target-card";
    targetCard.dataset.id = target.id;

    targetCard.innerHTML = `
      <div class="target-card-header">
        <div>
          <div class="target-currency">${target.baseCurrency} → ${target.targetCurrency}</div>
        </div>
      </div>
      <div class="target-main-row">
        <div>
          <strong>Target Rate</strong>
          <div>1 ${target.baseCurrency} = ${target.targetRate}</div>
        </div>
        <div>
          <strong>Amount</strong>
          <div>${target.targetAmount} ${target.targetCurrency}</div>
        </div>
      </div>
      <div class="target-footer-row">
        <button class="btn btn-outline btn-sm" onclick="viewTargetDetails('${target.id}')">View Details</button>
      </div>
    `;

    targetsList.appendChild(targetCard);
  });
}

// View target details
function viewTargetDetails(targetId) {
  const targets = loadRateTargets();
  const target = targets.find((t) => t.id === targetId);
  if (!target) return;

  alert(`Target Rate: ${target.targetRate}, Amount: ${target.targetAmount} ${target.targetCurrency}`);
}

// Event listener for form submission
$("set-target-form").addEventListener("submit", setRateTarget);

// Initial render
renderRateTargets();
