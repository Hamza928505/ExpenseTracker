/**
 * ExpenseTracker — transactions.js
 * Transactions page: filter chips and list rendering.
 * Depends on: shared.js
 */

let filter = 'all';

/* ── FILTER CHIP ── */
function setFilter(f, el) {
  filter = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  render();
}

/* ── RENDER TRANSACTION LIST ── */
function render() {
  const mt = monthTxs();

  let shown = mt;
  if (filter === 'income')       shown = mt.filter(t => t.type === 'income');
  else if (filter === 'expense') shown = mt.filter(t => t.type === 'expense');
  else if (!['all', 'income', 'expense'].includes(filter))
                                 shown = mt.filter(t => t.category === filter);

  document.getElementById('txBadge').textContent = shown.length + ' entries';

  const list = document.getElementById('txList');

  if (!shown.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        No transactions found.<br>Tap + to add one.
      </div>`;
    return;
  }

  list.innerHTML = shown.map(t => {
    const d       = new Date(t.date + 'T00:00:00');
    const ds      = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const col     = CAT_COLOR[t.category] || '#6b7280';
    const nameHtml = t.desc
      ? esc(t.desc)
      : '<span style="color:var(--text3);font-style:italic">No description</span>';

    return `
      <div class="tx-item">
        <div class="tx-ico" style="background:${col}22">${CAT_EMOJI[t.category] || '💡'}</div>
        <div class="flex-grow-1 overflow-hidden">
          <div class="tx-name">${nameHtml}</div>
          <div class="d-flex gap-1 mt-1 flex-wrap">
            <span class="tx-pill">${t.category}</span>
            <span class="tx-pill">${ds}</span>
            <span class="tx-pill">${t.type}</span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <div class="tx-amount ${t.type === 'income' ? 'inc' : 'exp'}">
            ${t.type === 'income' ? '+' : '−'}${fmt(t.amount)}
          </div>
          <button class="tx-del" onclick="delTx(${t.id})" aria-label="Delete">✕</button>
        </div>
      </div>`;
  }).join('');
}
