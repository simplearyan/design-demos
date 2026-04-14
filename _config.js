/**
 * _config.js — Single source of truth for the design-demos build system.
 *
 * Adding a new project directory?
 *   1. Add an entry to `dirs` below.
 *   2. Run `npm run build` locally.
 *   3. Commit & push — done.
 */
module.exports = {
    dirs: [
        {
            id: 'brutalism',
            label: 'Brutalism',
            icon: '💣',
            desc: 'Raw, editorial brutalist UI experiments'
        },
        {
            id: 'capcut-clone-deisng',
            label: 'CapCut Clone',
            icon: '🎬',
            desc: 'Pro video editor UI clones & variants'
        },
        {
            id: 'flourish-design',
            label: 'Flourish Design',
            icon: '📊',
            desc: 'Data viz studio UI inspired by Flourish'
        },
        {
            id: 'gemini-lms',
            label: 'Gemini LMS',
            icon: '📚',
            desc: 'Course reader & LMS UI iterations'
        },
        {
            id: 'kenichi-animation-studio',
            label: 'Kenichi Studio',
            icon: '🎨',
            desc: 'Animation studio app design evolution'
        },
        {
            id: 'landing-pages',
            label: 'Landing Pages',
            icon: '🌐',
            desc: 'General marketing & personal landing pages'
        },
        {
            id: 'personal-notes-site',
            label: 'Personal Notes',
            icon: '📝',
            desc: 'Multi-page personal notes & portfolio site'
        },
        {
            id: 'pol-math',
            label: 'Pol-Math',
            icon: '🔢',
            desc: 'Math-focused educational tool iterations'
        },
        {
            id: 'zero-gravity',
            label: 'Zero Gravity',
            icon: '🌌',
            desc: 'Personal portfolio v1 — space theme'
        },
        {
            id: 'zero-gravity-v2',
            label: 'Zero Gravity V2',
            icon: '✨',
            desc: 'Full redesign iteration of Zero Gravity'
        },
    ]
};
