// crypto-p2p.js

const OFFER_KEYS = {
  OFFERS: "p2p_crypto_offers_v1",
  USER: "p2p_user_v1",
};

const $ = (id) => document.getElementById(id);



// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}


// Load user data (shared with other pages)
let currentUser =
  JSON.parse(localStorage.getItem(OFFER_KEYS.USER) || "null") || {
    id: "user_me",
    name: "You",
  };
localStorage.setItem(OFFER_KEYS.USER, JSON.stringify(currentUser));

// Load and save offers
function loadOffers() {
  return JSON.parse(localStorage.getItem(OFFER_KEYS.OFFERS) || "[]");
}
function saveOffers(list) {
  localStorage.setItem(OFFER_KEYS.OFFERS, JSON.stringify(list));
}

// Seed demo offers if empty
(function seedOffers() {
  const existing = loadOffers();
  if (existing.length) return;

  const now = new Date().toISOString();
  const demo = [
    {
      id: "O101",
      side: "sell",
      crypto: "BTC",
      country: "US",
      rate: 3000000,
      minAmount: 50000,
      maxAmount: 1000000,
      payment: "Bank transfer",
      timeLimitMins: 30,
      terms: "Send clear wallet screenshots.",
      sellerName: "CryptoKing",
      createdAt: now,
    },
    {
      id: "O102",
      side: "buy",
      crypto: "USDT",
      country: "NG",
      rate: 600,
      minAmount: 10000,
      maxAmount: 500000,
      payment: "USDT transfer",
      timeLimitMins: 20,
      terms: "Only USDT ERC20 supported.",
      sellerName: "StableCoinBuyer",
      createdAt: now,
    },
  ];
  saveOffers(demo);
})();

// Render offers
function renderOffers() {
  const offers = loadOffers();
  const listEl = $("offers-list");
  const emptyEl = $("offers-empty");
  const countEl = $("offers-count");
  const bestRateEl = $("offers-best-rate");

  listEl.innerHTML = "";

  const crypto = $("filter-crypto").value;
  const country = $("filter-country").value;
  const side = $("filter-side").value;
  const search = $("filter-search").value.toLowerCase().trim();

  const filtered = offers.filter((o) => {
    const cryptoOk = crypto === "all" || o.crypto === crypto;
    const countryOk = country === "all" || o.country === country;
    const sideOk = side === "all" || o.side === side;
    const searchOk =
      !search ||
      o.crypto.toLowerCase().includes(search) ||
      (o.sellerName || "").toLowerCase().includes(search) ||
      (o.payment || "").toLowerCase().includes(search);
    return cryptoOk && countryOk && sideOk && searchOk;
  });

  if (!filtered.length) {
    emptyEl.style.display = "block";
    countEl.textContent = "0";
    bestRateEl.textContent = "–";
    return;
  }

  emptyEl.style.display = "none";
  countEl.textContent = filtered.length.toString();

  // Best rate for sell-side
  const sellOffers = filtered.filter((o) => o.side === "sell");
  if (!sellOffers.length) {
    bestRateEl.textContent = "N/A";
  } else {
    const best = sellOffers.reduce(
      (acc, o) => (o.rate > acc ? o.rate : acc),
      0
    );
    bestRateEl.textContent = "NGN " + best.toLocaleString();
  }

  filtered.forEach((o) => {
    const card = document.createElement("article");
    card.className = "offer-card";
    card.dataset.id = o.id;

    const totalNgn = o.minAmount * o.rate;

    card.innerHTML = `
      <div class="offer-card-header">
        <div>
          <div class="offer-crypto">${o.crypto}</div>
          <div class="offer-country">${o.country}</div>
        </div>
        <span class="offer-side-badge ${o.side === "buy" ? "buy" : "sell"}">
          ${o.side === "buy" ? "I am buying" : "I am selling"}
        </span>
      </div>

      <div class="offer-main-row">
        <div>
          <div class="muted" style="font-size:11px">Rate</div>
          <strong>NGN ${Number(o.rate).toLocaleString()}</strong>
        </div>
        <div style="text-align:right">
          <div class="muted" style="font-size:11px">Approx. value</div>
          <strong>NGN ${totalNgn.toLocaleString()}</strong>
        </div>
      </div>

      <div class="offer-footer-row">
        <div class="muted small">
          ${
            o.timeLimitMins
              ? "Time limit: " + o.timeLimitMins + " mins"
              : "Flexible time"
          }
        </div>
        <div class="row">
          <button class="btn btn-outline btn-sm offer-view-btn">View</button>
          <button class="btn btn-primary btn-sm offer-buy-btn">
            ${o.side === "sell" ? "Buy" : "Sell to this offer"}
          </button>
        </div>
      </div>
    `;
    listEl.appendChild(card);
  });

  // Attach event listeners for view and buy buttons
  listEl.querySelectorAll(".offer-view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".offer-card");
      openViewModal(card?.dataset.id);
    });
  });

  listEl.querySelectorAll(".offer-buy-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".offer-card");
      openViewModal(card?.dataset.id, { autoFocusTrade: true });
    });
  });
}

// Open offer view modal
function openViewModal(offerId, opts = {}) {
  if (!offerId) return;
  const offers = loadOffers();
  const offer = offers.find((o) => o.id === offerId);
  if (!offer) return;

  const modal = $("offer-view-modal");
  const modalTitle = $("view-title");
  const modalBody = $("view-body");

  modalTitle.textContent = `${offer.crypto} (${offer.rate})`;

  const totalNgn = offer.minAmount * offer.rate;

  modalBody.innerHTML = `
    <div class="modal-body-details">
      <div><label>Side</label><div>${offer.side}</div></div>
      <div><label>Crypto</label><div>${offer.crypto}</div></div>
      <div><label>Country</label><div>${offer.country}</div></div>
      <div><label>Rate</label><div>NGN ${offer.rate}</div></div>
      <div><label>Approx. Value</label><div>NGN ${totalNgn}</div></div>
      <div><label>Payment</label><div>${offer.payment}</div></div>
      <div><label>Time Limit</label><div>${offer.timeLimitMins} mins</div></div>
    </div>
    <div class="modal-body-terms">
      <label>Terms & Instructions</label>
      <div>${offer.terms || "No terms specified."}</div>
    </div>
  `;

  modal.style.display = "flex";
}

// Close modal
$("view-close").addEventListener("click", () => {
  $("offer-view-modal").style.display = "none";
});

// Start Trade (demo only)
$("view-start-trade").addEventListener("click", () => {
  alert("Demo trade started!");
  $("offer-view-modal").style.display = "none";
});

// Filters
["filter-crypto", "filter-country", "filter-side"].forEach((id) => {
  const el = $(id);
  el && el.addEventListener("change", renderOffers);
});
$("filter-search").addEventListener("input", renderOffers);

// Create Offer (Demo)
$("open-create-modal").addEventListener("click", () => {
  $("offer-create-modal").style.display = "flex";
});
$("create-offer-cancel").addEventListener("click", () => {
  $("offer-create-modal").style.display = "none";
});

// Initial render
renderOffers();
