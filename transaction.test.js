const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const storage = new Map([
  ['et_txs', JSON.stringify([{ id: 1, desc: 'Old', amount: 10, tax: 1, type: 'expense', category: 'General', date: '2026-09-21' }])],
  ['et_base_currency', 'JOD'],
  ['et_display_currency', 'JOD'],
]);
const element = () => ({
  value: '', checked: false, hidden: false, textContent: '', innerHTML: '', className: '', style: {},
  classList: { add() {}, remove() {}, contains() { return true; } },
  setAttribute() {}, addEventListener() {}, focus() {},
});
const elements = {};
[
  'fAmt', 'fTax', 'fDesc', 'fDate', 'fRecurring', 'fScanStatus', 'sheetTitle',
  'fSubmitBtn', 'fRecurringRow', 'sheetOverlay', 'addSheet', 'fAmtCur', 'fTaxCur',
  'fAmtNote', 'fCatPicker', 'btnInc', 'btnExp',
].forEach(id => { elements[id] = element(); });

const context = {
  localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  },
  document: {
    activeElement: element(), body: { style: {} },
    documentElement: { setAttribute() {}, getAttribute() { return 'light'; } },
    getElementById: id => elements[id] || null,
    querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, createElement: element,
  },
  fetch: async () => ({ ok: true, json: async () => ({ date: '2026-09-21', rates: { JOD: 1, USD: 1.4 } }) }),
  Swal: { fire: () => ({ then() {} }) },
  setTimeout: fn => fn(),
  console: { error() {} },
};

vm.runInNewContext(`${fs.readFileSync('shared.js', 'utf8')}
  editTx(1);
  document.getElementById('fAmt').value = '20';
  document.getElementById('fTax').value = '2';
  document.getElementById('fDesc').value = 'Updated';
  addTx();
  globalThis.checkedTx = txs[0];
  globalThis.checkedCount = txs.length;
`, context);

assert.equal(context.checkedCount, 1);
assert.deepEqual(
  JSON.parse(JSON.stringify(context.checkedTx)),
  { id: 1, desc: 'Updated', amount: 20, tax: 2, type: 'expense', category: 'General', date: '2026-09-21' },
);
