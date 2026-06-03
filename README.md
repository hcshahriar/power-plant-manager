# ⚡ Power Plant Manager

A JavaScript-based game where you manage a building's electrical system. Balance power distribution, prevent blackouts, and complete objectives to progress through levels.

## 🎮 Game Overview

**Power Plant Manager** is an interactive management game where you control the power distribution across multiple building zones. Your goal is to:

- ✅ Complete all objectives
- ⚡ Balance power consumption without causing blackouts
- 📈 Maximize your score
- 🎯 Progress through increasingly difficult levels

## 🕹️ How to Play

1. **Open** `index.html` in your web browser
2. **Click switches** to toggle zones on/off
3. **Monitor** your power usage (avoid exceeding 100 MW)
4. **Complete objectives** listed on the right panel
5. **Earn points** for every zone you power and objective you complete

## 🏢 Building Zones

- **💡 Lighting** - 20 MW (×1 multiplier)
- **❄️ Air Conditioning** - 30 MW (×1.5 multiplier)
- **🖥️ Offices** - 15 MW (×1 multiplier)
- **🔒 Security** - 10 MW (×2 multiplier)
- **📊 Data Center** - 25 MW (×2.5 multiplier)
- **🏋️ Gym** - 12 MW (×0.8 multiplier)

## 📊 Objectives

Each level includes challenges like:
- Keep a certain number of zones powered
- Power specific critical systems
- Maintain stable power for a duration
- Optimize energy consumption

## 🎯 Scoring System

- **Zone Power**: Base power × zone multiplier
- **Objective Bonus**: +50 points (standard) or +100 points (time-based)
- **Progression**: Higher levels increase max power capacity

## ⚠️ Blackout System

- **Green (Safe)**: 0-70% power usage
- **Orange (Warning)**: 70-90% power usage
- **Red (Danger)**: 90%+ power usage
- **Game Over**: Exceeding 100 MW triggers blackout

## 🎮 Controls

| Action | Effect |
|--------|--------|
| Click Zone Switch | Toggle zone on/off |
| Reset Game | Start level over |
| Next Level | Proceed to next difficulty |

## 🛠️ Features

✨ **Current Version (v1.0)**
- Interactive zone switching
- Real-time power monitoring
- Multiple objectives per level
- Progressive difficulty
- Responsive UI design
- Blackout warning system

## 🚀 Future Enhancements

- [ ] Multiple levels with increasing difficulty
- [ ] Time-based challenges
- [ ] Random outage events
- [ ] Leaderboard system
- [ ] Sound effects and animations
- [ ] Different game modes
- [ ] Mobile optimization
- [ ] Multiplayer support

## 📁 Project Structure

```
power-plant-manager/
├── index.html       # Main HTML structure
├── styles.css       # Styling and animations
├── game.js          # Game logic and mechanics
└── README.md        # This file
```

## 💻 Technologies Used

- **HTML5** - Page structure
- **CSS3** - Styling, gradients, and animations
- **Vanilla JavaScript** - Game logic and interactivity

## 🎨 Design Features

- Modern gradient UI with glassmorphism
- Responsive grid layout
- Real-time visual feedback
- Color-coded power status
- Smooth animations and transitions

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

This game demonstrates:
- Object-oriented JavaScript (ES6 Classes)
- DOM manipulation
- Event handling
- CSS Grid and Flexbox
- State management
- Game loop concepts

---

**Happy Power Managing!** ⚡🎮

For bugs or suggestions, please open an issue on GitHub.