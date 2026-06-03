// Payment & Subscription System
class PaymentSystem {
    constructor() {
        this.plans = [
            {
                id: 'free',
                name: 'Free',
                price: 0,
                currency: 'USD',
                features: [
                    '✓ 6 Basic Zones',
                    '✓ Standard Levels',
                    '✓ Ad Supported',
                    '✗ No Premium Zones',
                    '✗ No Power-ups'
                ],
                maxZones: 6,
                premiumZones: false,
                powerUps: false,
                adSupported: true
            },
            {
                id: 'premium',
                name: 'Premium',
                price: 4.99,
                currency: 'USD',
                billing: '/month',
                features: [
                    '✓ 10+ Zones',
                    '��� Advanced Levels',
                    '✓ Ad-Free',
                    '✓ Premium Zones',
                    '✗ Limited Power-ups'
                ],
                maxZones: 10,
                premiumZones: true,
                powerUps: false,
                adSupported: false,
                stripeId: 'price_premium'
            },
            {
                id: 'pro',
                name: 'Pro',
                price: 9.99,
                currency: 'USD',
                billing: '/month',
                badge: 'MOST POPULAR',
                features: [
                    '✓ 15+ Zones',
                    '✓ All Levels',
                    '✓ Ad-Free',
                    '✓ All Premium Zones',
                    '✓ Unlimited Power-ups',
                    '✓ Priority Support'
                ],
                maxZones: 15,
                premiumZones: true,
                powerUps: true,
                adSupported: false,
                stripeId: 'price_pro'
            }
        ];

        this.currentPlan = this.getPlanFromStorage() || 'free';
        this.userEmail = localStorage.getItem('userEmail') || '';
        this.subscriptionExpiry = localStorage.getItem('subscriptionExpiry') || null;
    }

    getPlanFromStorage() {
        return localStorage.getItem('subscriptionPlan');
    }

    getPlan(planId) {
        return this.plans.find(p => p.id === planId);
    }

    getCurrentPlan() {
        return this.getPlan(this.currentPlan);
    }

    isSubscribed() {
        return this.currentPlan !== 'free';
    }

    hasFeature(feature) {
        const plan = this.getCurrentPlan();
        if (!plan) return false;

        switch(feature) {
            case 'premium-zones':
                return plan.premiumZones;
            case 'power-ups':
                return plan.powerUps;
            case 'ad-free':
                return !plan.adSupported;
            case 'unlimited':
                return plan.id === 'pro';
            default:
                return false;
        }
    }

    getMaxZones() {
        return this.getCurrentPlan()?.maxZones || 6;
    }

    initStripe() {
        // Initialize Stripe (replace with your public key)
        if (window.Stripe) {
            this.stripe = Stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE');
        }
    }

    async upgradePlan(planId) {
        const plan = this.getPlan(planId);
        if (!plan) return false;

        // If free plan, just update local storage
        if (planId === 'free') {
            this.setPlan('free');
            return true;
        }

        // For paid plans, show payment modal
        return new Promise((resolve) => {
            this.showPaymentModal(plan, resolve);
        });
    }

    setPlan(planId, expiryDate = null) {
        this.currentPlan = planId;
        localStorage.setItem('subscriptionPlan', planId);
        
        if (expiryDate) {
            localStorage.setItem('subscriptionExpiry', expiryDate);
            this.subscriptionExpiry = expiryDate;
        }
    }

    showPaymentModal(plan, callback) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-content">
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                <h2>Upgrade to ${plan.name}</h2>
                <div class="payment-summary">
                    <div class="plan-name">${plan.name}</div>
                    <div class="plan-price">$${plan.price.toFixed(2)}<span>${plan.billing || ''}</span></div>
                </div>
                <div class="payment-form">
                    <input type="email" id="paymentEmail" placeholder="Email" value="${this.userEmail}">
                    <div id="card-element"></div>
                    <button class="pay-btn" onclick="paymentSystem.processPayment('${plan.id}')">Pay $${plan.price.toFixed(2)}</button>
                    <button class="cancel-btn" onclick="this.parentElement.parentElement.remove()">Cancel</button>
                </div>
                <p class="payment-note">🔒 Your payment is secure and encrypted. No card details are stored.</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Mock payment processing (replace with actual Stripe integration)
        setTimeout(() => {
            console.log('Payment modal created for plan:', plan.id);
        }, 100);
    }

    async processPayment(planId) {
        const email = document.getElementById('paymentEmail')?.value;
        if (!email) {
            alert('Please enter your email');
            return;
        }

        // In production, this would integrate with Stripe
        console.log('Processing payment for:', email, 'Plan:', planId);
        
        // Simulate payment processing
        this.userEmail = email;
        localStorage.setItem('userEmail', email);
        
        // Set subscription (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        this.setPlan(planId, expiryDate.toISOString());
        
        // Close modal and show success
        document.querySelector('.payment-modal')?.remove();
        this.showSuccessNotification(`Welcome to ${this.getPlan(planId).name}!`);
        
        // Refresh game if active
        if (typeof game !== 'undefined') {
            game.render();
        }
    }

    showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    checkSubscriptionExpiry() {
        if (!this.subscriptionExpiry) return;
        
        const expiry = new Date(this.subscriptionExpiry);
        const now = new Date();
        
        if (now > expiry) {
            this.setPlan('free');
            this.showSuccessNotification('Your subscription has expired. Downgraded to Free plan.');
        }
    }
}

// Initialize payment system
let paymentSystem;
window.addEventListener('DOMContentLoaded', () => {
    paymentSystem = new PaymentSystem();
    paymentSystem.checkSubscriptionExpiry();
});