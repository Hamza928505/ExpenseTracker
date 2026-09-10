/**
 * ExpenseTracker — index.js
 * Home: balance panel, money in/out cards, analytics charts, spending breakdown.
 * Depends on: shared.js, Chart.js
 */

let flowChart  = null;
let donutChart = null;
let pieChart   = null;

/* ── CHART TAB SWITCHER ── */
function showChart(id, el) {
  document.querySelectorAll('.ctab').forEach(t => {
    t.classList.remove('on');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.chart-pane').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  el.setAttribute('aria-selected', 'true');
  document.getElementById('cp-' + id).classList.add('on');
}

/* ── EMPTY STATE ── */
function emptyState(iconName, title, sub) {
  return `
    <div class="empty-state">
      <span class="empty-icon">${icon(iconName)}</span>
      <div class="empty-title">${title}</div>
      <div class="empty-sub">${sub}</div>
    </div>`;
}

/* ============================================================
   MAIN RENDER
   ============================================================ */
function render() {
  const mt  = monthTxs();
  const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const bal = inc - exp;

  // ── Balance panel ──
  const hb = document.getElementById('heroBalance');
  hb.textContent = (bal < 0 ? '−' : '') + fmt(Math.abs(bal));
  hb.classList.toggle('is-negative', bal < 0);
  hb.title = `${currencyName(displayCurrency)} — tap to switch currency`;

  renderCurrencyPills();
  renderHeroAlt(bal);

  // ── Money in / out cards ──
  const incCount = mt.filter(t => t.type === 'income').length;
  const expCount = mt.filter(t => t.type === 'expense').length;

  document.getElementById('statIncome').textContent   = fmt(inc);
  document.getElementById('statExpenses').textContent = fmt(exp);
  document.getElementById('statIncCount').textContent = incCount + (incCount === 1 ? ' transaction' : ' transactions');
  document.getElementById('statExpCount').textContent = expCount + (expCount === 1 ? ' transaction' : ' transactions');

  // ── Section badge ──
  const cb = document.getElementById('chartBadge');
  if (cb) cb.textContent = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // ── Spending breakdown ──
  const bycat = {};
  mt.filter(t => t.type === 'expense')
    .forEach(t => { bycat[t.category] = (bycat[t.category] || 0) + t.amount; });
  const sorted = Object.entries(bycat).sort((a, b) => b[1] - a[1]);

  document.getElementById('bdgCats').textContent =
    sorted.length + (sorted.length === 1 ? ' category' : ' categories');

  const bd = document.getElementById('breakdown');

  if (!sorted.length) {
    bd.innerHTML = emptyState('pieChart', 'Nothing spent yet',
      'Once you log an expense this month, the split shows up here.');
  } else {
    const mx = sorted[0][1];
    bd.innerHTML = sorted.map(([cat, amt]) => `
      <div class="br-row">
        ${catAvatar(cat, true)}
        <div class="br-body">
          <div class="br-top">
            <span class="br-name">${esc(catLabel(cat))}</span>
            <span class="br-val">${esc(fmt(amt))}</span>
          </div>
          <div class="br-track">
            <div class="br-fill" style="width:${(amt / mx * 100).toFixed(1)}%;background:${catColor(cat)}"></div>
          </div>
        </div>
      </div>`).join('');
  }

  renderCharts(mt);
}

/* ============================================================
   CHARTS
   ============================================================ */
function renderCharts(mt) {
  const c = getCC();

  const baseTooltip = {
    backgroundColor: c.tbg,
    borderColor: c.tborder,
    borderWidth: 1,
    padding: 12,
    cornerRadius: 12,
    displayColors: true,
    boxPadding: 4,
    titleFont: { family: c.font, size: 13, weight: '700' },
    bodyFont:  { family: c.font, size: 13, weight: '500' },
    titleColor: c.ttitle,
    bodyColor:  c.tbody,
  };

  const baseLegend = {
    labels: {
      color: c.legend,
      font: { family: c.font, size: 12, weight: '600' },
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 8,
      boxHeight: 8,
      padding: 14,
    },
  };

  /* ── 1. Six-month flow ──────────────────────────────────── */
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
  flowChart = new Chart(document.getElementById('flowChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Money in',  data: incD, backgroundColor: c.pos, borderRadius: 6, borderSkipped: false, maxBarThickness: 26 },
        { label: 'Money out', data: expD, backgroundColor: c.neg, borderRadius: 6, borderSkipped: false, maxBarThickness: 26 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      layout: { padding: { top: 6 } },   // keeps the top tick clear of the legend
      plugins: {
        legend: { ...baseLegend, position: 'top', align: 'start' },
        tooltip: {
          ...baseTooltip,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}` },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: { color: c.tick, font: { family: c.font, size: 12, weight: '600' } },
        },
        y: {
          border: { display: false },
          grid: { color: c.grid, drawTicks: false },
          ticks: { color: c.tick, font: { family: c.font, size: 12 }, padding: 8, maxTicksLimit: 5, callback: v => fmtShort(v) },
        },
      },
    },
  });

  /* ── 2. Expense split ───────────────────────────────────── */
  const bc = {};
  mt.filter(t => t.type === 'expense')
    .forEach(t => { bc[t.category] = (bc[t.category] || 0) + t.amount; });
  const keys = Object.keys(bc);
  const vals = Object.values(bc);

  if (donutChart) donutChart.destroy();
  const donutCtx = document.getElementById('donutChart').getContext('2d');

  donutChart = !vals.length
    ? new Chart(donutCtx, {
        type: 'doughnut',
        data: { labels: ['No data'], datasets: [{ data: [1], backgroundColor: [c.empty], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
      })
    : new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: keys.map(k => catLabel(k)),
          datasets: [{
            data: vals,
            backgroundColor: keys.map(k => catColor(k)),
            borderColor: c.surface,
            borderWidth: 3,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          animation: { duration: 400 },
          plugins: {
            legend: { ...baseLegend, position: 'bottom' },
            tooltip: {
              ...baseTooltip,
              callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)}` },
            },
          },
        },
      });

  /* ── 3. Everything this month ───────────────────────────── */
  const ac = {};
  mt.forEach(t => { ac[t.category] = (ac[t.category] || 0) + t.amount; });
  const pk  = Object.keys(ac);
  const pv  = Object.values(ac);
  const tot = pv.reduce((a, b) => a + b, 0) || 1;

  if (pieChart) pieChart.destroy();
  const pieCtx = document.getElementById('pieChart').getContext('2d');

  pieChart = !pv.length
    ? new Chart(pieCtx, {
        type: 'doughnut',
        data: { labels: ['No data'], datasets: [{ data: [1], backgroundColor: [c.empty], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
      })
    : new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: pk.map(k => catLabel(k)),
          datasets: [{
            data: pv,
            backgroundColor: pk.map(k => catColor(k)),
            borderColor: c.surface,
            borderWidth: 3,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '55%',
          animation: { duration: 400 },
          plugins: {
            legend: { ...baseLegend, position: 'bottom' },
            tooltip: {
              ...baseTooltip,
              callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)} · ${(ctx.raw / tot * 100).toFixed(1)}%` },
            },
          },
        },
      });
}
