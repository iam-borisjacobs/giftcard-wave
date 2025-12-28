// app.js
// Global JS for entire prototype (Laravel-ready structure)
const THEME_KEY = "p2p_theme";

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("theme-light");
  } else {
    document.body.classList.remove("theme-light");
    theme = "dark";
  }
  localStorage.setItem(THEME_KEY, theme);
}



/*
  Shared keys for localStorage
*/
const APP_KEYS = {
  USER: "p2p_user_v1",
  WALLET: "p2p_wallet_v1",
  TXNS: "p2p_transactions_v1",
  GIFTCARD_OFFERS: "p2p_giftcard_offers_v1",
  CRYPTO_OFFERS: "p2p_crypto_offers_v1",
  FAVORITES: "p2p_favorites_v1",
  RATE_TARGETS: "p2p_rate_targets_v1",
  LOVE_HISTORY: "p2p_love_history_v1",
  REWARDS: "p2p_rewards_v1",
};

/*
  Small helper
*/
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const $id = (id) => document.getElementById(id);


/*
  GLOBAL UTILS: TOAST & MODAL
*/
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <div class="toast-close">&times;</div>
  `;

  // Close functionality
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  });

  // Auto remove
  setTimeout(() => {
    if (toast.isConnected) {
        toast.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
    }
  }, 4000);

  container.appendChild(toast);
}

// Global generic modal (requires a generic modal structure in HTML or we create it)
// We will look for #global-modal or create it
function showModal(title, htmlContent, onConfirm = null, confirmText = "Confirm") {
  let modal = document.getElementById("global-modal");
  
  if (!modal) {
    // Create generic modal structure if missing
    modal = document.createElement("div");
    modal.id = "global-modal";
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 id="global-modal-title" class="modal-title"></h3>
        </div>
        <div id="global-modal-body" class="modal-body"></div>
        <div class="modal-actions">
          <button id="global-modal-close" class="btn btn-outline btn-sm">Close</button>
          <button id="global-modal-confirm" class="btn btn-primary btn-sm">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind generic close
    modal.querySelector("#global-modal-close").addEventListener("click", () => {
      modal.style.display = "none";
    });
    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
  }

  // Update content
  const titleEl = modal.querySelector("#global-modal-title");
  const bodyEl = modal.querySelector("#global-modal-body");
  const confirmBtn = modal.querySelector("#global-modal-confirm");

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = htmlContent;

  // Handle Confirm
  // Clone button to remove old listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  if (onConfirm) {
    newConfirmBtn.style.display = "inline-flex";
    newConfirmBtn.textContent = confirmText;
    newConfirmBtn.addEventListener("click", () => {
        onConfirm();
        modal.style.display = "none";
    });
  } else {
    newConfirmBtn.style.display = "none";
  }

  modal.style.display = "flex";
}

/*
  Ensure demo user exists (used across pages)
*/
function ensureDemoUser() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(APP_KEYS.USER) || "null");
  } catch (e) {
    user = null;
  }
  if (!user) {
    user = { id: "user_me", name: "You", email: "demo@example.com" };
    localStorage.setItem(APP_KEYS.USER, JSON.stringify(user));
  }
  return user;
}

/*
  ==============
  LAYOUT / GLOBAL
  ==============
  - Theme (light/dark)
  - Sidebar hamburger
  - Mobile layout
  - Welcome, {user}
*/
function initLayout() {
  // IMPORTANT: capture the demo user so "user" is defined
  const user = ensureDemoUser();

  // --- THEME SETUP ---
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  const themeCheckbox = document.getElementById("themeToggle");
  if (themeCheckbox) {
    // reflect saved state in UI
    themeCheckbox.checked = savedTheme === "light";

    themeCheckbox.addEventListener("change", () => {
      const newTheme = themeCheckbox.checked ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  // Welcome text (if the element exists)
  const userNameEl = $id("user-name");
  if (userNameEl) {
    userNameEl.textContent = user.name || "User";
  }

  // Sidebar + hamburger + overlay
  const menuBtn = $id("menuBtn");
  const sidebar = $id("sidebar");
  const overlay = $id("sidebar-overlay");

  function closeSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("closing");
    setTimeout(() => {
      sidebar.classList.remove("show");
      sidebar.classList.remove("closing");
    }, 300); // match your CSS transition time
  }

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
      const willShow = !sidebar.classList.contains("show");

      if (willShow) {
        sidebar.classList.add("show");
        overlay.classList.add("active");
      } else {
        closeSidebar();
        overlay.classList.remove("active");
      }
    });

    overlay.addEventListener("click", () => {
      closeSidebar();
      overlay.classList.remove("active");
    });
  }

  // Sidebar dropdown sections (admin) - accordion behaviour
  const sectionToggles = $$(".menu-section-toggle");
  sectionToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".menu-section");
      if (!section) return;

      const isOpen = section.classList.contains("open");

      // Close all sections
      $$(".menu-section").forEach((sec) => sec.classList.remove("open"));

      // If the clicked one was not open, open it
      if (!isOpen) {
        section.classList.add("open");
      }
    });
  });




  // Clicking on overlay closes sidebar
  if (overlay) {
    overlay.addEventListener("click", () => {
      closeSidebar();
    });
  }

  // Optional: ESC key closes sidebar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });
}


/*
  ============
  DASHBOARD
  ============
  (You can expand later when Laravel data comes in)
*/
function initDashboard() {
 // 1. Handle "Add demo funds"
  const fundBtn = document.getElementById("fund-btn");
  if (fundBtn) {
    fundBtn.addEventListener("click", () => {
      showModal(
        "Add Demo Funds",
        `
        <p>This mimics adding funds via a gateway.</p>
        <div class="form-group" style="margin-top:10px;">
            <label class="form-label">Amount (NGN)</label>
            <input type="number" id="demo-fund-amount" class="form-input" value="50000" />
        </div>
        `,
        async () => {
          const amtInput = document.getElementById("demo-fund-amount");
          const amt = Number(amtInput.value);
          const confirmBtn = document.getElementById("global-modal-confirm");

          if (amt <= 0) {
             showToast("Please enter a valid amount", "error");
             return;
          }

          // UI Loading State
          confirmBtn.classList.add("is-loading");
          confirmBtn.textContent = ""; // Hide text

          try {
             // CALL MOCK API
             const response = await window.mockApi.addFunds(amt, 'NGN');
             
             // Update wallet on success
             const wallet = JSON.parse(localStorage.getItem(APP_KEYS.WALLET) || '{"balances":{"NGN":0}}');
             wallet.balances.NGN = (wallet.balances.NGN || 0) + amt;
             
             // History Log
             wallet.history = wallet.history || [];
             wallet.history.push({
                type: 'Deposit',
                amount: amt,
                currency: 'NGN',
                direction: 'In',
                createdAt: response.timestamp,
                note: 'Demo Funding'
             });
             localStorage.setItem(APP_KEYS.WALLET, JSON.stringify(wallet));
             
             // Update UI
             const balEl = document.getElementById("balance-ng");
             if (balEl) balEl.textContent = wallet.balances.NGN.toLocaleString();
             
             showToast(response.message, "success");
             document.getElementById("global-modal").style.display = "none"; // Close manually
             
          } catch (err) {
             showToast(err.message, "error");
          } finally {
             // Reset UI
             confirmBtn.classList.remove("is-loading");
             confirmBtn.textContent = "Confirm";
          }
        },
        "Proceed"
      );
    });
  }


  // 2. Handle "Create Offer" form
  const createForm = document.getElementById("createForm");
  if (createForm) {
      createForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const btn = createForm.querySelector("button[type='submit']");
          if (btn.classList.contains("is-loading")) return; // Prevent double-submit

          // Gather data
          const type = document.getElementById("listing-type").value;
          const asset = document.getElementById("listing-asset").value.trim();
          const qty = Number(document.getElementById("listing-qty").value);
          const price = Number(document.getElementById("listing-price").value);
          const payment = document.getElementById("listing-payment").value.trim();
          const desc = document.getElementById("listing-desc").value.trim();

          // Basic UI Validation
          if (!asset) { showToast("Asset name is required", "error"); return; }
          if (qty <= 0) { showToast("Quantity must be positive", "error"); return; }
          
          // UI Loading
          btn.classList.add("is-loading");
          const originalText = btn.textContent;
          btn.textContent = "";

          try {
             // Mock API Call
             await window.mockApi.createOffer({
                 type, asset, qty, price, payment, desc
             });

             // On Success
             showToast("Offer created successfully!", "success");
             createForm.reset();
             
             // Refresh listings (mock)
             const listingContainer = document.getElementById("listings");
             if (listingContainer) {
                 const newItem = document.createElement("div");
                 newItem.className = "offer-card";
                 newItem.innerHTML = `
                    <div class="row space-between">
                        <div class="row">
                            <div class="avatar">${asset[0].toUpperCase()}</div>
                            <div>
                                <div><strong>${asset}</strong></div>
                                <div class="muted small">${qty} units • ${payment}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="accent">${price.toLocaleString()} NGN</div>
                            <button class="btn btn-outline btn-sm">Buy</button>
                        </div>
                    </div>
                 `;
                 listingContainer.prepend(newItem);
             }

          } catch (err) {
              showToast(err.message, "error");
          } finally {
              btn.classList.remove("is-loading");
              btn.textContent = originalText;
          }
      });
  }
          


  // 3. Load initial balances form local storage
  const wallet = JSON.parse(localStorage.getItem(APP_KEYS.WALLET) || '{"balances":{"NGN":0,"BTC":0,"USDT":0}}');
  const bNg = document.getElementById("balance-ng");
  const bBtc = document.getElementById("balance-btc");
  const bUsdt = document.getElementById("balance-usdt");
  
  if (bNg) bNg.textContent = (wallet.balances.NGN || 0).toLocaleString();
  if (bBtc) bBtc.textContent = (wallet.balances.BTC || 0).toFixed(8);
  if (bUsdt) bUsdt.textContent = (wallet.balances.USDT || 0).toFixed(2);
}



// ========= AUTH: LOGIN =========
function initAuthLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const rememberInput = document.getElementById("login-remember");
  const errorEl = document.getElementById("login-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailOrUser = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!emailOrUser || !password) {
      if (errorEl) {
        errorEl.textContent = "Please enter your email/username and password.";
        errorEl.style.display = "block";
      }
      return;
    }

    // DEMO MODE:
    // we just create / overwrite the demo user and "log in"
    const demoUser = {
      id: "user_me",
      name: emailOrUser.split("@")[0] || "You",
      email: emailOrUser,
    };
    localStorage.setItem(APP_KEYS.USER, JSON.stringify(demoUser));

    if (rememberInput && rememberInput.checked) {
      localStorage.setItem("p2p_remember_user", "1");
    } else {
      localStorage.removeItem("p2p_remember_user");
    }

    // In real Laravel: redirect after successful Auth::attempt(...)
    window.location.href = "index.html";
  });
}

// ========= AUTH: REGISTER =========
function initAuthRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const nameInput = document.getElementById("reg-name");
  const usernameInput = document.getElementById("reg-username");
  const emailInput = document.getElementById("reg-email");
  const passInput = document.getElementById("reg-password");
  const passConfirmInput = document.getElementById("reg-password-confirm");
  const termsInput = document.getElementById("reg-terms");
  const errorEl = document.getElementById("register-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();
    const passConfirm = passConfirmInput.value.trim();

    if (!fullName || !username || !email || !pass || !passConfirm) {
      if (errorEl) {
        errorEl.textContent = "Please fill in all required fields.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (pass.length < 6) {
      if (errorEl) {
        errorEl.textContent = "Password should be at least 6 characters.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (pass !== passConfirm) {
      if (errorEl) {
        errorEl.textContent = "Passwords do not match.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (termsInput && !termsInput.checked) {
      if (errorEl) {
        errorEl.textContent = "You must agree to the terms & privacy policy.";
        errorEl.style.display = "block";
      }
      return;
    }

    if (errorEl) {
      errorEl.style.display = "none";
      errorEl.textContent = "";
    }

    // DEMO: "register" the user by saving to localStorage and auto-login
    const demoUser = {
      id: "user_me",
      name: username || fullName.split(" ")[0] || "You",
      full_name: fullName,
      email,
      username,
    };
    localStorage.setItem(APP_KEYS.USER, JSON.stringify(demoUser));
    localStorage.setItem("p2p_remember_user", "1");

    // In real Laravel: POST /register then redirect on success
    window.location.href = "index.html";
  });
}


// ========= AUTH: FORGOT PASSWORD =========
function initAuthForgot() {
  const form = document.getElementById("forgot-form");
  if (!form) return;

  const emailInput = document.getElementById("forgot-email");
  const errorEl = document.getElementById("forgot-error");
  const successEl = document.getElementById("forgot-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      if (successEl) {
        successEl.style.display = "none";
        successEl.textContent = "";
      }
      if (errorEl) {
        errorEl.textContent = "Please enter the email linked to your account.";
        errorEl.style.display = "block";
      }
      return;
    }

    // Clear errors
    if (errorEl) {
      errorEl.style.display = "none";
      errorEl.textContent = "";
    }

    // DEMO MODE:
    // In a real app, you'd POST /forgot-password and show a toast if success
    if (successEl) {
      successEl.textContent =
        "If an account exists for this email, a reset link has been sent.";
      successEl.style.display = "block";
    }

    // Optionally clear the input after a short delay (demo UX)
    setTimeout(() => {
      emailInput.value = "";
    }, 800);
  });
}


// ========= ADMIN: DASHBOARD =========
function initAdminDashboard() {
  const totalUsersEl = document.getElementById("admin-total-users");
  const verifiedUsersEl = document.getElementById("admin-verified-users");
  const activeOffersEl = document.getElementById("admin-active-offers");
  const openDisputesEl = document.getElementById("admin-open-disputes");
  const totalDepositsEl = document.getElementById("admin-total-deposits");
  const totalWithdrawalsEl = document.getElementById("admin-total-withdrawals");

  const tradesBodyEl = document.getElementById("admin-recent-trades-body");
  const tradesEmptyEl = document.getElementById("admin-recent-trades-empty");
  const usersBodyEl = document.getElementById("admin-recent-users-body");
  const usersEmptyEl = document.getElementById("admin-recent-users-empty");

  if (!totalUsersEl || !tradesBodyEl || !usersBodyEl) return;

  const user = ensureDemoUser();

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  const giftOffers = loadJSON(APP_KEYS.GIFTCARD_OFFERS, []);
  const cryptoOffers = loadJSON(APP_KEYS.CRYPTO_OFFERS, []);
  const rewards = loadJSON(APP_KEYS.REWARDS, null);
  const wallet = loadJSON(APP_KEYS.WALLET, { history: [] });
  const txns = loadJSON(APP_KEYS.TXNS, []);

  // ---- metrics ----
  const totalUsers = 1; // demo: only local user
  const verifiedUsers = rewards ? 1 : 0;
  const activeOffers = giftOffers.length + cryptoOffers.length;
  const openDisputes = 0; // placeholder for future dispute data

  totalUsersEl.textContent = totalUsers.toString();
  if (verifiedUsersEl) verifiedUsersEl.textContent = verifiedUsers.toString();
  if (activeOffersEl) activeOffersEl.textContent = activeOffers.toString();
  if (openDisputesEl) openDisputesEl.textContent = openDisputes.toString();

  // deposits/withdrawals from wallet history (very rough demo)
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  (wallet.history || []).forEach((h) => {
    if (h.type === "Deposit") {
      totalDeposits += Number(h.amount || 0);
    } else if (h.type === "Withdraw") {
      totalWithdrawals += Number(h.amount || 0);
    }
  });

  if (totalDepositsEl) {
    totalDepositsEl.textContent = "NGN " + totalDeposits.toLocaleString();
  }
  if (totalWithdrawalsEl) {
    totalWithdrawalsEl.textContent = "NGN " + totalWithdrawals.toLocaleString();
  }

  // ---- recent trades table ----
  const trades = [];

  // wallet history
  (wallet.history || []).forEach((w) => {
    trades.push({
      time: w.createdAt,
      type: w.type || "Wallet",
      user: user.name || "User",
      amount: `${w.amount} ${w.currency || ""}`.trim(),
      status: w.direction || "In/Out",
    });
  });

  // trades from TXNS store
  (txns || []).forEach((t) => {
    trades.push({
      time: t.createdAt,
      type: "Trade " + (t.type || ""),
      user: t.user || user.name || "User",
      amount: "NGN " + (t.amount?.toLocaleString?.() || t.amount || ""),
      status: t.status || "Status",
    });
  });

  // gift + crypto offer creations as "Trade events"
  giftOffers.forEach((o) => {
    trades.push({
      time: o.createdAt,
      type: "Giftcard offer",
      user: o.sellerName || user.name || "User",
      amount: `${o.faceValue || ""} ${o.cardCurrency || ""}`.trim(),
      status: o.side === "buy" ? "Buying" : "Selling",
    });
  });

  cryptoOffers.forEach((o) => {
    trades.push({
      time: o.createdAt,
      type: "Crypto offer",
      user: o.sellerName || user.name || "User",
      amount: `${o.amount || ""} ${o.crypto || ""}`.trim(),
      status: o.side === "buy" ? "Buying" : "Selling",
    });
  });

  trades.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });

  tradesBodyEl.innerHTML = "";
  if (!trades.length) {
    if (tradesEmptyEl) tradesEmptyEl.style.display = "block";
  } else {
    if (tradesEmptyEl) tradesEmptyEl.style.display = "none";
    trades.slice(0, 15).forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.time ? new Date(t.time).toLocaleString() : "-"}</td>
        <td>${t.type}</td>
        <td>${t.user}</td>
        <td>${t.amount}</td>
        <td>${t.status}</td>
      `;
      tradesBodyEl.appendChild(tr);
    });
  }

  // ---- recent users table (demo: just the current user) ----
  usersBodyEl.innerHTML = "";
  const demoUserRow = document.createElement("tr");
  demoUserRow.innerHTML = `
    <td>${user.name || "Demo user"}</td>
    <td>${user.email || "demo@example.com"}</td>
    <td>${verifiedUsers ? "Verified" : "Unverified"}</td>
    <td>${new Date().toLocaleDateString()}</td>
  `;
  usersBodyEl.appendChild(demoUserRow);
  if (usersEmptyEl) usersEmptyEl.style.display = "none";
}

/*
  ======================
  ADMIN GIFTCARDS PAGE
  ======================
*/
function initAdminGiftcards() {
  const table = document.querySelector(".tx-table");
  if (!table) return;

  table.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const btn = e.target;
      const action = btn.textContent.trim();
      const row = btn.closest("tr");
      // Getting brand name from the row logic (specific to the static HTML structure)
      const brandEl = row.querySelector("span[style*='font-weight: 500']"); 
      const brand = brandEl ? brandEl.textContent : "Item";

      if (action === "Edit Rate") {
          showModal(
              `Edit Rate: ${brand}`,
              `<div class="form-group" style="padding:10px 0;">
                 <label class="form-label">New Rate (NGN/$)</label>
                 <input type="number" class="form-input" value="1200" id="admin-new-rate">
               </div>`,
              () => {
                  const val = document.getElementById("admin-new-rate").value;
                  showToast(`Rate for ${brand} updated to ${val}`, "success");
              },
              "Save Rate"
          );
      } else if (action === "Resume") {
           showModal(
               "Resume Offer",
               `<p>Are you sure you want to resume trading for <strong>${brand}</strong>?</p>`,
               () => {
                   showToast(`${brand} has been resumed.`, "success");
                   const tag = row.querySelector(".tag");
                   if (tag) {
                       tag.className = "tag tag-success";
                       tag.textContent = "Active";
                   }
                   btn.textContent = "Suspend"; // Toggle (demo)
               },
               "Resume"
           );
      } else if (action === "Suspend") {
           showToast(`${brand} suspended.`, "warning");
           const tag = row.querySelector(".tag");
           if (tag) {
                tag.className = "tag tag-warning";
                tag.textContent = "Paused";
           }
           btn.textContent = "Resume";
      }
    }
  });
}




/*
  ============
  WALLET PAGE
  ============
*/
function initWallet() {
  // Tabs
  const tabButtons = document.querySelectorAll(".wallet-tab");
  const tabPanels = document.querySelectorAll(".wallet-tab-panel");

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab; // "deposit" | "withdraw" | "transfer"

        // Toggle active class on buttons
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Toggle active class on panels
        tabPanels.forEach((panel) => {
          if (panel.id === `tab-${target}`) {
            panel.classList.add("active");
          } else {
            panel.classList.remove("active");
          }
        });
      });
    });
  }

  // ===== Demo wallet state in localStorage =====
  const balanceNgEl = document.getElementById("wallet-balance-ng");
  const balanceBtcEl = document.getElementById("wallet-balance-btc");
  const balanceUsdtEl = document.getElementById("wallet-balance-usdt");
  const totalFiatEl = document.getElementById("wallet-total-fiat");
  const txBodyEl = document.getElementById("wallet-tx-body");
  const txEmptyEl = document.getElementById("wallet-tx-empty");
  const clearHistoryBtn = document.getElementById("wallet-clear-history");

  if (!balanceNgEl || !balanceBtcEl || !balanceUsdtEl || !txBodyEl) {
    // If these don't exist, don't run the rest
    return;
  }

  // We'll store wallet + history in the WALLET key
  function loadWallet() {
    try {
      return (
        JSON.parse(localStorage.getItem(APP_KEYS.WALLET) || "null") || {
          balances: { NGN: 0, BTC: 0, USDT: 0 },
          history: [],
        }
      );
    } catch (e) {
      return { balances: { NGN: 0, BTC: 0, USDT: 0 }, history: [] };
    }
  }

  function saveWallet(wallet) {
    localStorage.setItem(APP_KEYS.WALLET, JSON.stringify(wallet));
  }

  let wallet = loadWallet();

  // Rough demo conversion rates for total fiat value
  const BTC_TO_NGN = 45000000; // demo only
  const USDT_TO_NGN = 1600; // demo only

  function renderBalances() {
    balanceNgEl.textContent = wallet.balances.NGN.toLocaleString();
    balanceBtcEl.textContent = wallet.balances.BTC.toFixed(8);
    balanceUsdtEl.textContent = wallet.balances.USDT.toFixed(2);

    if (totalFiatEl) {
      const totalFiat =
        wallet.balances.NGN +
        wallet.balances.BTC * BTC_TO_NGN +
        wallet.balances.USDT * USDT_TO_NGN;
      totalFiatEl.textContent = "NGN " + totalFiat.toLocaleString();
    }
  }

  function renderHistory() {
    const history = wallet.history || [];
    txBodyEl.innerHTML = "";

    if (!history.length) {
      if (txEmptyEl) txEmptyEl.style.display = "block";
      return;
    }
    if (txEmptyEl) txEmptyEl.style.display = "none";

    history
      .slice() // copy
      .reverse() // latest first
      .forEach((tx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${new Date(tx.createdAt).toLocaleString()}</td>
          <td>${tx.type}</td>
          <td>${tx.currency}</td>
          <td>${tx.amount}</td>
          <td>${tx.direction}</td>
          <td>${tx.note || ""}</td>
        `;
        txBodyEl.appendChild(tr);
      });
  }

  function addHistoryEntry(entry) {
    wallet.history.push({
      ...entry,
      createdAt: new Date().toISOString(),
    });
    saveWallet(wallet);
    renderHistory();
  }

  // Initial render
  renderBalances();
  renderHistory();

  // ===== Deposit form =====
  const depositForm = document.getElementById("deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currency = document.getElementById("deposit-currency").value;
      const amount = parseFloat(
        document.getElementById("deposit-amount").value || "0"
      );
      const note = document.getElementById("deposit-note").value.trim();

      if (!amount || amount <= 0) {
        showToast("Enter a valid amount to deposit.", "error");
        return;
      }

      wallet.balances[currency] = (wallet.balances[currency] || 0) + amount;

      addHistoryEntry({
        type: "Deposit",
        currency,
        amount,
        direction: "In",
        note,
      });

      saveWallet(wallet);
      renderBalances();
      depositForm.reset();
      showToast("Demo deposit added successfully.", "success");
    });
  }

  // ===== Withdraw form =====
  const withdrawForm = document.getElementById("withdraw-form");
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currency = document.getElementById("withdraw-currency").value;
      const amount = parseFloat(
        document.getElementById("withdraw-amount").value || "0"
      );
      const note = document.getElementById("withdraw-destination").value.trim();

      if (!amount || amount <= 0) {
        showToast("Enter a valid amount to withdraw.", "error");
        return;
      }

      if ((wallet.balances[currency] || 0) < amount) {
        showToast("Insufficient balance for this withdrawal.", "error");
        return;
      }

      // Confirm Withdrawal
      showModal(
          "Confirm Withdrawal",
          `<p>Are you sure you want to withdraw <strong>${amount} ${currency}</strong> to <em>${note || 'External'}</em>?</p>`,
          () => {
              wallet.balances[currency] -= amount;

              addHistoryEntry({
                type: "Withdraw",
                currency,
                amount,
                direction: "Out",
                note,
              });

              saveWallet(wallet);
              renderBalances();
              withdrawForm.reset();
              showToast("Withdrawal processed.", "success");
          },
          "Withdraw Funds"
      );
    });
  }

  // ===== Transfer form =====
  const transferForm = document.getElementById("transfer-form");
  if (transferForm) {
    transferForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const from = document.getElementById("transfer-from").value;
      const to = document.getElementById("transfer-to").value;
      const amount = parseFloat(
        document.getElementById("transfer-amount").value || "0"
      );
      const note = document.getElementById("transfer-note").value.trim();

      if (!amount || amount <= 0) {
        showToast("Enter a valid amount to transfer.", "error");
        return;
      }
      if (from === to) {
        showToast("Choose different wallets for From and To.", "error");
        return;
      }
      if ((wallet.balances[from] || 0) < amount) {
        showToast("Insufficient balance for this transfer.", "error");
        return;
      }

      wallet.balances[from] -= amount;
      wallet.balances[to] = (wallet.balances[to] || 0) + amount;

      addHistoryEntry({
        type: "Transfer",
        currency: `${from} → ${to}`,
        amount,
        direction: "Internal",
        note,
      });

      saveWallet(wallet);
      renderBalances();
      transferForm.reset();
      showToast("Transfer completed.", "success");
    });
  }

  // ===== Clear history button =====
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
       showModal(
           "Clear History",
           "<p>Are you sure you want to clear your entire wallet transaction history? This cannot be undone.</p>",
           () => {
              wallet.history = [];
              saveWallet(wallet);
              renderHistory();
              showToast("History cleared.", "info");
           },
           "Clear All"
       );
    });
  }
}

// function initDeposit() to handle deposit.html specific toggles
function initDeposit() {
  const methodRadios = document.querySelectorAll('input[name="method"]');
  const detailsContainer = document.getElementById("deposit-details-bank");
  
  if (!detailsContainer) return;

  // We can swap the content based on selection
  // In a real app we might have multiple containers hidden/shown
  // For this demo, let's inject HTML based on selection
  
  const contentMap = {
    bank_transfer: `
      <div style="background: rgba(148, 163, 184, 0.05); padding: 16px; border-radius: 12px; border: 1px dashed rgba(148, 163, 184, 0.2);">
          <div class="row space-between" style="margin-bottom: 8px;">
              <span class="muted small">Bank Name</span>
              <strong style="font-size: 14px;">Wema Bank</strong>
          </div>
          <div class="row space-between" style="margin-bottom: 8px;">
              <span class="muted small">Account Name</span>
              <strong style="font-size: 14px;">Giftcard Wave - 982736</strong>
          </div>
          <div class="row space-between">
              <span class="muted small">Account Number</span>
              <div class="row">
                  <strong style="font-size: 16px; letter-spacing: 1px;">0123456789</strong>
                  <button type="button" class="btn btn-outline btn-sm"
                      style="padding: 2px 8px; font-size: 10px;" onclick="navigator.clipboard.writeText('0123456789'); showToast('Copied!', 'success')">COPY</button>
              </div>
          </div>
      </div>
      <div style="margin-top: 24px;">
          <label>Amount to Deposit (NGN)</label>
          <input type="number" placeholder="Min: 1,000 NGN" min="1000">
      </div>
      <div style="margin-top: 12px; font-size: 12px; color: var(--muted);">
          • Transfers are typically credited within 5-10 minutes.<br>
          • Please use your unique reference if provided.
      </div>
    `,
    btc: `
      <div style="background: rgba(148, 163, 184, 0.05); padding: 16px; border-radius: 12px; border: 1px dashed rgba(148, 163, 184, 0.2); text-align: center;">
          <div style="margin-bottom: 12px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" alt="BTC QR" style="border-radius: 8px;">
          </div>
          <span class="muted small">Bitcoin Address (BTC Network)</span>
          <div class="row" style="justify-content: center; gap: 8px; margin-top: 8px;">
              <strong style="font-size: 13px; word-break: break-all;">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</strong>
              <button type="button" class="btn btn-outline btn-sm"
                  style="padding: 2px 8px; font-size: 10px;" onclick="navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'); showToast('Copied!', 'success')">COPY</button>
          </div>
      </div>
      <div style="margin-top: 24px;">
          <label>Amount Sending (BTC)</label>
          <input type="number" placeholder="e.g. 0.005" step="0.0001">
      </div>
      <div style="margin-top: 12px; font-size: 12px; color: var(--muted);">
          • Send only BTC to this address.<br>
          • 1 Confirmation required.
      </div>
    `,
    usdt: `
       <div style="background: rgba(148, 163, 184, 0.05); padding: 16px; border-radius: 12px; border: 1px dashed rgba(148, 163, 184, 0.2); text-align: center;">
          <div style="margin-bottom: 12px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T9yD14Nj9j7xAB4dbGeiX9h8E5J7eTjY5t" alt="USDT QR" style="border-radius: 8px;">
          </div>
          <span class="muted small">Tether Address (TRC-20)</span>
          <div class="row" style="justify-content: center; gap: 8px; margin-top: 8px;">
              <strong style="font-size: 13px; word-break: break-all;">T9yD14Nj9j7xAB4dbGeiX9h8E5J7eTjY5t</strong>
              <button type="button" class="btn btn-outline btn-sm"
                  style="padding: 2px 8px; font-size: 10px;" onclick="navigator.clipboard.writeText('T9yD14Nj9j7xAB4dbGeiX9h8E5J7eTjY5t'); showToast('Copied!', 'success')">COPY</button>
          </div>
      </div>
      <div style="margin-top: 24px;">
          <label>Amount Sending (USDT)</label>
          <input type="number" placeholder="Min: 10 USDT" min="10">
      </div>
      <div style="margin-top: 12px; font-size: 12px; color: var(--muted);">
          • Send only USDT (TRC-20) to this address.<br>
          • Transfers are credited automatically.
      </div>
    `
  };

  // Listen for radio changes
  methodRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        // Toggle Active Class on parent label
        document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
        e.target.closest('.method-card').classList.add('active');

        // Swap Content
        const val = e.target.value;
        if (contentMap[val]) {
            detailsContainer.innerHTML = contentMap[val];
        }
    });

    // Handle click on parent label to trigger radio selection if needed (usually handled by browser, but for custom styling sometimes needed)
    // The CSS 'label' wrapping input usually handles this, but let's ensure the 'active' class syncs if updated programmatically
  });
  
  // Also handle click events on the cards to ensure UI updates even if radio logic is tricky
  document.querySelectorAll('.method-card').forEach(card => {
      card.addEventListener('click', () => {
          const radio = card.querySelector('input');
          if (radio) {
              radio.checked = true;
              radio.dispatchEvent(new Event('change'));
          }
      });
  });
}


/*
  ==============
  TRANSACTIONS PAGE
  ==============
*/
function initTransactions() {
  const tableBody = $id("transaction-body"); // matched HTML ID
  const typeFilter = $id("filter-type");
  const statusFilter = $id("filter-status");
  const emptyEl = $id("transaction-empty");

  if (!tableBody) return;

  // Load txns from WALLET history & TXNS store
  // We combine them for a full view
  function loadAllTransactions() {
      const wallet = JSON.parse(localStorage.getItem(APP_KEYS.WALLET) || '{"history":[]}');
      const storedTx = JSON.parse(localStorage.getItem(APP_KEYS.TXNS) || "[]");
      
      // Map wallet history to standard format
      const walletTx = (wallet.history || []).map((h, i) => ({
          id: "W" + (Date.now() - i), // synthetic ID
          type: (h.type === 'Deposit' || h.type === 'Withdraw') ? h.type : 'Transfer',
          amount: h.amount,
          currency: h.currency,
          status: 'Completed', // Wallet history is settled
          date: h.createdAt,
          note: h.note || '',
          direction: h.direction
      }));

      // Map stored misc trades
      const otherTx = storedTx.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          currency: 'NGN', // simplified
          status: t.status,
          date: t.createdAt,
          note: 'Marketplace trade',
          direction: 'N/A'
      }));

      return [...walletTx, ...otherTx].sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  const allTxns = loadAllTransactions();

  function render(txns) {
     tableBody.innerHTML = "";
     if (!txns.length) {
         if (emptyEl) emptyEl.style.display = "block";
         return;
     }
     if (emptyEl) emptyEl.style.display = "none";

     txns.forEach(tx => {
         const tr = document.createElement("tr");
         tr.innerHTML = `
           <td>${new Date(tx.date).toLocaleString()}</td>
           <td>${tx.type}</td>
           <td>
             <span class="${tx.direction === 'In' ? 'text-green' : (tx.direction === 'Out' ? 'text-red' : '')}">
               ${tx.direction === 'Out' ? '-' : ''} ${Number(tx.amount).toLocaleString()} ${tx.currency || ''}
             </span>
           </td>
           <td><span class="tag tag-${getStatusColor(tx.status)}">${tx.status}</span></td>
           <td><button class="btn btn-outline btn-sm view-tx-btn">View</button></td>
         `;
         tr.querySelector(".view-tx-btn").addEventListener("click", () => showTxDetails(tx));
         tableBody.appendChild(tr);
     });
  }

  function getStatusColor(status) {
      if (status === 'Completed') return 'success';
      if (status === 'Pending') return 'warning';
      if (status === 'Cancelled') return 'danger';
      return 'neutral';
  }

  function showTxDetails(tx) {
      showModal(
          "Transaction Details",
          `
            <div class="modal-body-details">
                <div><label>ID</label><div>${tx.id}</div></div>
                <div><label>Type</label><div>${tx.type}</div></div>
                <div><label>Date</label><div>${new Date(tx.date).toLocaleString()}</div></div>
                <div><label>Amount</label><div>${Number(tx.amount).toLocaleString()} ${tx.currency || ''}</div></div>
                <div><label>Status</label><div><span class="tag tag-${getStatusColor(tx.status)}">${tx.status}</span></div></div>
                <div><label>Note</label><div>${tx.note || '-'}</div></div>
            </div>
          `,
          null, // no confirm action needed
          "Close"
      );
  }

  function filterFromUI() {
      const typeVal = typeFilter ? typeFilter.value : "all";
      const statusVal = statusFilter ? statusFilter.value : "all";
      
      const filtered = allTxns.filter(t => {
          const typeMatch = (typeVal === "all") || (t.type.toLowerCase() === typeVal.toLowerCase()) || 
                            (typeVal === 'escrow' && (t.type.includes('Gift') || t.type.includes('Crypto')));
          const statusMatch = (statusVal === "all") || (t.status.toLowerCase() === statusVal.toLowerCase());
          return typeMatch && statusMatch;
      });
      render(filtered);
  }

  if (typeFilter) typeFilter.addEventListener("change", filterFromUI);
  if (statusFilter) statusFilter.addEventListener("change", filterFromUI);

  // Initial render
  render(allTxns);
}

/*
  ====================
  GIFTCARD OFFERS PAGE
  ====================
*/
function initGiftcardOffers() {
  const listEl = $id("offers-list");
  if (!listEl) return; // Not on this page

  // Seed demo offers if none
  let offers = [];
  try {
    offers = JSON.parse(
      localStorage.getItem(APP_KEYS.GIFTCARD_OFFERS) || "[]"
    );
  } catch (e) {
    offers = [];
  }

  if (!offers.length) {
    const now = new Date().toISOString();
    offers = [
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
    ];
    localStorage.setItem(APP_KEYS.GIFTCARD_OFFERS, JSON.stringify(offers));
  }

  const brandFilter = $id("filter-brand");
  const countryFilter = $id("filter-country");
  const sideFilter = $id("filter-side");
  const searchInput = $id("filter-search");
  const emptyEl = $id("offers-empty");
  const countEl = $id("offers-count");
  const bestRateEl = $id("offers-best-rate");

  const createModal = $id("offer-create-modal");
  const openCreateBtn = $id("open-create-modal");
  const createCancelBtn = $id("create-offer-cancel");
  const createForm = $id("create-offer-form");

  const viewModal = $id("offer-view-modal");
  const viewTitleEl = $id("view-title");
  const viewBodyEl = $id("view-body");
  const viewCloseBtn = $id("view-close");
  const viewStartTradeBtn = $id("view-start-trade");
  let viewSelectedOfferId = null;

  const user = ensureDemoUser();

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function saveOffers() {
    localStorage.setItem(APP_KEYS.GIFTCARD_OFFERS, JSON.stringify(offers));
  }

  function renderOffers() {
    listEl.innerHTML = "";
    const brand = brandFilter ? brandFilter.value : "all";
    const country = countryFilter ? countryFilter.value : "all";
    const side = sideFilter ? sideFilter.value : "all";
    const q = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = offers.filter((o) => {
      const brandOk = brand === "all" || o.brand === brand;
      const countryOk = country === "all" || o.country === country;
      const sideOk = side === "all" || o.side === side;
      const searchOk =
        !q ||
        o.brand.toLowerCase().includes(q) ||
        (o.sellerName || "").toLowerCase().includes(q) ||
        (o.payment || "").toLowerCase().includes(q);
      return brandOk && countryOk && sideOk && searchOk;
    });

    if (!filtered.length) {
      if (emptyEl) emptyEl.style.display = "block";
      if (countEl) countEl.textContent = "0";
      if (bestRateEl) bestRateEl.textContent = "–";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (countEl) countEl.textContent = filtered.length.toString();

    const sellOffers = filtered.filter((o) => o.side === "sell");
    if (!sellOffers.length) {
      if (bestRateEl) bestRateEl.textContent = "N/A";
    } else {
      const best = sellOffers.reduce(
        (acc, o) => (o.rate > acc ? o.rate : acc),
        0
      );
      if (bestRateEl)
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
          <span class="offer-side-badge ${
            o.side === "buy" ? "buy" : "sell"
          }">
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
          <div>Payment: ${escapeHtml(o.payment || "Any")}</div>
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

    // Attach handlers
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

  function openViewModal(id, opts = {}) {
    if (!viewModal || !viewTitleEl || !viewBodyEl) return;
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    viewSelectedOfferId = offer.id;

    const totalNgn = offer.faceValue * offer.rate;
    viewTitleEl.textContent = `${offer.brand} (${offer.faceValue} ${
      offer.cardCurrency || ""
    }) • ${offer.country}`;

    viewBodyEl.innerHTML = `
      <div class="modal-body-details">
        <div>
          <label>Side</label>
          <div>${
            offer.side === "buy"
              ? "Buyer wants your card"
              : "Seller provides card"
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
    if (opts.autoFocusTrade && viewStartTradeBtn) {
      // could add visual hint – kept simple
    }
  }

  if (viewCloseBtn && viewModal) {
    viewCloseBtn.addEventListener("click", () => {
      viewModal.style.display = "none";
      viewSelectedOfferId = null;
    });
  }
  if (viewStartTradeBtn && viewModal) {
    viewStartTradeBtn.addEventListener("click", () => {
      if (!viewSelectedOfferId) {
        viewModal.style.display = "none";
        return;
      }
      const offer = offers.find((o) => o.id === viewSelectedOfferId);
      if (!offer) {
        viewModal.style.display = "none";
        return;
      }
      
      viewModal.style.display = "none";
      
      showModal(
          "Start Trade",
          `<p>You are about to start a trade with <strong>${offer.sellerName}</strong> for <strong>${offer.brand}</strong>.</p>
           <p class="muted small">This will lock funds in escrow (demo).</p>`,
          () => {
              showToast("Trade started! Chat opened (demo).", "success");
              // In real app, redirect to trade/chat page
          },
          "Start Trade"
      );
    });
  }

  // Create offer modal
  if (openCreateBtn && createModal) {
    openCreateBtn.addEventListener("click", () => {
      createModal.style.display = "flex";
    });
  }
  if (createCancelBtn && createModal) {
    createCancelBtn.addEventListener("click", () => {
      createModal.style.display = "none";
    });
  }
  if (createForm && createModal) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const side = $id("offer-side")?.value || "sell";
      const brand = $id("offer-brand")?.value.trim();
      const country = $id("offer-country")?.value.trim();
      const cardCurrency = $id("offer-card-currency")?.value.trim();
      const faceValue = Number($id("offer-face-value")?.value || 0);
      const rate = Number($id("offer-rate")?.value || 0);
      const minNgn = Number($id("offer-min-ngn")?.value || 0) || null;
      const maxNgn = Number($id("offer-max-ngn")?.value || 0) || null;
      const payment = $id("offer-payment")?.value.trim();
      const timeLimitMins =
        Number($id("offer-time-limit")?.value || 0) || null;
      const terms = $id("offer-terms")?.value.trim();

      if (!brand || !country || !faceValue || !rate || !payment) {
        showToast(
          "Please fill brand, country, face value, rate and payment method.",
          "error"
        );
        return;
      }

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
        sellerName: user.name || "You",
        createdAt: new Date().toISOString(),
      });
      saveOffers();
      createModal.style.display = "none";
      createForm.reset();
      renderOffers();
      showToast("Offer created successfully (demo only).", "success");
    });
  }

  // Filter events
  [brandFilter, countryFilter, sideFilter].forEach((el) => {
    if (el) el.addEventListener("change", renderOffers);
  });
  if (searchInput) {
    searchInput.addEventListener("input", renderOffers);
  }

  renderOffers();
}

/*
  =================
  CRYPTO P2P PAGE
  =================
*/
function initCryptoP2P() {
  const listEl = $id("offers-list");
  if (!listEl) return;

  let offers = [];
  try {
    offers = JSON.parse(localStorage.getItem(APP_KEYS.CRYPTO_OFFERS) || "[]");
  } catch (e) {
    offers = [];
  }

  if (!offers.length) {
    const now = new Date().toISOString();
    offers = [
      {
        id: "C101",
        side: "sell",
        crypto: "BTC",
        country: "US",
        rate: 3000000,
        minAmount: 50000,
        maxAmount: 1000000,
        payment: "Bank transfer",
        timeLimitMins: 30,
        terms: "Send from non-mixed wallet only.",
        sellerName: "CryptoKing",
        createdAt: now,
      },
      {
        id: "C102",
        side: "buy",
        crypto: "USDT",
        country: "NG",
        rate: 600,
        minAmount: 10000,
        maxAmount: 500000,
        payment: "USDT transfer (ERC20)",
        timeLimitMins: 20,
        terms: "Network: ERC20 only.",
        sellerName: "StableBuyer",
        createdAt: now,
      },
    ];
    localStorage.setItem(APP_KEYS.CRYPTO_OFFERS, JSON.stringify(offers));
  }

  const cryptoFilter = $id("filter-crypto");
  const countryFilter = $id("filter-country");
  const sideFilter = $id("filter-side");
  const searchInput = $id("filter-search");
  const emptyEl = $id("offers-empty");
  const countEl = $id("offers-count");
  const bestRateEl = $id("offers-best-rate");

  const createModal = $id("offer-create-modal");
  const openCreateBtn = $id("open-create-modal");
  const createCancelBtn = $id("create-offer-cancel");
  const createForm = $id("create-offer-form");

  const viewModal = $id("offer-view-modal");
  const viewTitleEl = $id("view-title");
  const viewBodyEl = $id("view-body");
  const viewCloseBtn = $id("view-close");
  const viewStartTradeBtn = $id("view-start-trade");
  let viewSelectedId = null;
  const user = ensureDemoUser();

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function saveOffers() {
    localStorage.setItem(APP_KEYS.CRYPTO_OFFERS, JSON.stringify(offers));
  }

  function renderOffers() {
    listEl.innerHTML = "";
    const crypto = cryptoFilter ? cryptoFilter.value : "all";
    const country = countryFilter ? countryFilter.value : "all";
    const side = sideFilter ? sideFilter.value : "all";
    const q = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = offers.filter((o) => {
      const cryptoOk = crypto === "all" || o.crypto === crypto;
      const countryOk = country === "all" || o.country === country;
      const sideOk = side === "all" || o.side === side;
      const searchOk =
        !q ||
        o.crypto.toLowerCase().includes(q) ||
        (o.sellerName || "").toLowerCase().includes(q) ||
        (o.payment || "").toLowerCase().includes(q);
      return cryptoOk && countryOk && sideOk && searchOk;
    });

    if (!filtered.length) {
      if (emptyEl) emptyEl.style.display = "block";
      if (countEl) countEl.textContent = "0";
      if (bestRateEl) bestRateEl.textContent = "–";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (countEl) countEl.textContent = filtered.length.toString();

    const sellOffers = filtered.filter((o) => o.side === "sell");
    if (!sellOffers.length) {
      if (bestRateEl) bestRateEl.textContent = "N/A";
    } else {
      const best = sellOffers.reduce(
        (acc, o) => (o.rate > acc ? o.rate : acc),
        0
      );
      if (bestRateEl) bestRateEl.textContent = "NGN " + best.toLocaleString();
    }

    filtered.forEach((o) => {
      const card = document.createElement("article");
      card.className = "offer-card";
      card.dataset.id = o.id;
      const approx = o.minAmount * o.rate;

      card.innerHTML = `
        <div class="offer-card-header">
          <div>
            <div class="offer-crypto">${escapeHtml(o.crypto)}</div>
            <div class="offer-country">${escapeHtml(o.country)}</div>
          </div>
          <span class="offer-side-badge ${
            o.side === "buy" ? "buy" : "sell"
          }">
            ${o.side === "buy" ? "I am buying" : "I am selling"}
          </span>
        </div>
        <div class="offer-main-row">
          <div>
            <div class="muted" style="font-size:11px">Rate</div>
            <strong>NGN ${Number(o.rate).toLocaleString()}</strong>
          </div>
          <div style="text-align:right">
            <div class="muted" style="font-size:11px">Approx. min value</div>
            <strong>NGN ${approx.toLocaleString()}</strong>
          </div>
        </div>
        <div class="offer-meta-row">
          <div>
            Limits: ${
              o.minAmount
                ? "NGN " + Number(o.minAmount).toLocaleString()
                : "No min"
            } - ${
        o.maxAmount
          ? "NGN " + Number(o.maxAmount).toLocaleString()
          : "No max"
      }
          </div>
          <div>Payment: ${escapeHtml(o.payment || "Any")}</div>
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

  function openViewModal(id, opts = {}) {
    if (!viewModal || !viewTitleEl || !viewBodyEl) return;
    const offer = offers.find((o) => o.id === id);
    if (!offer) return;
    viewSelectedId = offer.id;

    const approx = offer.minAmount * offer.rate;
    viewTitleEl.textContent = `${offer.crypto} • ${offer.country}`;

    viewBodyEl.innerHTML = `
      <div class="modal-body-details">
        <div><label>Side</label><div>${
          offer.side === "buy" ? "Buyer wants your crypto" : "Seller provides crypto"
        }</div></div>
        <div><label>Crypto</label><div>${escapeHtml(offer.crypto)}</div></div>
        <div><label>Country</label><div>${escapeHtml(offer.country)}</div></div>
        <div><label>Rate</label><div>NGN ${offer.rate.toLocaleString()}</div></div>
        <div><label>Min amount</label><div>${
          offer.minAmount
            ? "NGN " + offer.minAmount.toLocaleString()
            : "No min"
        }</div></div>
        <div><label>Max amount</label><div>${
          offer.maxAmount
            ? "NGN " + offer.maxAmount.toLocaleString()
            : "No max"
        }</div></div>
        <div><label>Approx. min value</label><div>NGN ${approx.toLocaleString()}</div></div>
        <div><label>Payment</label><div>${escapeHtml(offer.payment || "Any")}</div></div>
        <div><label>Time limit</label><div>${
          offer.timeLimitMins
            ? offer.timeLimitMins + " minutes"
            : "Flexible / not set"
        }</div></div>
        <div><label>Seller</label><div>${escapeHtml(
          offer.sellerName || "Seller"
        )}</div></div>
      </div>
      <div class="modal-body-terms">
        <label style="display:block; font-size:11px; color:var(--muted); margin-bottom:2px;">
          Terms & instructions
        </label>
        <div>${
          offer.terms
            ? escapeHtml(offer.terms)
            : "<span class='muted'>No specific terms provided.</span>"
        }</div>
      </div>
    `;
    viewModal.style.display = "flex";
  }

  if (viewCloseBtn && viewModal) {
    viewCloseBtn.addEventListener("click", () => {
      viewModal.style.display = "none";
      viewSelectedId = null;
    });
  }
  if (viewStartTradeBtn && viewModal) {
    viewStartTradeBtn.addEventListener("click", () => {
      if (!viewSelectedId) {
        viewModal.style.display = "none";
        return;
      }
      const offer = offers.find((o) => o.id === viewSelectedId);
      if (!offer) {
        viewModal.style.display = "none";
        return;
      }
      
      viewModal.style.display = "none";
      showModal(
        "Start Crypto Trade",
        `<p>You are about to buy/sell <strong>${offer.crypto}</strong> with <strong>${offer.sellerName}</strong>.</p>
         <p class="muted small">Escrow will secure ${offer.crypto}.</p>`,
        () => {
             showToast("Crypto trade started (demo).", "success");
        },
        "Proceed"
      );
    });
  }

  // Create offer
  if (openCreateBtn && createModal && createForm) {
    openCreateBtn.addEventListener("click", () => {
      createModal.style.display = "flex";
    });
    if (createCancelBtn) {
      createCancelBtn.addEventListener("click", () => {
        createModal.style.display = "none";
      });
    }
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const side = $id("offer-side")?.value || "sell";
      const crypto = $id("offer-crypto")?.value.trim();
      const country = $id("offer-country")?.value.trim();
      const payment = $id("offer-payment")?.value.trim();
      const amount = Number($id("offer-amount")?.value || 0);
      const rate = Number($id("offer-rate")?.value || 0);
      const minAmount = Number($id("offer-min")?.value || 0) || null;
      const maxAmount = Number($id("offer-max")?.value || 0) || null;
      const terms = $id("offer-terms")?.value.trim();

      if (!crypto || !payment || !amount || !rate) {
        showToast("Please fill crypto, payment, amount and rate.", "error");
        return;
      }

      offers.push({
        id: "C" + Date.now() + Math.floor(Math.random() * 999),
        side,
        crypto,
        country,
        rate,
        minAmount,
        maxAmount,
        payment,
        timeLimitMins: 30,
        terms,
        sellerName: user.name || "You",
        createdAt: new Date().toISOString(),
      });
      saveOffers();
      createModal.style.display = "none";
      createForm.reset();
      renderOffers();
      showToast("Crypto offer created (demo only).", "success");
    });
  }

  [cryptoFilter, countryFilter, sideFilter].forEach((el) => {
    if (el) el.addEventListener("change", renderOffers);
  });
  if (searchInput) searchInput.addEventListener("input", renderOffers);

  renderOffers();
}

/*
  ===================
  RATE CALCULATOR PAGE
  ===================
*/
function initRateCalculator() {
  const baseSelect = $id("base-currency");
  const targetSelect = $id("target-currency");
  const amountInput = $id("amount");
  const resultInput = $id("converted-amount");
  const calcBtn = $id("calculate-btn");
  const resetBtn = $id("reset-btn");
  const liveRatesEl = $id("live-rates");
  if (!baseSelect || !targetSelect || !amountInput || !resultInput) return;

  const exchangeRates = {
    "NGN-BTC": 0.00000022,
    "BTC-NGN": 45000000,
    "USDT-NGN": 1600,
    "NGN-USDT": 1 / 1600,
    "ETH-NGN": 2800000,
    "NGN-ETH": 1 / 2800000,
  };

  function calculate() {
    const base = baseSelect.value;
    const target = targetSelect.value;
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }
    if (base === target) {
      resultInput.value = amount.toFixed(2);
      return;
    }
    const key = `${base}-${target}`;
    const rate = exchangeRates[key];
    if (!rate) {
      showToast("Exchange rate not available for the selected pair (demo).", "error");
      return;
    }
    const converted = amount * rate;
    resultInput.value = converted.toFixed(6);
  }

  function reset() {
    baseSelect.value = "NGN";
    targetSelect.value = "BTC";
    amountInput.value = "";
    resultInput.value = "";
  }

  function showLiveRates() {
    if (!liveRatesEl) return;
    liveRatesEl.innerHTML = `
      1 NGN ≈ ${exchangeRates["NGN-BTC"]} BTC<br>
      1 BTC ≈ ${exchangeRates["BTC-NGN"]} NGN<br>
      1 USDT ≈ ${exchangeRates["USDT-NGN"]} NGN<br>
      1 ETH ≈ ${exchangeRates["ETH-NGN"]} NGN
    `;
  }

  if (calcBtn) calcBtn.addEventListener("click", calculate);
  if (resetBtn) resetBtn.addEventListener("click", reset);
  showLiveRates();
}

/*
  ==============
  FAVORITES PAGE
  ==============
*/
function initFavorites() {
  const listEl = $id("favorites-list");
  if (!listEl) return;

  const emptyEl = $id("favorites-empty");
  const brandFilter = $id("filter-brand");
  const sideFilter = $id("filter-side");

  function loadFavoritesIds() {
    try {
      return JSON.parse(localStorage.getItem(APP_KEYS.FAVORITES) || "[]");
    } catch (e) {
      return [];
    }
  }

  function loadGiftOffers() {
    try {
      return JSON.parse(
        localStorage.getItem(APP_KEYS.GIFTCARD_OFFERS) || "[]"
      );
    } catch (e) {
      return [];
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function render() {
    const favIds = loadFavoritesIds();
    const offers = loadGiftOffers();
    listEl.innerHTML = "";

    if (!favIds.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";

    const brand = brandFilter ? brandFilter.value : "all";
    const side = sideFilter ? sideFilter.value : "all";

    const favOffers = offers.filter((o) => favIds.includes(o.id));
    const filtered = favOffers.filter((o) => {
      const brandOk = brand === "all" || o.brand === brand;
      const sideOk = side === "all" || o.side === side;
      return brandOk && sideOk;
    });

    filtered.forEach((o) => {
      const card = document.createElement("article");
      card.className = "favorite-card";
      card.dataset.id = o.id;
      card.innerHTML = `
        <div class="favorite-card-header">
          <div>
            <div class="favorite-crypto">${escapeHtml(o.brand)}</div>
            <div class="favorite-country">${escapeHtml(o.country)}</div>
          </div>
          <button class="btn btn-outline btn-sm fav-view-btn">View details</button>
        </div>
        <div class="favorite-card-body">
          <div><strong>Rate:</strong> NGN ${o.rate.toLocaleString()} / card unit</div>
          <div><strong>Min:</strong> ${
            o.minNgn ? "NGN " + o.minNgn.toLocaleString() : "No min"
          }</div>
          <div><strong>Max:</strong> ${
            o.maxNgn ? "NGN " + o.maxNgn.toLocaleString() : "No max"
          }</div>
        </div>
        <div class="favorite-footer-row">
          <button class="btn btn-primary btn-sm fav-start-btn">Start trade</button>
        </div>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll(".fav-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".favorite-card");
        const id = card?.dataset.id;
        showModal("Favorite Details", `<p>Details for offer ${id} would appear here.</p>`, null, "Close");
      });
    });
    listEl.querySelectorAll(".fav-start-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".favorite-card");
        const id = card?.dataset.id;
        showModal("Start Trade", `<p>Start trade for offer ${id}?</p>`, () => showToast("Trade started!", "success"), "Okay");
      });
    });
  }

  if (brandFilter) brandFilter.addEventListener("change", render);
  if (sideFilter) sideFilter.addEventListener("change", render);

  render();
}

/*
  ==============
  RATE TARGET PAGE
  ==============
*/
function initRateTarget() {
  const form = $id("set-target-form");
  const listEl = $id("active-targets-list");
  const emptyEl = $id("no-active-targets");
  if (!form || !listEl) return;

  function loadTargets() {
    try {
      return JSON.parse(localStorage.getItem(APP_KEYS.RATE_TARGETS) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveTargets(list) {
    localStorage.setItem(APP_KEYS.RATE_TARGETS, JSON.stringify(list));
  }

  function render() {
    const targets = loadTargets();
    listEl.innerHTML = "";
    if (!targets.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";

    targets.forEach((t) => {
      const card = document.createElement("article");
      card.className = "target-card";
      card.dataset.id = t.id;
      card.innerHTML = `
        <div class="target-card-header">
          <div class="target-currency">${t.baseCurrency} → ${t.targetCurrency}</div>
        </div>
        <div class="target-main-row">
          <div>
            <strong>Target rate</strong>
            <div>1 ${t.baseCurrency} = ${t.targetRate}</div>
          </div>
          <div>
            <strong>Amount</strong>
            <div>${t.targetAmount} ${t.targetCurrency}</div>
          </div>
        </div>
        <div class="target-footer-row">
          <button class="btn btn-outline btn-sm">View details</button>
        </div>
      `;
      listEl.appendChild(card);
    });

    listEl
      .querySelectorAll(".target-footer-row button")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const card = e.target.closest(".target-card");
          const id = card?.dataset.id;
          const targets = loadTargets();
          const t = targets.find((x) => x.id === id);
          if (!t) return;
          showModal(
            "Target Details",
            `Target ${t.baseCurrency}→${t.targetCurrency} at rate ${t.targetRate} for amount ${t.targetAmount} ${t.targetCurrency}`,
            null,
            "Close"
          );
        });
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const base = $id("target-base-currency")?.value;
    const target = $id("target-target-currency")?.value;
    const rate = parseFloat($id("target-rate")?.value || "0");
    const amount = parseFloat($id("target-amount")?.value || "0");
    if (!base || !target || !rate || !amount) {
      showToast("Fill base, target, target rate and amount.", "error");
      return;
    }
    const targets = loadTargets();
    targets.push({
      id: "T" + Date.now(),
      baseCurrency: base,
      targetCurrency: target,
      targetRate: rate,
      targetAmount: amount,
      createdAt: new Date().toISOString(),
    });
    saveTargets(targets);
    form.reset();
    render();
    showToast("Rate target set successfully.", "success");
  });

  render();
}

/*
  ==========
  REWARDS PAGE
  ==========
*/
function initRewards() {
  const earnedEl = $id("points-earned");
  const redeemedEl = $id("points-redeemed");
  const availableEl = $id("points-available");
  const redeemInput = $id("redeem-points");
  const redeemBtn = $id("redeem-btn");
  if (!earnedEl || !redeemedEl || !availableEl || !redeemBtn) return;

  let data;
  try {
    data = JSON.parse(localStorage.getItem(APP_KEYS.REWARDS) || "null");
  } catch (e) {
    data = null;
  }
  if (!data) {
    data = {
      pointsEarned: 1000,
      pointsRedeemed: 0,
      pointsAvailable: 1000,
    };
    localStorage.setItem(APP_KEYS.REWARDS, JSON.stringify(data));
  }

  function save() {
    localStorage.setItem(APP_KEYS.REWARDS, JSON.stringify(data));
  }

  function render() {
    earnedEl.textContent = data.pointsEarned.toLocaleString();
    redeemedEl.textContent = data.pointsRedeemed.toLocaleString();
    availableEl.textContent = data.pointsAvailable.toLocaleString();
  }

  redeemBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const val = parseInt(redeemInput.value || "0", 10);
    if (!val || val <= 0) {
      showToast("Enter a valid number of points to redeem.", "error");
      return;
    }
    if (val > data.pointsAvailable) {
      showToast("You don't have enough points.", "error");
      return;
    }
    data.pointsAvailable -= val;
    data.pointsRedeemed += val;
    save();
    render();
    redeemInput.value = "";
    showToast(`You redeemed ${val} points (demo only).`, "success");
  });

  render();
}

/*
  ==========
  SETTINGS PAGE
  ==========
*/
function initSettings() {
  const modal = $id("settings-modal");
  const modalTitle = $id("modal-title");
  const modalBody = $id("modal-body");
  const modalClose = $id("modal-close");
  if (!modal || !modalTitle || !modalBody || !modalClose) return;

  function openSettingsModal(setting) {
    modal.style.display = "flex";

    switch (setting) {
      case "profile":
        modalTitle.textContent = "Edit Profile";
        modalBody.innerHTML = `
          <form id="profile-form">
            <div class="form-row">
              <div class="form-col">
                <label>Email</label>
                <input type="email" id="profile-email" value="jboris260@gmail.com" />
              </div>
              <div class="form-col">
                <label>Username</label>
                <input type="text" id="profile-username" value="jboris260" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-col">
                <label>Phone number</label>
                <input type="text" id="profile-phone" value="2348033880229" />
              </div>
              <div class="form-col">
                <label>Birthday</label>
                <input type="date" id="profile-birthday" />
              </div>
            </div>
            <div class="form-row">
              <button type="submit" class="btn btn-primary btn-sm">Save changes</button>
            </div>
          </form>
        `;
        break;

      case "security":
        modalTitle.textContent = "Security";
        modalBody.innerHTML = `
          <form id="security-form">
            <div class="form-row">
              <div class="form-col">
                <label>New password</label>
                <input type="password" id="security-password" placeholder="Enter new password" />
              </div>
              <div class="form-col">
                <label>New transaction PIN</label>
                <input type="password" id="security-pin" placeholder="Enter new pin" />
              </div>
            </div>
            <div class="form-row">
              <button type="submit" class="btn btn-primary btn-sm">Save changes</button>
            </div>
          </form>
        `;
        break;

      case "identity":
        modalTitle.textContent = "Identity verification";
        modalBody.innerHTML = `
          <form id="identity-form">
            <div class="form-row">
              <div class="form-col">
                <label>Date of birth</label>
                <input type="date" id="identity-dob" />
              </div>
              <div class="form-col">
                <label>BVN</label>
                <input type="text" id="identity-bvn" placeholder="Enter your BVN" />
              </div>
            </div>
            <div class="form-row">
              <button type="submit" class="btn btn-primary btn-sm">Verify</button>
            </div>
          </form>
        `;
        break;

      case "delete":
        modalTitle.textContent = "Delete account";
        modalBody.innerHTML = `
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <div class="form-row">
            <button type="button" id="confirm-delete" class="btn btn-danger btn-sm">
              Yes, delete my account
            </button>
            <button type="button" id="cancel-delete" class="btn btn-outline btn-sm">
              Cancel
            </button>
          </div>
        `;
        break;

      case "developer":
        modalTitle.textContent = "Developer account";
        modalBody.innerHTML = `
          <p>Enable or disable developer access to this account (demo only).</p>
          <div class="form-row">
            <button type="button" id="enable-developer" class="btn btn-primary btn-sm">
              Enable developer
            </button>
            <button type="button" id="disable-developer" class="btn btn-outline btn-sm">
              Disable developer
            </button>
          </div>
        `;
        break;

      default:
        modalTitle.textContent = "Settings";
        modalBody.innerHTML = `<p>Unknown setting.</p>`;
    }

    // Attach button handlers inside modal content (delegated)
    setTimeout(() => {
      const confirmDelete = $id("confirm-delete");
      const cancelDelete = $id("cancel-delete");
      const enableDev = $id("enable-developer");
      const disableDev = $id("disable-developer");

      const profileForm = $id("profile-form");
      const securityForm = $id("security-form");
      const identityForm = $id("identity-form");

      if (profileForm) {
          profileForm.addEventListener("submit", (e) => {
              e.preventDefault();
              showToast("Profile updated successfully.", "success");
              modal.style.display = "none";
          });
      }
      if (securityForm) {
          securityForm.addEventListener("submit", (e) => {
              e.preventDefault();
              showToast("Security settings updated.", "success");
              modal.style.display = "none";
          });
      }
      if (identityForm) {
          identityForm.addEventListener("submit", (e) => {
              e.preventDefault();
              showToast("Identity verification submitted.", "success");
              modal.style.display = "none";
          });
      }

      if (confirmDelete) {
        confirmDelete.addEventListener("click", () => {
          showToast("Demo: Account deleted.", "error");
          modal.style.display = "none";
        });
      }
      if (cancelDelete) {
        cancelDelete.addEventListener("click", () => {
          modal.style.display = "none";
        });
      }
      if (enableDev) {
        enableDev.addEventListener("click", () => {
          showToast("Developer mode enabled.", "success");
          modal.style.display = "none";
        });
      }
      if (disableDev) {
        disableDev.addEventListener("click", () => {
          showToast("Developer mode disabled.", "info");
          modal.style.display = "none";
        });
      }
    }, 0);
  }

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const profileBtn = $id("profile-btn");
  const securityBtn = $id("security-btn");
  const identityBtn = $id("identity-btn");
  const deleteBtn = $id("delete-btn");
  const developerBtn = $id("developer-btn");

  if (profileBtn) profileBtn.addEventListener("click", () => openSettingsModal("profile"));
  if (securityBtn) securityBtn.addEventListener("click", () => openSettingsModal("security"));
  if (identityBtn) identityBtn.addEventListener("click", () => openSettingsModal("identity"));
  if (deleteBtn) deleteBtn.addEventListener("click", () => openSettingsModal("delete"));
  if (developerBtn)
    developerBtn.addEventListener("click", () => openSettingsModal("developer"));
}

/*
  ============
  LEADERBOARD PAGE
  ============
*/
function initLeaderboard() {
  const listEl = $id("leaderboard-list");
  const timeframeSelect = $id("leaderboard-timeframe");
  const criteriaSelect = $id("leaderboard-criteria");
  if (!listEl || !timeframeSelect || !criteriaSelect) return;

  const data = [
    { id: "U1", name: "User One", points: 1200, transactions: 50, trades: 30 },
    { id: "U2", name: "User Two", points: 1100, transactions: 45, trades: 20 },
    { id: "U3", name: "User Three", points: 1000, transactions: 40, trades: 25 },
    { id: "U4", name: "User Four", points: 950, transactions: 30, trades: 15 },
    { id: "U5", name: "User Five", points: 900, transactions: 25, trades: 18 },
    { id: "U6", name: "User Six", points: 850, transactions: 20, trades: 10 },
    { id: "U7", name: "User Seven", points: 800, transactions: 18, trades: 5 },
    { id: "U8", name: "User Eight", points: 750, transactions: 15, trades: 7 },
    { id: "U9", name: "User Nine", points: 700, transactions: 10, trades: 8 },
    { id: "U10", name: "User Ten", points: 650, transactions: 5, trades: 3 },
  ];

  function render() {
    const criteria = criteriaSelect.value; // points | transactions | trades
    listEl.innerHTML = "";
    const sorted = [...data].sort((a, b) => b[criteria] - a[criteria]);

    sorted.slice(0, 10).forEach((user, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-item";
      item.innerHTML = `
        <div class="user-info">
          <div class="user-rank">${index + 1}</div>
          <div>
            <div class="user-name">${user.name}</div>
            <div class="user-points">${user[criteria]} ${criteria}</div>
          </div>
        </div>
        <div class="user-ranking">${user.points} points</div>
      `;
      listEl.appendChild(item);
    });
  }

  timeframeSelect.addEventListener("change", render);
  criteriaSelect.addEventListener("change", render);

  render();
}

/*
  ==========
  SHOW LOVE PAGE
  ==========
*/
function initShowLove() {
  const form = $id("show-love-form");
  const historyList = $id("love-history-list");
  const emptyEl = $id("no-love-history");
  if (!form || !historyList) return;

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(APP_KEYS.LOVE_HISTORY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveHistory(list) {
    localStorage.setItem(APP_KEYS.LOVE_HISTORY, JSON.stringify(list));
  }

  function render() {
    const history = loadHistory();
    historyList.innerHTML = "";
    if (!history.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";

    history.forEach((item) => {
      const card = document.createElement("article");
      card.className = "love-history-card";
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="love-history-card-header">
          <div><strong>${item.recipient}</strong></div>
          <div class="muted small">${new Date(
            item.date
          ).toLocaleString()}</div>
        </div>
        <div class="love-history-card-body">
          <p><strong>Message:</strong> ${item.message}</p>
        </div>
        <div class="love-footer-row">
          <button class="btn btn-outline btn-sm">View</button>
        </div>
      `;
      historyList.appendChild(card);
    });

    historyList.querySelectorAll(".love-footer-row button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".love-history-card");
        const id = card?.dataset.id;
        const history = loadHistory();
        const love = history.find((x) => x.id === id);
        if (!love) return;
        showModal(
          `Message to ${love.recipient}`, 
          `<p>${love.message}</p>`,
          null,
          "Close"
        );
      });
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipient = $id("love-recipient")?.value.trim();
    const msg = $id("love-message")?.value.trim();
    if (!recipient || !msg) {
      showToast("Please enter a recipient and a message.", "error");
      return;
    }
    const history = loadHistory();
    history.push({
      id: "L" + Date.now(),
      recipient,
      message: msg,
      date: new Date().toISOString(),
    });
    saveHistory(history);
    form.reset();
    render();
    showToast("Your love message has been saved.", "success");
  });

  render();
}


// Partial Loading Logic
function loadPartial(id, file) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve();

    // Handle relative paths for local testing without server (optional fallback)
    // Defaulting to root-relative as requested
    let path = `/partials/${file}`;
    
    // Quick fix for local file:// usage if needed, but sticking to request:
    // However, since we are in a "desktop" environment without a guaranteed server,
    // let's try to be smart.
    // If we are in /admin/, we need to go up one level if using relative.
    // But fetch('/partials/...') is absolute from root.
    // If running on file://, root is C:/. That won't work.
    // The user's prompt says "fetch(`/partials/${file}`)" explicitly. 
    // I will use a relative path helper to make it robust for the user's setup.
    
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
        // If in admin folder (depth 1), use ../partials
        const isInAdmin = window.location.pathname.includes('/admin/');
        if (isInAdmin) path = `../partials/${file}`;
        else path = `partials/${file}`;
    }

    return fetch(path)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            return res.text();
        })
        .then(html => {
            element.innerHTML = html;
            // Re-evaluate scripts if any (not needed for simple HTML partials usually)
        })
        .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
    // Determine context (Admin vs User)
    // We can check the body dataset or URL
    const page = document.body.dataset.page || "";
    const isAdmin = page.startsWith("admin-") || window.location.pathname.includes('/admin/');

    const sidebarFile = isAdmin ? "admin_sidebar.html" : "sidebar.html";
    const headerFile = isAdmin ? "admin_header.html" : "header.html";
    const footerFile = isAdmin ? "admin_footer.html" : "footer.html";

    Promise.all([
        loadPartial("sidebar", sidebarFile),
        loadPartial("header", headerFile),
        loadPartial("footer", footerFile)
    ]).then(() => {
        // 1. Populate Dynamic Header Titles
        const title = document.body.dataset.title;
        const subtitle = document.body.dataset.subtitle;
        
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        
        if (title && titleEl) titleEl.textContent = title;
        if (subtitle && subtitleEl) subtitleEl.textContent = subtitle;

        // 2. Initialize Layout (depends on Sidebar existing)
        initLayout();

        // 3. Initialize Page-Specific Logic
        switch (page) {
            case "dashboard":
                initDashboard();
                break;
            case "wallet":
                initWallet();
                break;
            case "deposit":
                initDeposit();
                break;
            case "transactions":
                initTransactions();
                break;
            case "giftcard-offers":
                initGiftcardOffers();
                break;
            case "crypto-p2p":
                initCryptoP2P();
                break;
            case "rate-calculator":
                initRateCalculator();
                break;
            case "favorites":
                initFavorites();
                break;
            case "rate-target":
                initRateTarget();
                break;
            case "rewards":
                initRewards();
                break;
            case "settings":
                initSettings();
                break;
            case "leaderboard":
                initLeaderboard();
                break;
            case "show-love":
                initShowLove();
                break;
            case "auth-login":
                initAuthLogin();
                break;
            case "auth-register":
                initAuthRegister();
                break;
            case "auth-forgot":
                initAuthForgot();
                break;
            case "admin-dashboard":
            case "admin-verification": // Added missing case
                // Only if special logic exists
                if (typeof initAdminDashboard === 'function' && page === 'admin-dashboard') initAdminDashboard();
                break;
            case "admin-giftcards":
                if (typeof initAdminGiftcards === 'function') initAdminGiftcards();
                break;
            case "verification":
                // Existing verification logic
                const startVerificationBtn = document.getElementById('start-verification');
                if (startVerificationBtn) {
                     startVerificationBtn.addEventListener('click', () => {
                         window.location.href = 'verification-tier1.html';
                     });
                }
                break;
            default:
                // no-op
                break;
        }

        // 4. Highlight Active Menu Item (Post-load)
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.menu-item');
        menuLinks.forEach(link => {
             // Simple active check
             if (link.getAttribute('href') === currentPath) {
                 link.classList.add('active');
             } else {
                 link.classList.remove('active'); // Clear default active from partials
             }
        });
        
        // Handle admin "active" correction if needed (since hrefs might match)
        // (Existing logic in app.js initLayout handles basic stuff, but specific "active" class usually in HTML)
        // Since we load the SAME sidebar partial for all pages, we MUST set active class dynamically here.
    });
});



