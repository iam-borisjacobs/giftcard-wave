// giftcard-offers.js
// Demo-only front-end logic for Gift card offers page

const OFFER_KEYS = {
  OFFERS: "p2p_giftcard_offers_v1",
  USER: "p2p_user_v1",
};

const $ = (id) => document.getElementById(id);

// Sidebar toggle (mobile)
const menuBtn = $("menuBtn");
const sidebar = $("sidebar");
if (menuBtn && sidebar) {
  menuBtn.onclick = () => sidebar.classList.toggle("show");
}

// Load demo user (shared with other pages)
let currentUser =
  JSON.parse(localStorage.getItem(OFFER_KEYS.USER) || "null") || {
    id: "user_me",
    name: "You",
  };
localStorage.setItem(OFFER_KEYS.USER, JSON.stringify(currentUser));

// Offers helpers
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
      brand: "Amazon",
      country: "US",
      cardCurrency: "USD",
      faceValue: 100,
      rate: 780,
      minNgn: 15000,
      maxNgn: 200000,
      payment: "NGN bank transfer",
      timeLimitMins: 30,
      terms: "Send clear card photos. No receipts required for $100 and below.",
      sellerName: "CardKing",
      createdAt: now,
    },
    {
      id: "O102",
      side: "buy",
      brand: "Steam",
      country: "UK",
      cardCurrency: "GBP",
      faceValue: 50,
      rate: 900,
      minNgn: 25000,
      maxNgn: 150000,
      payment: "Wallet balance",
      timeLimitMins: 20,
      terms: "Region UK only. Codes only, no physical.",
      sellerName: "GameVault",
      createdAt: now,
    },
    {
      id: "O103",
      side: "sell",
      brand: "Google Play",
      country: "US",
      cardCurrency: "USD",
      faceValue: 25,
      rate: 720,
      minNgn: 10000,
      maxNgn: 60000,
      payment: "Bank transfer, USDT",
      timeLimitMins: 45,
      terms: "Code must be unused and region locked to US.",
      sellerName: "GiftHub",
      createdAt: now,
    },
  ];
  saveOffers(demo);
})();

// Rendering
function renderOffers() {
  const offers = loadOffers();
  const listEl = $("offers-list");
  const emptyEl = $("offers-empty");
  const countEl = $("offers-count");
  const bestRateEl = $("offers-best-rate");

  listEl.innerHTML = "";

  const brand = $("filter-brand").value;
  const country = $("filter-country").value;
  const side = $("filter-side").value;
  const search = $("filter-search").value.toLowerCase().trim();

  const filtered = offers.filter((o) => {
    const brandOk = brand === "all" || o.brand === brand;
    const countryOk = country === "all" || o.country === country;
    const sideOk = side === "all" || o.side === side;
    const searchOk =
      !search ||
      o.brand.toLowerCase().includes(search) ||
      (o.sellerName || "").toLowerCase().includes(search) ||
      (o.payment || "").toLowerCase().includes(search);
    return brandOk && countryOk && sideOk && searchOk;
  });

  if (!filtered.length) {
    emptyEl.style.display = "block";
    countEl.textContent = "0";
    bestRateEl.textContent = "–";
    return;
  }

  emptyEl.style.display = "none";
  countEl.textContent = filtered.length.toString();

  // Best rate (for sell-side just show max)
  const sellOffers = filtered.filter((o) => o.side === "sell");
  if (!sellOffers.length) {
    bestRateEl.textContent = "N/A";
  } else {
    const best = sellOffers.reduce(
      (acc, o) => (o.rate > acc ? o.rate : acc),
      0
    );
    bestRateEl.textContent = "NGN " + best.toLocaleString() + " / card unit";
  }

  filtered.forEach((o) => {
    const card = document.createElement("article");
    card.className = "offer-card";
    card.dataset.id = o.id;

    const totalNgn = o.faceValue * o.rate;

    card.innerHTML = `
      <div class="offer-card-header">
        <div>
          <div class="offer-brand">${escapeHtml(o.brand)} ${
      o.faceValue ? "(" + o.faceValue + " " + (o.cardCurrency || "") + ")" : ""
    }</div>
          <div class="offer-country">
            ${escapeHtml(o.country)} • ${escapeHtml(
      o.cardCurrency || ""
    )} • by ${escapeHtml(o.sellerName || "Seller")}
          </div>
        </div>
        <span class="offer-side-badge ${o.side === "buy" ? "buy" : "sell"}">
          ${o.side === "buy" ? "I am buying" : "I am selling"}
        </span>
      </div>

      <div class="offer-main-row">
        <div>
          <div class="muted" style="font-size:11px">Rate</div>
          <strong>NGN ${Number(o.rate).toLocaleString()}</strong>
          <span class="muted" style="font-size:11px"> / card unit</span>
        </div>
        <div style="text-align:right">
          <div class="muted" style="font-size:11px">Approx. value</div>
          <strong>NGN ${totalNgn.toLocaleString()}</strong>
        </div>
      </div>

      <div class="offer-meta-row">
        <div>
          Limits:
          ${
            o.minNgn
              ? "NGN " + Number(o.minNgn).toLocaleString()
              : "No min"
          } - ${
      o.maxNgn ? "NGN " + Number(o.maxNgn).toLocaleString() : "No max"
    }
        </div>
        <div>
          Payment: ${escapeHtml(o.payment || "Any")}
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
          <button class="btn btn-outline btn-sm offer-view-btn">
            View
          </button>
          <button class="btn btn-primary btn-sm offer-buy-btn">
            ${o.side === "sell" ? "Buy" : "Sell to this offer"}
          </button>
        </div>
      </div>
    `;

    listEl.appendChild(card);
  });

  // Attach button handlers after DOM injection
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

// Escape helper
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* =========================
   CREATE OFFER MODAL
   ========================= */

const createModal = $("offer-create-modal");
$("open-create-modal").addEventListener("click", () => {
  createModal.style.display = "flex";
});

$("create-offer-cancel").addEventListener("click", () => {
  createModal.style.display = "none";
});

$("create-offer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const side = $("offer-side").value;
  const brand = $("offer-brand").value.trim();
  const country = $("offer-country").value.trim();
  const cardCurrency = $("offer-card-currency").value.trim();
  const faceValue = Number($("offer-face-value").value || 0);
  const rate = Number($("offer-rate").value || 0);
  const minNgn = Number($("offer-min-ngn").value || 0) || null;
  const maxNgn = Number($("offer-max-ngn").value || 0) || null;
  const payment = $("offer-payment").value.trim();
  const timeLimitMins = Number($("offer-time-limit").value || 0) || null;
  const terms = $("offer-terms").value.trim();

  if (!brand || !country || !faceValue || !rate || !payment) {
    alert("Please fill brand, country, face value, rate and payment method.");
    return;
  }

  const offers = loadOffers();
  offers.push({
    id: "O" + Date.now() + Math.floor(Math.random() * 999),
    side,
    brand,
    country,
    cardCurrency,
    faceValue,
    rate,
    minNgn,
    maxNgn,
    payment,
    timeLimitMins,
    terms,
    sellerName: currentUser.name || "You",
    createdAt: new Date().toISOString(),
  });
  saveOffers(offers);

  createModal.style.display = "none";
  $("create-offer-form").reset();
  renderOffers();
  alert("Offer created (demo only).");
});

/* =========================
   VIEW OFFER MODAL
   ========================= */

const viewModal = $("offer-view-modal");
const viewTitleEl = $("view-title");
const viewBodyEl = $("view-body");
const viewStartTradeBtn = $("view-start-trade");
let viewSelectedOfferId = null;

function openViewModal(offerId, opts = {}) {
  if (!offerId) return;
  const offers = loadOffers();
  const offer = offers.find((o) => o.id === offerId);
  if (!offer) return;

  viewSelectedOfferId = offer.id;

  viewTitleEl.textContent = `${offer.brand} (${offer.faceValue} ${
    offer.cardCurrency || ""
  }) • ${offer.country}`;

  const totalNgn = offer.faceValue * offer.rate;

  viewBodyEl.innerHTML = `
    <div class="modal-body-details">
      <div>
        <label>Side</label>
        <div>${
          offer.side === "buy" ? "Buyer wants your card" : "Seller provides card"
        }</div>
      </div>
      <div>
        <label>Brand</label>
        <div>${escapeHtml(offer.brand)}</div>
      </div>
      <div>
        <label>Country & currency</label>
        <div>${escapeHtml(offer.country)} • ${escapeHtml(
    offer.cardCurrency || "-"
  )}</div>
      </div>
      <div>
        <label>Face value</label>
        <div>${offer.faceValue} ${escapeHtml(offer.cardCurrency || "")}</div>
      </div>
      <div>
        <label>Rate</label>
        <div>NGN ${Number(offer.rate).toLocaleString()} per card unit</div>
      </div>
      <div>
        <label>Approx. value per card</label>
        <div>NGN ${totalNgn.toLocaleString()}</div>
      </div>
      <div>
        <label>Limits</label>
        <div>
          ${
            offer.minNgn
              ? "Min NGN " + Number(offer.minNgn).toLocaleString()
              : "No minimum"
          } • ${
    offer.maxNgn
      ? "Max NGN " + Number(offer.maxNgn).toLocaleString()
      : "No maximum"
  }
        </div>
      </div>
      <div>
        <label>Payment</label>
        <div>${escapeHtml(offer.payment || "Any")}</div>
      </div>
      <div>
        <label>Time limit</label>
        <div>${
          offer.timeLimitMins
            ? offer.timeLimitMins + " minutes"
            : "Flexible / not set"
        }</div>
      </div>
      <div>
        <label>Seller</label>
        <div>${escapeHtml(offer.sellerName || "Seller")}</div>
      </div>
    </div>
    <div class="modal-body-terms">
      <label style="display:block; font-size:11px; color:var(--muted); margin-bottom:2px;">
        Terms & instructions
      </label>
      <div>
        ${
          offer.terms
            ? escapeHtml(offer.terms)
            : "<span class='muted'>No specific terms provided.</span>"
        }
      </div>
    </div>
  `;

  viewModal.style.display = "flex";

  if (opts.autoFocusTrade) {
    // could highlight button, etc. For now we just leave as is.
  }
}

$("view-close").addEventListener("click", () => {
  viewModal.style.display = "none";
  viewSelectedOfferId = null;
});

viewStartTradeBtn.addEventListener("click", () => {
  if (!viewSelectedOfferId) {
    viewModal.style.display = "none";
    return;
  }
  const offers = loadOffers();
  const offer = offers.find((o) => o.id === viewSelectedOfferId);
  if (!offer) {
    viewModal.style.display = "none";
    return;
  }

  // DEMO: later this becomes a redirect to /trades/create?offer=...
  alert(
    `Demo: starting trade with ${offer.sellerName || "seller"} for ${
      offer.brand
    } (${offer.faceValue} ${offer.cardCurrency || ""}).`
  );
  viewModal.style.display = "none";
});

// Filters
["filter-brand", "filter-country", "filter-side"].forEach((id) => {
  const el = $(id);
  el && el.addEventListener("change", renderOffers);
});
$("filter-search").addEventListener("input", () => {
  renderOffers();
});

// Initial render
renderOffers();
