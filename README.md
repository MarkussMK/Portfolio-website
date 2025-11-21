# Markuss Šube - Interactive Robot Portfolio

🤖 **Live Site**: [www.markuss.cv](https://www.markuss.cv)

## Overview
An interactive portfolio website featuring an immersive robot arm game experience. Built for Markuss Šube, Automation Engineer. The site challenges visitors with misprogrammed robot arms they must navigate carefully to explore the portfolio.

## Key Features

### 🎮 Interactive Robot Game Mode
- **Warning System**: Dramatic typewriter effect introduction with choice-based interactions
- **8 Robot Arms**: Advanced inverse kinematics with cursor tracking and zoom animations
- **Game Mechanics**: Touch a robot arm and face consequences with "Try Again" or "Quit Game" options
- **Session Memory**: Choice persistence throughout browsing session

### 🎨 Visual Experience
- **Industrial Cogs**: 4 floating animated cogs with gray industrial aesthetic
- **Screen Shake Effects**: Dramatic feedback when robots are disturbed
- **Large-Scale Typography**: Bold Montserrat font spanning full screen width
- **Responsive Design**: Optimized for desktop interaction (mobile users skip the game)

### 📱 Multi-Page Portfolio
- **Experience Page**: Professional skills and achievements
- **Projects Page**: Detailed project showcases
- **Contact Page**: Functional contact form with social links

## File Structure
```
├── index.html          # Main page with robot game
├── Experience.html     # Professional experience
├── Projects.html       # Project portfolio
├── Contact.html        # Contact information
├── animations.js       # Robot interactions & animations
├── styles.css         # Complete styling system
└── README.md          # This file
```

## Technical Highlights

### Robot Arm System
- **Inverse Kinematics**: Real-time 4-joint arm calculations
- **Smooth Interpolation**: Fluid cursor following with realistic constraints
- **Zoom Animations**: 1.4x scale effect when arms are touched
- **Warning Overlays**: Typewriter effect messages with choice buttons

### Interactive Elements
- **Choice System**: Accept/Refuse robot interaction with session persistence
- **Scroll Management**: Always start from top, smooth scroll to top on reset
- **Button Layouts**: Proper spacing to prevent text overlap
- **Mobile Detection**: Robot game disabled on touch devices

## Getting Started

### Local Development
```bash
# Python HTTP server
python -m http.server 8000

# Or use VS Code Live Server extension
```

Visit `http://localhost:8000`

### Deployment
Deployed via GitHub Pages. Updates to main branch automatically go live.

## Browser Support
- Modern desktop browsers for full robot game experience
- Mobile browsers with game-free portfolio browsing
- Requires JavaScript enabled

---

**Experience the Robot Portfolio**: 🤖 [www.markuss.cv](https://www.markuss.cv)
