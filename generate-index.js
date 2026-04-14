/**
 * generate-index.js
 * Generates the unified index.html portal with Grid + List view toggle and search.
 * 
 * Usage:
 *   node generate-index.js
 *   npm run index
 */
const fs   = require('fs');
const path = require('path');
const { dirs } = require('./_config');

const rootDir    = __dirname;
const outputFile = path.join(rootDir, 'index.html');

// ─── Scanner ──────────────────────────────────────────────────────────────────

function scanDirectories() {
    const allDemos = [];

    dirs.forEach(({ id, label, icon, desc }) => {
        const fullPath = path.join(rootDir, id);
        if (!fs.existsSync(fullPath)) {
            console.warn(`[warn] Directory not found: ${id}`);
            return;
        }

        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            if (path.extname(file) !== '.html') return;

            const screenshotRel = `./screenshots/${id}/${encodeURIComponent(file.replace('.html', '.png'))}`;
            const screenshotAbs = path.join(rootDir, 'screenshots', id, file.replace('.html', '.png'));
            const hasScreenshot = fs.existsSync(screenshotAbs);

            allDemos.push({
                name:       file,
                path:       `${id}/${file}`,
                folder:     id,
                label,
                icon,
                desc,
                cleanName:  file.replace('.html', '').replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                screenshot: hasScreenshot ? screenshotRel : null,
            });
        });
    });

    return allDemos;
}

// ─── HTML Generation ──────────────────────────────────────────────────────────

function generateHTML(demos) {
    const grouped = {};
    dirs.forEach(({ id, label, icon, desc }) => {
        const section = demos.filter(d => d.folder === id);
        if (section.length > 0) grouped[id] = { label, icon, desc, items: section };
    });

    const totalCount = demos.length;
    const sectionCount = Object.keys(grouped).length;
    const buildDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const sectionCardsHTML = Object.values(grouped).map(({ label, icon, desc, items }, sIdx) => {
        const cardItems = items.map(demo => `
            <a href="${demo.path}" class="card" data-name="${demo.cleanName.toLowerCase()} ${label.toLowerCase()}" target="_blank">
                <div class="card-thumb">
                    ${demo.screenshot
                        ? `<img src="${demo.screenshot}" alt="${demo.cleanName}" loading="lazy">`
                        : `<div class="card-thumb-placeholder"><span>${icon}</span></div>`
                    }
                    <div class="card-thumb-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Open Demo
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-name">${demo.cleanName}</div>
                    <code class="card-path">${demo.path}</code>
                </div>
            </a>`).join('');

        const rowItems = items.map(demo => `
            <a href="${demo.path}" class="row-item" data-name="${demo.cleanName.toLowerCase()} ${label.toLowerCase()}" target="_blank">
                <div class="row-icon">${icon}</div>
                <div class="row-info">
                    <span class="row-name">${demo.cleanName}</span>
                    <code class="row-path">${demo.path}</code>
                </div>
                <svg class="row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>`).join('');

        return `
        <section class="section" style="animation-delay: ${sIdx * 0.06}s">
            <div class="section-header">
                <div class="section-title-group">
                    <span class="section-icon">${icon}</span>
                    <div>
                        <h2 class="section-title">${label}</h2>
                        <p class="section-desc">${desc}</p>
                    </div>
                </div>
                <span class="section-badge">${items.length}</span>
            </div>
            <div class="grid view-grid">${cardItems}</div>
            <div class="list view-list hidden">${rowItems}</div>
        </section>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Demos — Aryan's UI Lab</title>
    <meta name="description" content="A curated index of ${totalCount} UI design prototypes across ${sectionCount} projects.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg:           #0a0a0a;
            --surface:      #141414;
            --surface-2:    #1a1a1a;
            --surface-h:    #222222;
            --border:       #2a2a2a;
            --border-h:     #444;
            --accent:       #d4f238;
            --accent-dim:   rgba(212,242,56,0.1);
            --text:         #ededed;
            --text-2:       #aaa;
            --text-3:       #666;
            --radius:       14px;
            --radius-sm:    8px;
            --font:         'Outfit', system-ui, sans-serif;
            --mono:         'JetBrains Mono', 'Fira Code', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: var(--font);
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        /* ── Layout ── */
        .wrapper { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

        /* ── Header ── */
        .site-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(10,10,10,0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
        }
        .header-inner {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1rem 0;
        }
        .logo {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #fff 40%, #888);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
        }
        .header-stats {
            display: flex;
            gap: 1rem;
            font-size: 0.75rem;
            color: var(--text-3);
        }
        .stat-pill {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 999px;
            padding: 0.25rem 0.75rem;
            color: var(--text-2);
        }
        .search-wrap {
            flex: 1;
            max-width: 380px;
            position: relative;
        }
        .search-icon {
            position: absolute;
            left: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-3);
            pointer-events: none;
        }
        #search {
            width: 100%;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 0.5rem 1rem 0.5rem 2.5rem;
            color: var(--text);
            font-family: var(--font);
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s;
        }
        #search::placeholder { color: var(--text-3); }
        #search:focus { border-color: var(--accent); }

        .view-btns {
            display: flex;
            gap: 0.375rem;
            margin-left: auto;
        }
        .view-btn {
            background: var(--surface);
            border: 1px solid var(--border);
            color: var(--text-3);
            padding: 0.4rem 0.7rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all 0.15s;
            display: flex;
            align-items: center;
        }
        .view-btn:hover { color: var(--text); border-color: var(--border-h); }
        .view-btn.active { color: var(--accent); border-color: var(--accent); background: var(--accent-dim); }

        /* ── Hero ── */
        .hero {
            padding: 4rem 0 3rem;
            text-align: center;
        }
        .hero h1 {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 700;
            letter-spacing: -0.03em;
            line-height: 1.1;
            background: linear-gradient(to bottom, #fff 40%, #555);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .hero p {
            color: var(--text-2);
            font-size: 1.1rem;
            max-width: 500px;
            margin: 0 auto;
            line-height: 1.6;
        }
        .build-date {
            margin-top: 1rem;
            font-size: 0.75rem;
            color: var(--text-3);
            font-family: var(--mono);
        }

        /* ── Sections ── */
        .sections { padding-bottom: 6rem; display: grid; gap: 4rem; }
        .section { animation: fadeUp 0.4s ease-out both; }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }
        .section-title-group { display: flex; align-items: center; gap: 0.875rem; }
        .section-icon { font-size: 1.5rem; }
        .section-title { font-size: 1.1rem; font-weight: 600; }
        .section-desc { font-size: 0.8rem; color: var(--text-3); margin-top: 0.15rem; }
        .section-badge {
            font-size: 0.7rem;
            font-weight: 600;
            background: var(--surface-2);
            border: 1px solid var(--border);
            color: var(--text-3);
            border-radius: 999px;
            padding: 0.2rem 0.6rem;
        }

        /* ── Grid View ── */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.25rem;
        }
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow: hidden;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.2s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-6px);
            border-color: var(--accent);
            box-shadow: 0 16px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-dim);
        }
        .card-thumb {
            position: relative;
            width: 100%;
            aspect-ratio: 16/10;
            background: var(--surface-2);
            overflow: hidden;
        }
        .card-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease, opacity 0.3s;
        }
        .card:hover .card-thumb img { transform: scale(1.04); }
        .card-thumb-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            background: repeating-linear-gradient(
                45deg,
                var(--surface-2),
                var(--surface-2) 10px,
                var(--surface) 10px,
                var(--surface) 20px
            );
        }
        .card-thumb-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.65);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--accent);
            opacity: 0;
            transition: opacity 0.2s;
        }
        .card:hover .card-thumb-overlay { opacity: 1; }
        .card-body { padding: 1rem 1.125rem; }
        .card-name {
            font-size: 0.925rem;
            font-weight: 600;
            margin-bottom: 0.3rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .card-path {
            font-size: 0.68rem;
            color: var(--text-3);
            font-family: var(--mono);
        }

        /* ── List View ── */
        .list { display: flex; flex-direction: column; gap: 0.375rem; }
        .row-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            text-decoration: none;
            color: inherit;
            transition: background 0.15s, border-color 0.15s, transform 0.15s;
        }
        .row-item:hover {
            background: var(--surface-h);
            border-color: var(--accent);
            transform: translateX(4px);
        }
        .row-icon { font-size: 1rem; flex-shrink: 0; }
        .row-info { flex: 1; min-width: 0; }
        .row-name { font-size: 0.875rem; font-weight: 500; display: block; }
        .row-path { font-size: 0.68rem; color: var(--text-3); font-family: var(--mono); }
        .row-arrow { color: var(--text-3); flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
        .row-item:hover .row-arrow { color: var(--accent); transform: translateX(3px); }

        /* ── Empty search state ── */
        .no-results {
            text-align: center;
            padding: 4rem 0;
            color: var(--text-3);
            display: none;
        }
        .no-results.visible { display: block; }

        /* ── Utilities ── */
        .hidden { display: none !important; }

        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
            .wrapper { padding: 0 1rem; }
            .header-stats { display: none; }
            .search-wrap { max-width: none; flex: 1; }
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Sticky Header -->
    <header class="site-header">
        <div class="wrapper header-inner">
            <span class="logo">UI Lab</span>
            <div class="header-stats">
                <span class="stat-pill">${totalCount} demos</span>
                <span class="stat-pill">${sectionCount} projects</span>
            </div>
            <div class="search-wrap">
                <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="search" id="search" placeholder="Search demos…" autocomplete="off">
            </div>
            <div class="view-btns">
                <button class="view-btn active" id="btn-grid" title="Grid view" aria-label="Grid view">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                </button>
                <button class="view-btn" id="btn-list" title="List view" aria-label="List view">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Hero -->
    <div class="wrapper">
        <div class="hero">
            <h1>Design Concepts</h1>
            <p>Experimental UI prototypes — video editors, LMS readers, portfolios, and more.</p>
            <p class="build-date">Generated ${buildDate} · ${totalCount} files across ${sectionCount} projects</p>
        </div>

        <!-- Sections -->
        <div class="sections" id="sections">
            ${sectionCardsHTML}
        </div>

        <div class="no-results" id="no-results">
            <p style="font-size:2rem;margin-bottom:0.5rem">🔍</p>
            <p>No demos match your search.</p>
        </div>
    </div>

    <script>
        const STORAGE_KEY = 'design-demos-view';
        const btnGrid   = document.getElementById('btn-grid');
        const btnList   = document.getElementById('btn-list');
        const search    = document.getElementById('search');
        const noResults = document.getElementById('no-results');

        // ── View toggle ──────────────────────────────────────────────────────
        function setView(mode) {
            const isGrid = mode === 'grid';
            btnGrid.classList.toggle('active', isGrid);
            btnList.classList.toggle('active', !isGrid);
            document.querySelectorAll('.view-grid').forEach(el => el.classList.toggle('hidden', !isGrid));
            document.querySelectorAll('.view-list').forEach(el => el.classList.toggle('hidden', isGrid));
            localStorage.setItem(STORAGE_KEY, mode);
        }

        btnGrid.addEventListener('click', () => setView('grid'));
        btnList.addEventListener('click', () => setView('list'));

        // Restore saved preference
        setView(localStorage.getItem(STORAGE_KEY) || 'grid');

        // ── Search / filter ───────────────────────────────────────────────────
        search.addEventListener('input', () => {
            const q = search.value.trim().toLowerCase();
            let totalVisible = 0;

            document.querySelectorAll('.section').forEach(section => {
                const cards = section.querySelectorAll('.card, .row-item');
                let sectionVisible = 0;

                cards.forEach(card => {
                    const match = !q || card.dataset.name.includes(q);
                    card.style.display = match ? '' : 'none';
                    if (match) sectionVisible++;
                });

                section.style.display = sectionVisible === 0 ? 'none' : '';
                totalVisible += sectionVisible;
            });

            noResults.classList.toggle('visible', totalVisible === 0);
        });
    </script>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const demos       = scanDirectories();
const htmlContent = generateHTML(demos);

fs.writeFileSync(outputFile, htmlContent, 'utf8');
console.log(`✅ Generated index.html — ${demos.length} demos across ${dirs.length} projects.`);
