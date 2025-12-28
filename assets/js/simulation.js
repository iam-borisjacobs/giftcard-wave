/**
 * simulation.js
 * Mocks the backend API with artificial latency and error randomness.
 * This ensures the UI can handle "Loading..." states and "Server Error" toasts.
 */

const mockApi = {
    // Config
    latency: { min: 800, max: 2500 }, // ms
    failureRate: 0.1, // 10% chance of random server error

    /**
     * Helper to simulate network delay
     */
    _delay() {
        const ms = Math.floor(Math.random() * (this.latency.max - this.latency.min + 1)) + this.latency.min;
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Helper to randomly throw errors (simulate 500/503)
     */
    _maybeFail() {
        if (Math.random() < this.failureRate) {
            throw new Error("Simulated Server Error: Please try again later.");
        }
    },

    /**
     * Mock: Add Funds
     */
    async addFunds(amount, currency = 'NGN') {
        await this._delay();
        this._maybeFail();

        if (amount <= 0) throw new Error("Invalid amount. Must be greater than 0.");
        
        // Success
        return {
            status: 'success',
            message: `Successfully deposited ${amount} ${currency}`,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Mock: Login
     */
    async login(email, password) {
        await this._delay();
        
        if (!email || !password) throw new Error("Credentials missing.");
        
        // Mock validation
        if (email.indexOf("@") === -1) throw new Error("Invalid email format.");
        
        // Success
        return {
            status: 'success',
            token: 'mock-jwt-token-' + Date.now(),
            user: { id: 1, name: 'Demo User', email: email }
        };
    },

    /**
     * Mock: Fetch Wallet Balance
     */
    async getBalances() {
        await this._delay();
        this._maybeFail();
        
        return {
            NGN: 150000,
            BTC: 0.045,
            USDT: 120.50
        };
    },

    /**
     * Mock: Create Offer
     */
    async createOffer(data) {
        await this._delay();
        this._maybeFail();

        // Validation logic moved here from UI
        if (!data.asset) throw new Error("Asset name is required.");
        if (data.amount <= 0) throw new Error("Amount must be positive.");
        if (data.price <= 0) throw new Error("Price must be positive.");

        return {
            status: 'success',
            message: 'Offer created successfully',
            offerId: 'OFF-' + Math.floor(Math.random() * 10000)
        };
    }
};

// Expose to window for app.js
window.mockApi = mockApi;
console.info("%c [MockAPI] Simulation Layer Loaded ", "background: #222; color: #bada55");
