/**
 * ExpenseTracker — transactions.js
 * Transactions page: category filters and the day-grouped activity list.
 * Depends on: shared.js
 */

let filter = 'all';

/* ============================================================
   FILTER CHIPS
   Built from the live category list so a category the user adds
   shows up here the moment it exists.
   ============================================================ */
function renderFilterChips() {
  const bar = document.getElementById('filterChips');
  if (!bar) return;

  const fixed = [
    { f: 'all',     l: 'All',       ic: 'layers'   },
    { f: 'income',  l: 'Money in',  ic: 'arrowIn'  },
    { f: 'expense', l: 'Money out', ic: 'arrowOut' },
  ];

  const chip = (f, label, iconName, color) =>
    `<button class="chip${filter === f ? ' on' : ''}" data-filter="${esc(f)}"
             aria-pressed="${filter === f}"${color ? ` style="--cat:${color}"` : ''}>` +
    `${icon(iconName)}${esc(label)}</button>`;

  bar.innerHTML =
    fixed.map(c => chip(c.f, c.l, c.ic)).join('') +
    cats('income').map(c => chip(c.v, c.l, c.icon, c.color)).join('') +
    cats('expense').map(c => chip(c.v, c.l, c.icon, c.color)).join('');
}

function setFilter(f) {
  filter = f;
  renderFilterChips();
  render();
}

/* ── DAY HEADINGS — "Today", "Yesterday", then the date ── */
function dayLabel(iso) {
  const d     = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';

  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  const mt = monthTxs();

  let shown = mt;
  if (filter === 'income')       shown = mt.filter(t => t.type === 'income');
  else if (filter === 'expense') shown = mt.filter(t => t.type === 'expense');
  else if (!['all', 'income', 'expense'].includes(filter))
                                 shown = mt.filter(t => t.category === filter);

  document.getElementById('txBadge').textContent =
    shown.length + (shown.length === 1 ? ' transaction' : ' transactions');

  const list = document.getElementById('txList');

  if (!shown.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">${icon('inbox')}</span>
        <div class="empty-title">${filter === 'all' ? 'No transactions yet' : 'Nothing matches this filter'}</div>
        <div class="empty-sub">${
          filter === 'all'
            ? 'Add your first one for this month and it will appear here.'
            : 'Try a different category, or pick another month.'
        }</div>
      </div>`;
    return;
  }

  // Newest day first; within a day, newest entry first
  const byDay = new Map();
  shown.slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id))
    .forEach(t => {
      if (!byDay.has(t.date)) byDay.set(t.date, []);
      byDay.get(t.date).push(t);
    });

  let html = '';
  byDay.forEach((items, date) => {
    html += `<div class="tx-day">${dayLabel(date)}</div>`;

    html += items.map(t => {
      const isIncome = t.type === 'income';
      const nameHtml = t.desc
        ? `<div class="tx-name">${esc(t.desc)}</div>`
        : `<div class="tx-name is-blank">No description</div>`;

      return `
        <div class="tx-item">
          ${catAvatar(t.category)}
          <div class="tx-body">
            ${nameHtml}
            <div class="tx-meta">${esc(catLabel(t.category))} · ${isIncome ? 'Money in' : 'Money out'}</div>
          </div>
          <div class="tx-right">
            <div class="tx-amount ${isIncome ? 'inc' : ''}">${isIncome ? '+' : '−'}${fmt(t.amount)}</div>
            <button class="tx-del" onclick="delTx(${t.id})"
                    aria-label="Delete ${esc(t.desc || catLabel(t.category))}">${icon('trash')}</button>
          </div>
        </div>`;
    }).join('');
  });

  list.innerHTML = html;
}

/* Chips are re-rendered on every change, so the handler lives on the bar. */
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('filterChips');
  if (!bar) return;
  bar.addEventListener('click', e => {
    const b = e.target.closest('.chip[data-filter]');
    if (b) setFilter(b.getAttribute('data-filter'));
  });
});
