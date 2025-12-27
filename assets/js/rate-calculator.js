// rate-calculator.js

// Dummy rates (to simulate real-world exchange rates)
const exchangeRates = {
  "NGN-BTC": 0.000022,  // 1 NGN = 0.000022 BTC
  "BTC-NGN": 100000000,    // 1 BTC = 100,000,000 NGN
  "USDT-NGN": 1650,       // 1 USDT = 1650 NGN
  "NGN-USDT": 1 / 1650,   // 1 NGN = 1 / 1650 USDT
  "ETH-NGN": 900000000,     // 1 ETH = 900,000,000 NGN
  "NGN-ETH": 1 / 900000000, // 1 NGN = 1 / 900000000 ETH
};

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

// Handle currency conversion logic
function calculateConversion() {
  const baseCurrency = $("base-currency").value;
  const targetCurrency = $("target-currency").value;
  const amount = parseFloat($("amount").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  let rateKey = `${baseCurrency}-${targetCurrency}`;

  if (exchangeRates[rateKey]) {
    const rate = exchangeRates[rateKey];
    const convertedAmount = amount * rate;
    $("converted-amount").value = convertedAmount.toFixed(2);
  } else {
    alert("Exchange rate not available for the selected currencies.");
  }
}

// Reset the calculator
function resetCalculator() {
  $("base-currency").value = "NGN";
  $("target-currency").value = "BTC";
  $("amount").value = "";
  $("converted-amount").value = "";
}

// Event Listeners
$("calculate-btn").addEventListener("click", calculateConversion);
$("reset-btn").addEventListener("click", resetCalculator);

// Initialize demo rates display (optional)
function showLiveRates() {
  const ratesText = `
    1 NGN = ${exchangeRates["NGN-BTC"]} BTC<br>
    1 BTC = ${exchangeRates["BTC-NGN"]} NGN<br>
    1 USDT = ${exchangeRates["USDT-NGN"]} NGN<br>
    1 ETH = ${exchangeRates["ETH-NGN"]} NGN
  `;
  $("live-rates").innerHTML = ratesText;
}

// Initial display of live rates
showLiveRates();
