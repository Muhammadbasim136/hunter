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
  const scheme = app === "business" ? "whatsapp-business" : "whatsapp";
  return `${scheme}://send?phone=${normalizedPhone}&text=${encodeURIComponent(text || "")}`;
}

export function buildWhatsAppUrls({ phone, country, text, app = "business" }) {
  const normalizedPhone = normalizeWhatsAppPhone(phone, country);
  if (!normalizedPhone) return [];

  const encodedText = encodeURIComponent(text || "");
  const standardUrl = `whatsapp://send?phone=${normalizedPhone}&text=${encodedText}`;
  const businessUrl = `whatsapp-business://send?phone=${normalizedPhone}&text=${encodedText}`;

  return app === "business" ? [businessUrl, standardUrl] : [standardUrl];
}

export function openWhatsAppChat({ phone, country, text, app = "business" }) {
  const urls = buildWhatsAppUrls({ phone, country, text, app });
  if (urls.length === 0) return false;

  const timers = [];
  const clearFallbacks = () => {
    while (timers.length) clearTimeout(timers.pop());
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", clearFallbacks);
  };
  const onVisibilityChange = () => {
    if (document.hidden) clearFallbacks();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", clearFallbacks, { once: true });

  window.location.href = urls[0];

  urls.slice(1).forEach((url, index) => {
    timers.push(
      setTimeout(() => {
        if (!document.hidden) window.location.href = url;
      }, 900 + index * 900)
    );
  });

  return true;
}
