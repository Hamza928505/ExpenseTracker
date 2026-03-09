/**
 * ExpenseTracker — index.js
 * Dashboard: hero card, stat cards, analytics charts, spending breakdown.
 * Depends on: shared.js, Chart.js
 */

let flowChart  = null;
let donutChart = null;
let pieChart   = null;

/* ── CHART TAB SWITCHER ── */
function showChart(id, el) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.chart-pane').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('cp-' + id).classList.add('on');
}

/* ── MAIN RENDER ── */
function render() {
  const mt  = monthTxs();
  const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const bal = inc - exp;

  // Hero card
  const hb = document.getElementById('heroBalance');
  hb.textContent = fmt(Math.abs(bal));
  hb.style.color = bal < 0 ? 'rgba(180,0,0,0.85)' : '#000';
  document.getElementById('heroIncome').textContent   = fmt(inc);
  document.getElementById('heroExpenses').textContent = fmt(exp);

  // Stat cards
  document.getElementById('statIncome').textContent   = fmt(inc);
  document.getElementById('statExpenses').textContent = fmt(exp);
  document.getElementById('statIncCount').textContent =
    mt.filter(t => t.type === 'income').length  + ' entries';
  document.getElementById('statExpCount').textContent =
    mt.filter(t => t.type === 'expense').length + ' entries';

  // Chart badge (current month label)
  const cb = document.getElementById('chartBadge');
  if (cb) cb.textContent = viewDate
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase();

  // Spending breakdown
  const expT  = mt.filter(t => t.type === 'expense');
  const bycat = {};
  expT.forEach(t => { bycat[t.category] = (bycat[t.category] || 0) + t.amount; });
  const sorted = Object.entries(bycat).sort((a, b) => b[1] - a[1]);

  document.getElementById('bdgCats').textContent = sorted.length + ' categories';
  const bd = document.getElementById('breakdown');

  if (!sorted.length) {
    bd.innerHTML = `<div class="empty-state"><span class="empty-icon">📊</span>No spending data yet</div>`;
  } else {
    const mx = sorted[0][1];
    bd.innerHTML = sorted.map(([cat, amt]) => `
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="br-name">${CAT_EMOJI[cat] || '💡'} ${cat}</span>
          <span class="br-val">${fmt(amt)}</span>
        </div>
        <div class="br-track">
          <div class="br-fill" style="width:${(amt / mx * 100).toFixed(1)}%; background:${CAT_COLOR[cat] || '#6b7280'}"></div>
        </div>
      </div>`).join('');
  }

  renderCharts(mt);
}

/* ── CHARTS ── */
function renderCharts(mt) {
  const c = getCC();

  // ── 1. Six-month flow bar chart ──────────────────────────────────
  const months = [], incD = [], expD = [];
  for (let i = 5; i >= 0; i--) {
    const d  = new Date(viewDate.getFullYear(), viewDate.getMonth() - i, 1);
    const mx = txs.filter(t => {
      const td = new Date(t.date + 'T00:00:00');
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    });
    months.push(d.toLocaleDateString('en-US', { month: 'short' }));
    incD.push(mx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
    expD.push(mx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  }

  if (flowChart) flowChart.destroy();
  flowChart = new Chart(
    document.getElementById('flowChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Income',  data: incD, backgroundColor: 'rgba(34,167,94,0.7)',  borderColor: '#22a75e', borderWidth: 2, borderRadius: 4 },
          { label: 'Expense', data: expD, backgroundColor: 'rgba(217,79,79,0.7)', borderColor: '#d94f4f', borderWidth: 2, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: c.legend, font: { family: "'JetBrains Mono'", size: 10 }, boxWidth: 10, padding: 10 },
          },
          tooltip: {
            backgroundColor: c.tbg, borderColor: c.tborder, borderWidth: 1,
            titleFont: { family: "'Syne'", size: 12, weight: 'bold' },
            bodyFont:  { family: "'JetBrains Mono'", size: 11 },
            titleColor: c.ttitle, bodyColor: c.tbody,
            callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` },
          },
        },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.tick, font: { family: "'JetBrains Mono'", size: 10 } } },
          y: { grid: { color: c.grid }, ticks: { color: c.tick, font: { family: "'JetBrains Mono'", size: 10 }, callback: v => '$' + v } },
        },
      },
    }
  );

  // ── 2. Expense donut chart ────────────────────────────────────────
  const expTx = mt.filter(t => t.type === 'expense');
  const bc    = {};
  expTx.forEach(t => { bc[t.category] = (bc[t.category] || 0) + t.amount; });
  const keys = Object.keys(bc);
  const vals = Object.values(bc);
  const cols = keys.map(k => CAT_COLOR[k] || '#6b7280');
  const eb   = c.dk ? '#202020' : '#ede9e2';
  const brd  = c.dk ? '#181818' : '#fff';

  if (donutChart) donutChart.destroy();
  const donutCtx = document.getElementById('donutChart').getContext('2d');

  donutChart = !vals.length
    ? new Chart(donutCtx, {
        type: 'doughnut',
        data: { labels: ['No data'], datasets: [{ data: [1], backgroundColor: [eb], borderColor: 'transparent', borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, cutout: '68%' },
      })
    : new Chart(donutCtx, {
        type: 'doughnut',
        data: { labels: keys, datasets: [{ data: vals, backgroundColor: cols, borderColor: brd, borderWidth: 3 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '62%',
          plugins: {
            legend: { position: 'bottom', labels: { color: c.legend, font: { family: "'JetBrains Mono'", size: 10 }, boxWidth: 10, padding: 8 } },
            tooltip: {
              backgroundColor: c.tbg, borderColor: c.tborder, borderWidth: 1,
              titleFont: { family: "'Syne'", size: 12, weight: 'bold' },
              bodyFont:  { family: "'JetBrains Mono'", size: 11 },
              titleColor: c.ttitle, bodyColor: c.tbody,
              callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` },
            },
          },
        },
      });

  // ── 3. Monthly report pie (all categories, inc + exp) ────────────
  const ac  = {};
  mt.forEach(t => { ac[t.category] = (ac[t.category] || 0) + t.amount; });
  const pk  = Object.keys(ac);
  const pv  = Object.values(ac);
  const pc  = pk.map(k => CAT_COLOR[k] || '#6b7280');
  const tot = pv.reduce((a, b) => a + b, 0) || 1;

  if (pieChart) pieChart.destroy();
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  pieChart = !pv.length
    ? new Chart(pieCtx, {
        type: 'pie',
        data: { labels: ['No data'], datasets: [{ data: [1], backgroundColor: [eb], borderColor: 'transparent', borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } },
      })
    : new Chart(pieCtx, {
        type: 'pie',
        data: { labels: pk, datasets: [{ data: pv, backgroundColor: pc, borderColor: brd, borderWidth: 2 }] },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: c.legend, font: { family: "'JetBrains Mono'", size: 10 }, boxWidth: 10, padding: 8 } },
            tooltip: {
              backgroundColor: c.tbg, borderColor: c.tborder, borderWidth: 1,
              titleFont: { family: "'Syne'", size: 12, weight: 'bold' },
              bodyFont:  { family: "'JetBrains Mono'", size: 11 },
              titleColor: c.ttitle, bodyColor: c.tbody,
              callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)} (${(ctx.raw / tot * 100).toFixed(1)}%)` },
            },
          },
        },
      });
}
