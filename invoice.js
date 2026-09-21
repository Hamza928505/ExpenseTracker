/** Browser-only invoice scanning. Images never leave the device. */
const INVOICE_OCR_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js';
const INVOICE_LANGUAGE_KEY = 'et_invoice_language';
const INVOICE_LANGUAGES = [
  ['afr', 'Afrikaans'], ['sqi', 'Albanian'], ['amh', 'Amharic'], ['grc', 'Ancient Greek'],
  ['ara', 'Arabic'], ['hye', 'Armenian'], ['asm', 'Assamese'], ['aze', 'Azerbaijani'],
  ['aze_cyrl', 'Azerbaijani (Cyrillic)'], ['eus', 'Basque'], ['bel', 'Belarusian'], ['ben', 'Bengali'],
  ['bod', 'Tibetan'], ['bos', 'Bosnian'], ['bre', 'Breton'], ['bul', 'Bulgarian'],
  ['mya', 'Burmese'], ['cat', 'Catalan'], ['ceb', 'Cebuano'], ['chr', 'Cherokee'],
  ['chi_sim', 'Chinese (Simplified)'], ['chi_tra', 'Chinese (Traditional)'], ['cos', 'Corsican'],
  ['hrv', 'Croatian'], ['ces', 'Czech'], ['dan', 'Danish'], ['div', 'Dhivehi'],
  ['nld', 'Dutch'], ['dzo', 'Dzongkha'], ['eng', 'English'], ['enm', 'English (Middle)'],
  ['epo', 'Esperanto'], ['est', 'Estonian'], ['fao', 'Faroese'], ['fil', 'Filipino'],
  ['fin', 'Finnish'], ['fra', 'French'], ['frm', 'French (Middle)'], ['glg', 'Galician'],
  ['kat', 'Georgian'], ['kat_old', 'Georgian (Old)'], ['deu', 'German'], ['frk', 'German (Fraktur)'],
  ['ell', 'Greek'], ['guj', 'Gujarati'], ['hat', 'Haitian Creole'], ['heb', 'Hebrew'],
  ['hin', 'Hindi'], ['hun', 'Hungarian'], ['isl', 'Icelandic'], ['iku', 'Inuktitut'],
  ['ind', 'Indonesian'], ['gle', 'Irish'], ['ita', 'Italian'], ['ita_old', 'Italian (Old)'],
  ['jpn', 'Japanese'], ['jav', 'Javanese'], ['kan', 'Kannada'], ['kaz', 'Kazakh'],
  ['khm', 'Khmer'], ['kir', 'Kyrgyz'], ['kor', 'Korean'], ['kmr', 'Kurdish (Kurmanji)'],
  ['lao', 'Lao'], ['lat', 'Latin'], ['lav', 'Latvian'], ['lit', 'Lithuanian'],
  ['ltz', 'Luxembourgish'], ['mkd', 'Macedonian'], ['msa', 'Malay'], ['mal', 'Malayalam'],
  ['mlt', 'Maltese'], ['mri', 'Maori'], ['mar', 'Marathi'], ['mon', 'Mongolian'],
  ['nep', 'Nepali'], ['nor', 'Norwegian'], ['oci', 'Occitan'], ['ori', 'Odia'],
  ['pus', 'Pashto'], ['fas', 'Persian'], ['pol', 'Polish'], ['por', 'Portuguese'],
  ['pan', 'Punjabi'], ['que', 'Quechua'], ['ron', 'Romanian'], ['rus', 'Russian'],
  ['san', 'Sanskrit'], ['gla', 'Scottish Gaelic'], ['srp', 'Serbian (Cyrillic)'],
  ['srp_latn', 'Serbian (Latin)'], ['snd', 'Sindhi'], ['sin', 'Sinhala'], ['slk', 'Slovak'],
  ['slv', 'Slovenian'], ['spa', 'Spanish'], ['spa_old', 'Spanish (Old)'], ['sun', 'Sundanese'],
  ['swa', 'Swahili'], ['swe', 'Swedish'], ['syr', 'Syriac'], ['tgk', 'Tajik'],
  ['tam', 'Tamil'], ['tat', 'Tatar'], ['tel', 'Telugu'], ['tha', 'Thai'],
  ['tir', 'Tigrinya'], ['ton', 'Tongan'], ['tur', 'Turkish'], ['uig', 'Uyghur'],
  ['ukr', 'Ukrainian'], ['urd', 'Urdu'], ['uzb', 'Uzbek'], ['uzb_cyrl', 'Uzbek (Cyrillic)'],
  ['vie', 'Vietnamese'], ['cym', 'Welsh'], ['fry', 'Western Frisian'], ['yid', 'Yiddish'],
  ['yor', 'Yoruba'],
];
const INVOICE_DIGIT_ZEROES = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6,
  0xc66, 0xce6, 0xd66, 0xde6, 0xe50, 0xed0, 0xf20, 0x1040, 0x1090, 0x17e0,
  0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0, 0x1c40, 0x1c50,
  0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xa9f0, 0xaa50, 0xabf0, 0xff10,
];
let invoiceOcrLoader;
let invoiceOcrWorker;
let invoiceOcrWorkerLanguages = '';

function invoiceDigits(value) {
  return String(value || '')
    .replace(/\p{Nd}/gu, digit => {
      const code = digit.codePointAt(0);
      const zero = INVOICE_DIGIT_ZEROES.find(start => code >= start && code <= start + 9);
      return zero === undefined ? digit : String(code - zero);
    })
    .replace(/٫/g, '.')
    .replace(/٬/g, ',');
}

function invoiceIsoDate(year, month, day) {
  year = Number(year) + (Number(year) < 100 ? 2000 : 0);
  month = Number(month);
  day = Number(day);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function invoiceDate(text) {
  const lines = invoiceDigits(text).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const labelled = lines.filter(line => /invoice\s*date|\bdate\b|\u062a\u0627\u0631\u064a\u062e/i.test(line) && !/due|\u0627\u0633\u062a\u062d\u0642\u0627\u0642/i.test(line));

  for (const line of labelled.concat(lines)) {
    let match = line.match(/\b(20\d{2})[\/.\-](\d{1,2})[\/.\-](\d{1,2})\b/);
    if (match) {
      const date = invoiceIsoDate(match[1], match[2], match[3]);
      if (date) return date;
    }

    match = line.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/);
    if (match) {
      const date = invoiceIsoDate(match[3], match[2], match[1]);
      if (date) return date;
    }
  }
  return '';
}

function invoiceNumber(value) {
  const token = invoiceDigits(value).replace(/\s/g, '').replace(/[^\d.,]/g, '');
  if (!token) return 0;

  const dot = token.lastIndexOf('.');
  const comma = token.lastIndexOf(',');
  if (dot >= 0 && comma >= 0) {
    const decimal = dot > comma ? '.' : ',';
    return Number(token.replace(decimal === '.' ? /,/g : /\./g, '').replace(decimal, '.'));
  }

  const separator = dot >= 0 ? '.' : (comma >= 0 ? ',' : '');
  if (!separator) return Number(token);
  const parts = token.split(separator);
  const fraction = parts.pop();
  return Number((fraction.length <= 3 ? parts.join('') + '.' + fraction : parts.concat(fraction).join('')));
}

function invoiceAmount(text) {
  const lines = invoiceDigits(text).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const labels = [
    /amount\s+due|grand\s+total|invoice\s+total|total\s+due|\u0627\u0644\u0645\u0628\u0644\u063a\s*\u0627\u0644\u0645\u0633\u062a\u062d\u0642|\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\s*\u0627\u0644\u0643\u0644\u064a|\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a\s*\u0627\u0644\u0643\u0644\u064a/i,
    /\btotal\b|\u0627\u0644\u0645\u062c\u0645\u0648\u0639|\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a|\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a/i,
  ];

  for (const label of labels) {
    for (const line of lines.slice().reverse()) {
      if (!label.test(line) || /sub\s*total|tax\s+total|\u0627\u0644\u0645\u062c\u0645\u0648\u0639\s*\u0627\u0644\u0641\u0631\u0639\u064a|\u0627\u0644\u0636\u0631\u064a\u0628\u0629/i.test(line)) continue;
      const values = (line.match(/\d[\d\s.,]*\d|\d/g) || []).map(invoiceNumber).filter(n => Number.isFinite(n) && n > 0);
      if (values.length) return values[values.length - 1];
    }
  }

  // ponytail: language-neutral fallback; add per-language labels only if real invoices defeat this heuristic.
  const candidates = [];
  lines.forEach((line, lineIndex) => {
    if (/\b\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4}\b/.test(line)) return;
    const tokens = line.match(/\d[\d\s.,]*\d|\d/g) || [];
    tokens.forEach((token, tokenIndex) => {
      const amount = invoiceNumber(token);
      if (!Number.isFinite(amount) || amount <= 0 || amount >= 1e9) return;
      const decimal = /[.,]\d{1,3}\s*$/.test(token);
      const currency = /[$¢-¥֏؋৲৳৻૱௹฿៛₠-₿]|\b[A-Z]{3}\b/u.test(line);
      candidates.push({ amount, score: lineIndex + (decimal ? lines.length : 0) + (currency ? lines.length : 0), tokenIndex });
    });
  });
  candidates.sort((a, b) => a.score - b.score || a.tokenIndex - b.tokenIndex);
  return candidates.length ? candidates[candidates.length - 1].amount : 0;
}

function invoiceDescription(text) {
  const lines = String(text || '').split(/\r?\n/).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
  for (const line of lines) {
    const labelled = line.match(/(?:vendor|merchant|supplier|store|\u0627\u0644\u0645\u0648\u0631\u062f|\u0627\u0644\u0628\u0627\u0626\u0639|\u0627\u0644\u062a\u0627\u062c\u0631)\s*[:\-]\s*(.+)/i);
    if (labelled && labelled[1].length > 1) return labelled[1].slice(0, 80);
  }

  const skip = /invoice|receipt|date|total|tax|vat|phone|tel|\u0641\u0627\u062a\u0648\u0631\u0629|\u0625\u064a\u0635\u0627\u0644|\u062a\u0627\u0631\u064a\u062e|\u0627\u0644\u0645\u062c\u0645\u0648\u0639|\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a|\u0636\u0631\u064a\u0628\u0629|\u0631\u0642\u0645/i;
  const first = lines.find(line => line.length > 1 && line.length <= 80 && /\p{L}/u.test(line) && !skip.test(line));
  return first || '';
}

function parseInvoiceText(text) {
  return {
    amount: invoiceAmount(text),
    date: invoiceDate(text),
    description: invoiceDescription(text),
  };
}

function setInvoiceStatus(message, error) {
  const status = document.getElementById('fScanStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-error', Boolean(error));
}

function loadInvoiceOcr() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (invoiceOcrLoader) return invoiceOcrLoader;

  invoiceOcrLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = INVOICE_OCR_URL;
    script.crossOrigin = 'anonymous';
    script.dataset.invoiceOcr = '';
    script.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error('OCR did not load.'));
    script.onerror = () => {
      invoiceOcrLoader = null;
      script.remove();
      reject(new Error('OCR could not be downloaded. Check your connection.'));
    };
    document.head.appendChild(script);
  });
  return invoiceOcrLoader;
}

function invoiceProgress(message) {
  const percent = message.progress ? ` ${Math.round(message.progress * 100)}%` : '';
  setInvoiceStatus(`${message.status || 'Scanning'}${percent}`);
}

function initInvoiceLanguage() {
  const button = document.getElementById('fScanBtn');
  if (!button || document.getElementById('fScanLang')) return;

  const select = document.createElement('select');
  select.id = 'fScanLang';
  select.className = 'et-select invoice-language';
  select.setAttribute('aria-label', 'Invoice language');
  select.title = 'Invoice language';
  INVOICE_LANGUAGES.forEach(([code, name]) => select.add(new Option(name, code)));
  select.value = 'eng';
  try {
    const saved = localStorage.getItem(INVOICE_LANGUAGE_KEY);
    if (INVOICE_LANGUAGES.some(([code]) => code === saved)) select.value = saved;
  } catch (_) {}
  select.addEventListener('change', () => {
    try { localStorage.setItem(INVOICE_LANGUAGE_KEY, select.value); } catch (_) {}
  });

  const controls = document.createElement('div');
  controls.className = 'invoice-scan-controls';
  button.before(controls);
  controls.append(button, select);
}

async function getInvoiceWorker(Tesseract, language) {
  const languages = language === 'eng' ? ['eng'] : [language, 'eng'];
  const key = languages.join('+');
  if (!invoiceOcrWorker) {
    invoiceOcrWorker = await Tesseract.createWorker(languages, 1, { logger: invoiceProgress });
  } else if (invoiceOcrWorkerLanguages !== key) {
    await invoiceOcrWorker.reinitialize(languages, 1);
  }
  invoiceOcrWorkerLanguages = key;
  return invoiceOcrWorker;
}

async function scanInvoice(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;

  const button = document.getElementById('fScanBtn');
  try {
    if (!file.type.startsWith('image/')) throw new Error('Choose an invoice photo or image.');
    if (file.size > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.');

    button.disabled = true;
    setInvoiceStatus('Preparing scanner…');
    const Tesseract = await loadInvoiceOcr();
    const language = document.getElementById('fScanLang')?.value || 'eng';
    const worker = await getInvoiceWorker(Tesseract, language);
    const result = await worker.recognize(file);
    const parsed = parseInvoiceText(result.data.text);
    const filled = [];

    selectedCat = 'General';
    setType('expense');
    if (parsed.amount) {
      document.getElementById('fAmt').value = Number(parsed.amount.toFixed(3));
      previewAmountInBase();
      filled.push('amount');
    }
    if (parsed.description) {
      document.getElementById('fDesc').value = parsed.description;
      filled.push('description');
    }
    if (parsed.date) {
      document.getElementById('fDate').value = parsed.date;
      filled.push('date');
    }

    setInvoiceStatus(filled.length
      ? `Filled ${filled.join(', ')}. Check the amount and currency before saving.`
      : 'No invoice fields were found. Try a clearer, straighter photo.', !filled.length);
  } catch (error) {
    setInvoiceStatus(error.message || 'The invoice could not be scanned.', true);
  } finally {
    button.disabled = false;
  }
}

if (typeof document !== 'undefined') initInvoiceLanguage();

if (typeof module !== 'undefined') {
  module.exports = { parseInvoiceText };
  if (require.main === module) {
    const assert = require('node:assert/strict');
    const parsed = parseInvoiceText('Acme Market\nInvoice Date: 21/09/2026\nGrand Total JOD 12.345');
    assert.deepEqual(parsed, { description: 'Acme Market', date: '2026-09-21', amount: 12.345 });
    const arabic = parseInvoiceText('متجر عمان\nتاريخ الفاتورة: ٢١/٠٩/٢٠٢٦\nالإجمالي الكلي ١٢٫٣٤٥');
    assert.deepEqual(arabic, { description: 'متجر عمان', date: '2026-09-21', amount: 12.345 });
    const hindi = parseInvoiceText('दुकान\n२१/०९/२०२६\n₹ १,२३४.५०');
    assert.deepEqual(hindi, { description: 'दुकान', date: '2026-09-21', amount: 1234.5 });
  }
}
