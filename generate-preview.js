/**
 * generate-preview.js
 * Captures Puppeteer screenshots for all demos and regenerates index.html.
 *
 * Usage:
 *   node generate-preview.js          ← Skip files that already have screenshots
 *   node generate-preview.js --force  ← Re-capture all screenshots
 *   npm run preview
 *   npm run preview:force
 */
const fs        = require('fs');
const path      = require('path');
const puppeteer = require('puppeteer');
const { dirs }  = require('./_config');

const rootDir        = __dirname;
const screenshotsDir = path.join(rootDir, 'screenshots');
const FORCE          = process.argv.includes('--force');

// ─── Scanner ──────────────────────────────────────────────────────────────────

async function scanDirectories() {
    const allDemos = [];

    dirs.forEach(({ id, label, icon }) => {
        const fullPath = path.join(rootDir, id);
        if (!fs.existsSync(fullPath)) {
            console.warn(`[warn] Directory not found: ${id}`);
            return;
        }

        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            if (path.extname(file) !== '.html') return;
            allDemos.push({
                name:     file,
                path:     `${id}/${file}`,
                fullPath: path.join(fullPath, file),
                folder:   id,
                label,
                icon,
            });
        });
    });

    return allDemos;
}

// ─── Screenshot Capture ───────────────────────────────────────────────────────

async function captureScreenshots(demos) {
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

    // Determine which demos need capturing
    const toCapture = demos.filter(demo => {
        const pngPath = path.join(screenshotsDir, demo.folder, demo.name.replace('.html', '.png'));
        return FORCE || !fs.existsSync(pngPath);
    });

    if (toCapture.length === 0) {
        console.log('✅ All screenshots are up to date. Use --force to regenerate.');
        return;
    }

    console.log(`📸 Capturing ${toCapture.length} screenshot(s)${FORCE ? ' (forced)' : ' (new only)'}…`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const [i, demo] of toCapture.entries()) {
        const folderPath = path.join(screenshotsDir, demo.folder);
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        const pngPath = path.join(folderPath, demo.name.replace('.html', '.png'));

        try {
            console.log(`  [${i + 1}/${toCapture.length}] ${demo.path}`);
            await page.goto(`file://${demo.fullPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
            await new Promise(r => setTimeout(r, 800)); // let animations settle
            await page.screenshot({ path: pngPath, type: 'png' });
        } catch (err) {
            console.error(`  ✖ Failed: ${demo.path} — ${err.message}`);
        }
    }

    await browser.close();
    console.log(`✅ Done capturing. Skipped: ${demos.length - toCapture.length} (already exist).`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
    try {
        const demos = await scanDirectories();
        await captureScreenshots(demos);

        // Re-run the index generator to pick up new screenshots
        console.log('\n🔄 Regenerating index.html…');
        require('./generate-index');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
