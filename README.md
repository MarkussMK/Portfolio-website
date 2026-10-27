# Markuss Šube — Portfolio

Modern, dark-themed portfolio for Markuss Šube (Automation Engineer & creative developer),
built with plain HTML/CSS/JS — no framework, no build step.

**Live site:** [markuss.cv](https://markuss.cv)

---

## Features

- **Single-page layout** — Home, About, Skills, Work, Experience, and Contact sections with
  scroll-spy nav highlighting and smooth anchor scrolling.
- **3D "case-file" project cards** — the Work section's project boxes tilt/rotate in 3D on
  hover (desktop) and flatten into clean cards on touch devices; clicking one opens a modal
  with the full project write-up.
- **Retro Arcade Hall** — a separate arcade (`html/retro-arcade.html`) with 6 playable cabinet
  games: Pac-Man, Tetris, Breakout, Pong, Space Invaders, Asteroids.
- **Animated circuit-board background** — a canvas-drawn PCB/HUD look, plus an idle CSS
  robotic-arm decoration, both respecting `prefers-reduced-motion`.
- **Reveal-on-scroll, animated stat counters and skill bars**, with a manual fallback check
  (not just `IntersectionObserver`) so content shows up reliably on mobile Safari.
- **Hidden easter egg (desktop only)** — clicking "Work" 10x quickly launches a WASD
  horror-office mini-game (lazy-loads three.js only when triggered). Skipped entirely on
  touch devices since it needs a keyboard + pointer lock.
- **Animated zombie chaser** — the easter egg uses Quaternius' Zombie_Ribcage model from the
  Zombie Apocalypse Kit, licensed CC0 1.0; the model is served locally from `models/`.
- **Responsive** — tuned layout, spacing, and 3D-box fallback for phones/tablets.

---

##  Structure

| Path | Description |
|------|-------------|
| `index.html` | Main single-page portfolio (all sections) |
| `css/style.css` | All styling for the portfolio |
| `js/main.js` | All interactions: nav, reveals, canvas background, arcade easter egg, etc. |
| `html/retro-arcade.html` | Retro Arcade Hall — links to the 6 games below |
| `html/*.html` (pacman, tetris, breakout, pong, space-invaders, asteroids) | Individual arcade games |
| `old project/` | The previous XP-leveling multi-page portfolio, kept for reference |

---

## 🛠 Notes

- No external dependencies except Google Fonts and, only when the easter egg is triggered,
  three.js and its GLTF loader from a CDN.
- `models/Zombie_Ribcage.gltf` is by Quaternius, from the
  [Zombie Apocalypse Kit](https://quaternius.com/packs/zombieapocalypsekit.html), under
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
- Deployed via GitHub Pages straight from `main` (custom domain via `CNAME`).
