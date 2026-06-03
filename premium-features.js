// Premium Features & Power-ups
class PremiumFeatures {
    constructor(game, paymentSystem) {
        this.game = game;
        this.paymentSystem = paymentSystem;
        this.powerUps = [];
        this.premiumZones = [
            { id: 'quantum', name: '⚛️ Quantum Lab', power: 35, multiplier: 3.5, locked: true },
            { id: 'solar', name: '☀️ Solar Farm', power: 40, multiplier: 3, locked: true },
            { id: 'wind', name: '💨 Wind Turbine', power: 30, multiplier: 2.8, locked: true },
            { id: 'ai', name: '🤖 AI Center', power: 45, multiplier: 4, locked: true }
        ];
        
        this.availablePowerUps = [
            { id: 'boost', name: '⚡ Power Boost', cost: 100, effect: 'Increase max power by 50MW for 30s', duration: 30000 },
            { id: 'shield', name: '🛡️ Blackout Shield', cost: 150, effect: 'Prevent blackout for 20s', duration: 20000 },
            { id: 'reset', name: '🔄 Smart Reset', cost: 75, effect: 'Reset power usage', duration: 0 }
        ];
        
        this.activePowerUps = [];
    }

    getPremiumZones() {
        if (!this.paymentSystem.hasFeature('premium-zones')) {
            return [];
        }
        return this.premiumZones;
    }

    getAvailablePowerUps() {
        if (!this.paymentSystem.hasFeature('power-ups')) {
            return [];
        }
        return this.availablePowerUps;
    }

    usePowerUp(powerUpId) {
        if (!this.paymentSystem.hasFeature('power-ups')) {
            alert('🔒 Power-ups are only available with Pro subscription');
            return false;
        }

        const powerUp = this.availablePowerUps.find(p => p.id === powerUpId);
        if (!powerUp) return false;

        // Check if user has enough score for the power-up
        if (this.game.score < powerUp.cost) {
            alert(`Not enough score! Need ${powerUp.cost}, have ${this.game.score}`);
            return false;
        }

        // Deduct score
        this.game.score -= powerUp.cost;

        // Apply power-up effect
        switch(powerUpId) {
            case 'boost':
                this.applyPowerBoost();
                break;
            case 'shield':
                this.applyBlackoutShield();
                break;
            case 'reset':
                this.game.currentPower = 0;
                this.game.zones.forEach(z => z.isActive = false);
                break;
        }

        this.activePowerUps.push({
            ...powerUp,
            startTime: Date.now()
        });

        this.showPowerUpNotification(powerUp);
        return true;
    }

    applyPowerBoost() {
        const originalMaxPower = this.game.maxPower;
        this.game.maxPower += 50;
        
        setTimeout(() => {
            this.game.maxPower = originalMaxPower;
        }, 30000);
    }

    applyBlackoutShield() {
        this.game.shieldActive = true;
        setTimeout(() => {
            this.game.shieldActive = false;
        }, 20000);
    }

    checkPowerUpExpiry() {
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            if (powerUp.duration === 0) return false;
            
            const elapsed = Date.now() - powerUp.startTime;
            return elapsed < powerUp.duration;
        });
    }

    showPowerUpNotification(powerUp) {
        const notification = document.createElement('div');
        notification.className = 'notification power-up';
        notification.innerHTML = `<strong>${powerUp.name}</strong><br>${powerUp.effect}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Enhanced Game with Premium Features
class EnhancedGame {
    constructor() {
        // Initialize base game components
        this.maxPower = 100;
        this.currentPower = 0;
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.gameWon = false;
        this.shieldActive = false;
        
        this.zones = [];
        this.objectives = [];
        this.completedObjectives = 0;
        
        // Initialize premium features when payment system is ready
        if (typeof paymentSystem !== 'undefined') {
            this.premiumFeatures = new PremiumFeatures(this, paymentSystem);
        }
        
        this.init();
    }

    init() {
        this.createZones();
        this.createObjectives();
        this.render();
        this.attachEventListeners();
        this.startGameLoop();
    }

    createZones() {
        const basicZones = [
            { id: 'lights', name: '💡 Lighting', power: 20, multiplier: 1 },
            { id: 'ac', name: '❄️ Air Conditioning', power: 30, multiplier: 1.5 },
            { id: 'offices', name: '🖥️ Offices', power: 15, multiplier: 1 },
            { id: 'security', name: '🔒 Security', power: 10, multiplier: 2 },
            { id: 'data', name: '📊 Data Center', power: 25, multiplier: 2.5 },
            { id: 'gym', name: '🏋️ Gym', power: 12, multiplier: 0.8 },
        ];

        this.zones = basicZones.map(data => ({
            ...data,
            isActive: false,
            currentConsumption: 0,
            isPremium: false
        }));

        // Add premium zones if available
        if (this.premiumFeatures && this.premiumFeatures.getPremiumZones().length > 0) {
            const premiumZones = this.premiumFeatures.getPremiumZones();
            premiumZones.forEach(zone => {
                this.zones.push({
                    ...zone,
                    isActive: false,
                    currentConsumption: 0,
                    isPremium: true
                });
            });
        }
    }

    createObjectives() {
        const objectiveData = [
            { id: 1, text: 'Keep 3 zones powered', required: 3, type: 'activeZones' },
            { id: 2, text: 'Power the Security system', required: 'security', type: 'zone' },
            { id: 3, text: 'Avoid blackout for 60 seconds', required: 60, type: 'time' },
            { id: 4, text: 'Power Data Center', required: 'data', type: 'zone' },
        ];

        this.objectives = objectiveData.map(obj => ({
            ...obj,
            completed: false,
            startTime: Date.now()
        }));
    }

    toggleZone(zoneId) {
        const zone = this.zones.find(z => z.id === zoneId);
        if (!zone) return;

        if (zone.isPremium && !paymentSystem.hasFeature('premium-zones')) {
            alert('🔒 This zone is only available with Premium subscription!');
            return;
        }

        const powerChange = zone.power;

        if (!zone.isActive && this.currentPower + powerChange > this.maxPower) {
            if (!this.shieldActive) {
                alert('⚠️ Not enough power! Blackout imminent!');
                return;
            }
        }

        zone.isActive = !zone.isActive;
        zone.currentConsumption = zone.isActive ? zone.power : 0;

        this.currentPower = this.zones.reduce((total, z) => total + z.currentConsumption, 0);

        if (zone.isActive) {
            this.score += Math.floor(zone.power * zone.multiplier);
        }

        this.checkBlackout();
        this.checkObjectives();
        this.render();
    }

    checkBlackout() {
        if (this.shieldActive) return;

        if (this.currentPower > this.maxPower) {
            this.gameOver = true;
            this.endGame(false, '💥 BLACKOUT! You used too much power!');
        }
    }

    checkObjectives() {
        this.objectives.forEach(obj => {
            if (obj.completed) return;

            switch (obj.type) {
                case 'activeZones':
                    const activeCount = this.zones.filter(z => z.isActive).length;
                    if (activeCount >= obj.required) {
                        obj.completed = true;
                        this.completedObjectives++;
                        this.score += 50;
                    }
                    break;

                case 'zone':
                    const zone = this.zones.find(z => z.id === obj.required);
                    if (zone && zone.isActive) {
                        obj.completed = true;
                        this.completedObjectives++;
                        this.score += 50;
                    }
                    break;

                case 'time':
                    const elapsed = (Date.now() - obj.startTime) / 1000;
                    const blackoutRisk = this.getBlackoutRisk();
                    if (elapsed >= obj.required && blackoutRisk !== 'Danger') {
                        obj.completed = true;
                        this.completedObjectives++;
                        this.score += 100;
                    }
                    break;
            }
        });

        if (this.completedObjectives === this.objectives.length) {
            this.gameWon = true;
            this.endGame(true, `🎉 Level ${this.level} Complete!\n\nScore: ${this.score}`);
        }
    }

    getBlackoutRisk() {
        const percent = (this.currentPower / this.maxPower) * 100;
        if (percent >= 90) return 'Danger';
        if (percent >= 70) return 'Warning';
        return 'Safe';
    }

    endGame(won, message) {
        const modal = document.getElementById('gameModal');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalMessage');
        const btn = document.getElementById('modalBtn');

        if (won) {
            title.textContent = '🎉 Level Complete!';
            title.style.color = '#00ff88';
        } else {
            title.textContent = '💀 Game Over!';
            title.style.color = '#ff4444';
        }

        text.textContent = message;
        modal.classList.remove('hidden');

        btn.onclick = () => {
            this.reset();
            modal.classList.add('hidden');
        };
    }

    reset() {
        this.currentPower = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.completedObjectives = 0;
        this.zones.forEach(z => z.isActive = false);
        this.objectives.forEach(obj => obj.completed = false);
        this.render();
    }

    render() {
        this.renderStats();
        this.renderZones();
        this.renderObjectives();
        this.renderPowerUps();
    }

    renderStats() {
        document.getElementById('availablePower').textContent = 
            (this.maxPower - this.currentPower).toFixed(1);
        document.getElementById('powerUsed').textContent = this.currentPower.toFixed(1);
        document.getElementById('score').textContent = this.score;

        const riskElement = document.getElementById('blackoutRisk');
        const risk = this.getBlackoutRisk();
        riskElement.textContent = this.shieldActive ? '🛡️ SHIELD' : risk;

        if (this.shieldActive) {
            riskElement.style.color = '#4ade80';
        } else if (risk === 'Danger') {
            riskElement.style.color = '#ff4444';
        } else if (risk === 'Warning') {
            riskElement.style.color = '#ffa500';
        } else {
            riskElement.style.color = '#4ade80';
        }
    }

    renderZones() {
        const container = document.getElementById('zonesContainer');
        container.innerHTML = '';

        this.zones.forEach(zone => {
            const zoneEl = document.createElement('div');
            zoneEl.className = `zone ${zone.isActive ? 'active' : ''} ${zone.isPremium ? 'premium' : ''}`;

            if (zone.currentConsumption > zone.power * 1.2) {
                zoneEl.classList.add('blackout');
            }

            const percent = (zone.currentConsumption / zone.power) * 100;
            const isPremiumLocked = zone.isPremium && !paymentSystem.hasFeature('premium-zones');

            zoneEl.innerHTML = `
                <div class="zone-name">${zone.name}</div>
                ${isPremiumLocked ? '<div class="zone-lock">🔒 Premium</div>' : ''}
                <div class="zone-info">
                    Power: ${zone.currentConsumption}/${zone.power} MW
                </div>
                <div class="power-bar">
                    <div class="power-fill" style="width: ${Math.min(percent, 100)}%"></div>
                </div>
                <button class="switch-btn ${zone.isActive ? 'on' : 'off'}" ${isPremiumLocked ? 'disabled' : ''}>
                    ${zone.isActive ? '🔌 ON' : '⚫ OFF'}
                </button>
            `;

            if (!isPremiumLocked) {
                zoneEl.querySelector('.switch-btn').addEventListener('click', () => {
                    this.toggleZone(zone.id);
                });
            }

            container.appendChild(zoneEl);
        });
    }

    renderObjectives() {
        const container = document.getElementById('objectivesList');
        container.innerHTML = '';

        this.objectives.forEach(obj => {
            const objEl = document.createElement('div');
            objEl.className = `objective ${obj.completed ? 'completed' : ''}`;
            objEl.textContent = (obj.completed ? '✅ ' : '⭕ ') + obj.text;
            container.appendChild(objEl);
        });
    }

    renderPowerUps() {
        if (!this.premiumFeatures) return;
        
        const container = document.getElementById('powerUpsContainer');
        if (!container) return;

        container.innerHTML = '';
        const powerUps = this.premiumFeatures.getAvailablePowerUps();

        if (powerUps.length === 0) return;

        powerUps.forEach(powerUp => {
            const powerUpEl = document.createElement('button');
            powerUpEl.className = 'power-up-btn';
            powerUpEl.innerHTML = `${powerUp.name}<br><small>${powerUp.cost} pts</small>`;
            powerUpEl.onclick = () => this.premiumFeatures.usePowerUp(powerUp.id);
            container.appendChild(powerUpEl);
        });
    }

    attachEventListeners() {
        document.getElementById('resetBtn')?.addEventListener('click', () => this.reset());
    }

    startGameLoop() {
        setInterval(() => {
            if (this.premiumFeatures) {
                this.premiumFeatures.checkPowerUpExpiry();
            }
            this.render();
        }, 100);
    }
}

// Override game initialization
let game;
window.addEventListener('DOMContentLoaded', () => {
    // Wait for payment system to initialize
    setTimeout(() => {
        game = new EnhancedGame();
    }, 500);
});