
# Markuss Šube — WebDev Portfolio

Welcome to my interactive portfolio! This site combines a gamified XP/leveling system with a retro arcade hall, showcasing my skills, projects, and personality in a modern and engaging format.

**Live site:** [markuss.cv](https://markuss.cv)

---

## 🚀 Features

- **XP Progression System** — Earn XP by scrolling through sections. Completing pages unlocks new areas and levels up your character.
- **Page Unlock Flow** — Pages are gated: complete Main Terminal → unlock Experience → unlock Projects → unlock Contact.
- **Level-up & Unlock Notifications** — Unified animated popup system for all level-ups and unlocks.
- **Leveling Toggle** — Players can opt out of the XP system entirely; all pages unlock immediately when disabled.
- **Reset Progress** — Hard-reset button clears all localStorage progress and returns to the home page.
- **Retro Arcade Hall** — A full virtual arcade with 6 playable cabinet games, accessible from the Projects page.
- **WebGL Background** — Three.js shader-powered animated background across all portfolio pages.
- **Responsive Design** — Optimized for desktop and mobile. XP tracker collapses into a level-up popup on small screens.
- **Randomized Brain Teaser** — Quiz answers are shuffled on every load so the correct answer is never in a fixed position.

---

## 📄 Pages

| File | Description |
|------|-------------|
| `index.html` | Main Terminal — Home, About Me, System Origins |
| `html/Experience.html` | System Specs — Skills, profile, career history |
| `html/Projects.html` | Data Archives — Project showcase with 3D card UI |
| `html/Contact.html` | Communication Hub — Contact form and social links |
| `html/retro-arcade.html` | Retro Arcade Hall — 6 playable arcade cabinets |
| `html/space-invaders.html` | Space Invaders game |
| `html/pacman.html` | Pac-Man game |
| `html/tetris.html` | Tetris game |
| `html/pong.html` | Pong game |
| `html/breakout.html` | Breakout game (brick-breaking, levels, 3 lives) |
| `html/asteroids.html` | Asteroids game (vector ship, split mechanics, hyperspace) |
| `html/brain-teaser.html` | Brain Teaser quiz (randomized answer order) |

---

## 🕹️ Arcade Games

| Cabinet | Game | Theme |
|---------|------|-------|
| 1 | Space Invaders | Yellow + light blue cabinet |
| 2 | Pac-Man | Classic yellow cabinet |
| 3 | Tetris | Blue cabinet |
| 4 | Pong | Monochrome cabinet |
| 5 | Breakout | Prison stripe B&W cabinet |
| 6 | Asteroids | Green glow cabinet |

---

## 🗂️ Project Structure

```
/
├── index.html               ← Root home page (stays at root for GitHub Pages)
├── CNAME                    ← Custom domain: markuss.cv
├── html/                    ← All other HTML pages
│   ├── Experience.html
│   ├── Projects.html
│   ├── Contact.html
│   ├── retro-arcade.html
│   ├── space-invaders.html
│   ├── pacman.html
│   ├── tetris.html
│   ├── pong.html
│   ├── breakout.html
│   ├── asteroids.html
│   └── brain-teaser.html
├── css/
│   ├── styles.css           ← Main portfolio styles
│   ├── game-styles-new.css  ← Arcade/game shared styles
│   └── projects-3d.css      ← 3D card styles for Projects page
├── js/
│   ├── progression.js       ← XP system, leveling, unlocks, popups
│   ├── animations.js        ← UI animations and transitions
│   └── background-shader.js ← Three.js WebGL background shader
└── images/
    ├── linkedin.jpg
    ├── pfp.jpg
    ├── aboutmesection.jpg / aboutmesection1.jpg / aboutmesection2.jpg
    ├── screen1.png / screen2.png / screen3.png
    ├── Space_invaders_logo.svg.png
    ├── 423-4232181_pac-man-pacman-logo-svg.png
    ├── Tetris-Logo-1-1155x770.png
    ├── pong-logo-png_seeklogo-438122.png
    ├── breakout.jpg
    ├── astroids.png
    └── ...
```

---

## 🛠️ How The XP System Works

- Scrolling through `.read-section` elements earns XP tracked via `IntersectionObserver`.
- Each page has a level cap — you can't overshoot into the next tier before visiting that page.
- Completing a page calls `completeCurrentPage()`, which pushes a `nextPage` basename into `state.unlockedPages` and triggers the unlock notification.
- Navigation lock/unlock reads each nav link's `href` basename (`.split('/').pop()`) and compares it against `unlockedPages` — this is compatible with the `html/` subfolder structure.
- All state is stored in `localStorage` under a single key.
- The `_imgBase` variable in `progression.js` resolves image paths correctly whether the script is loaded from `index.html` (root) or any page inside `html/`.

---

## 💡 Adding Content

- **New page:** Create it in `html/`, add CSS/JS refs with `../css/` and `../js/` prefixes, add a nav link in `index.html` with an `html/` prefix, and register it in `PAGE_LEVELS` inside `progression.js`.
- **New arcade game:** Create it in `html/`, add a cabinet entry in `html/retro-arcade.html`, and add a cabinet image to `images/`.
- **New brain teaser question:** Add an object to the `questions` array in `html/brain-teaser.html`. Answers are automatically shuffled on load.

---

## 🧑‍💻 Author

**Markuss Šube** — Automation Engineer & Programming Enthusiast

## 📬 Contact

- LinkedIn: [linkedin.com/in/markuss-sube](https://linkedin.com/in/markuss-sube)
- Site: [markuss.cv](https://markuss.cv)

---

Feel free to explore, level up, and discover all the features of this portfolio!
