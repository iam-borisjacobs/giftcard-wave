// favorites.js

const FAVORITES_KEY = "p2p_favorites_v1";
const OFFER_KEYS = "p2p_offers_v1";

// Load offers and favorites
function loadOffers() {
  return JSON.parse(localStorage.getItem(OFFER_KEYS) || "[]");
}

// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}

function loadFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Render favorites list
function renderFavorites() {
  const favorites = loadFavorites();
  const favoritesList = document.getElementById("favorites-list");
  const emptyMessage = document.getElementById("favorites-empty");

  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  favorites.forEach((favId) => {
    const offer = loadOffers().find((o) => o.id === favId);
    if (!offer) return;

    const card = document.createElement("article");
    card.className = "favorite-card";
    card.dataset.id = offer.id;

    card.innerHTML = `
      <div class="favorite-card-header">
        <div>
          <div class="favorite-crypto">${offer.crypto}</div>
          <div class="favorite-country">${offer.country}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="viewFavoriteOffer('${offer.id}')">
          View Details
        </button>
      </div>

      <div class="favorite-card-body">
        <strong>Rate:</strong> NGN ${offer.rate.toLocaleString()} per unit
        <strong>Min Amount:</strong> NGN ${offer.minAmount}
        <strong>Max Amount:</strong> NGN ${offer.maxAmount}
      </div>

      <div class="favorite-footer-row">
        <button class="btn btn-primary btn-sm" onclick="startTrade('${offer.id}')">Start Trade</button>
      </div>
    `;

    favoritesList.appendChild(card);
  });
}

// View favorite offer details
function viewFavoriteOffer(offerId) {
  const offer = loadOffers().find((o) => o.id === offerId);
  if (!offer) return;

  const modal = document.getElementById("favorite-view-modal");
  const modalBody = document.getElementById("view-body");

  modalBody.innerHTML = `
    <p><strong>Crypto:</strong> ${offer.crypto}</p>
    <p><strong>Rate:</strong> NGN ${offer.rate.toLocaleString()}</p>
    <p><strong>Min Amount:</strong> NGN ${offer.minAmount}</p>
    <p><strong>Max Amount:</strong> NGN ${offer.maxAmount}</p>
    <p><strong>Payment Method:</strong> ${offer.payment}</p>
    <p><strong>Terms:</strong> ${offer.terms}</p>
  `;

  modal.style.display = "flex";
}

// Close modal
document.getElementById("view-close").addEventListener("click", () => {
  document.getElementById("favorite-view-modal").style.display = "none";
});

// Start trade
function startTrade(offerId) {
  alert(`Starting trade for offer: ${offerId} (demo action)`);
}

// Toggle favorite
function toggleFavorite(offerId) {
  const favorites = loadFavorites();
  if (favorites.includes(offerId)) {
    const index = favorites.indexOf(offerId);
    favorites.splice(index, 1);
  } else {
    favorites.push(offerId);
  }
  saveFavorites(favorites);
  renderFavorites();
}

// Add event listeners for the filter
document.getElementById("filter-brand").addEventListener("change", renderFavorites);
document.getElementById("filter-side").addEventListener("change", renderFavorites);

// Initial render of favorites
renderFavorites();
