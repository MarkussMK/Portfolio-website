# Markuss Šube — Portfolio

A modern, dark-themed portfolio for Markuss Šube, Automation Engineer and creative developer. Built with plain HTML, CSS, and JavaScript—no framework or build step required.

**Live site:** [markuss.cv](https://markuss.cv)

**Source code:** [github.com/MarkussMK/Portfolio-website](https://github.com/MarkussMK/Portfolio-website)

## Features

- **Single-page portfolio** with Home, About, Skills, Work, Experience, and Contact sections.
- **Interactive project cards** that open case-file modals, with layouts adapted for desktop and touch devices.
- **Retro Arcade Hall** with six playable games: Pac-Man, Tetris, Breakout, Pong, Space Invaders, and Asteroids.
- **Animated circuit-board background** and CSS robotic-arm decoration, with support for `prefers-reduced-motion`.
- **Scroll reveals, counters, and skill bars**, including a fallback to help content appear reliably in mobile Safari.
- **Desktop-only hidden easter egg:** click “Work” 10 times quickly to launch a WASD horror-office mini-game. Three.js is loaded only when the game is launched.
- **Zombie model** in the easter egg, served locally from `models/` and licensed under CC0 1.0.
- **Responsive design** with layouts for phones and tablets.

## Project structure

| Path | Description |
| --- | --- |
| `index.html` | Main portfolio page |
| `css/style.css` | Portfolio styles |
| `js/main.js` | Page interactions, animations, canvas background, and easter egg |
| `html/retro-arcade.html` | Arcade landing page |
| `html/*.html` | Individual arcade games |
| `images/` | Images and icons |
| `models/` | 3D models used by the easter egg |
| `old project/` | Previous portfolio, kept for reference |

## Run locally

There is no build step or package installation. Open `index.html` in a browser, or serve the project directory with a local web server.

## Credits

The `models/Zombie_Ribcage.gltf` model is by Quaternius, from the [Zombie Apocalypse Kit](https://quaternius.com/packs/zombieapocalypsekit.html), and is licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

The site is deployed with GitHub Pages from the `main` branch, with a custom domain configured in `CNAME`.
