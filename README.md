# Design Demos

A collection of experimental design concepts, prototypes, and landing pages.

## Live Demo

[View the Live Index](https://simplearyan.github.io/design-demos/)  

## Structure

The project is organized into several categories:
- **brutalism**: Raw, bold, and experimental layouts.
- **landing-pages**: High-conversion landing page concepts.
- **zero-gravity**: Floating, ethereal, and gravity-defying designs.
- **zero-gravity-v2**: The next evolution of the zero-gravity concept.

## Development

This repository includes a script to automatically generate the `index.html` dashboard.

### Adding New Demos
1. Create your HTML file in the appropriate subdirectory (or create a new one).
2. Run the index generator script.

### Generating the Index
To update the main `index.html` file, run:

```bash
node generate-index.js
```

This script scans all subdirectories for `.html` files and rebuilds the dashboard with links to them.

## Deployment

This repository is configured to automatically deploy to GitHub Pages on every push to the `master` branch. The workflow:
1. Checks out the code.
2. Runs `node generate-index.js` to ensure the index is fresh.
3. Uploads the content to GitHub Pages.

> **Important**: Ensure GitHub Pages is enabled in your repository settings (Settings > Pages), with "GitHub Actions" selected as the source.
