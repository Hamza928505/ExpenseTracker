# 💰 ExpenseTracker

A fully client-side personal finance web app — track income and expenses by category, visualise spending with interactive charts, and manage your budget on any device from phone to desktop.

> **No accounts. No servers. No tracking. Your data stays in your browser.**

---

## ✨ Features

- **Home** — bright-green balance panel showing the month's net balance in every currency you keep, money in / money out cards, and three interactive Chart.js visualisations (monthly flow, category split, whole-month split)
- **Multi-currency balance** — pick a main currency and as many others as you like; each flies its country's flag under the balance, and tapping one (or the balance itself) re-denominates the whole page instantly — `JD 1,271.60` → `$1,792.96`. Rates are cached, so switching works offline
- **Your own categories** — add money-in and money-out categories with a name, an icon from 40 line icons, and a colour. They appear in the add sheet, the filter chips, the breakdown and the charts exactly like the built-ins
- **Transactions** — horizontally scrollable filter chip bar built from your live category list (mouse-drag on desktop, touch on mobile), activity list grouped by day (Today / Yesterday / date) with a category icon per row, delete per entry
- **Settings** — dark / light mode toggle, main and display currency with flags, quick-switch currency list, category management, live data stats, currency converter, and a separated danger zone
- **Add Transaction** — bottom sheet on mobile, centred dialog from `md` up; money in / money out segmented control, amount with currency affix, a visual category picker, date, and repeat-monthly. Amounts typed while viewing another currency are converted to the main one before they are stored
- **Month navigation** — browse any past or future month via the topbar pill
- **Responsive** — Bootstrap 5 grid across all six breakpoints (`xs` → `xxl`); sidebar on desktop (≥ 992 px), bottom nav on mobile
- **PWA / Add to Home Screen** — `manifest.json` + full icon set for iOS and Android

---

## 🗂 File Structure

```
expense-tracker/
│
├── index.html              ← Dashboard
├── index.css               ← Dashboard-specific styles
├── index.js                ← Charts, stats, breakdown logic
│
├── transactions.html       ← Transactions page
├── transactions.css
├── transactions.js         ← Filter chips, list rendering, mouse-drag scroll
│
├── settings.html           ← Settings page
├── settings.css
├── settings.js             ← Theme sync, live data stats
│
│
├── shared.css              ← Design tokens, layout, all shared components
├── shared.js               ← Shared state, localStorage, categories, currencies
│
├── libs/flags/             ← Country flag SVGs, one per currency (vendored)
│
├── manifest.json           ← PWA web app manifest
├── icon-16.png             ← Favicon (browser tab)
├── icon-32.png             ← Favicon HiDPI
├── icon-180.png            ← iOS home screen icon (apple-touch-icon)
├── icon-192.png            ← Android home screen icon
├── icon-192-maskable.png   ← Android adaptive icon (safe-zone padded)
├── icon-512.png            ← Android splash / PWA install
├── icon-512-maskable.png   ← Android adaptive icon large (safe-zone padded)
└── icon-1024.png           ← Master icon (reference)
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3, Bootstrap 5.3 |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | Chart.js 4.4 |
| Dialogs | SweetAlert2 11 |
| Fonts | Plus Jakarta Sans (variable, self-hosted in `libs/fonts/`) |
| Flags | Country SVGs, self-hosted in `libs/flags/` |
| Rates | exchangerate-api.com, cached in `localStorage` for offline use |
| Storage | `localStorage` (100% client-side) |

---

## 🎨 Design System

The UI follows a Wise-inspired language: bright green on forest green, flat
surfaces with hairline borders, generous radii, pill-shaped controls, one type
family, and line icons — no gradients or decorative shadows.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand` | `#9fe870` | `#9fe870` | Balance panel, primary CTAs |
| `--forest` | `#163300` | `#163300` | Text and fills on `--brand` |
| `--pos` | `#2f5711` | `#9fe870` | Money in |
| `--neg` | `#a8200d` | `#ff8f7a` | Money out |
| `--bg` / `--surface` | `#f6f6f4` / `#ffffff` | `#0e0f0c` / `#17190f` | Page / cards |
| `--text` / `--text-2` / `--text-3` | `#0e0f0c` / `#545a4f` / `#676e62` | `#f4f6f0` / `#a9b0a2` / `#7e867a` | Text hierarchy |

Icons are SVG, not emoji. They live in a single registry (`ICONS` in
`shared.js`); markup writes `<i data-icon="home"></i>` and `hydrateIcons()`
swaps in the SVG, while JS-rendered markup calls `icon('home')` directly.

Accessibility is checked in both themes at 390 px and 1440 px: body text meets
4.5:1, every interactive target is at least 44×44 px, focus rings are visible,
and `prefers-reduced-motion` is respected.

---

## 📊 Data Model

Transactions are stored in `localStorage` under the key `et_txs` as a JSON array:

```json
{
  "id":       1710000000000,
  "desc":     "Lunch",
  "amount":   12.50,
  "type":     "expense",
  "category": "Food",
  "date":     "2025-03-11"
}
```

Theme preference is stored separately under `et_theme` as `"dark"` or `"light"`. **Light is the default**; an inline script in each `<head>` applies the stored theme before first paint so there is no flash.

---

## 🎨 Responsive Breakpoints

All media queries use **`min-width`** (mobile-first). Bootstrap 5 breakpoints are applied throughout:

| Breakpoint | Width | Layout change |
|---|---|---|
| `xs` (default) | < 576 px | Stacked layout, compact padding, bottom nav |
| `sm` | ≥ 576 px | Wider gaps and spacing |
| `md` | ≥ 768 px | Larger text, add sheet becomes a centred dialog |
| `lg` | ≥ 992 px | Sidebar appears, bottom nav hidden |
| `xl` | ≥ 1200 px | Charts + breakdown side-by-side (col-8 / col-4) |
| `xxl` | ≥ 1400 px | Max spacing, comfortable reading widths |

---

## 📱 Categories

Each category carries an SVG icon and a colour, both defined in `shared.js`
(`CAT_ICON` and `CAT_COLOR`) and rendered as a tinted circular avatar by
`catAvatar()` — used by the transaction list, the breakdown, and the charts.

**Income:** Salary · Freelance · Investment

**Expense:** General · Food & Dining · Transport · Shopping · Health · Bills & Utilities · Entertainment · Travel · Education · Other

---

## 📲 PWA — Add to Home Screen

The app ships a complete PWA icon set generated at:

| File | Size | Purpose |
|---|---|---|
| `icon-180.png` | 180 × 180 | iOS Safari `apple-touch-icon` |
| `icon-192.png` | 192 × 192 | Android standard home screen |
| `icon-192-maskable.png` | 192 × 192 | Android adaptive icon (safe-zone padded) |
| `icon-512.png` | 512 × 512 | Android splash + PWA install banner |
| `icon-512-maskable.png` | 512 × 512 | Android adaptive icon large |

The maskable variants use a solid full-bleed background and shrink all artwork into the inner **80 % safe zone** so no launcher mask (circle, squircle, teardrop) clips the design.

---

## 🚀 Running Locally

No build step or server required — just open the files directly:

```bash
# Clone or download the project, then open in any browser:
open index.html

# Or serve with any static server (recommended for PWA manifest):
npx serve .
# or
python3 -m http.server 8080
```

> PWA features (Add to Home Screen prompt) require the files to be served over **HTTP/HTTPS**, not opened as `file://`.

---

- LinkedIn — [Hamza Salameh](https://www.linkedin.com/in/hamza-salameh-287a53258)

---

## 📜 License

MIT — free to use, study, and modify.
