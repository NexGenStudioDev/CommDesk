# 🎨 CommDesk Theme System — Developer Guide

> Everything you need to know about how theming works in CommDesk, how to use design tokens, trigger the theme toggle, and build new components that support both Light and Dark mode.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [How the Theme System Works](#how-the-theme-system-works)
3. [File Structure](#file-structure)
4. [Using the Theme in Components](#using-the-theme-in-components)
5. [Design Tokens Reference](#design-tokens-reference)
6. [Color Palette Reference](#color-palette-reference)
7. [CommDesk CSS Utility Classes](#commdesk-css-utility-classes)
8. [Theme Toggle](#theme-toggle)
9. [Adding a New Component](#adding-a-new-component)
10. [Common Mistakes](#common-mistakes)
11. [Quick Reference](#quick-reference)

---

## Overview

CommDesk uses a **two-layer theming architecture**:

| Layer | File | Purpose |
|---|---|---|
| **CSS Variables** | `src/App.css` | Actual color values for light/dark. Single source of truth for colors. |
| **TypeScript Tokens** | `src/theme/theme.config.ts` | Typed bridge — maps CSS variables to readable property names |
| **Provider** | `src/theme/provider.tsx` | Manages mode state, persists to localStorage, applies `.dark` to `<html>` |
| **Hook** | `src/theme/hooks/useTheme.ts` | Access tokens and controls in any component |
| **Palette** | `src/theme/colors.ts` | Raw color palette (blue, purple, gray, etc.) used by App.css |

**How they connect:**

```
App.css          → defines --cd-* CSS variables for :root and .dark
theme.config.ts  → maps "theme.text.primary" → "var(--cd-text)"
provider.tsx     → toggles .dark on <html>, persists choice, exposes tokens
useTheme()       → gives any component access to { theme, mode, toggle, setMode }
```

---

## How the Theme System Works

```
User clicks ThemeToggle
        ↓
toggle() in useTheme() is called
        ↓
provider.tsx adds/removes .dark class on <html>
        ↓
CSS variables in :root (light) or .dark (dark) take effect
        ↓
All components using theme tokens or var(--cd-*) update automatically
        ↓
Choice saved to localStorage → persists on refresh
```

### System Theme Detection

On first load, if no saved preference exists, the system automatically detects the user's OS preference:

```ts
// Inside provider.tsx — runs before any render
function resolveInitialMode(): ThemeMode {
  const stored = localStorage.getItem("commdesk-theme");
  if (stored === "light" || stored === "dark") return stored;

  // Fall back to OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
```

### Flash Prevention

To prevent a white flash before the theme loads, `App.css` sets:

```css
html { color-scheme: light; }
html.dark { color-scheme: dark; }
```

---

## File Structure

```
src/theme/
├── hooks/
│   └── useTheme.ts        ← Hook to use in components
├── colors.ts              ← Raw palette (blue, gray, charcoal, etc.)
├── index.ts               ← Re-exports everything
├── provider.tsx           ← ThemeProvider component
├── shadows.ts             ← Shadow tokens
├── spacing.ts             ← Spacing tokens
├── theme.config.ts        ← Typed token map (THE main file)
└── typography.ts          ← Typography tokens

src/config/
└── them.config.ts         ← ⚠️ DELETED — do not use this file

src/
└── App.css                ← CSS variable definitions for :root and .dark
```

> ⚠️ `src/config/them.config.ts` (note the typo: `them` not `theme`) was an old broken file that has been **deleted**. Any import from this path will throw an error. Use `src/theme/` instead.

---

## Using the Theme in Components

### Step 1 — Import the hook

```tsx
import { useTheme } from "@/theme/hooks/useTheme";
```

### Step 2 — Destructure what you need

```tsx
const { theme, mode, toggle, setMode } = useTheme();
```

| Property | Type | Description |
|---|---|---|
| `theme` | `ThemeTokens` | Typed design tokens object |
| `mode` | `"light" \| "dark"` | Current active theme mode |
| `toggle` | `() => void` | Switch between light and dark |
| `setMode` | `(mode) => void` | Explicitly set a mode |

### Step 3 — Use tokens in JSX

```tsx
const MyCard = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.bg.surface,
        border: `1px solid ${theme.border.default}`,
        color: theme.text.primary,
      }}
    >
      <p style={{ color: theme.text.secondary }}>Subtitle</p>
      <span style={{ color: theme.success.default }}>Active</span>
    </div>
  );
};
```

### Alternative — CSS Variables directly (for simple cases)

```tsx
// Works fine for one-off styles
<div style={{ background: "var(--cd-surface)", color: "var(--cd-text)" }}>
  Hello
</div>

// Tailwind arbitrary values
<div className="bg-[var(--cd-surface)] text-[var(--cd-text)] border-[var(--cd-border)]">
  Hello
</div>
```

> 💡 **Which to use?**
> - Use `useTheme()` tokens when building reusable components — TypeScript will catch typos.
> - Use `var(--cd-*)` directly for quick one-off inline styles or Tailwind classes.
> - **Never** hardcode color values like `"#ffffff"` or Tailwind classes like `"text-gray-900"`.

---

## Design Tokens Reference

All tokens come from `src/theme/theme.config.ts`. Access them via `theme.*` after calling `useTheme()`.

### Backgrounds — `theme.bg.*`

| Token | CSS Variable | Usage |
|---|---|---|
| `theme.bg.page` | `var(--cd-bg)` | Full page background |
| `theme.bg.surface` | `var(--cd-surface)` | Cards, panels, modals |
| `theme.bg.surfaceSecondary` | `var(--cd-surface-2)` | Inputs, tags, table rows |
| `theme.bg.surfaceTertiary` | `var(--cd-surface-3)` | Hover fills, subtle nested sections |

### Text — `theme.text.*`

| Token | CSS Variable | Usage |
|---|---|---|
| `theme.text.primary` | `var(--cd-text)` | Main body text |
| `theme.text.secondary` | `var(--cd-text-2)` | Labels, supporting text |
| `theme.text.muted` | `var(--cd-text-muted)` | Placeholders, disabled, hints |
| `theme.text.inverse` | `"#ffffff"` | Text on colored/dark backgrounds |

### Borders — `theme.border.*`

| Token | CSS Variable | Usage |
|---|---|---|
| `theme.border.default` | `var(--cd-border)` | Card, input, modal borders |
| `theme.border.subtle` | `var(--cd-border-subtle)` | Table row dividers, inner sections |

### Primary Brand — `theme.primary.*`

| Token | CSS Variable | Usage |
|---|---|---|
| `theme.primary.default` | `var(--cd-primary)` | Buttons, links, active nav |
| `theme.primary.hover` | `var(--cd-primary-hover)` | Button hover state |
| `theme.primary.subtle` | `var(--cd-primary-subtle)` | Badge backgrounds, focus rings |
| `theme.primary.text` | `var(--cd-primary-text)` | Text on primary-subtle backgrounds |

### Status — `theme.success / warning / danger`

| Token | Usage |
|---|---|
| `theme.success.default` | Success text, icons |
| `theme.success.subtle` | Success badge backgrounds |
| `theme.warning.default` | Warning text, icons |
| `theme.warning.subtle` | Warning badge backgrounds |
| `theme.danger.default` | Error text, destructive actions |
| `theme.danger.subtle` | Error badge backgrounds |

### Other Tokens

| Token | Usage |
|---|---|
| `theme.secondary.default` | Purple brand accent |
| `theme.accent.default` | Cyan accent |
| `theme.interactive.hover` | Row/item hover background |
| `theme.shadow.sm` | Card default shadow |
| `theme.shadow.md` | Card elevated/hover shadow |

---

## Color Palette Reference

Raw palette values live in `src/theme/colors.ts`. These feed into `App.css` and are **not meant to be used directly in components** — use `theme.*` tokens instead.

Available palettes: `blue`, `purple`, `cyan`, `green`, `yellow`, `red`, `orange`, `gray`, `charcoal`

```ts
import { palette } from "@/theme/colors";

palette.blue[600]      // #2563eb  (light primary)
palette.blue[500]      // #3b82f6  (dark primary)
palette.gray[50]       // #f8fafc  (light background)
palette.charcoal[900]  // #0f1320  (dark background)
palette.charcoal[800]  // #1a1f2e  (dark surface)
```

> ✅ Prefer `theme.*` tokens in components. Raw palette values don't auto-switch with the theme.

---

## CommDesk CSS Utility Classes

Pre-built classes defined in `src/App.css`. They use CSS variables internally and automatically respond to theme changes — no extra code needed.

### Cards

```tsx
<div className="cd-card">Basic card</div>
<div className="cd-card cd-card-hover">Card with hover lift effect</div>
```

### Badges

```tsx
<span className="cd-badge cd-badge-success">Active</span>
<span className="cd-badge cd-badge-warning">Pending</span>
<span className="cd-badge cd-badge-danger">Rejected</span>
<span className="cd-badge cd-badge-primary">Featured</span>
<span className="cd-badge cd-badge-neutral">Draft</span>
```

### Buttons

```tsx
<button className="cd-btn cd-btn-primary">Save</button>
<button className="cd-btn cd-btn-secondary">Cancel</button>
<button className="cd-btn cd-btn-ghost">More</button>
<button className="cd-btn cd-btn-danger">Delete</button>
```

### Inputs

```tsx
<input className="cd-input" placeholder="Enter value..." />
```

### Navigation Links

```tsx
<a href="/dashboard" className="cd-nav-link active">Dashboard</a>
<a href="/members" className="cd-nav-link">Members</a>
```

The `.active` class automatically applies the primary highlight style.

### Tables

```tsx
<table className="cd-table">
  <thead>
    <tr><th>Name</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td><span className="cd-badge cd-badge-success">Active</span></td>
    </tr>
  </tbody>
</table>
```

### Other Utilities

```tsx
<div className="cd-page">          {/* Full page background */}
<div className="cd-metric">        {/* Stat/metric box */}
<div className="cd-glass">         {/* Glassmorphism surface */}
<h3 className="cd-section-title">  {/* Section heading */}
<p className="cd-text-muted">      {/* Muted paragraph text */}
<div className="cd-sidebar">       {/* Sidebar wrapper */}
```

---

## Theme Toggle

### Using the Built-in Toggle Component

```tsx
import ThemeToggle from "@/Component/ui/ThemeToggle";

// Drop anywhere — Navbar, Sidebar, Settings page
<ThemeToggle />
```

### Building a Custom Toggle

```tsx
import { useTheme } from "@/theme/hooks/useTheme";

const MyToggle = () => {
  const { mode, toggle, setMode } = useTheme();

  return (
    <div>
      <p>Current: {mode}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setMode("light")}>☀️ Light</button>
      <button onClick={() => setMode("dark")}>🌙 Dark</button>
    </div>
  );
};
```

### Reset to System Preference

```tsx
// Clears saved preference — next load auto-detects OS theme
localStorage.removeItem("commdesk-theme");
window.location.reload();
```

### Conditional Logic Based on Mode

```tsx
const { mode } = useTheme();
const isDark = mode === "dark";

// Only use for JS-level logic — charts, canvas, third-party libraries
const chartLineColor = isDark ? "#60a5fa" : "#2563eb";
```

> 💡 For styling, always prefer `theme.*` tokens. Use `mode` only when JavaScript needs to branch (e.g. Recharts colors, canvas fill).

---

## Adding a New Component

### ✅ Recommended approach — use theme tokens

```tsx
import { useTheme } from "@/theme/hooks/useTheme";

const EventCard = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.bg.surface,
        border: `1px solid ${theme.border.default}`,
        borderRadius: "1rem",
        padding: "1.25rem",
        boxShadow: `0 1px 3px ${theme.shadow.sm}`,
      }}
    >
      <h3 style={{ color: theme.text.primary }}>Event Name</h3>
      <p style={{ color: theme.text.secondary }}>Details here</p>
      <span
        className="cd-badge"
        style={{
          background: theme.success.subtle,
          color: theme.success.default,
        }}
      >
        Active
      </span>
    </div>
  );
};
```

### ✅ Simpler approach — use utility classes

```tsx
const EventCard = () => (
  <div className="cd-card">
    <h3 className="cd-section-title">Event Name</h3>
    <p className="cd-text-muted">Details here</p>
    <span className="cd-badge cd-badge-success">Active</span>
  </div>
);
```

### Pre-PR Checklist

Before opening a PR, verify your component in both themes:

- [ ] Toggled to dark mode — no hardcoded light colors visible
- [ ] Toggled to light mode — no hardcoded dark colors visible
- [ ] No `#ffffff`, `#111827`, or similar hex values in JSX
- [ ] No `bg-white`, `text-gray-*`, `border-gray-*` Tailwind classes
- [ ] No import from `../../config/them.config` (deleted file)
- [ ] Using `theme.*` tokens or `var(--cd-*)` for all colors

---

## Common Mistakes

### ❌ 1. Hardcoded colors

```tsx
// ❌ Breaks in dark mode
<div style={{ background: "#ffffff", color: "#1e293b" }}>

// ✅ Correct
const { theme } = useTheme();
<div style={{ background: theme.bg.surface, color: theme.text.primary }}>
```

### ❌ 2. Static Tailwind color classes

```tsx
// ❌ Breaks in dark mode
<div className="bg-white text-gray-900 border-gray-200">

// ✅ Correct
<div className="bg-[var(--cd-surface)] text-[var(--cd-text)] border-[var(--cd-border)]">
```

### ❌ 3. Importing from the deleted config file

```tsx
// ❌ File is deleted — throws "module not found"
import { getTheme } from "../../config/them.config";

// ✅ Correct
import { useTheme } from "@/theme/hooks/useTheme";
const { theme } = useTheme();
```

### ❌ 4. Using next-themes directly in components

```tsx
// ❌ Wrong — bypasses CommDesk's typed token system
import { useTheme } from "next-themes";

// ✅ Correct — use CommDesk's own hook
import { useTheme } from "@/theme/hooks/useTheme";
```

### ❌ 5. @apply with custom classes in Tailwind v4

```css
/* ❌ Tailwind v4 doesn't support @apply on custom-defined classes */
.my-class { @apply cd-card; }

/* ✅ Copy the CSS properties directly */
.my-class {
  background-color: var(--cd-surface);
  border: 1px solid var(--cd-border);
  border-radius: 1rem;
}
```

### ❌ 6. ThemeProvider placed inside a route

```tsx
// ❌ Login page won't have theme support
<BrowserRouter>
  <Route path="/login" element={<Login />} />
  <ThemeProvider>
    <Route path="/dashboard" element={<Dashboard />} />
  </ThemeProvider>
</BrowserRouter>

// ✅ Wrap the entire app
<ThemeProvider>
  <BrowserRouter>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </BrowserRouter>
</ThemeProvider>
```

---

## Quick Reference

### Token → CSS Variable mapping

| `theme.*` token | CSS Variable | Use for |
|---|---|---|
| `theme.bg.page` | `var(--cd-bg)` | Page background |
| `theme.bg.surface` | `var(--cd-surface)` | Cards, panels |
| `theme.bg.surfaceSecondary` | `var(--cd-surface-2)` | Inputs, rows |
| `theme.bg.surfaceTertiary` | `var(--cd-surface-3)` | Nested fills |
| `theme.text.primary` | `var(--cd-text)` | Main text |
| `theme.text.secondary` | `var(--cd-text-2)` | Labels |
| `theme.text.muted` | `var(--cd-text-muted)` | Placeholders |
| `theme.border.default` | `var(--cd-border)` | Borders |
| `theme.border.subtle` | `var(--cd-border-subtle)` | Dividers |
| `theme.primary.default` | `var(--cd-primary)` | Brand blue |
| `theme.primary.hover` | `var(--cd-primary-hover)` | Button hover |
| `theme.primary.subtle` | `var(--cd-primary-subtle)` | Badge bg |
| `theme.primary.text` | `var(--cd-primary-text)` | Badge text |
| `theme.interactive.hover` | `var(--cd-hover)` | Row hover bg |
| `theme.success.default` | `var(--cd-success)` | Success text |
| `theme.success.subtle` | `var(--cd-success-subtle)` | Success bg |
| `theme.warning.default` | `var(--cd-warning)` | Warning text |
| `theme.warning.subtle` | `var(--cd-warning-subtle)` | Warning bg |
| `theme.danger.default` | `var(--cd-danger)` | Error/danger |
| `theme.danger.subtle` | `var(--cd-danger-subtle)` | Error bg |
| `theme.shadow.sm` | `var(--cd-shadow)` | Card shadow |
| `theme.shadow.md` | `var(--cd-shadow-md)` | Hover shadow |

### Hook returns

```ts
const { theme, mode, toggle, setMode } = useTheme();
//      ↑       ↑      ↑       ↑
//   tokens  "light"  fn()   fn(mode)
//            "dark"
```

### CSS Utility classes cheatsheet

| Class | Use |
|---|---|
| `cd-card` | Card container |
| `cd-card-hover` | Add hover lift to card |
| `cd-btn cd-btn-primary` | Primary button |
| `cd-btn cd-btn-secondary` | Secondary button |
| `cd-btn cd-btn-ghost` | Ghost/text button |
| `cd-btn cd-btn-danger` | Danger button |
| `cd-badge cd-badge-success` | Green badge |
| `cd-badge cd-badge-warning` | Yellow badge |
| `cd-badge cd-badge-danger` | Red badge |
| `cd-badge cd-badge-primary` | Blue badge |
| `cd-badge cd-badge-neutral` | Gray badge |
| `cd-input` | Styled input |
| `cd-table` | Styled table |
| `cd-nav-link` | Sidebar nav link |
| `cd-nav-link active` | Active nav link |
| `cd-page` | Page wrapper background |
| `cd-section-title` | Section heading |
| `cd-text-muted` | Muted paragraph |
| `cd-glass` | Glassmorphism panel |
| `cd-metric` | Stat metric box |

---

> 📌 **Files to edit when changing the theme:**
> - Color values → `src/App.css` (`:root` and `.dark` CSS variables)
> - Add/rename a token → `src/theme/theme.config.ts` (TypeScript will show everywhere to update)
> - Raw palette → `src/theme/colors.ts`
> - Toggle component → `src/Component/ui/ThemeToggle.tsx`
> - Provider logic → `src/theme/provider.tsx`