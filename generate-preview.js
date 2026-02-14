const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const targetDirs = [
    'brutalism', 
    'landing-pages', 
    'zero-gravity', 
    'zero-gravity-v2'
];

const rootDir = __dirname;
const outputHtmlFile = path.join(rootDir, 'index-preview.html');
const screenshotsDir = path.join(rootDir, 'screenshots');

async function scanDirectories() {
    let allDemos = [];
    
    targetDirs.forEach(dir => {
        const fullPath = path.join(rootDir, dir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath);
            files.forEach(file => {
                if (path.extname(file) === '.html') {
                    allDemos.push({
                        name: file,
                        path: `${dir}/${file}`,
                        fullPath: path.join(fullPath, file),
                        folder: dir,
                        cleanName: file.replace('.html', '').replace(/[-_]/g, ' ')
                    });
                }
            });
        }
    });
    
    return allDemos;
}

async function captureScreenshots(demos) {
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    const browser = await puppeteer.launch({
        // Add this line to use your installed Chrome:
        channel: 'chrome', 
        // If that doesn't work, explicitly point to the file:
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`Starting capture of ${demos.length} demos...`);

    for (const [index, demo] of demos.entries()) {
        const demoScreenshotDir = path.join(screenshotsDir, demo.folder);
        if (!fs.existsSync(demoScreenshotDir)) {
            fs.mkdirSync(demoScreenshotDir);
        }

        const screenshotPath = path.join(demoScreenshotDir, demo.name.replace('.html', '.png'));
        const relativeScreenshotPath = `./screenshots/${demo.folder}/${encodeURIComponent(demo.name.replace('.html', '.png'))}`;
        
        // Check if screenshot already exists to skip (optional, but good for speed)
        // For now we'll overwrite to ensure fresh state
        
        try {
            console.log(`[${index + 1}/${demos.length}] Capturing ${demo.path}...`);
            await page.goto(`file://${demo.fullPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Wait a bit for animations
            await new Promise(r => setTimeout(r, 1000));
            
            await page.screenshot({ path: screenshotPath, type: 'png' });
            demo.screenshot = relativeScreenshotPath;
        } catch (err) {
            console.error(`Failed to capture ${demo.path}:`, err.message);
            demo.screenshot = null; // Handle missing screenshot in HTML
        }
    }

    await browser.close();
    return demos;
}

function generatePreviewHTML(demos) {
    const grouped = demos.reduce((acc, demo) => {
        if (!acc[demo.folder]) acc[demo.folder] = [];
        acc[demo.folder].push(demo);
        return acc;
    }, {});

    const css = `
        :root {
            --bg: #0a0a0a;
            --surface: #141414;
            --surface-hover: #1f1f1f;
            --border: #333;
            --accent: #d4f238;
            --text: #ededed;
            --text-muted: #888;
            --font-main: 'Outfit', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: var(--font-main);
            min-height: 100vh;
            padding: 2rem;
            -webkit-font-smoothing: antialiased;
        }

        header {
            max-width: 1400px;
            margin: 0 auto 3rem auto;
            text-align: center;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            position: relative;
        }

        .view-toggle {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 1rem;
        }

        .view-btn {
            background: var(--surface);
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s;
        }

        .view-btn.active {
            color: var(--accent);
            border-color: var(--accent);
        }

        .view-btn:hover {
            background: var(--surface-hover);
            color: var(--text);
        }

        h1 {
            font-size: 3rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #fff, #888);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p.subtitle {
            color: var(--text-muted);
            font-size: 1.1rem;
        }

        main {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            gap: 4rem;
        }

        section {
            animation: fadeIn 0.5s ease-out forwards;
        }

        .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border);
            opacity: 0.5;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            group;
        }

        .card:hover {
            transform: translateY(-8px);
            border-color: var(--accent);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }

        .card-image {
            width: 100%;
            height: 200px;
            background: var(--surface-hover);
            object-fit: cover;
            border-bottom: 1px solid var(--border);
            transition: opacity 0.3s ease;
        }
        
        .card-image.placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            font-size: 0.875rem;
        }

        .card:hover .card-image {
            opacity: 0.9;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.3;
            margin-bottom: 0.5rem;
            text-transform: capitalize;
        }

        .card-path {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-family: monospace;
            opacity: 0.7;
            margin-bottom: 1rem;
        }
        
        .card-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
        }

        .try-btn {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--accent);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .card:hover .try-btn {
            opacity: 1;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Demos Preview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <header>
        <h1>Design Concepts</h1>
        <p class="subtitle">Visual preview of experimental pages and prototypes</p>
        
        <div class="view-toggle">
            <a href="index.html" class="view-btn">List View</a>
            <a href="index-preview.html" class="view-btn active">Grid Preview</a>
        </div>
    </header>

    <main>
        ${Object.keys(grouped).map((folder, index) => `
            <section style="animation-delay: ${index * 0.1}s">
                <div class="section-title">${folder}</div>
                <div class="grid">
                    ${grouped[folder].map(demo => `
                        <a href="${demo.path}" class="card">
                            ${demo.screenshot 
                                ? `<img src="${demo.screenshot}" alt="${demo.cleanName}" class="card-image" loading="lazy">` 
                                : `<div class="card-image placeholder">No Preview Available</div>`
                            }
                            <div class="card-content">
                                <div class="card-title">${demo.cleanName}</div>
                                <div class="card-path">${demo.path}</div>
                                <div class="card-actions">
                                    <span class="try-btn">
                                        View Demo 
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><arrow-right/></svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </section>
        `).join('')}
    </main>
</body>
</html>`;

    return html;
}

(async () => {
    try {
        const demos = await scanDirectories();
        const demosWithScreenshots = await captureScreenshots(demos);
        const htmlContent = generatePreviewHTML(demosWithScreenshots);
        
        fs.writeFileSync(outputHtmlFile, htmlContent);
        console.log(`Generated index-preview.html with ${demos.length} demos.`);
    } catch (error) {
        console.error('Error generating preview:', error);
    }
})();
