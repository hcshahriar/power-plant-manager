// Power Plant Manager Game
class PowerPlantGame {
    constructor() {
        this.maxPower = 100;
        this.currentPower = 0;
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.gameWon = false;
        
        this.zones = [];
        this.objectives = [];
        this.completedObjectives = 0;
        
        this.init();
    }

    init() {
        this.createZones();
        this.createObjectives();
        this.render();
        this.attachEventListeners();
    }

    createZones() {
        const zoneData = [
            { id: 'lights', name: '💡 Lighting', power: 20, multiplier: 1 },
            { id: 'ac', name: '❄️ Air Conditioning', power: 30, multiplier: 1.5 },
            { id: 'offices', name: '🖥️ Offices', power: 15, multiplier: 1 },
            { id: 'security', name: '🔒 Security', power: 10, multiplier: 2 },
            { id: 'data', name: '📊 Data Center', power: 25, multiplier: 2.5 },
            { id: 'gym', name: '🏋️ Gym', power: 12, multiplier: 0.8 },
        ];

        this.zones = zoneData.map(data => ({
            ...data,
            isActive: false,
            currentConsumption: 0
        }));
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

        // Calculate power change
        const powerChange = zone.power;

        // Check if we can turn on (if turning off, always allowed)
        if (!zone.isActive && this.currentPower + powerChange > this.maxPower) {
            this.showAlert('⚠️ Not enough power! Blackout imminent!');
            return;
        }

        // Toggle zone
        zone.isActive = !zone.isActive;
        zone.currentConsumption = zone.isActive ? zone.power : 0;

        // Update power
        this.currentPower = this.zones.reduce((total, z) => total + z.currentConsumption, 0);

        // Update score
        if (zone.isActive) {
            this.score += Math.floor(zone.power * zone.multiplier);
        }

        // Check for blackout
        this.checkBlackout();
        this.checkObjectives();
        this.render();
    }

    checkBlackout() {
        const blackoutRiskPercent = (this.currentPower / this.maxPower) * 100;
        
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
                        this.showAlert('✅ Objective completed: ' + obj.text);
                    }
                    break;

                case 'zone':
                    const zone = this.zones.find(z => z.id === obj.required);
                    if (zone && zone.isActive) {
                        obj.completed = true;
                        this.completedObjectives++;
                        this.score += 50;
                        this.showAlert('✅ Objective completed: ' + obj.text);
                    }
                    break;

                case 'time':
                    const elapsed = (Date.now() - obj.startTime) / 1000;
                    const blackoutRisk = this.getBlackoutRisk();
                    if (elapsed >= obj.required && blackoutRisk !== 'Danger') {
                        obj.completed = true;
                        this.completedObjectives++;
                        this.score += 100;
                        this.showAlert('✅ Objective completed: ' + obj.text);
                    }
                    break;
            }
        });

        // Check if all objectives completed
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
        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.completedObjectives = 0;
        this.zones.forEach(z => z.isActive = false);
        this.objectives.forEach(obj => obj.completed = false);
        this.render();
    }

    showAlert(message) {
        // Simple visual feedback - you can enhance this
        console.log(message);
    }

    render() {
        this.renderStats();
        this.renderZones();
        this.renderObjectives();
    }

    renderStats() {
        document.getElementById('availablePower').textContent = 
            (this.maxPower - this.currentPower).toFixed(1);
        document.getElementById('powerUsed').textContent = this.currentPower.toFixed(1);
        document.getElementById('score').textContent = this.score;

        const riskElement = document.getElementById('blackoutRisk');
        const risk = this.getBlackoutRisk();
        riskElement.textContent = risk;

        if (risk === 'Danger') {
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
            zoneEl.className = `zone ${zone.isActive ? 'active' : ''}`;

            if (zone.currentConsumption > zone.power * 1.2) {
                zoneEl.classList.add('blackout');
            }

            const percent = (zone.currentConsumption / zone.power) * 100;

            zoneEl.innerHTML = `
                <div class="zone-name">${zone.name}</div>
                <div class="zone-info">
                    Power: ${zone.currentConsumption}/${zone.power} MW
                </div>
                <div class="power-bar">
                    <div class="power-fill" style="width: ${Math.min(percent, 100)}%"></div>
                </div>
                <button class="switch-btn ${zone.isActive ? 'on' : 'off'}">
                    ${zone.isActive ? '🔌 ON' : '⚫ OFF'}
                </button>
            `;

            zoneEl.querySelector('.switch-btn').addEventListener('click', () => {
                this.toggleZone(zone.id);
            });

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

    attachEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
    }

    nextLevel() {
        this.level++;
        // Increase difficulty
        this.maxPower = 100 + (this.level * 10);
        this.reset();
        this.createObjectives();
        this.render();
    }
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new PowerPlantGame();
});