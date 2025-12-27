// rewards.js

// Dummy data for points (replace with real data in future)
const pointsData = {
  pointsEarned: 1000,
  pointsRedeemed: 0,
  pointsAvailable: 1000,
};

// Load reward points data
function loadPoints() {
  return pointsData;
}

// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}


// Update points on the page
function updatePointsDisplay() {
  const points = loadPoints();
  document.getElementById("points-earned").textContent = points.pointsEarned;
  document.getElementById("points-redeemed").textContent = points.pointsRedeemed;
  document.getElementById("points-available").textContent = points.pointsAvailable;
}

// Redeem points
function redeemPoints(event) {
  event.preventDefault();

  const pointsToRedeem = parseInt(document.getElementById("redeem-points").value);

  if (isNaN(pointsToRedeem) || pointsToRedeem <= 0 || pointsToRedeem > pointsData.pointsAvailable) {
    alert("Please enter a valid number of points to redeem.");
    return;
  }

  pointsData.pointsAvailable -= pointsToRedeem;
  pointsData.pointsRedeemed += pointsToRedeem;

  updatePointsDisplay();

  alert(`You have redeemed ${pointsToRedeem} points.`);
}

// Event listener for redeem button
document.getElementById("redeem-btn").addEventListener("click", redeemPoints);

// Initial points display update
updatePointsDisplay();
