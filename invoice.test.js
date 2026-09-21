// Run with: node invoice.test.js (no browser or downloads required).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const elements = Object.fromEntries([
  'fScanBtn', 'fScanLang', 'fSubmitBtn', 'fScanPreview', 'fScanText', 'fScanStatus',
  'fAmt', 'fTax', 'fDesc', 'fDate',
].map(id => [id, { value: '', textContent: '', disabled: false, classList: { toggle() {} } }]));
elements.fScanLang.value = 'auto';
let text = 'متجر عمان\nضريبة القيمة المضافة 9616 4.00\nالإجمالي الكلي 29.00';
let recognitionError;
let releaseRecognition;
const workers = [];
const context = vm.createContext({
  document: { getElementById: id => elements[id] },
  window: { Tesseract: { createWorker: async (languages, oem, options) => {
    const worker = {
      languages, oem, options, terminated: false,
      setParameters: async () => {},
      detect: async () => ({ data: { script: 'Arabic' } }),
      recognize: async () => {
        if (recognitionError) throw recognitionError;
        if (releaseRecognition) await new Promise(resolve => { releaseRecognition = resolve; });
        return { data: { text, confidence: 90 } };
      },
      terminate: async () => { worker.terminated = true; },
    };
    workers.push(worker);
    return worker;
  } } },
  setType() {}, previewAmountInBase() {}, setTimeout, clearTimeout,
});
vm.runInContext(fs.readFileSync('invoice.js', 'utf8'), context);
const scan = () => context.scanInvoice({ files: [{ type: 'image/png', size: 100 }], value: 'invoice.png' });

(async () => {
  await scan();
  assert.equal(workers[0].languages, 'osd');
  assert.equal(workers[0].oem, 0);
  assert.equal(workers[0].terminated, true);
  assert.deepEqual(Array.from(workers[1].languages), ['ara', 'eng']);
  assert.equal(elements.fAmt.value, 29);
  assert.equal(elements.fTax.value, 4);
  assert.equal(elements.fScanText.textContent, text);
  assert.equal(elements.fScanPreview.hidden, false);
  assert.equal(elements.fSubmitBtn.disabled, false);

  elements.fScanLang.value = 'ara';
  text = '';
  await scan();
  assert.equal(elements.fAmt.value, 29, 'Empty scans must preserve existing inputs');
  assert.match(elements.fScanStatus.textContent, /No readable text/);

  recognitionError = 'Network error loading OCR';
  await scan();
  assert.equal(elements.fScanStatus.textContent, recognitionError);
  assert.equal(elements.fScanBtn.disabled, false);
  assert.equal(workers[1].terminated, true);
  recognitionError = null;

  await assert.rejects(context.createInvoiceWorker({ createWorker: (_, __, options) => {
    options.errorHandler('Language download failed');
    return new Promise(() => {});
  } }, 'eng', 1), /Language download failed/);

  text = 'Shop\nGrand Total 99.00';
  releaseRecognition = true;
  const pending = scan();
  await new Promise(resolve => setImmediate(resolve));
  vm.runInContext('invoiceScanId++', context); // Closing the transaction sheet.
  elements.fAmt.value = 7;
  releaseRecognition();
  await pending;
  assert.equal(elements.fAmt.value, 7, 'Do not fill a different transaction after closing');
  console.log('Invoice scan regression checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
