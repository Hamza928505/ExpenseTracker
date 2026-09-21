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
const INVOICE_SCRIPT_DEFAULTS = {
  Arabic: 'ara', Armenian: 'hye', Bengali: 'ben', Cherokee: 'chr', Cyrillic: 'rus',
  Devanagari: 'hin', Ethiopic: 'amh', Fraktur: 'frk', Georgian: 'kat', Greek: 'ell',
  Gujarati: 'guj', Gurmukhi: 'pan', Han: 'chi_sim', HanS: 'chi_sim', HanT: 'chi_tra',
  Hangul: 'kor', Hebrew: 'heb', Japanese: 'jpn', Kannada: 'kan', Khmer: 'khm', Lao: 'lao',
  Latin: 'eng', Malayalam: 'mal', Myanmar: 'mya', Oriya: 'ori', Sinhala: 'sin',
  Syriac: 'syr', Tamil: 'tam', Telugu: 'tel', Thaana: 'div', Thai: 'tha', Tibetan: 'bod',
};
const INVOICE_SCRIPT_LANGUAGES = {
  Arabic: ['ara', 'fas', 'kmr', 'pus', 'snd', 'syr', 'uig', 'urd'],
  Cyrillic: ['aze_cyrl', 'bel', 'bul', 'kaz', 'kir', 'mkd', 'mon', 'rus', 'srp', 'tgk', 'ukr', 'uzb_cyrl'],
  Devanagari: ['hin', 'mar', 'nep', 'san'],
  Han: ['chi_sim', 'chi_tra', 'jpn'], HanS: ['chi_sim'], HanT: ['chi_tra'],
  Hebrew: ['heb', 'yid'], Japanese: ['jpn'], Hangul: ['kor'],
};
let invoiceOcrLoader;
let invoiceOcrWorker;
let invoiceOcrWorkerLanguages = '';
let invoiceScanId = 0;

async function prepareInvoiceImage(file) {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const longest = Math.max(bitmap.width, bitmap.height);
    const shortest = Math.min(bitmap.width, bitmap.height);
    const scale = Math.min(2400 / longest, Math.max(1, 1600 / shortest));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.filter = 'grayscale(1) contrast(1.35)';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas;
  } catch (_) {
    return file;
  } finally {
    bitmap?.close?.();
  }
}

function invoiceDigits(value) {
  return String(value || '').normalize('NFKC')
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\u0640\u064b-\u065f]/g, '')
    .replace(/\p{Nd}/gu, digit => {
      const code = digit.codePointAt(0);
      const zero = INVOICE_DIGIT_ZEROES.find(start => code >= start && code <= start + 9);
      return zero === undefined ? digit : String(code - zero);
    })
    .replace(/٫/g, '.')
    .replace(/٬/g, ',')
    .replace(/٪/g, '%');
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

const INVOICE_TAX_LABEL = /\b(?:tax|vat|gst|hst|pst|iva|tva|mwst|btw|mva|pdv)\b|ضريبة|الضريبة|القيمة\s*المضافة|impuesto|imposta|imposte|steuer|taxe|imposto|налог|ндс|税|세금|कर|வரி/i;
const INVOICE_CURRENCY = /\p{Sc}|\b(?:JOD|USD|EUR|GBP|AED|SAR|KWD|BHD|OMR|QAR|EGP|INR|CAD|AUD|CHF|JPY|CNY)\b/iu;

function invoiceMoneyValues(line) {
  // Keep price columns separate; only join spaced thousands when followed by a decimal.
  return [...line.matchAll(/\d{1,3}(?: \d{3})+[.,]\d{1,3}|\d+(?:[.,]\d+)*/g)]
    .filter(match => !/^\s*%/.test(line.slice(match.index + match[0].length)) &&
      !/%$/.test(line.slice(0, match.index)))
    .map(match => ({ amount: invoiceNumber(match[0]), token: match[0] }))
    .filter(value => Number.isFinite(value.amount) && value.amount > 0 && value.amount < 1e9);
}

function invoiceLabelValues(lines, index) {
  const values = invoiceMoneyValues(lines[index]);
  if (values.length) return values;
  const next = lines[index + 1] || '';
  // Sparse OCR can put a total's value on its own line.
  if (/\p{L}/u.test(next.replace(INVOICE_CURRENCY, ''))) return [];
  return invoiceMoneyValues(next);
}

function invoiceAmount(text) {
  const lines = invoiceDigits(text).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const labels = [
    /amount\s+due|grand\s+total|invoice\s+total|total\s+due|\u0627\u0644\u0645\u0628\u0644\u063a\s*\u0627\u0644\u0645\u0633\u062a\u062d\u0642|\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a\s*\u0627\u0644\u0643\u0644\u064a|\u0627\u0644\u0627\u062c\u0645\u0627\u0644\u064a\s*\u0627\u0644\u0643\u0644\u064a/i,
    /\b(?:total|totale|gesamtbetrag|summe|totaal|totalt)\b|المجموع|الإجمالي|الاجمالي|إجمالي|اجمالي|итого|合計|总计|總計|합계/i,
  ];

  for (const label of labels) {
    for (let index = lines.length - 1; index >= 0; index--) {
      const line = lines[index];
      if (!label.test(line) || /sub\s*total|المجموع\s*الفرعي/i.test(line) || INVOICE_TAX_LABEL.test(line)) continue;
      const values = invoiceLabelValues(lines, index);
      if (values.length) return values[values.length - 1].amount;
    }
  }

  // ponytail: language-neutral fallback; add per-language labels only if real invoices defeat this heuristic.
  const candidates = [];
  lines.forEach((line, lineIndex) => {
    if (/\b\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4}\b/.test(line) || INVOICE_TAX_LABEL.test(line) ||
      /\b(?:cash|change|tendered|phone|tel|subtotal|invoice|receipt)\b|رقم|هاتف|الباقي|المدفوع|الفرعي/i.test(line)) return;
    invoiceMoneyValues(line).forEach(({ amount, token }, tokenIndex) => {
      const decimal = /[.,]\d{1,3}$/.test(token);
      const currency = INVOICE_CURRENCY.test(line);
      if (!decimal && !currency) return;
      candidates.push({ amount, score: lineIndex + (decimal ? lines.length : 0) + (currency ? lines.length : 0), tokenIndex });
    });
  });
  candidates.sort((a, b) => a.score - b.score || a.tokenIndex - b.tokenIndex);
  return candidates.length ? candidates[candidates.length - 1].amount : 0;
}

function invoiceTax(text) {
  const lines = invoiceDigits(text).split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index--) {
    if (!INVOICE_TAX_LABEL.test(lines[index])) continue;
    const values = invoiceLabelValues(lines, index);
    if (values.length) return values[values.length - 1].amount;
  }
  return 0;
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
    tax: invoiceTax(text),
    date: invoiceDate(text),
    description: invoiceDescription(text),
  };
}

function invoiceResultScore(result, parsed) {
  return (parsed.amount ? 100 : 0) + (parsed.tax ? 20 : 0) + (parsed.date ? 10 : 0) +
    (parsed.description ? 5 : 0) + Math.max(0, Number(result.data.confidence) || 0) / 100;
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
    const timer = setTimeout(() => script.onerror(), 30000);
    script.src = INVOICE_OCR_URL;
    script.crossOrigin = 'anonymous';
    script.dataset.invoiceOcr = '';
    script.onload = () => {
      if (!window.Tesseract) return script.onerror();
      clearTimeout(timer);
      resolve(window.Tesseract);
    };
    script.onerror = () => {
      clearTimeout(timer);
      invoiceOcrLoader = null;
      script.remove();
      reject(new Error('OCR could not be downloaded. Check your connection.'));
    };
    document.head.appendChild(script);
  });
  return invoiceOcrLoader;
}

function createInvoiceWorker(Tesseract, languages, oem, options = {}) {
  // Some engine download failures call errorHandler without rejecting createWorker.
  return new Promise((resolve, reject) => {
    let finished = false;
    const fail = error => {
      finished = true;
      clearTimeout(timer);
      reject(new Error(String(error?.message || error)));
    };
    const timer = setTimeout(() => fail('Scanner loading timed out. Check your connection and try again.'), 90000);
    Tesseract.createWorker(languages, oem, { ...options, logger: invoiceProgress, errorHandler: fail })
      .then(worker => {
        clearTimeout(timer);
        if (finished) { worker.terminate(); return; }
        finished = true;
        resolve(worker);
      }, fail);
  });
}

function invoiceProgress(message) {
  const percent = message.progress ? ` ${Math.round(message.progress * 100)}%` : '';
  setInvoiceStatus(`${message.status || 'Scanning'}${percent}`);
}

async function invoiceOcrTimeout(job) {
  let timer;
  try {
    return await Promise.race([job, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Scanning timed out. Try a smaller, cropped invoice photo.')), 90000);
    })]);
  } finally {
    clearTimeout(timer);
  }
}

function invoiceLanguageName(code) {
  return (INVOICE_LANGUAGES.find(([value]) => value === code) || [code, code])[1];
}

function invoiceLocaleLanguage() {
  if (typeof navigator === 'undefined') return 'eng';
  const locale = String(navigator.language || 'en');
  const base = locale.split('-')[0].toLowerCase();
  const special = { fa: 'fas', nb: 'nor', no: 'nor', ps: 'pus', zh: /(?:tw|hk|hant)/i.test(locale) ? 'chi_tra' : 'chi_sim' };
  if (special[base]) return special[base];
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(base).toLowerCase();
    const found = INVOICE_LANGUAGES.find(([, label]) => {
      const normalized = label.toLowerCase();
      return normalized === name || normalized.startsWith(`${name} (`);
    });
    if (found) return found[0];
  } catch (_) {}
  return 'eng';
}

function invoiceLanguageForScript(script) {
  const localeLanguage = invoiceLocaleLanguage();
  const group = INVOICE_SCRIPT_LANGUAGES[script];
  if (group && group.includes(localeLanguage)) return localeLanguage;

  const nonLatin = new Set([
    ...Object.values(INVOICE_SCRIPT_DEFAULTS).filter(code => code !== 'eng'),
    ...Object.values(INVOICE_SCRIPT_LANGUAGES).flat(),
  ]);
  if (script === 'Latin' && !nonLatin.has(localeLanguage)) return localeLanguage;
  return INVOICE_SCRIPT_DEFAULTS[script] || localeLanguage || 'eng';
}

async function detectInvoiceLanguage(Tesseract, image) {
  const fallback = invoiceLocaleLanguage();
  let detector;
  try {
    setInvoiceStatus('Detecting invoice language…');
    // OSD has the script classifier; English traineddata only recognizes Latin characters.
    detector = await createInvoiceWorker(Tesseract, 'osd', 0, {
      legacyCore: true,
      legacyLang: true,
    });
    await detector.setParameters({ user_defined_dpi: '300' });
    const result = await invoiceOcrTimeout(detector.detect(image));
    const language = invoiceLanguageForScript(result.data.script);
    setInvoiceStatus(`Detected ${result.data.script || 'text'}; scanning as ${invoiceLanguageName(language)}…`);
    return language;
  } catch (_) {
    setInvoiceStatus(`Could not auto-detect; scanning as ${invoiceLanguageName(fallback)}…`);
    return fallback;
  } finally {
    if (detector) await detector.terminate();
  }
}

function initInvoiceLanguage() {
  const button = document.getElementById('fScanBtn');
  if (!button || document.getElementById('fScanLang')) return;

  const select = document.createElement('select');
  select.id = 'fScanLang';
  select.className = 'et-select invoice-language';
  select.setAttribute('aria-label', 'Invoice language');
  select.title = 'Invoice language';
  select.add(new Option('Auto-detect', 'auto'));
  INVOICE_LANGUAGES.forEach(([code, name]) => select.add(new Option(name, code)));
  select.value = 'auto';
  try {
    const saved = localStorage.getItem(INVOICE_LANGUAGE_KEY);
    if (saved === 'auto' || INVOICE_LANGUAGES.some(([code]) => code === saved)) select.value = saved;
  } catch (_) {}
  select.addEventListener('change', () => {
    try { localStorage.setItem(INVOICE_LANGUAGE_KEY, select.value); } catch (_) {}
  });

  const controls = document.createElement('div');
  controls.className = 'invoice-scan-controls';
  button.before(controls);
  controls.append(button, select);

  const details = document.createElement('details');
  details.id = 'fScanPreview';
  details.className = 'invoice-scan-preview';
  details.hidden = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Recognized invoice text';
  const text = document.createElement('pre');
  text.id = 'fScanText';
  text.dir = 'auto';
  details.append(summary, text);
  document.getElementById('fScanStatus').after(details);
}

async function getInvoiceWorker(Tesseract, language) {
  const languages = language === 'eng' ? ['eng'] : [language, 'eng'];
  const key = languages.join('+');
  if (invoiceOcrWorker && invoiceOcrWorkerLanguages !== key) {
    await invoiceOcrWorker.terminate();
    invoiceOcrWorker = null;
  }
  if (!invoiceOcrWorker) {
    invoiceOcrWorker = await createInvoiceWorker(Tesseract, languages, 1);
  }
  invoiceOcrWorkerLanguages = key;
  return invoiceOcrWorker;
}

async function scanInvoice(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;

  const button = document.getElementById('fScanBtn');
  if (button.disabled) return;
  const scanId = ++invoiceScanId;
  const preview = document.getElementById('fScanPreview');
  const submit = document.getElementById('fSubmitBtn');
  try {
    if (file.type && !file.type.startsWith('image/')) throw new Error('Choose an invoice photo or image.');
    if (file.size > 25 * 1024 * 1024) throw new Error('Choose an image smaller than 25 MB.');

    button.disabled = true;
    submit.disabled = true;
    preview.hidden = true;
    preview.open = false;
    setInvoiceStatus('Improving invoice photo…');
    const image = await prepareInvoiceImage(file);
    setInvoiceStatus('Preparing scanner…');
    const Tesseract = await loadInvoiceOcr();
    const selectedLanguage = document.getElementById('fScanLang')?.value || 'auto';
    const language = selectedLanguage === 'auto'
      ? await detectInvoiceLanguage(Tesseract, image)
      : selectedLanguage;
    const worker = await getInvoiceWorker(Tesseract, language);
    let result = await invoiceOcrTimeout(worker.recognize(image, { rotateAuto: true, user_defined_dpi: '300' }));
    let parsed = parseInvoiceText(result.data.text);
    if (invoiceResultScore(result, parsed) < 115) {
      setInvoiceStatus('Trying a receipt layout…');
      const retry = await invoiceOcrTimeout(worker.recognize(image, { tessedit_pageseg_mode: '6', rotateAuto: true, user_defined_dpi: '300' }));
      const retryParsed = parseInvoiceText(retry.data.text);
      if (invoiceResultScore(retry, retryParsed) > invoiceResultScore(result, parsed)) {
        result = retry;
        parsed = retryParsed;
      }
    }
    // A closed/reopened transaction must not receive an earlier scan's values.
    if (scanId !== invoiceScanId) return;
    document.getElementById('fScanText').textContent = result.data.text || '';
    preview.hidden = !result.data.text?.trim();
    const filled = [];

    if (parsed.amount) {
      setType('expense');
      document.getElementById('fAmt').value = Number(parsed.amount.toFixed(3));
      document.getElementById('fTax').value = '';
      previewAmountInBase();
      filled.push('amount');
    }
    if (parsed.tax && (!parsed.amount || parsed.tax <= parsed.amount)) {
      document.getElementById('fTax').value = Number(parsed.tax.toFixed(3));
      filled.push('tax');
    }
    if (parsed.description) {
      document.getElementById('fDesc').value = parsed.description;
      filled.push('description');
    }
    if (parsed.date) {
      document.getElementById('fDate').value = parsed.date;
      filled.push('date');
    }

    setInvoiceStatus(parsed.amount
      ? `${invoiceLanguageName(language)} scan: filled ${filled.join(', ')}. Check the amount, tax and currency before saving.`
      : (result.data.text?.trim()
        ? `Read text using ${invoiceLanguageName(language)}, but could not identify the total. Review the recognized text or select the invoice language and scan again.`
        : 'No readable text found. Crop to the invoice, use a sharp, upright photo, and select its language before retrying.'), !parsed.amount);
  } catch (error) {
    if (invoiceOcrWorker) await invoiceOcrWorker.terminate();
    invoiceOcrWorker = null;
    if (scanId === invoiceScanId) setInvoiceStatus(String(error?.message || error || 'The invoice could not be scanned.'), true);
  } finally {
    button.disabled = false;
    submit.disabled = false;
  }
}

if (typeof document !== 'undefined') initInvoiceLanguage();

if (typeof module !== 'undefined') {
  module.exports = { parseInvoiceText, invoiceLanguageForScript };
  if (require.main === module) {
    const assert = require('node:assert/strict');
    const parsed = parseInvoiceText('Acme Market\nInvoice Date: 21/09/2026\nVAT 16% JOD 2.345\nGrand Total JOD 12.345');
    assert.deepEqual(parsed, { description: 'Acme Market', date: '2026-09-21', amount: 12.345, tax: 2.345 });
    const arabic = parseInvoiceText('متجر عمان\nتاريخ الفاتورة: ٢١/٠٩/٢٠٢٦\nالإجمالي الكلي ١٢٫٣٤٥');
    assert.deepEqual(arabic, { description: 'متجر عمان', date: '2026-09-21', amount: 12.345, tax: 0 });
    const hindi = parseInvoiceText('दुकान\n२१/०९/२०२६\n₹ १,२३४.५०');
    assert.deepEqual(hindi, { description: 'दुकान', date: '2026-09-21', amount: 1234.5, tax: 0 });
    assert.equal(invoiceLanguageForScript('Arabic'), 'ara');
    assert.equal(invoiceLanguageForScript('Cyrillic'), 'rus');
    assert.equal(invoiceLanguageForScript('HanT'), 'chi_tra');
    assert.equal(parseInvoiceText('Shop\nTotal 2 10.00 20.00').amount, 20);
    assert.equal(parseInvoiceText('Shop\nTOTAL\n29.00\nCash 50.00\nChange 21.00').amount, 29);
    assert.equal(parseInvoiceText('Shop\nVAT 16%\nTOTAL').amount, 0);
    assert.equal(parseInvoiceText('Shop\nVAT 16% 4.00\nTotal 29.00').tax, 4);
    assert.equal(parseInvoiceText('Shop\nTotal EUR 1 234,50').amount, 1234.5);
    assert.equal(parseInvoiceText('Shop\nPhone 0791234567\nInvoice 12345').amount, 0);
    // Actual Arabic OCR can misread a percent sign as 96; don't join it to the price.
    assert.equal(parseInvoiceText('ضريبة القيمة المضافة 9616 4.00\nالإجمالي الكلي 29.00').tax, 4);
    assert.equal(parseInvoiceText('٤٫٠٠ ضريبة ١٦٪\nالإجمالي ٢٩٫٠٠').tax, 4);
  }
}
