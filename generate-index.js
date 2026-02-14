const fs = require('fs');
const path = require('path');

const targetDirs = [
    'brutalism', 
    'landing-pages', 
    'zero-gravity', 
    'zero-gravity-v2'
];

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'index.html');

function scanDirectories() {
    let allBytes = [];
    
    targetDirs.forEach(dir => {
        const fullPath = path.join(rootDir, dir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath);
            files.forEach(file => {
                if (path.extname(file) === '.html') {
                    allBytes.push({
                        name: file,
                        path: `${dir}/${file}`,
                        folder: dir,
                        cleanName: file.replace('.html', '').replace(/[-_]/g, ' ')
                    });
                }
            });
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    });
    
    return allBytes;
}

function generateHTML(demos) {
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
            --accent: #d4f238; /* Acid green/yellow for a modern pop */
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
            max-width: 1200px;
            margin: 0 auto 3rem auto;
            text-align: center;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
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
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            gap: 3rem;
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
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            background: var(--surface-hover);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }

        .card-content {
            z-index: 1;
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
        }

        .card-icon {
            margin-top: 1.5rem;
            display: flex;
            justify-content: flex-end;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
            color: var(--accent);
        }

        .card:hover .card-icon {
            opacity: 1;
            transform: translateX(0);
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
    <title>Design Demos Index</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <header>
        <h1>Design Concepts</h1>
        <p class="subtitle">Index of all experimental pages and prototypes</p>
    </header>

    <main>
        ${Object.keys(grouped).map((folder, index) => `
            <section style="animation-delay: ${index * 0.1}s">
                <div class="section-title">${folder}</div>
                <div class="grid">
                    ${grouped[folder].map(demo => `
                        <a href="${demo.path}" class="card">
                            <div class="card-content">
                                <div class="card-title">${demo.cleanName}</div>
                                <div class="card-path">${demo.path}</div>
                            </div>
                            <div class="card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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

const demos = scanDirectories();
const htmlContent = generateHTML(demos);

fs.writeFileSync(outputFile, htmlContent);
console.log(`Generated index.html with ${demos.length} files.`);

