const COUNTRY_CALLING_CODES = {
  pakistan: "92",
  pk: "92",
  india: "91",
  in: "91",
  "united states": "1",
  usa: "1",
  us: "1",
  canada: "1",
  ca: "1",
  "united kingdom": "44",
  uk: "44",
  gb: "44",
  uae: "971",
  "united arab emirates": "971",
  saudi: "966",
  "saudi arabia": "966",
  qatar: "974",
  kuwait: "965",
  oman: "968",
  bahrain: "973",
  australia: "61",
  germany: "49",
  france: "33",
  italy: "39",
  spain: "34",
  turkey: "90",
  malaysia: "60",
  singapore: "65",
  indonesia: "62",
  bangladesh: "880",
  sri_lanka: "94",
  "sri lanka": "94",
  nepal: "977",
  china: "86",
  japan: "81",
  thailand: "66",
  south_africa: "27",
  "south africa": "27",
  nigeria: "234",
  kenya: "254",
  egypt: "20",
  brazil: "55",
  mexico: "52",
};

const ANDROID_PACKAGE = {
  business: "com.whatsapp.w4b",
  standard: "com.whatsapp",
};

function isAndroid() {
  return typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
}

export function supportsWhatsAppAppChoice() {
  return isAndroid();
}

function countryKey(country = "") {
  return String(country).trim().toLowerCase().replace(/[_-]+/g, " ");
}

export function normalizeWhatsAppPhone(rawPhone, country) {
  if (!rawPhone) return null;
  const text = String(rawPhone).trim();
  const hasPlus = text.startsWith("+");
  let digits = text.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;

  if (hasPlus) return digits;
  if (digits.startsWith("00") && digits.length > 10) return digits.slice(2);

  const code = COUNTRY_CALLING_CODES[countryKey(country)];
  if (!code) return digits;
  if (digits.startsWith(code) && digits.length > code.length + 7) return digits;
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  return `${code}${digits}`;
}

export function buildWhatsAppNativeUrl({ phone, country, text, app = "standard" }) {
  const normalizedPhone = normalizeWhatsAppPhone(phone, country);
  if (!normalizedPhone) return null;

  const encodedText = encodeURIComponent(text || "");
  if (isAndroid()) {
    const packageName = ANDROID_PACKAGE[app] || ANDROID_PACKAGE.standard;
    return `intent://send?phone=${normalizedPhone}&text=${encodedText}#Intent;scheme=whatsapp;package=${packageName};end`;
  }

  return `whatsapp://send?phone=${normalizedPhone}&text=${encodedText}`;
}

export function buildWhatsAppUrls({ phone, country, text, app = "business" }) {
  const url = buildWhatsAppNativeUrl({ phone, country, text, app });
  return url ? [url] : [];
}

export function openWhatsAppChat({ phone, country, text, app = "business" }) {
  const url = buildWhatsAppNativeUrl({ phone, country, text, app });
  if (!url) return false;

  window.location.href = url;

  return true;
}
