MŠAE24 Portfolio
=================

Overview
--------
A small, static portfolio site for Markuss Šube. Simple HTML pages (Home, Experience, Projects, Contact) and a single shared stylesheet: `styles.css`.

Files of interest
-----------------
- `MŠAE24 Portfolio.html` — Homepage with optional hero and inline parallax JS.
- `Experience.html` — Experience / about page.
- `Projects.html` — Projects listing.
- `Contact.html` — Contact page with a JavaScript form wired to Formspree.
- `styles.css` — Centralized styling and CSS variables.

Preview locally (PowerShell)
----------------------------
From the project folder (where the files live), run a simple HTTP server and open a browser:

# Start a Python HTTP server on port 8000
python -m http.server 8000

Then open http://localhost:8000/MŠAE24%20Portfolio.html (or the filename without encoding if your browser handles it).

Alternatives
- Use the VS Code "Live Server" extension (recommended for quick editing previews).
- Use `npx http-server . -p 8000` if you have Node.js.

Editing notes
-------------
- Styling and variables are in `styles.css`.
  - Key variables to tweak: `--header-text-offset`, `--pill-nudge`, `--bg`, `--bg-horizontal`, `--btn-shadow`, `--btn-shadow-hover`.
  - The `:root` block holds the palette and these tuning variables.
- Hero behavior (homepage): the homepage uses `<body class="has-hero">` to opt into an overlay masthead and parallax hero. The inline script in `MŠAE24 Portfolio.html` contains these functions:
  - `updateHeroMax()` — ensures the hero image fills the container.
  - `setHeroOffset()` — shifts the hero under the header and extends its height.
  - `onScroll()` — applies a translate for parallax (disabled below small widths).
- Contact form: posts to Formspree (endpoint configured in `Contact.html`). The form submission uses JavaScript to POST JSON and displays a short success note.

Small maintenance tips
----------------------
- When changing header left offset or pill alignment, update `--header-text-offset` and `--pill-nudge` in `styles.css`.
- If you want pixel-perfect hero/header alignment, we can update the homepage script to read the `--header-text-offset` computed value.
- Be careful renaming files with non-ASCII chars in the filename (browsers may URL-encode them). Consider using an ASCII filename for the homepage (e.g., `index.html`) to simplify local previews.

Next steps / Suggestions
------------------------
- (Optional) Rename `MŠAE24 Portfolio.html` to `index.html` and update links — makes local preview URLs simpler.
- (Optional) Move the homepage JS into a small `hero.js` file for clarity.
- (Optional) Add a tiny test or lint step (HTML validator) if you plan to expand the site.
