/**
 * ExpenseTracker — shared.js
 * Shared state, utilities, and UI functions used by all 3 pages.
 */

/* ── CATEGORY MAPS ── */
const CAT_COLOR = {
  Food:          '#e8a020',
  Transport:     '#3b82f6',
  Shopping:      '#a855f7',
  Health:        '#22a75e',
  Bills:         '#06b6d4',
  Entertainment: '#f59e0b',
  Travel:        '#ef4444',
  Education:     '#10b981',
  Salary:        '#22a75e',
  Freelance:     '#8b5cf6',
  Investment:    '#f59e0b',
  General:       '#6b7280',
  Other:         '#6b7280',
};

const CAT_EMOJI = {
  Food:          '🍽',
  Transport:     '🚗',
  Shopping:      '🛍',
  Health:        '💊',
  Bills:         '⚡',
  Entertainment: '🎬',
  Travel:        '✈️',
  Education:     '📚',
  Salary:        '💼',
  Freelance:     '💻',
  Investment:    '📈',
  General:       '☕',
  Other:         '💡',
};

const INCOME_CATS = [
  { v: 'Salary',     l: '💼 Salary'     },
  { v: 'Freelance',  l: '💻 Freelance'  },
  { v: 'Investment', l: '📈 Investment' },
];

const EXPENSE_CATS = [
  { v: 'General',       l: '☕ General'           },
  { v: 'Food',          l: '🍽 Food & Dining'     },
  { v: 'Transport',     l: '🚗 Transport'         },
  { v: 'Shopping',      l: '🛍 Shopping'          },
  { v: 'Health',        l: '💊 Health'            },
  { v: 'Bills',         l: '⚡ Bills & Utilities' },
  { v: 'Entertainment', l: '🎬 Entertainment'     },
  { v: 'Travel',        l: '✈️ Travel'            },
  { v: 'Education',     l: '📚 Education'         },
  { v: 'Other',         l: '💡 Other'             },
];

/* ── STATE ── */
let txs      = JSON.parse(localStorage.getItem('et_txs') || '[]');
let isDark   = localStorage.getItem('et_theme') !== 'light';
let mode     = 'income';
let viewDate = new Date();

/* ── STORAGE ── */
function save() {
  localStorage.setItem('et_txs', JSON.stringify(txs));
}

/* ── UTILITIES ── */
function fmt(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

/* ── THEME ── */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const tb = document.getElementById('themeBtn');
  if (tb) tb.textContent = isDark ? '☀️' : '🌙';
  const td = document.getElementById('darkToggle');
  if (td) td.checked = isDark;
  localStorage.setItem('et_theme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
  isDark = !isDark;
  applyTheme();
  if (typeof renderCharts === 'function') setTimeout(renderCharts, 40);
}

/* ── MONTH NAVIGATION ── */
function updateMonth() {
  const label = viewDate
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase();
  document.querySelectorAll('.mpill-label').forEach(el => (el.textContent = label));
}

function changeMonth(dir) {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1);
  updateMonth();
  if (typeof render === 'function') render();
}

/* ── TRANSACTION TYPE ── */
function setType(t) {
  mode = t;
  const bi = document.getElementById('btnInc');
  const be = document.getElementById('btnExp');
  if (bi) bi.className = 'type-seg-btn' + (t === 'income'  ? ' sel-inc' : '');
  if (be) be.className = 'type-seg-btn' + (t === 'expense' ? ' sel-exp' : '');
  updateCats();
}

function updateCats() {
  const sel = document.getElementById('fCat');
  if (!sel) return;
  const cats = mode === 'income' ? INCOME_CATS : EXPENSE_CATS;
  sel.innerHTML = cats.map(c => `<option value="${c.v}">${c.l}</option>`).join('');
}

/* ── ADD SHEET ── */
function openSheet() {
  document.getElementById('sheetOverlay').classList.add('on');
  document.getElementById('addSheet').classList.add('on');
  setTimeout(() => {
    const a = document.getElementById('fAmt');
    if (a) a.focus();
  }, 350);
}

function closeSheet() {
  document.getElementById('sheetOverlay').classList.remove('on');
  document.getElementById('addSheet').classList.remove('on');
}

/* ── ADD TRANSACTION ── */
function addTx() {
  const amt  = parseFloat(document.getElementById('fAmt').value);
  const desc = (document.getElementById('fDesc').value || '').trim();
  const cat  = document.getElementById('fCat').value;
  const date = document.getElementById('fDate').value;

  if (!amt || amt <= 0) {
    Swal.fire({
      title: 'Invalid Amount',
      text:  'Enter an amount greater than $0.',
      icon:  'error',
      confirmButtonText: 'Fix it',
      customClass: { confirmButton: 'swal2-confirm danger' },
    });
    return;
  }

  if (!date) {
    Swal.fire({ title: 'No Date', text: 'Please select a date.', icon: 'warning', confirmButtonText: 'OK' });
    return;
  }

  txs.unshift({ id: Date.now(), desc, amount: amt, type: mode, category: cat, date });
  save();
  if (typeof render === 'function') render();

  document.getElementById('fAmt').value  = '';
  document.getElementById('fDesc').value = '';
  closeSheet();

  Swal.fire({
    title: mode === 'income' ? '💰 Income Logged' : '💸 Expense Logged',
    text:  desc ? `${fmt(amt)} — ${desc}` : fmt(amt),
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
    title: 'Delete this entry?',
    html:  `<b style="color:var(--red)">${esc(tx?.desc || '(no description)')}</b><br>${fmt(tx?.amount || 0)}`,
    icon:  'warning',
    showCancelButton:  true,
    confirmButtonText: 'Delete',
    cancelButtonText:  'Cancel',
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
  if (!txs.length) {
    Swal.fire({ title: 'Nothing to clear', icon: 'info', confirmButtonText: 'OK' });
    return;
  }
  Swal.fire({
    title:             'Wipe all data?',
    text:              `Permanently delete all ${txs.length} transactions.`,
    icon:              'warning',
    showCancelButton:  true,
    confirmButtonText: 'Delete All',
    cancelButtonText:  'Cancel',
    customClass: { confirmButton: 'swal2-confirm danger', cancelButton: 'swal2-cancel' },
  }).then(r => {
    if (r.isConfirmed) {
      txs = [];
      save();
      if (typeof render === 'function') render();
      Swal.fire({ title: 'Cleared', icon: 'success', timer: 1400, showConfirmButton: false, timerProgressBar: true });
    }
  });
}

/* ── CHART COLOUR HELPER ── */
function getCC() {
  const dk = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid:    dk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    tick:    dk ? '#5a5550' : '#b0a898',
    legend:  dk ? '#a09888' : '#6b6358',
    tbg:     dk ? '#181818' : '#fff',
    tborder: '#e8a020',
    ttitle:  '#e8a020',
    tbody:   dk ? '#a09888' : '#6b6358',
    dk,
  };
}

/* ── PAGE INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Set today's date in the sheet date picker
  const fd = document.getElementById('fDate');
  if (fd) fd.value = new Date().toISOString().split('T')[0];

  applyTheme();
  updateCats();
  updateMonth();

  // Render the current page
  if (typeof render === 'function') render();
});
