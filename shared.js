/**
 * ExpenseTracker — shared.js
 * Shared state, utilities, and UI functions used by all 3 pages.
 */

/* ============================================================
   ICON REGISTRY
   Line icons (Lucide geometry) drawn at 24×24 with currentColor.
   Markup uses <i class="ic" data-icon="home"></i>; hydrateIcons()
   swaps in the SVG. JS-rendered markup calls icon() directly.
   ============================================================ */
const ICONS = {
  home:        '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  receipt:     '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  settings:    '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  plus:        '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus:       '<path d="M5 12h14"/>',
  x:           '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  trash:       '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight:'<path d="m9 18 6-6-6-6"/>',
  arrowRight:  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowIn:     '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
  arrowOut:    '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  sun:         '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon:        '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  wallet:      '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  pieChart:    '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  barChart:    '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  inbox:       '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  layers:      '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  repeat:      '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  calendar:    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  bank:        '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  exchange:    '<path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  drive:       '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
  themeSwitch: '<path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',

  /* ── category icons ── */
  utensils:    '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  car:         '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bag:         '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  pulse:       '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4 .5-2 1 1h5.28"/>',
  zap:         '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  film:        '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  plane:       '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  book:        '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  briefcase:   '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  laptop:      '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  trendUp:     '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  coffee:      '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  sparkle:     '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  gift:        '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  heart:       '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  dumbbell:    '<path d="M6 5v14"/><path d="M18 5v14"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6 12h12"/>',
  phone:       '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  wifi:        '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>',
  fuel:        '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
  baby:        '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
  music:       '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  camera:      '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  wrench:      '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  shirt:       '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  pill:        '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  graduation:  '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  ticket:      '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  paw:         '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  cart:        '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  globe:       '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  star:        '<path d="m12 2 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 8.8l6.5-.9z"/>',
  shield:      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  key:         '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  building:    '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  check:       '<path d="M20 6 9 17l-5-5"/>',
  tag:         '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  flag:        '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
};

/** Returns an inline <svg> string for a registry icon. */
function icon(name, cls) {
  const body = ICONS[name] || ICONS.sparkle;
  return `<span class="ic${cls ? ' ' + cls : ''}" aria-hidden="true">` +
         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
         `stroke-linecap="round" stroke-linejoin="round">${body}</svg></span>`;
}

/** Replaces every <i data-icon="…"> placeholder in the document with its SVG. */
function hydrateIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (!ICONS[name]) return;
    el.classList.add('ic');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
                   `stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
    el.removeAttribute('data-icon');
  });
}

/* ============================================================
   CATEGORIES
   The built-ins ship with the app. Anything the user adds is kept in
   localStorage under et_categories and merged on top, so a custom
   category behaves exactly like a built-in everywhere it shows up.
   ============================================================ */
const DEFAULT_CATS = {
  income: [
    { v: 'Salary',        l: 'Salary',            icon: 'briefcase', color: '#4e9f3d' },
    { v: 'Freelance',     l: 'Freelance',         icon: 'laptop',    color: '#6d5bd0' },
    { v: 'Investment',    l: 'Investment',        icon: 'trendUp',   color: '#2e8b79' },
  ],
  expense: [
    { v: 'General',       l: 'General',           icon: 'coffee',    color: '#7a8471' },
    { v: 'Food',          l: 'Food & Dining',     icon: 'utensils',  color: '#e8724c' },
    { v: 'Transport',     l: 'Transport',         icon: 'car',       color: '#3b7dd8' },
    { v: 'Shopping',      l: 'Shopping',          icon: 'bag',       color: '#8b5cf6' },
    { v: 'Health',        l: 'Health',            icon: 'pulse',     color: '#17a398' },
    { v: 'Bills',         l: 'Bills & Utilities', icon: 'zap',       color: '#0fa3c7' },
    { v: 'Entertainment', l: 'Entertainment',     icon: 'film',      color: '#d9527f' },
    { v: 'Travel',        l: 'Travel',            icon: 'plane',     color: '#e9a13b' },
    { v: 'Education',     l: 'Education',         icon: 'book',      color: '#5b6ad0' },
    { v: 'Other',         l: 'Other',             icon: 'sparkle',   color: '#9aa294' },
  ],
};

/* What a user-made category can be built from. */
const CAT_ICON_CHOICES = [
  'utensils', 'cart', 'coffee', 'car', 'fuel', 'bag', 'shirt', 'home',
  'pulse', 'pill', 'dumbbell', 'zap', 'wifi', 'phone', 'film', 'music',
  'ticket', 'camera', 'plane', 'globe', 'book', 'graduation', 'baby', 'paw',
  'gift', 'heart', 'briefcase', 'laptop', 'trendUp', 'bank', 'building', 'wrench',
  'key', 'shield', 'star', 'tag', 'wallet', 'repeat', 'sparkle', 'layers',
];

const CAT_COLOR_CHOICES = [
  '#e8724c', '#c9432c', '#e9a13b', '#4e9f3d', '#2e8b79', '#17a398',
  '#0fa3c7', '#3b7dd8', '#5b6ad0', '#6d5bd0', '#8b5cf6', '#d9527f',
  '#7a8471', '#9aa294', '#0e7490', '#b45309',
];

const FALLBACK_CAT = { l: 'Other', icon: 'sparkle', color: '#9aa294' };

function loadCustomCats() {
  try {
    const raw = JSON.parse(localStorage.getItem('et_categories') || '{}');
    const clean = list => (Array.isArray(list) ? list : [])
      .filter(c => c && typeof c.v === 'string' && c.v.trim())
      .map(c => ({
        v:     c.v,
        l:     c.l || c.v,
        icon:  ICONS[c.icon] ? c.icon : 'sparkle',
        color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : FALLBACK_CAT.color,
        custom: true,
      }));
    return { income: clean(raw.income), expense: clean(raw.expense) };
  } catch (e) {
    return { income: [], expense: [] };
  }
}

let customCats = loadCustomCats();

function saveCats() {
  localStorage.setItem('et_categories', JSON.stringify(customCats));
}

/** Built-ins first, then the user's own, for one side of the ledger. */
function cats(type) {
  const side = type === 'income' ? 'income' : 'expense';
  return DEFAULT_CATS[side].concat(customCats[side] || []);
}

function allCats() {
  return cats('income').concat(cats('expense'));
}

/** Never throws on an unknown value — an old transaction keeps its name. */
function catDef(v) {
  return allCats().find(c => c.v === v) || Object.assign({}, FALLBACK_CAT, { v: v, l: v || 'Other' });
}

function catColor(v) { return catDef(v).color; }
function catIcon(v)  { return catDef(v).icon;  }
function catLabel(v) { return catDef(v).l;     }

function catSide(v) {
  return cats('income').some(c => c.v === v) ? 'income' : 'expense';
}

/** Circular tinted avatar for a category — used by every list on the site. */
function catAvatar(cat, small) {
  const col = catColor(cat);
  return `<span class="cat-ico${small ? ' cat-ico-sm' : ''}" ` +
         `style="background:${col}1f;color:${col}">${icon(catIcon(cat))}</span>`;
}

/* ── ADD / REMOVE A CATEGORY ───────────────────────────────── */

/** Name + icon + colour dialog. Adds to the given side of the ledger. */
function openCategoryDialog(type) {
  if (typeof Swal === 'undefined') return;
  const side = type === 'income' ? 'income' : 'expense';

  let pickIcon  = CAT_ICON_CHOICES[0];
  let pickColor = CAT_COLOR_CHOICES[0];

  const html = `
    <div class="cat-form">
      <label class="et-label" for="catName">Name</label>
      <input class="et-input" id="catName" type="text" maxlength="24"
             placeholder="${side === 'income' ? 'e.g. Bonus' : 'e.g. Groceries'}" autocomplete="off"/>

      <div class="et-label cat-form-lbl">Icon</div>
      <div class="icon-grid" id="catIconGrid">
        ${CAT_ICON_CHOICES.map((n, i) =>
          `<button type="button" class="icon-opt${i === 0 ? ' on' : ''}" data-ic="${n}"
                   aria-label="${n}">${icon(n)}</button>`).join('')}
      </div>

      <div class="et-label cat-form-lbl">Colour</div>
      <div class="color-grid" id="catColorGrid">
        ${CAT_COLOR_CHOICES.map((c, i) =>
          `<button type="button" class="color-opt${i === 0 ? ' on' : ''}" data-col="${c}"
                   style="--swatch:${c}" aria-label="Colour ${c}"></button>`).join('')}
      </div>
    </div>`;

  Swal.fire({
    title: side === 'income' ? 'New money-in category' : 'New money-out category',
    html,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Add category',
    cancelButtonText:  'Cancel',
    didOpen: () => {
      const grid  = document.getElementById('catIconGrid');
      const cgrid = document.getElementById('catColorGrid');

      const paint = () => {
        grid.style.setProperty('--pick', pickColor);
        grid.querySelectorAll('.icon-opt').forEach(b => b.classList.toggle('on', b.dataset.ic === pickIcon));
        cgrid.querySelectorAll('.color-opt').forEach(b => b.classList.toggle('on', b.dataset.col === pickColor));
      };

      grid.addEventListener('click', e => {
        const b = e.target.closest('.icon-opt');
        if (b) { pickIcon = b.dataset.ic; paint(); }
      });
      cgrid.addEventListener('click', e => {
        const b = e.target.closest('.color-opt');
        if (b) { pickColor = b.dataset.col; paint(); }
      });

      paint();
      document.getElementById('catName').focus();
    },
    preConfirm: () => {
      const name = (document.getElementById('catName').value || '').trim();
      if (!name) {
        Swal.showValidationMessage('Give the category a name.');
        return false;
      }
      if (allCats().some(c => c.v.toLowerCase() === name.toLowerCase())) {
        Swal.showValidationMessage('That category already exists.');
        return false;
      }
      return { v: name, l: name, icon: pickIcon, color: pickColor, custom: true };
    },
  }).then(r => {
    if (!r.isConfirmed || !r.value) return;
    customCats[side].push(r.value);
    saveCats();
    if (side === mode) selectedCat = r.value.v;
    refreshCategoryUI();
  });
}

/** Removes a user-made category. Transactions filed under it are left alone. */
function deleteCategory(v) {
  const side = customCats.income.some(c => c.v === v) ? 'income' : 'expense';
  const used = txs.filter(t => t.category === v).length;

  Swal.fire({
    title: 'Delete this category?',
    html: `<b>${esc(catLabel(v))}</b><br>` + (used
      ? `${used} transaction${used === 1 ? '' : 's'} still use${used === 1 ? 's' : ''} it. ` +
        `They stay in your history and keep the name.`
      : 'You can add it again at any time.'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText:  'Keep it',
    customClass: { confirmButton: 'swal2-confirm danger', cancelButton: 'swal2-cancel' },
  }).then(r => {
    if (!r.isConfirmed) return;
    customCats[side] = customCats[side].filter(c => c.v !== v);
    saveCats();
    refreshCategoryUI();
  });
}

/** Re-renders every surface that lists categories, on whichever page we are. */
function refreshCategoryUI() {
  updateCats();
  if (typeof renderCategorySettings === 'function') renderCategorySettings();
  if (typeof renderFilterChips === 'function')      renderFilterChips();
  if (typeof render === 'function')                 render();
}

/* ============================================================
   STATE
   ============================================================ */
let txs      = JSON.parse(localStorage.getItem('et_txs') || '[]');
let recurringTxs = JSON.parse(localStorage.getItem('et_recurring') || '[]');
/* Light is the default theme — dark is opt-in. */
let isDark   = localStorage.getItem('et_theme') === 'dark';
let mode     = 'income';
let selectedCat = 'Salary';
let viewDate = new Date();
let baseCurrency = localStorage.getItem('et_base_currency') || 'JOD';
let displayCurrency = localStorage.getItem('et_display_currency') || 'JOD';
let exchangeRate = 1;

/* ============================================================
   CURRENCIES
   The pickers work before — and without — any network call: they start
   from this built-in list and the live API only widens it to the full
   set. Choosing a currency is never gated on a fetch.

   Flags are vendored under libs/flags as SVGs (same reasoning as the
   other libs), keyed by the country the currency belongs to.
   ============================================================ */
const CURRENCY_SYMBOLS = {
  JOD: 'JD ',  USD: '$',    EUR: '€',    GBP: '£',    JPY: '¥',    CNY: '¥',
  AED: 'AED ', SAR: 'SAR ', EGP: 'E£ ',  KWD: 'KD ',  QAR: 'QR ',  BHD: 'BD ',
  TRY: '₺',    INR: '₹',    ILS: '₪',    CHF: 'CHF ', CAD: 'CA$',  AUD: 'A$',
  SEK: 'kr ',  NOK: 'kr ',  DKK: 'kr ',  PLN: 'zł ',  RUB: '₽',    ZAR: 'R ',
  BRL: 'R$',   MXN: 'MX$',  KRW: '₩',    SGD: 'S$',   NZD: 'NZ$',  HKD: 'HK$',
  THB: '฿',    VND: '₫',    PHP: '₱',    NGN: '₦',    UAH: '₴',    OMR: 'OMR ',
};

/* Which flag a currency flies. Anything missing falls back to a code badge. */
const CURRENCY_COUNTRY = {
  AED: 'ae', AFN: 'af', ALL: 'al', AMD: 'am', ANG: 'cw', AOA: 'ao', ARS: 'ar', AUD: 'au',
  AWG: 'aw', AZN: 'az', BAM: 'ba', BBD: 'bb', BDT: 'bd', BGN: 'bg', BHD: 'bh', BIF: 'bi',
  BMD: 'bm', BND: 'bn', BOB: 'bo', BRL: 'br', BSD: 'bs', BTN: 'bt', BWP: 'bw', BYN: 'by',
  BZD: 'bz', CAD: 'ca', CDF: 'cd', CHF: 'ch', CLP: 'cl', CNY: 'cn', COP: 'co', CRC: 'cr',
  CUP: 'cu', CVE: 'cv', CZK: 'cz', DJF: 'dj', DKK: 'dk', DOP: 'do', DZD: 'dz', EGP: 'eg',
  ERN: 'er', ETB: 'et', EUR: 'eu', FJD: 'fj', FKP: 'fk', GBP: 'gb', GEL: 'ge', GHS: 'gh',
  GIP: 'gi', GMD: 'gm', GNF: 'gn', GTQ: 'gt', GYD: 'gy', HKD: 'hk', HNL: 'hn', HRK: 'hr',
  HTG: 'ht', HUF: 'hu', IDR: 'id', ILS: 'il', INR: 'in', IQD: 'iq', IRR: 'ir', ISK: 'is',
  JMD: 'jm', JOD: 'jo', JPY: 'jp', KES: 'ke', KGS: 'kg', KHR: 'kh', KMF: 'km', KPW: 'kp',
  KRW: 'kr', KWD: 'kw', KYD: 'ky', KZT: 'kz', LAK: 'la', LBP: 'lb', LKR: 'lk', LRD: 'lr',
  LSL: 'ls', LYD: 'ly', MAD: 'ma', MDL: 'md', MGA: 'mg', MKD: 'mk', MMK: 'mm', MNT: 'mn',
  MOP: 'mo', MRU: 'mr', MUR: 'mu', MVR: 'mv', MWK: 'mw', MXN: 'mx', MYR: 'my', MZN: 'mz',
  NAD: 'na', NGN: 'ng', NIO: 'ni', NOK: 'no', NPR: 'np', NZD: 'nz', OMR: 'om', PAB: 'pa',
  PEN: 'pe', PGK: 'pg', PHP: 'ph', PKR: 'pk', PLN: 'pl', PYG: 'py', QAR: 'qa', RON: 'ro',
  RSD: 'rs', RUB: 'ru', RWF: 'rw', SAR: 'sa', SBD: 'sb', SCR: 'sc', SDG: 'sd', SEK: 'se',
  SGD: 'sg', SHP: 'sh', SLL: 'sl', SOS: 'so', SRD: 'sr', SSP: 'ss', STN: 'st', SYP: 'sy',
  SZL: 'sz', THB: 'th', TJS: 'tj', TMT: 'tm', TND: 'tn', TOP: 'to', TRY: 'tr', TTD: 'tt',
  TWD: 'tw', TZS: 'tz', UAH: 'ua', UGX: 'ug', USD: 'us', UYU: 'uy', UZS: 'uz', VES: 've',
  VND: 'vn', VUV: 'vu', WST: 'ws', XAF: 'cm', XCD: 'ag', XOF: 'sn', XPF: 'pf', YER: 'ye',
  ZAR: 'za', ZMW: 'zm', ZWL: 'zw',
};

const CURRENCY_NAMES = {
  AED:  'UAE Dirham',
  AFN:  'Afghan Afghani',
  ALL:  'Albanian Lek',
  AMD:  'Armenian Dram',
  ANG:  'Netherlands Antillean Guilder',
  AOA:  'Angolan Kwanza',
  ARS:  'Argentine Peso',
  AUD:  'Australian Dollar',
  AWG:  'Aruban Florin',
  AZN:  'Azerbaijani Manat',
  BAM:  'Bosnia-Herzegovina Mark',
  BBD:  'Barbadian Dollar',
  BDT:  'Bangladeshi Taka',
  BGN:  'Bulgarian Lev',
  BHD:  'Bahraini Dinar',
  BIF:  'Burundian Franc',
  BMD:  'Bermudan Dollar',
  BND:  'Brunei Dollar',
  BOB:  'Bolivian Boliviano',
  BRL:  'Brazilian Real',
  BSD:  'Bahamian Dollar',
  BTN:  'Bhutanese Ngultrum',
  BWP:  'Botswanan Pula',
  BYN:  'Belarusian Ruble',
  BZD:  'Belize Dollar',
  CAD:  'Canadian Dollar',
  CDF:  'Congolese Franc',
  CHF:  'Swiss Franc',
  CLP:  'Chilean Peso',
  CNY:  'Chinese Yuan',
  COP:  'Colombian Peso',
  CRC:  'Costa Rican Colon',
  CUP:  'Cuban Peso',
  CVE:  'Cape Verdean Escudo',
  CZK:  'Czech Koruna',
  DJF:  'Djiboutian Franc',
  DKK:  'Danish Krone',
  DOP:  'Dominican Peso',
  DZD:  'Algerian Dinar',
  EGP:  'Egyptian Pound',
  ERN:  'Eritrean Nakfa',
  ETB:  'Ethiopian Birr',
  EUR:  'Euro',
  FJD:  'Fijian Dollar',
  FKP:  'Falkland Islands Pound',
  GBP:  'British Pound',
  GEL:  'Georgian Lari',
  GHS:  'Ghanaian Cedi',
  GIP:  'Gibraltar Pound',
  GMD:  'Gambian Dalasi',
  GNF:  'Guinean Franc',
  GTQ:  'Guatemalan Quetzal',
  GYD:  'Guyanaese Dollar',
  HKD:  'Hong Kong Dollar',
  HNL:  'Honduran Lempira',
  HRK:  'Croatian Kuna',
  HTG:  'Haitian Gourde',
  HUF:  'Hungarian Forint',
  IDR:  'Indonesian Rupiah',
  ILS:  'Israeli Shekel',
  INR:  'Indian Rupee',
  IQD:  'Iraqi Dinar',
  IRR:  'Iranian Rial',
  ISK:  'Icelandic Krona',
  JMD:  'Jamaican Dollar',
  JOD:  'Jordanian Dinar',
  JPY:  'Japanese Yen',
  KES:  'Kenyan Shilling',
  KGS:  'Kyrgystani Som',
  KHR:  'Cambodian Riel',
  KMF:  'Comorian Franc',
  KPW:  'North Korean Won',
  KRW:  'South Korean Won',
  KWD:  'Kuwaiti Dinar',
  KYD:  'Cayman Islands Dollar',
  KZT:  'Kazakhstani Tenge',
  LAK:  'Laotian Kip',
  LBP:  'Lebanese Pound',
  LKR:  'Sri Lankan Rupee',
  LRD:  'Liberian Dollar',
  LSL:  'Lesotho Loti',
  LYD:  'Libyan Dinar',
  MAD:  'Moroccan Dirham',
  MDL:  'Moldovan Leu',
  MGA:  'Malagasy Ariary',
  MKD:  'Macedonian Denar',
  MMK:  'Myanmar Kyat',
  MNT:  'Mongolian Tugrik',
  MOP:  'Macanese Pataca',
  MRU:  'Mauritanian Ouguiya',
  MUR:  'Mauritian Rupee',
  MVR:  'Maldivian Rufiyaa',
  MWK:  'Malawian Kwacha',
  MXN:  'Mexican Peso',
  MYR:  'Malaysian Ringgit',
  MZN:  'Mozambican Metical',
  NAD:  'Namibian Dollar',
  NGN:  'Nigerian Naira',
  NIO:  'Nicaraguan Cordoba',
  NOK:  'Norwegian Krone',
  NPR:  'Nepalese Rupee',
  NZD:  'New Zealand Dollar',
  OMR:  'Omani Rial',
  PAB:  'Panamanian Balboa',
  PEN:  'Peruvian Sol',
  PGK:  'Papua New Guinean Kina',
  PHP:  'Philippine Peso',
  PKR:  'Pakistani Rupee',
  PLN:  'Polish Zloty',
  PYG:  'Paraguayan Guarani',
  QAR:  'Qatari Riyal',
  RON:  'Romanian Leu',
  RSD:  'Serbian Dinar',
  RUB:  'Russian Ruble',
  RWF:  'Rwandan Franc',
  SAR:  'Saudi Riyal',
  SBD:  'Solomon Islands Dollar',
  SCR:  'Seychellois Rupee',
  SDG:  'Sudanese Pound',
  SEK:  'Swedish Krona',
  SGD:  'Singapore Dollar',
  SHP:  'St Helena Pound',
  SLL:  'Sierra Leonean Leone',
  SOS:  'Somali Shilling',
  SRD:  'Surinamese Dollar',
  SSP:  'South Sudanese Pound',
  STN:  'Sao Tome Dobra',
  SYP:  'Syrian Pound',
  SZL:  'Swazi Lilangeni',
  THB:  'Thai Baht',
  TJS:  'Tajikistani Somoni',
  TMT:  'Turkmenistani Manat',
  TND:  'Tunisian Dinar',
  TOP:  'Tongan Paanga',
  TRY:  'Turkish Lira',
  TTD:  'Trinidad & Tobago Dollar',
  TWD:  'New Taiwan Dollar',
  TZS:  'Tanzanian Shilling',
  UAH:  'Ukrainian Hryvnia',
  UGX:  'Ugandan Shilling',
  USD:  'US Dollar',
  UYU:  'Uruguayan Peso',
  UZS:  'Uzbekistani Som',
  VES:  'Venezuelan Bolivar',
  VND:  'Vietnamese Dong',
  VUV:  'Vanuatu Vatu',
  WST:  'Samoan Tala',
  XAF:  'Central African Franc',
  XCD:  'East Caribbean Dollar',
  XOF:  'West African Franc',
  XPF:  'CFP Franc',
  YER:  'Yemeni Rial',
  ZAR:  'South African Rand',
  ZMW:  'Zambian Kwacha',
  ZWL:  'Zimbabwean Dollar',
};

/* Offered first in every picker; everything else lands under "All currencies". */
const COMMON_CURRENCIES = [
  'JOD', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'EGP', 'KWD', 'QAR', 'BHD',
  'TRY', 'CHF', 'CAD', 'AUD', 'JPY', 'CNY', 'INR',
];

/* Starts as the offline-safe set; fetchExchangeRate() widens it if rates arrive. */
let allCurrencies = COMMON_CURRENCIES.slice().sort();

function currencyName(code) {
  return CURRENCY_NAMES[code] || code;
}

function currencyLabel(code) {
  const sym = CURRENCY_SYMBOLS[code];
  return sym ? `${code} (${sym.trim()})` : code;
}

/* ── FLAGS ── */

/** <img> for the currency's flag, with a lettered badge as the fallback. */
function flag(code, cls) {
  const cc = CURRENCY_COUNTRY[code];
  const klass = 'flag' + (cls ? ' ' + cls : '');
  if (!cc) return `<span class="${klass} flag-code">${esc(String(code).slice(0, 2))}</span>`;
  return `<img class="${klass}" src="libs/flags/${cc}.svg" alt="" width="24" height="18" ` +
         `loading="lazy" data-code="${esc(code)}" onerror="flagFallback(this)"/>`;
}

/** Swaps a flag that could not load for the two-letter badge. */
function flagFallback(img) {
  const span = document.createElement('span');
  span.className = img.className + ' flag-code';
  span.textContent = (img.dataset.code || '').slice(0, 2);
  img.replaceWith(span);
}

/* ============================================================
   EXCHANGE RATES
   One fetch gives every rate against the base, so switching what you
   are looking at is instant and works offline off the cached table.
   ============================================================ */
let ratesData = null;   /* { base, date, rates } */
try {
  ratesData = JSON.parse(localStorage.getItem('et_rates') || 'null');
} catch (e) { ratesData = null; }

/* Goes false once a rate lookup fails AND we have nothing cached — we then
   refuse to show converted amounts rather than label base-currency numbers
   as something else. */
let ratesAvailable = true;

/** Rate from the base currency to `code`, or null when we cannot know it. */
function rateFor(code) {
  if (code === baseCurrency) return 1;
  if (ratesData && ratesData.base === baseCurrency && typeof ratesData.rates[code] === 'number') {
    return ratesData.rates[code];
  }
  return null;
}

/** Points exchangeRate at the display currency, falling back to the base. */
function applyDisplayCurrency() {
  const r = rateFor(displayCurrency);
  if (r === null) {
    displayCurrency = baseCurrency;
    exchangeRate = 1;
    return false;
  }
  exchangeRate = r;
  return true;
}

/* ── WALLET: the currencies you can flick between on the balance ── */
function loadWallet() {
  try {
    const raw = JSON.parse(localStorage.getItem('et_wallet') || 'null');
    if (Array.isArray(raw) && raw.length) return raw.filter(c => typeof c === 'string');
  } catch (e) { /* fall through */ }
  return [baseCurrency, baseCurrency === 'USD' ? 'EUR' : 'USD'];
}

let walletCurrencies = loadWallet();

/** The base currency is always first and always present. */
function normalizeWallet() {
  walletCurrencies = [baseCurrency].concat(
    walletCurrencies.filter(c => c && c !== baseCurrency)
  );
}
normalizeWallet();

function saveWallet() {
  normalizeWallet();
  localStorage.setItem('et_wallet', JSON.stringify(walletCurrencies));
}

function addWalletCurrency(code) {
  if (!code || walletCurrencies.includes(code)) return;
  walletCurrencies.push(code);
  saveWallet();
  refreshCurrencyUI();
}

function removeWalletCurrency(code) {
  if (code === baseCurrency) return;
  walletCurrencies = walletCurrencies.filter(c => c !== code);
  saveWallet();
  if (displayCurrency === code) setDisplayCurrency(baseCurrency);
  else refreshCurrencyUI();
}

/* ── SWITCHING WHAT YOU LOOK AT ── */

/** Instant when the rate is already cached; fetches once if it is not. */
async function setDisplayCurrency(code, quiet) {
  if (!code) return false;

  if (rateFor(code) === null) {
    await fetchExchangeRate();
    if (rateFor(code) === null) {
      notifyRatesUnavailable();
      refreshCurrencyUI();
      return false;
    }
  }

  displayCurrency = code;
  applyDisplayCurrency();
  save();
  refreshCurrencyUI();
  if (typeof render === 'function') render();

  if (!quiet) flashBalance();
  return true;
}

/** Clicking the balance walks through the currencies you picked. */
function cycleDisplayCurrency() {
  normalizeWallet();
  if (walletCurrencies.length < 2) return;
  const i = walletCurrencies.indexOf(displayCurrency);
  setDisplayCurrency(walletCurrencies[(i + 1) % walletCurrencies.length]);
}

/* A short pulse so the swap reads as a change, not a re-render. */
function flashBalance() {
  const hb = document.getElementById('heroBalance');
  if (!hb) return;
  hb.classList.remove('is-swapping');
  void hb.offsetWidth;
  hb.classList.add('is-swapping');
}

/* ── CURRENCY SURFACES ── */

/** The row of flag pills under the balance. */
function renderCurrencyPills() {
  const row = document.getElementById('heroCurRow');
  if (!row) return;
  normalizeWallet();

  row.innerHTML = walletCurrencies.map(c => `
    <button type="button" class="cur-pill${c === displayCurrency ? ' on' : ''}"
            data-cur="${esc(c)}" aria-pressed="${c === displayCurrency}"
            title="Show amounts in ${esc(currencyName(c))}">
      ${flag(c)}<span class="cur-pill-code">${esc(c)}</span>
      ${c === baseCurrency ? '<span class="cur-pill-tag">Main</span>' : ''}
    </button>`).join('') +
    `<a class="cur-pill cur-pill-add" href="settings.html#currencies"
        title="Choose your currencies" aria-label="Choose your currencies">${icon('plus')}</a>`;
}

/** The muted "also worth" line — every other currency you picked. */
function renderHeroAlt(baseAmount) {
  const el = document.getElementById('heroAlt');
  if (!el) return;
  normalizeWallet();

  const others = walletCurrencies.filter(c => c !== displayCurrency);
  if (!others.length) { el.innerHTML = ''; return; }

  const parts = others.map(c => {
    const r = rateFor(c);
    if (r === null) return '';
    const sym = CURRENCY_SYMBOLS[c] || (c + ' ');
    const val = Math.abs(baseAmount) * r;
    return `<button type="button" class="alt-cur" data-cur="${esc(c)}">` +
           `${flag(c, 'flag-xs')}<span>${baseAmount < 0 ? '−' : ''}${sym}` +
           `${val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></button>`;
  }).filter(Boolean);

  el.innerHTML = parts.length ? `<span class="alt-lead">Also</span>${parts.join('')}` : '';
}

/** Keeps every currency-shaped control on the page in step. */
function refreshCurrencyUI() {
  renderCurrencyPills();
  renderWalletSettings();
  populateCurrencyDropdowns();

  updateAmountCurrency();
  previewAmountInBase();

  document.querySelectorAll('[data-cur-flag]').forEach(el => {
    el.innerHTML = flag(el.getAttribute('data-cur-flag') === 'base' ? baseCurrency : displayCurrency, 'flag-lg');
  });
}

/** Settings page only — the list of currencies you can flick between. */
function renderWalletSettings() {
  const list = document.getElementById('walletList');
  if (!list) return;
  normalizeWallet();

  list.innerHTML = walletCurrencies.map(c => `
    <div class="wallet-row">
      <span class="wallet-flag">${flag(c, 'flag-lg')}</span>
      <div class="wallet-body">
        <div class="wallet-code">${esc(c)}${c === baseCurrency ? ' <span class="wallet-tag">Main</span>' : ''}</div>
        <div class="wallet-name">${esc(currencyName(c))}</div>
      </div>
      ${c === baseCurrency
        ? '<span class="wallet-note">Always shown</span>'
        : `<button class="wallet-del" data-remove="${esc(c)}" aria-label="Remove ${esc(c)}">${icon('trash')}</button>`}
    </div>`).join('');
}

function populateCurrencyDropdowns() {
  const dropdowns = ['baseCurrencySelect', 'displayCurrencySelect', 'walletAddSelect', 'convFrom', 'convTo'];

  /* The two pill selects sit next to a flag and a label, so the code alone
     is enough; the wider ones carry the full name. */
  const option = (code, terse) => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = terse ? currencyLabel(code) : `${currencyLabel(code)} — ${currencyName(code)}`;
    return o;
  };

  const common = COMMON_CURRENCIES.filter(c => allCurrencies.includes(c));
  const rest   = allCurrencies.filter(c => !common.includes(c));

  dropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Hold on to the user's pick when the list widens mid-session
    const prev = el.value;
    el.innerHTML = '';

    const terse = id === 'baseCurrencySelect' || id === 'displayCurrencySelect';

    const pool = id === 'walletAddSelect'
      ? { common: common.filter(c => !walletCurrencies.includes(c)),
          rest:   rest.filter(c => !walletCurrencies.includes(c)) }
      : { common, rest };

    if (pool.common.length) {
      const g = document.createElement('optgroup');
      g.label = 'Common';
      pool.common.forEach(c => g.appendChild(option(c, terse)));
      el.appendChild(g);
    }
    if (pool.rest.length) {
      const g = document.createElement('optgroup');
      g.label = 'All currencies';
      pool.rest.forEach(c => g.appendChild(option(c, terse)));
      el.appendChild(g);
    }

    let want;
    if (id === 'baseCurrencySelect') want = baseCurrency;
    else if (id === 'displayCurrencySelect') want = displayCurrency;
    else if (id === 'walletAddSelect') want = prev;
    // The converter defaults to base → display; the same currency on both
    // sides would make Convert a no-op.
    else if (id === 'convFrom') want = prev || baseCurrency;
    else if (id === 'convTo') {
      want = prev || (displayCurrency !== baseCurrency ? displayCurrency
                    : (baseCurrency === 'USD' ? 'EUR' : 'USD'));
    }

    if (want && [...el.options].some(o => o.value === want)) el.value = want;
  });
}

async function fetchExchangeRate() {
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    if (!data || !data.rates) throw new Error('No rates in response');

    ratesData = { base: baseCurrency, date: data.date || new Date().toISOString().split('T')[0], rates: data.rates };
    try { localStorage.setItem('et_rates', JSON.stringify(ratesData)); } catch (e) { /* quota — memory only */ }

    // Widen the picker to everything the API knows, keeping our built-ins so
    // a currency never disappears from the list.
    allCurrencies = [...new Set([...COMMON_CURRENCIES, ...Object.keys(data.rates), baseCurrency])].sort();
    ratesAvailable = true;

    if (!applyDisplayCurrency()) save();

    refreshCurrencyUI();
    if (typeof render === 'function') render();
    return true;
  } catch (e) {
    console.error('Exchange rate fetch failed', e);

    // A cached table from an earlier visit still converts correctly enough
    // to be useful, so only give up when there is nothing to fall back on.
    const haveCache = !!(ratesData && ratesData.base === baseCurrency);
    ratesAvailable = haveCache;

    const wasConverting = displayCurrency !== baseCurrency;
    const kept = applyDisplayCurrency();
    if (!kept) save();

    allCurrencies = [...new Set([
      ...COMMON_CURRENCIES,
      ...(haveCache ? Object.keys(ratesData.rates) : []),
      baseCurrency,
    ])].sort();

    refreshCurrencyUI();
    if (typeof render === 'function') render();
    if (wasConverting && !kept) notifyRatesUnavailable();
    return haveCache;
  }
}

/* At most one notice per page load. */
let ratesWarned = false;
function notifyRatesUnavailable() {
  if (ratesWarned || typeof Swal === 'undefined') return;
  ratesWarned = true;
  Swal.fire({
    title: 'Live rates unavailable',
    text: `Showing amounts in ${baseCurrency} until the rate service can be reached.`,
    icon: 'info',
    timer: 3200,
    showConfirmButton: false,
    timerProgressBar: true,
  });
}

/* Cached rates make the first paint correct; the fetch only refreshes them. */
if (allCurrencies.length && ratesData && ratesData.base === baseCurrency) {
  allCurrencies = [...new Set([...COMMON_CURRENCIES, ...Object.keys(ratesData.rates), baseCurrency])].sort();
}
applyDisplayCurrency();
fetchExchangeRate();

/* ── RECURRING LOGIC ── */
function processRecurring() {
  const now = new Date();
  const currentY = now.getFullYear();
  const currentM = now.getMonth();
  let updated = false;

  recurringTxs.forEach(rt => {
    let last = new Date(rt.lastDate);
    // Move to next month
    last.setMonth(last.getMonth() + 1);

    // As long as the next month is <= current month (considering year)
    while (last.getFullYear() < currentY || (last.getFullYear() === currentY && last.getMonth() <= currentM)) {
      const newDate = new Date(last);
      txs.push({
        id: Date.now() + Math.random(), // ensure unique id
        desc: rt.desc + ' (Auto)',
        amount: rt.amount,
        type: rt.type,
        category: rt.category,
        date: newDate.toISOString().split('T')[0]
      });
      rt.lastDate = newDate.toISOString();
      updated = true;
      last.setMonth(last.getMonth() + 1);
    }
  });

  if (updated) {
    // Sort txs by date descending
    txs.sort((a, b) => new Date(b.date) - new Date(a.date));
    save();
  }
}

// Call on startup
processRecurring();

/* ── STORAGE ── */
function save() {
  localStorage.setItem('et_txs', JSON.stringify(txs));
  localStorage.setItem('et_base_currency', baseCurrency);
  localStorage.setItem('et_display_currency', displayCurrency);
  localStorage.setItem('et_recurring', JSON.stringify(recurringTxs));
}

/* ============================================================
   UTILITIES
   ============================================================ */
function curSymbol() {
  return CURRENCY_SYMBOLS[displayCurrency] || (displayCurrency + ' ');
}

function fmt(n) {
  const converted = n * exchangeRate;
  return curSymbol() + converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Compact form for chart axes — 1.2k, 3.4M — in the display currency. */
function fmtShort(n) {
  const v = n * exchangeRate;
  const abs = Math.abs(v);
  if (abs >= 1e6) return curSymbol() + (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1e3) return curSymbol() + (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return curSymbol() + Math.round(v);
}

/* Safe in both text nodes and attribute values — descriptions end up in both. */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function monthTxs() {
  return txs.filter(t => {
    const d = new Date(t.date + 'T00:00:00');
    return (
      d.getFullYear() === viewDate.getFullYear() &&
      d.getMonth()    === viewDate.getMonth()
    );
  });
}

/* ============================================================
   THEME
   ============================================================ */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // Keep the browser/OS chrome in step with the surface behind it
  const tc = document.querySelector('meta[name="theme-color"]');
  if (tc) tc.setAttribute('content', isDark ? '#0e0f0c' : '#f6f6f4');

  const tb = document.getElementById('themeBtn');
  if (tb) {
    tb.innerHTML = icon(isDark ? 'sun' : 'moon');
    tb.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  const td = document.getElementById('darkToggle');
  if (td) td.checked = isDark;

  localStorage.setItem('et_theme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
  isDark = !isDark;
  applyTheme();
  if (typeof renderCharts === 'function') setTimeout(() => render(), 40);
}

/* ============================================================
   MONTH NAVIGATION
   ============================================================ */
function updateMonth() {
  const label = viewDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  document.querySelectorAll('.mpill-label').forEach(el => (el.textContent = label));
}

function changeMonth(dir) {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1);
  updateMonth();
  if (typeof render === 'function') render();
}

/* ============================================================
   TRANSACTION TYPE
   ============================================================ */
function setType(t) {
  mode = t;
  const bi = document.getElementById('btnInc');
  const be = document.getElementById('btnExp');
  if (bi) {
    bi.className = 'type-seg-btn' + (t === 'income' ? ' sel-inc' : '');
    bi.setAttribute('aria-pressed', String(t === 'income'));
  }
  if (be) {
    be.className = 'type-seg-btn' + (t === 'expense' ? ' sel-exp' : '');
    be.setAttribute('aria-pressed', String(t === 'expense'));
  }

  // Money in and money out have separate category lists
  if (!cats(t).some(c => c.v === selectedCat)) selectedCat = cats(t)[0].v;
  updateCats();
}

function updateCats() {
  const box = document.getElementById('fCatPicker');
  if (!box) return;

  const list = cats(mode);
  if (!list.some(c => c.v === selectedCat)) selectedCat = list[0].v;

  box.innerHTML = list.map(c => {
    const on = c.v === selectedCat;
    return `
      <button type="button" class="cat-opt${on ? ' on' : ''}" role="radio"
              aria-checked="${on}" data-cat="${esc(c.v)}" style="--cat:${c.color}">
        <span class="cat-ico cat-ico-sm" style="background:${c.color}1f;color:${c.color}">${icon(c.icon)}</span>
        <span class="cat-opt-l">${esc(c.l)}</span>
      </button>`;
  }).join('');
}

/** Marks a category as the one the new transaction will be filed under. */
function pickCat(v) {
  selectedCat = v;
  updateCats();
}

/* ============================================================
   ADD SHEET
   ============================================================ */
let sheetOpener = null;

function openSheet() {
  sheetOpener = document.activeElement;
  document.getElementById('sheetOverlay').classList.add('on');
  const sheet = document.getElementById('addSheet');
  sheet.classList.add('on');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  updateAmountCurrency();
  updateCats();

  setTimeout(() => {
    const a = document.getElementById('fAmt');
    if (a) a.focus();
  }, 300);
}

function closeSheet() {
  document.getElementById('sheetOverlay').classList.remove('on');
  const sheet = document.getElementById('addSheet');
  sheet.classList.remove('on');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Return focus to whatever opened the sheet (Esc route / a11y)
  if (sheetOpener && typeof sheetOpener.focus === 'function') sheetOpener.focus();
  sheetOpener = null;
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const sheet = document.getElementById('addSheet');
  if (sheet && sheet.classList.contains('on')) closeSheet();
});

/** Labels the amount field, and says what will actually be stored. */
function updateAmountCurrency() {
  const cur = document.getElementById('fAmtCur');
  if (cur) cur.textContent = displayCurrency;

  const note = document.getElementById('fAmtNote');
  if (!note) return;

  if (displayCurrency === baseCurrency) {
    note.textContent = '';
    note.hidden = true;
    return;
  }

  note.hidden = false;
  note.textContent = `Entered in ${displayCurrency} — stored as ${baseCurrency}.`;
}

/* Keep the note honest while the sheet is open behind a currency switch. */
function previewAmountInBase() {
  const note = document.getElementById('fAmtNote');
  const amt  = parseFloat((document.getElementById('fAmt') || {}).value);
  if (!note || note.hidden) return;

  const sym = CURRENCY_SYMBOLS[baseCurrency] || (baseCurrency + ' ');
  note.textContent = (amt > 0)
    ? `${displayCurrency} ${amt} is ${sym}${(amt / exchangeRate).toFixed(2)} stored`
    : `Entered in ${displayCurrency} — stored as ${baseCurrency}.`;
}

/* ============================================================
   ADD TRANSACTION
   ============================================================ */
function addTx() {
  const amt  = parseFloat(document.getElementById('fAmt').value);
  const desc = (document.getElementById('fDesc').value || '').trim();
  const cat  = selectedCat;
  const date = document.getElementById('fDate').value;
  const rec  = document.getElementById('fRecurring') ? document.getElementById('fRecurring').checked : false;

  if (!amt || amt <= 0) {
    Swal.fire({
      title: 'Enter an amount',
      text:  'The amount needs to be greater than zero.',
      icon:  'error',
      confirmButtonText: 'Got it',
      customClass: { confirmButton: 'swal2-confirm danger' },
    }).then(() => {
      const a = document.getElementById('fAmt');
      if (a) a.focus();
    });
    return;
  }

  if (!date) {
    Swal.fire({ title: 'Pick a date', text: 'Choose the date this happened.', icon: 'warning', confirmButtonText: 'OK' })
      .then(() => {
        const d = document.getElementById('fDate');
        if (d) d.focus();
      });
    return;
  }

  // What was typed is in the display currency; the ledger is kept in the base
  const stored = amt / (exchangeRate || 1);

  const txId = Date.now();
  txs.unshift({ id: txId, desc, amount: stored, type: mode, category: cat, date });

  if (rec) {
    recurringTxs.push({
      id: txId,
      desc,
      amount: stored,
      type: mode,
      category: cat,
      startDate: new Date(date).toISOString(),
      lastDate: new Date(date).toISOString()
    });
  }

  save();
  if (typeof render === 'function') render();

  document.getElementById('fAmt').value  = '';
  document.getElementById('fDesc').value = '';
  if (document.getElementById('fRecurring')) document.getElementById('fRecurring').checked = false;
  closeSheet();

  Swal.fire({
    title: mode === 'income' ? 'Money in' : 'Money out',
    text:  desc ? `${fmt(stored)} — ${desc}` : fmt(stored),
    icon:  'success',
    timer: 1800,
    showConfirmButton: false,
    timerProgressBar: true,
  });
}

/* ── DELETE TRANSACTION ── */
function delTx(id) {
  const tx = txs.find(t => t.id === id);
  Swal.fire({
    title: 'Delete this transaction?',
    html:  `<b>${esc(tx?.desc || 'No description')}</b><br>${fmt(tx?.amount || 0)}`,
    icon:  'warning',
    showCancelButton:  true,
    confirmButtonText: 'Delete',
    cancelButtonText:  'Keep it',
    customClass: { confirmButton: 'swal2-confirm danger', cancelButton: 'swal2-cancel' },
  }).then(r => {
    if (r.isConfirmed) {
      txs = txs.filter(t => t.id !== id);
      save();
      if (typeof render === 'function') render();
    }
  });
}

/* ── CLEAR ALL ── */
function clearAll() {
  if (!txs.length && !recurringTxs.length) {
    Swal.fire({ title: 'Nothing to clear', text: 'There is no data stored yet.', icon: 'info', confirmButtonText: 'OK' });
    return;
  }
  Swal.fire({
    title:             'Delete everything?',
    text:              'This removes every transaction from this browser. It cannot be undone.',
    icon:              'warning',
    showCancelButton:  true,
    confirmButtonText: 'Delete all',
    cancelButtonText:  'Cancel',
    customClass: { confirmButton: 'swal2-confirm danger', cancelButton: 'swal2-cancel' },
  }).then(r => {
    if (r.isConfirmed) {
      txs = [];
      recurringTxs = [];
      save();
      if (typeof render === 'function') render();
      Swal.fire({ title: 'All cleared', icon: 'success', timer: 1400, showConfirmButton: false, timerProgressBar: true });
    }
  });
}

/* ============================================================
   CHART COLOUR HELPER
   Reads the live tokens so charts always match the active theme.
   ============================================================ */
function getCC() {
  const dk = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid:    dk ? 'rgba(255,255,255,0.06)' : 'rgba(14,15,12,0.07)',
    tick:    dk ? '#7e867a' : '#7d8478',
    legend:  dk ? '#a9b0a2' : '#545a4f',
    tbg:     dk ? '#21241b' : '#0e0f0c',
    tborder: dk ? '#3b4033' : '#0e0f0c',
    ttitle:  dk ? '#f4f6f0' : '#ffffff',
    tbody:   dk ? '#a9b0a2' : '#d8dcd4',
    surface: dk ? '#17190f' : '#ffffff',
    empty:   dk ? '#2d3126' : '#e6e8e2',
    pos:     dk ? '#9fe870' : '#4e9f3d',
    neg:     dk ? '#ff8f7a' : '#c9432c',
    font:    "'Plus Jakarta Sans'",
    dk,
  };
}

/* ============================================================
   PAGE INIT
   ============================================================ */
hydrateIcons();  // markup above this script tag is already parsed

document.addEventListener('DOMContentLoaded', () => {
  hydrateIcons();

  // Default the sheet's date picker to today
  const fd = document.getElementById('fDate');
  if (fd) fd.value = new Date().toISOString().split('T')[0];

  applyTheme();
  refreshCurrencyUI();           // usable immediately, before any rate call lands
  updateCats();
  updateMonth();
  wireCurrencyClicks();
  wireCategoryClicks();
  wireAmountNote();

  if (typeof renderCategorySettings === 'function') renderCategorySettings();
  if (typeof renderFilterChips === 'function') renderFilterChips();
  if (typeof render === 'function') render();
});

/* ============================================================
   DELEGATED CLICKS
   The pills, the balance and the category tiles are all re-rendered
   from scratch, so their handlers live on the containers instead.
   ============================================================ */
function wireCurrencyClicks() {
  const row = document.getElementById('heroCurRow');
  if (row) {
    row.addEventListener('click', e => {
      const b = e.target.closest('.cur-pill[data-cur]');
      if (b) setDisplayCurrency(b.dataset.cur);
    });
  }

  const alt = document.getElementById('heroAlt');
  if (alt) {
    alt.addEventListener('click', e => {
      const b = e.target.closest('.alt-cur[data-cur]');
      if (b) setDisplayCurrency(b.dataset.cur);
    });
  }

  const hb = document.getElementById('heroBalance');
  if (hb) {
    hb.addEventListener('click', cycleDisplayCurrency);
    hb.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycleDisplayCurrency(); }
    });
  }

  const wl = document.getElementById('walletList');
  if (wl) {
    wl.addEventListener('click', e => {
      const b = e.target.closest('[data-remove]');
      if (b) removeWalletCurrency(b.getAttribute('data-remove'));
    });
  }
}

function wireAmountNote() {
  const amt = document.getElementById('fAmt');
  if (amt) amt.addEventListener('input', previewAmountInBase);
}

function wireCategoryClicks() {
  const box = document.getElementById('fCatPicker');
  if (box) {
    box.addEventListener('click', e => {
      const b = e.target.closest('.cat-opt[data-cat]');
      if (b) pickCat(b.getAttribute('data-cat'));
    });
  }

  ['catListIncome', 'catListExpense'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-del-cat]');
      if (b) deleteCategory(b.getAttribute('data-del-cat'));
    });
  });
}
