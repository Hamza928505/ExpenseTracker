# 💰 ExpenseTracker

A fully client-side personal finance web app — track income and expenses by category, visualise spending with interactive charts, and manage your budget on any device from phone to desktop.

> **No accounts. No servers. No tracking. Your data stays in your browser.**

---

## ✨ Features

- **Dashboard** — net balance hero card, income vs expense stat cards, and three interactive Chart.js visualisations (monthly flow bar chart, category donut, monthly report pie)
- **Transactions** — horizontally scrollable filter chip bar (mouse-drag on desktop, touch on mobile), full transaction list with category icons, delete per entry
- **Settings** — dark / light mode toggle, live data stats, one-tap clear-all
- **About** — developer profile, tech stack, and project portfolio
- **Add Transaction sheet** — bottom sheet with income / expense segmented control, amount, description, category select, and date picker
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
├── about.html              ← About / portfolio page
├── about.css
│
├── shared.css              ← Design tokens, layout, all shared components
├── shared.js               ← Shared state, localStorage, all utility functions
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
| Fonts | Syne, JetBrains Mono (Google Fonts) |
| Storage | `localStorage` (100% client-side) |

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

Theme preference is stored separately under `et_theme` as `"dark"` or `"light"`.

---

## 🎨 Responsive Breakpoints

All media queries use **`min-width`** (mobile-first). Bootstrap 5 breakpoints are applied throughout:

| Breakpoint | Width | Layout change |
|---|---|---|
| `xs` (default) | < 576 px | Stacked layout, compact padding, bottom nav |
| `sm` | ≥ 576 px | Wider gaps and spacing |
| `md` | ≥ 768 px | Larger text, wider topbar padding |
| `lg` | ≥ 992 px | Sidebar appears, bottom nav hidden |
| `xl` | ≥ 1200 px | Charts + breakdown side-by-side (col-8 / col-4) |
| `xxl` | ≥ 1400 px | Max spacing, comfortable reading widths |

---

## 📱 Categories

**Income:** Salary 💼 · Freelance 💻 · Investment 📈

**Expense:** General ☕ · Food 🍽 · Transport 🚗 · Shopping 🛍 · Health 💊 · Bills ⚡ · Entertainment 🎬 · Travel ✈️ · Education 📚 · Other 💡

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

The maskable variants use a solid amber full-bleed background and shrink all artwork into the inner **80 % safe zone** so no launcher mask (circle, squircle, teardrop) clips the design.

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
