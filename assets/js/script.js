
    document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }
});


    // Simple demo P2P marketplace - client-side only.
    const LS_KEYS = {
      LISTINGS: "p2p_listings_v1",
      ESCROWS: "p2p_escrows_v1",
      USER: "p2p_user_v1",
};
    
document.addEventListener("DOMContentLoaded", () => {
  // Read user from localStorage (or use a fallback)
  let userName = "User";
  const raw = localStorage.getItem("p2p_user_v1");

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        userName = parsed.name;
      }
    } catch (e) {
      // ignore parse errors, keep default "User"
    }
  }

  // Only update the DOM if the element actually exists on this page
  const userNameEl = document.getElementById("user-name");
  if (userNameEl) {
    userNameEl.textContent = userName;
  }
});


    // Demo user
    let user =
      JSON.parse(localStorage.getItem(LS_KEYS.USER) || "null") || {
        id: "user_me",
        name: "You",
        balances: { NGN: 0, BTC: 0.0, USDT: 0 },
      };
    localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));

    // UI refs
    const el = (id) => document.getElementById(id);
    const listingsEl = el("listings");
    const escrowsEl = el("escrows");
    const balanceNG = el("balance-ng");
    const balanceBTC = el("balance-btc");
    const balanceUSDT = el("balance-usdt");

    function loadListings() {
      return JSON.parse(localStorage.getItem(LS_KEYS.LISTINGS) || "[]");
    }
    function saveListings(l) {
      localStorage.setItem(LS_KEYS.LISTINGS, JSON.stringify(l));
    }
    function loadEscrows() {
      return JSON.parse(localStorage.getItem(LS_KEYS.ESCROWS) || "[]");
    }
    function saveEscrows(e) {
      localStorage.setItem(LS_KEYS.ESCROWS, JSON.stringify(e));
    }

    function refreshBalances() {
      balanceNG.textContent = Number(user.balances.NGN).toLocaleString();
      balanceBTC.textContent = Number(user.balances.BTC);
      balanceUSDT.textContent = Number(user.balances.USDT);
    }

    function renderListings() {
      const all = loadListings();
      const q = el("search").value.toLowerCase();
      const typeFilter = el("filter-type").value;

      let filtered = all.filter(
        (l) =>
          (typeFilter === "all" || l.type === typeFilter) &&
          (l.asset.toLowerCase().includes(q) ||
            (l.payment || "").toLowerCase().includes(q) ||
            (l.desc || "").toLowerCase().includes(q))
      );

      listingsEl.innerHTML = "";
      if (!filtered.length) {
        listingsEl.innerHTML =
          '<div class="muted small">No listings found.</div>';
      }

      filtered.forEach((l) => {
        const node = document.createElement("div");
        node.className = "listing";
        const typeClass =
          l.type === "crypto" ? "pill pill-crypto" : "pill pill-giftcard";

        node.innerHTML = `
            <div class="listing-header">
              <div class="small"><strong>${escapeHtml(l.asset)}</strong></div>
              <div class="${typeClass}">${l.type}</div>
            </div>
            <div class="listing-meta">
              Price: NGN ${Number(l.price).toLocaleString()} • Qty: ${l.qty}
            </div>
            <div class="listing-meta">
              Seller: <span class="muted">${escapeHtml(
          l.sellerName || "seller"
        )}</span>
            </div>
            <div class="listing-desc">${escapeHtml(l.desc || "")}</div>
            <div class="listing-footer">
              <div class="listing-meta small">
                Pay: ${escapeHtml(l.payment || "Any")}
              </div>
              <div class="row">
                <button data-id="${l.id
          }" class="btn btn-primary btn-sm buy-btn">Buy</button>
                ${l.sellerId === user.id
            ? '<span class="tag tag-soft">My listing</span>'
            : ""
          }
              </div>
            </div>
          `;
        listingsEl.appendChild(node);
      });

      // attach buy listeners
      document.querySelectorAll(".buy-btn").forEach((btn) =>
        btn.addEventListener("click", (e) =>
          openBuyModal(e.target.dataset.id)
        )
      );
    }

    function renderEscrows() {
      const esc = loadEscrows();
      if (!esc.length) {
        escrowsEl.textContent = "No escrows yet";
        return;
      }
      escrowsEl.innerHTML = "";
      esc
        .slice()
        .reverse()
        .forEach((s) => {
          const div = document.createElement("div");
          div.className = "escrow-row";

          const left = document.createElement("div");
          left.className = "small";
          left.innerHTML = `${escapeHtml(
            s.asset
          )} - NGN ${Number(s.amount).toLocaleString()} | <span class="muted">${s.status
            }</span>`;

          const actions = document.createElement("div");
          if (s.sellerId === user.id && s.status === "BUYER_FUNDED") {
            const b = document.createElement("button");
            b.textContent = "Mark as delivered";
            b.className = "btn btn-outline btn-sm";
            b.addEventListener("click", () => sellerMarkDelivered(s.id));
            actions.appendChild(b);
          }
          if (s.buyerId === user.id && s.status === "SHIPPED") {
            const b = document.createElement("button");
            b.textContent = "Confirm received";
            b.className = "btn btn-primary btn-sm";
            b.addEventListener("click", () => buyerConfirm(s.id));
            actions.appendChild(b);
          }

          div.appendChild(left);
          div.appendChild(actions);
          escrowsEl.appendChild(div);
        });
    }

    // create listing
    el("createForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const type = el("listing-type").value;
      const asset = el("listing-asset").value.trim();
      const qty = Number(el("listing-qty").value) || 1;
      const price = Number(el("listing-price").value) || 0;
      const payment = el("listing-payment").value.trim();
      const desc = el("listing-desc").value.trim();

      if (!asset || price <= 0) {
        alert("Please provide an asset and a valid price.");
        return;
      }

      const listings = loadListings();
      const id = "L" + Date.now() + Math.floor(Math.random() * 999);
      listings.push({
        id,
        type,
        asset,
        qty,
        price,
        payment,
        desc,
        sellerId: user.id,
        sellerName: user.name,
        created: Date.now(),
      });
      saveListings(listings);
      renderListings();
      el("createForm").reset();
    });

    // open buy modal
    function openBuyModal(listingId) {
      const l = loadListings().find((x) => x.id === listingId);
      if (!l) {
        alert("Listing not found.");
        return;
      }
      const modal = el("modal");
      modal.style.display = "flex";
      el("modal-title").textContent = "Place order - " + l.asset;
      el("modal-body").innerHTML = `
          <div class="muted">Seller: ${escapeHtml(
        l.sellerName || "seller"
      )}</div>
          <div style="margin-top:8px">Price per unit: NGN ${Number(
        l.price
      ).toLocaleString()}</div>
          <label class="muted" style="margin-top:8px">Quantity</label>
          <input id="order-qty" type="number" min="1" value="1" />
          <div style="margin-top:8px" class="muted">
            Total: <strong id="order-total"></strong>
          </div>
        `;

      const qtyInput = el("order-qty");
      const totalEl = el("order-total");
      function updateTotal() {
        const q = Number(qtyInput.value) || 1;
        totalEl.textContent = "NGN " + (q * l.price).toLocaleString();
      }
      qtyInput.addEventListener("input", updateTotal);
      updateTotal();

      el("modal-confirm").onclick = () => {
        const q = Number(qtyInput.value) || 1;
        const total = q * l.price;
        if (user.balances.NGN < total) {
          alert("Insufficient NGN balance. Use Add demo funds.");
          return;
        }
        // create escrow
        user.balances.NGN -= total; // move to escrow (deduct from buyer)
        const esc = loadEscrows();
        const escrowId = "E" + Date.now() + Math.floor(Math.random() * 999);
        esc.push({
          id: escrowId,
          listingId: l.id,
          asset: l.asset,
          amount: total,
          qty: q,
          sellerId: l.sellerId,
          buyerId: user.id,
          status: "BUYER_FUNDED",
          created: Date.now(),
        });
        saveEscrows(esc);
        localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
        refreshBalances();
        renderEscrows();
        modal.style.display = "none";
        alert(
          "Order created and funds moved to escrow. Communicate with the seller to complete the trade."
        );
      };
    }

    el("modal-close").addEventListener("click", () => {
      el("modal").style.display = "none";
    });

    // seller marks delivered
    function sellerMarkDelivered(escrowId) {
      const esc = loadEscrows();
      const e = esc.find((x) => x.id === escrowId);
      if (!e) return;
      if (e.sellerId !== user.id) {
        alert("Only the seller can mark as delivered.");
        return;
      }
      e.status = "SHIPPED";
      saveEscrows(esc);
      renderEscrows();
      alert("Marked as shipped or delivered. Buyer should confirm to release funds.");
    }

    // buyer confirms and releases funds to seller
    function buyerConfirm(escrowId) {
      const esc = loadEscrows();
      const e = esc.find((x) => x.id === escrowId);
      if (!e) return;
      if (e.buyerId !== user.id) {
        alert("Only the buyer can confirm.");
        return;
      }

      // pay seller
      if (e.sellerId === user.id) {
        user.balances.NGN += e.amount;
      } else {
        const sellers = JSON.parse(
          localStorage.getItem("p2p_demo_sellers") || "{}"
        );
        sellers[e.sellerId] = sellers[e.sellerId] || {
          balances: { NGN: 0, BTC: 0, USDT: 0 },
        };
        sellers[e.sellerId].balances.NGN += e.amount;
        localStorage.setItem("p2p_demo_sellers", JSON.stringify(sellers));
      }
      e.status = "COMPLETED";
      saveEscrows(esc);
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
      refreshBalances();
      renderEscrows();
      alert("Trade completed. Funds released to the seller.");
    }

    // helper: add demo funds
    el("fund-btn").addEventListener("click", () => {
      user.balances.NGN += 100000;
      user.balances.USDT += 50;
      user.balances.BTC += 0.05;
      localStorage.setItem(LS_KEYS.USER, JSON.stringify(user));
      refreshBalances();
      alert("Demo funds added.");
    });

    // small helpers
    function escapeHtml(s) {
      if (!s) return "";
      return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    }

    // initial render
    refreshBalances();
    renderListings();
    renderEscrows();

    // search and filter listeners
    el("search").addEventListener("input", renderListings);
    el("filter-type").addEventListener("change", renderListings);

    // seed with demo listings if none
    (function seed() {
      const all = loadListings();
      if (all.length) return;
      const seedL = [
        {
          id: "L101",
          type: "giftcard",
          asset: "Amazon 50 USD",
          qty: 3,
          price: 21000,
          payment: "Bank transfer",
          desc: "Amazon e-gift card. Instant delivery.",
          sellerId: "seller_1",
          sellerName: "CardKing",
        },
        {
          id: "L102",
          type: "giftcard",
          asset: "Google Play 25 USD",
          qty: 5,
          price: 9000,
          payment: "Bank transfer",
          desc: "Good for apps and games.",
          sellerId: "seller_2",
          sellerName: "CodeCards",
        },
        {
          id: "L103",
          type: "crypto",
          asset: "BTC",
          qty: 0.001,
          price: 2500000,
          payment: "On chain",
          desc: "Small BTC sell, fast release.",
          sellerId: "seller_3",
          sellerName: "CryptoJoe",
        },
      ];
      saveListings(seedL);
      renderListings();
    })();
 