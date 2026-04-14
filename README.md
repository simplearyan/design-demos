# Design Demos — Aryan's UI Lab

A curated collection of **61+ UI design prototypes** across 10 project domains — video editors, LMS readers, portfolios, data viz tools, and more. Powered by an auto-generating portal with screenshot previews.

## 🌐 Live Site

**[simplearyan.github.io/design-demos](https://simplearyan.github.io/design-demos/)**

---

## 📁 Project Structure

```
design-demos/
├── _config.js                    ← Single source of truth for all project metadata
├── generate-index.js             ← Generates index.html from config + screenshots
├── generate-preview.js           ← Puppeteer screenshot capture (cached)
├── index.html                    ← Auto-generated portal (Grid + List view + Search)
├── screenshots/                  ← Auto-generated thumbnails (committed to repo)
│
├── brutalism/                    ← 💣 Raw, editorial brutalist UI
├── capcut-clone-deisng/          ← 🎬 Pro video editor UI clones & variants
├── flourish-design/              ← 📊 Data viz studio UI (Flourish-inspired)
├── gemini-lms/                   ← 📚 Course reader & LMS UI iterations
├── kenichi-animation-studio/     ← 🎨 Animation studio app design evolution
├── landing-pages/                ← 🌐 Marketing & personal landing pages
├── personal-notes-site/          ← 📝 Multi-page notes & portfolio site
├── pol-math/                     ← 🔢 Math-focused educational tool iterations
├── zero-gravity/                 ← 🌌 Personal portfolio v1 — space theme
└── zero-gravity-v2/              ← ✨ Full redesign of Zero Gravity
```

---

## 🛠 Development

### Adding a New Project

1. **Add your HTML file(s)** to an existing subdirectory, or create a new one.
2. **Register it** in `_config.js` (only needed for new directories):
    ```js
    { id: 'my-new-project', label: 'My New Project', icon: '🚀', desc: 'Short description' }
    ```
3. **Run the build** — see commands below.

### npm Scripts

| Command | What it does |
| :--- | :--- |
| `npm run index` | Fast — regenerates `index.html` only (no browser needed) |
| `npm run preview` | Captures screenshots for **new** files only, then regenerates index |
| `npm run preview:force` | Re-captures **all** screenshots, then regenerates index |
| `npm run build` | Runs both `index` and `preview` |

```bash
# After adding new HTML files:
npm run preview         # takes screenshots of new files, rebuilds index

# To refresh all thumbnails:
npm run preview:force
```

> **Local note:** `npm run preview` uses your system-installed Chrome on Windows/macOS.  
> No need to run `npx puppeteer browsers install` locally.

---

## 🚀 Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions:

1. Checkout code
2. `npm install`
3. `npx puppeteer browsers install chrome` — installs browser for CI
4. `npm run preview` — captures any new screenshots, regenerates `index.html`
5. Upload & deploy to GitHub Pages

> **Setup:** Go to **Settings → Pages** and set the source to **"GitHub Actions"**.

---

## 🎨 Design Systems

| File | Theme | Used In |
| :--- | :--- | :--- |
| `Capcut_Palette.md` | Dark Studio (`#0a0a0a` + neon cyan) | CapCut Clone, Chart Studio |
| `Flourish_Palette.md` | Light Data-Viz (white + ocean teal) | Flourish Design, Chart Studio |
