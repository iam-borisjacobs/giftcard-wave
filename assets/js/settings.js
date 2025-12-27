// settings.js

// Helper function to get elements by ID
const $ = (id) => document.getElementById(id);

// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}

// Open specific modal based on clicked setting
function openSettingsModal(setting) {
  const modal = $("settings-modal");
  const modalTitle = $("modal-title");
  const modalBody = $("modal-body");

  modal.style.display = "flex"; // Show the modal

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
              <label>Phone Number</label>
              <input type="text" id="profile-phone" value="2348033880229" />
            </div>
            <div class="form-col">
              <label>Birthday</label>
              <input type="date" id="profile-birthday" />
            </div>
          </div>
          <div class="form-row">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      `;
      break;

    case "security":
      modalTitle.textContent = "Edit Security";
      modalBody.innerHTML = `
        <form id="security-form">
          <div class="form-row">
            <div class="form-col">
              <label>Change Password</label>
              <input type="password" id="security-password" placeholder="Enter new password" />
            </div>
            <div class="form-col">
              <label>Reset Pin</label>
              <input type="text" id="security-pin" placeholder="Enter new pin" />
            </div>
          </div>
          <div class="form-row">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      `;
      break;

    case "identity":
      modalTitle.textContent = "Identity Verification";
      modalBody.innerHTML = `
        <form id="identity-form">
          <div class="form-row">
            <div class="form-col">
              <label>Enter Date of Birth</label>
              <input type="date" id="identity-dob" />
            </div>
            <div class="form-col">
              <label>Enter BVN</label>
              <input type="text" id="identity-bvn" placeholder="Enter your BVN" />
            </div>
          </div>
          <div class="form-row">
            <button type="submit" class="btn btn-primary">Verify</button>
          </div>
        </form>
      `;
      break;

    case "delete":
      modalTitle.textContent = "Delete Account";
      modalBody.innerHTML = `
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="form-row">
          <button type="button" class="btn btn-danger" id="confirm-delete">Yes, Delete My Account</button>
          <button type="button" class="btn btn-outline" id="cancel-delete">Cancel</button>
        </div>
      `;
      break;

    case "developer":
      modalTitle.textContent = "Developer Account Settings";
      modalBody.innerHTML = `
        <p>Enable or disable developer access to this account.</p>
        <div class="form-row">
          <button type="button" class="btn btn-primary" id="enable-developer">Enable Developer Account</button>
          <button type="button" class="btn btn-danger" id="disable-developer">Disable Developer Account</button>
        </div>
      `;
      break;

    default:
      modalTitle.textContent = "Unknown Setting";
      modalBody.innerHTML = `<p>Selected setting is not recognized.</p>`;
  }
}

// Close modal
function closeModal() {
  $("settings-modal").style.display = "none";
}

// Event listeners for each setting button
document.getElementById("profile-btn").addEventListener("click", () => openSettingsModal("profile"));
document.getElementById("security-btn").addEventListener("click", () => openSettingsModal("security"));
document.getElementById("identity-btn").addEventListener("click", () => openSettingsModal("identity"));
document.getElementById("delete-btn").addEventListener("click", () => openSettingsModal("delete"));
document.getElementById("developer-btn").addEventListener("click", () => openSettingsModal("developer"));

// Close modal when clicking the close button
document.getElementById("modal-close").addEventListener("click", closeModal);

// Confirm delete account action
document.getElementById("confirm-delete").addEventListener("click", () => {
  alert("Your account has been deleted (demo action).");
  closeModal();
});

// Cancel delete account action
document.getElementById("cancel-delete").addEventListener("click", closeModal);

// Enable developer account
document.getElementById("enable-developer").addEventListener("click", () => {
  alert("Developer account enabled.");
  closeModal();
});

// Disable developer account
document.getElementById("disable-developer").addEventListener("click", () => {
  alert("Developer account disabled.");
  closeModal();
});

// Close modal when clicking the close button
document.getElementById("modal-close").addEventListener("click", closeModal);
