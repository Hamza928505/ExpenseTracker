/**
 * ExpenseTracker — settings.js
 * Settings page: live stats, currency preferences, and the converter.
 * Depends on: shared.js
 */

function render() {
  // Total transaction count
  document.getElementById('totalEntries').textContent =
    txs.length + (txs.length === 1 ? ' transaction' : ' transactions');

  // This-month summary
  const mt  = monthTxs();
  const inc = mt.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  document.getElementById('monthSummary').textContent = `${fmt(inc)} in · ${fmt(exp)} out`;

  // Keep the theme toggle in sync
  const dd = document.getElementById('darkToggle');
  if (dd) dd.checked = isDark;

  // Currency selectors
  const bcs = document.getElementById('baseCurrencySelect');
  if (bcs) bcs.value = baseCurrency;

  const dcs = document.getElementById('displayCurrencySelect');
  if (dcs) dcs.value = displayCurrency;

  renderWalletSettings();
  renderCategorySettings();

  document.querySelectorAll('[data-cur-flag]').forEach(el => {
    el.innerHTML = flag(el.getAttribute('data-cur-flag') === 'base' ? baseCurrency : displayCurrency, 'flag-lg');
  });
}

/* ============================================================
   CATEGORIES
   Built-ins are listed for reference; only the user's own can go.
   ============================================================ */
function renderCategorySettings() {
  [['income', 'catListIncome'], ['expense', 'catListExpense']].forEach(([side, id]) => {
    const box = document.getElementById(id);
    if (!box) return;

    box.innerHTML = cats(side).map(c => `
      <div class="cat-row">
        ${catAvatar(c.v, true)}
        <div class="cat-row-body">
          <div class="cat-row-name">${esc(c.l)}</div>
          <div class="cat-row-sub">${c.custom ? 'Yours' : 'Built in'}</div>
        </div>
        ${c.custom
          ? `<button class="cat-row-del" data-del-cat="${esc(c.v)}"
                     aria-label="Delete ${esc(c.l)}">${icon('trash')}</button>`
          : ''}
      </div>`).join('');
  });
}

/* ============================================================
   CURRENCY WALLET
   ============================================================ */
function addSelectedWalletCurrency() {
  const sel = document.getElementById('walletAddSelect');
  if (!sel || !sel.value) return;
  addWalletCurrency(sel.value);
}

/**
 * Changing the main currency re-denominates the ledger — the money did not
 * change, only the unit it is counted in — so every stored amount is
 * converted at the live rate. Without a rate we refuse rather than silently
 * relabel JD 1,271.60 as $1,271.60.
 */
async function updateBaseCurrency() {
  const bcs = document.getElementById('baseCurrencySelect');
  if (!bcs) return;

  const next = bcs.value;
  const prev = baseCurrency;
  if (next === prev) return;

  const revert = () => { bcs.value = prev; };

  // rateFor() is still keyed on the old base here, which is exactly the
  // old → new rate we need.
  let r = rateFor(next);
  if (r === null) {
    await fetchExchangeRate();
    r = rateFor(next);
  }
  if (r === null) {
    revert();
    Swal.fire({
      title: 'Cannot switch yet',
      text: `No rate for ${prev} → ${next} right now. Try again once you are online.`,
      icon: 'info',
      confirmButtonText: 'OK',
    });
    return;
  }

  const confirm = await Swal.fire({
    title: `Switch to ${next}?`,
    html: `Your ${txs.length} stored amount${txs.length === 1 ? '' : 's'} will be converted at ` +
          `<b>1 ${prev} = ${r.toFixed(4)} ${next}</b>, so nothing changes in value — ` +
          `only the currency they are kept in.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: `Switch to ${next}`,
    cancelButtonText: 'Cancel',
  });

  if (!confirm.isConfirmed) {
    revert();
    return;
  }

  txs.forEach(t => { t.amount = t.amount * r; });
  recurringTxs.forEach(t => { t.amount = t.amount * r; });

  baseCurrency    = next;
  displayCurrency = next;
  ratesData       = null;   // the cached table is for the old base
  exchangeRate    = 1;

  saveWallet();
  save();
  render();

  const ok = await fetchExchangeRate(); // fetches, then re-renders
  render();
  if (!ok) return;                      // it reports its own failure

  Swal.fire({
    title: 'Main currency set',
    text: `Amounts are now stored and shown in ${baseCurrency}.`,
    icon: 'success',
    timer: 1800,
    showConfirmButton: false,
  });
}

async function updateDisplayCurrency() {
  const dcs = document.getElementById('displayCurrencySelect');
  if (!dcs) return;

  const ok = await setDisplayCurrency(dcs.value, true);
  render();
  if (!ok) return;

  Swal.fire({
    title: 'Showing ' + displayCurrency,
    text: `Amounts are now converted to ${displayCurrency}.`,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  });
}

async function convertCurrency() {
  const amt   = parseFloat(document.getElementById('convAmount').value);
  const from  = document.getElementById('convFrom').value;
  const to    = document.getElementById('convTo').value;
  const resEl = document.getElementById('convResult');

  const show = (text, state) => {
    resEl.textContent = text;
    resEl.className = 'conv-result' + (state ? ' ' + state : '');
  };

  if (!amt || amt <= 0) {
    show('Enter an amount greater than zero.', 'is-error');
    return;
  }

  if (from === to) {
    show(`${amt.toFixed(2)} ${to}`, 'is-done');
    return;
  }

  show('Converting…', 'is-loading');

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!res.ok) throw new Error('Request failed');

    const data = await res.json();
    const rate = data.rates[to];
    if (!rate) throw new Error('Rate unavailable');

    show(`${(amt * rate).toFixed(2)} ${to}`, 'is-done');
  } catch (err) {
    console.error(err);
    show('Could not fetch rates. Check your connection and try again.', 'is-error');
  }
}
