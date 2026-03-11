/**
 * ExpenseTracker — settings.js
 * Settings page: display live stats and sync theme toggle.
 * Depends on: shared.js
 */

function render() {
  // Total transaction count
  document.getElementById('totalEntries').textContent = txs.length + ' transactions';

  // This-month summary
  const mt  = monthTxs();
  const inc = mt.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  document.getElementById('monthSummary').textContent = `${fmt(inc)} in · ${fmt(exp)} out`;

  // Keep settings toggle in sync with current theme
  const dd = document.getElementById('darkToggle');
  if (dd) dd.checked = isDark;
}
