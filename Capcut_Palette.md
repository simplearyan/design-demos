# The Perfect Dark UI Color Schema

This color system is specifically engineered for professional, long-session desktop applications (like video editors, IDEs, or 3D software). It uses a deep, true-dark neutral foundation to minimize eye strain, paired with a highly vibrant, high-contrast neon accent color to guide the user's focus.

---

## 1. Surfaces & Backgrounds (The Foundation — 60%)
In a professional dark UI, you should rarely use pure black (`#000000`). Instead, we use a staggered scale of very dark grays to create physical depth. The deeper the color, the further back in space it feels.

| Usage | Hex Code | Description |
| :--- | :--- | :--- |
| **App Background** | `#0a0a0a` | The deepest background. Used for the main window and outer framing. |
| **Timeline / Inputs** | `#0f0f0f` | Slightly elevated. Used for timeline tracks or deep input fields. |
| **Panels / Surfaces** | `#141414` | The primary surface color for sidebars, inspector panels, and modals. |
| **Hover / Elevated** | `#222222` | Used for hover states on buttons, or slightly elevated UI components. |

---

## 2. Primary Accent (The Action — 10%)
This is the most important color in the application. In a dark UI, the primary accent should be vibrant and highly saturated. We are using a punchy **"Neon Cyan"**.

| Usage | Hex Code | Description |
| :--- | :--- | :--- |
| **Primary Base** | `#00f0d1` | The main brand color (Export buttons, active tabs, timeline playhead). |
| **Primary Hover** | `#00d6b9` | A slightly deeper shade used for button hover states. |
| **Active Muted** | `#113333` | A very dark, desaturated version. Perfect for selected item backgrounds. |

---

## 3. Typography & Borders (The Structure — 30%)
High contrast is crucial, but pure white text on dark backgrounds can cause "halation" (eye-straining glow). We use a crisp off-white for main text and a softer gray for secondary elements.

| Usage | Hex Code | Tailwind Eq. | Description |
| :--- | :--- | :--- | :--- |
| **Text Main** | `#f3f4f6` | `gray-100` | Crisp, readable text for headings, values, and active menu items. |
| **Text Muted** | `#9ca3af` | `gray-400` | Secondary text, inactive icons, timestamps, and placeholders. |
| **Borders/Dividers** | `#222222` | `neutral-800` | Subtle borders to separate panels without cluttering the UI. |

---

## 4. Semantic / Feedback (The Communicators)
Users rely on standard semantic colors to understand system status. These are adjusted to "pop" on dark backgrounds.

| Usage | Hex Code | Description |
| :--- | :--- | :--- |
| 🔴 **Danger / Record** | `#ef4444` | Deleting clips, error messages, or the pulsing "Recording" indicator. |
| ⚠️ **Warning** | `#f59e0b` | Missing media files, cautionary alerts. |
| ✅ **Success** | `#10b981` | Successful export notifications, positive feedback. |

> [!IMPORTANT]
> **Eye Strain Protection:** When designing for dark mode, avoid using pure `#ffffff` for large blocks of text. Stick to `#f3f4f6` or `#e5e7eb` to keep the experience comfortable for multi-hour sessions.

---

## 💻 Tailwind CSS Integration
To implement this exact visual hierarchy in your codebase, drop this configuration into your `tailwind.config` file:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        // The Dark Studio Theme
        cc: {
          bg: '#0a0a0a',        // Deepest background
          track: '#0f0f0f',     // Secondary recessed background
          panel: '#141414',     // Main surface/panel background
          hover: '#222222',     // Hover states
          border: '#222222',    // Clean, subtle borders
          
          cyan: '#00f0d1',      // Punchy modern accent
          cyanHover: '#00d6b9', // Accent hover
          clip: '#113333',      // Selected item/clip background
          
          textMain: '#f3f4f6',  // Primary crisp text
          textMuted: '#9ca3af', // Secondary/inactive text
        }
      }
    }
  }
}
```

