// leaderboard.js

// Sidebar toggle (reused pattern)
const walletMenuBtn = document.getElementById("menuBtn");
const walletSidebar = document.getElementById("sidebar");
if (walletMenuBtn && walletSidebar) {
  walletMenuBtn.onclick = () => {
    walletSidebar.classList.toggle("show");
  };
}


// Dummy data (replace with real data in future)
const leaderboardData = [
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

// Render leaderboard
function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  const timeframe = document.getElementById("leaderboard-timeframe").value;
  const criteria = document.getElementById("leaderboard-criteria").value;

  leaderboardList.innerHTML = "";

  // Sort leaderboard based on the selected criteria
  const sortedLeaderboard = leaderboardData.sort((a, b) => b[criteria] - a[criteria]);

  // Display top 10 users (for demo)
  sortedLeaderboard.slice(0, 10).forEach((user, index) => {
    const leaderboardItem = document.createElement("div");
    leaderboardItem.classList.add("leaderboard-item");

    leaderboardItem.innerHTML = `
      <div class="user-info">
        <div class="user-rank">${index + 1}</div>
        <div class="user-name">${user.name}</div>
        <div class="user-points">${user[criteria]} ${criteria}</div>
      </div>
      <div class="user-ranking">${user.points} Points</div>
    `;

    leaderboardList.appendChild(leaderboardItem);
  });
}

// Event listeners for filters
document.getElementById("leaderboard-timeframe").addEventListener("change", renderLeaderboard);
document.getElementById("leaderboard-criteria").addEventListener("change", renderLeaderboard);

// Initial render
renderLeaderboard();
