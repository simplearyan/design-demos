# Design Demos — Aryan's UI Lab

A curated collection of **61+ UI design prototypes** across 10 project domains — video editors, LMS readers, portfolios, data viz tools, and more. Powered by an auto-generating portal with screenshot previews.

## 🌐 Live Site

**[simplearyan.github.io/design-demos](https://simplearyan.github.io/design-demos/)**

---

## 🖼️ Project Previews

### 💣 Brutalism
> Raw, editorial brutalist UI experiments

![Brutalism — Game Dev Page](screenshots/brutalism/Aryan_DS_game_Dev.png)

---

### 🎬 CapCut Clone
> Pro video editor UI clones & variants

![CapCut Clone](screenshots/capcut-clone-deisng/capcut-clone.png)

| Chart Studio 0.1 | Chart Studio 0.4.1 |
|---|---|
| ![Chart Studio 0.1](screenshots/capcut-clone-deisng/chart-studio-0.1.png) | ![Chart Studio 0.4.1](screenshots/capcut-clone-deisng/chart-studio-0.4.1.png) |

---

### 📊 Flourish Design
> Data viz studio UI inspired by Flourish

| Flourish Clone | Different Font Variant |
|---|---|
| ![Flourish Clone](screenshots/flourish-design/flourish-clone.png) | ![Different Font](screenshots/flourish-design/different-font.png) |

---

### 📚 Gemini LMS
> Course reader & LMS UI iterations

![Course Read — Pro Gray](screenshots/gemini-lms/course-read-pro-gray.png)

| Course Read (v1) | Discord Version | Stats Course |
|---|---|---|
| ![Course Read](screenshots/gemini-lms/course-read.png) | ![Discord Version](screenshots/gemini-lms/course-read-discrod-version.png) | ![Stats Course](screenshots/gemini-lms/stats-course.png) |

---

### 🎨 Kenichi Animation Studio
> Animation studio app design evolution

| v0.2 Home Page | v0.3 Responsive Bottom Bar |
|---|---|
| ![v0.2](screenshots/kenichi-animation-studio/v0.2-home-page.png) | ![v0.3](screenshots/kenichi-animation-studio/v0.3-responsive-bottom-bar.png) |

---

### 🌐 Landing Pages
> Marketing & personal landing pages

| Aryan DS | Gemini Notes |
|---|---|
| ![Aryan DS](screenshots/landing-pages/ARYAN_DS.png) | ![Gemini Notes](screenshots/landing-pages/GEMINI_NOTES.png) |

---

### 📝 Personal Notes Site
> Multi-page personal notes & portfolio site

![Notes Page](screenshots/personal-notes-site/notes.png)

| Index | Course Read | Solutions |
|---|---|---|
| ![Index](screenshots/personal-notes-site/index.png) | ![Course Read](screenshots/personal-notes-site/course-read.png) | ![Solutions](screenshots/personal-notes-site/solutions.png) |

---

### 🔢 Pol-Math
> Math-focused educational tool iterations

| v4 | v5 | v6 |
|---|---|---|
| ![v4](screenshots/pol-math/v4.png) | ![v5](screenshots/pol-math/v5.png) | ![v6](screenshots/pol-math/v6.png) |

---

### 🌌 Zero Gravity
> Personal portfolio v1 — space theme

![Zero Gravity Main](screenshots/zero-gravity/Aryan_Zero_gravity.png)

| Notes Page | Solutions Page | Devlog |
|---|---|---|
| ![Notes](screenshots/zero-gravity/Zero_gravity_notes_page.png) | ![Solutions](screenshots/zero-gravity/Zero_gravity_solutions_page.png) | ![Devlog](screenshots/zero-gravity/Zero_gravity_devlog_page.png) |

---

### ✨ Zero Gravity V2
> Full redesign iteration of Zero Gravity

| Home | Course Read | Notes |
|---|---|---|
| ![Home](screenshots/zero-gravity-v2/home.png) | ![Course Read](screenshots/zero-gravity-v2/course-read.png) | ![Notes](screenshots/zero-gravity-v2/notes.png) |

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
├── brutalism/
├── capcut-clone-deisng/
├── flourish-design/
├── gemini-lms/
├── kenichi-animation-studio/
├── landing-pages/
├── personal-notes-site/
├── pol-math/
├── zero-gravity/
└── zero-gravity-v2/
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
