# The Art of Experience — Under the Tuscan Sun

A one-page landing for a private, experience-led Tuscany journey.
Warm-minimal "Tuscan" aesthetic — terracotta, olive, ochre and cream —
with editorial typography, minimalist line-art illustrations, and refined
scroll / parallax motion.

## Stack

Built with **React 18** loaded via native ES modules + import maps, and
**Babel Standalone** for in-browser JSX. No build step and no Node.js required —
handy for quick local iteration. The source is organized as regular components,
so it can later be migrated into a Vite/Next.js project with minimal changes.

- `index.html` — document shell, fonts, import map, Babel loader
- `styles.css` — Tuscan design system (colors, typography, layout, motion)
- `app.jsx` — React components: sections + SVG illustrations

Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif)
and [Inter](https://fonts.google.com/specimen/Inter) (text), via Google Fonts.

## Run locally

Because Babel fetches `app.jsx`, open it through a local server (not `file://`):

```bash
cd ~/Projects/art-of-experience
python3 -m http.server 5173
```

Then visit http://localhost:5173

> Requires an internet connection at runtime (React, Babel and fonts load from
> CDNs). To go fully offline or production-grade, migrate to a Vite build.

## Deploy to GitHub Pages

This site is static — no build step required.

### Quick deploy (browser, ~5 min)

1. Create a new public repo: [github.com/new](https://github.com/new)  
   Name: `art-of-experience`
2. Click **"uploading an existing file"**
3. Upload these files from the project folder:
   - `index.html`
   - `styles.css`
   - `app.jsx`
   - `README.md`
   - `.gitignore`
4. Commit to `main`
5. **Settings → Pages →** Deploy from branch `main`, folder `/ (root)`
6. Live at: `https://YOUR_USERNAME.github.io/art-of-experience/`

A ready-made zip is also available: `art-of-experience-deploy.zip`

### Deploy via git (after Xcode Command Line Tools are installed)

```bash
cd ~/Projects/art-of-experience
git init
git add index.html styles.css app.jsx README.md .gitignore
git commit -m "Add Tuscan experience landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/art-of-experience.git
git push -u origin main
```

Then enable Pages in repo Settings (branch `main`, root).

## Notes

- Booking CTAs are intentionally omitted for now.
- Illustrations are hand-built SVG line art (no photos).
- Motion respects `prefers-reduced-motion`.

## Content

16–20 September 2026 · Tuscany, Italy · Limited to 10 guests · £2,350 per guest.
