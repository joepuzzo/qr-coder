import { getCountryCode } from "intl-phone";
import { DEFAULT_PAYLOAD_TYPE } from "./payloadTypes.js";

/** E.164-like string from informed phone field `{ country, number }`. */
function e164FromPhoneValue(v) {
  if (!v || typeof v !== "object") return "";
  if (v.number == null) return "";
  const national = String(v.number).replace(/\D/g, "");
  if (national.length < 7) return "";
  const cc = getCountryCode(v.country);
  if (!cc) return "";
  return `+${cc}${national}`;
}

function normalizeHttpUrl(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return "";
  try {
    const u = new URL(t.includes("://") ? t : `https://${t}`);
    return u.href;
  } catch {
    return "";
  }
}

/** ZXing-style escaping for WIFI:... payload ( \ ; , : " ) */
function escapeWifiField(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/:/g, "\\:")
    .replace(/"/g, '\\"');
}

/** vCard 3.0 text-value escaping (RFC 2426). */
function escapeVcardText(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function buildVcardPayload(values) {
  const first = String(values?.vcardFirstName ?? "").trim();
  const last = String(values?.vcardLastName ?? "").trim();
  if (!first && !last) return "";

  const fnParts = [first, last].filter(Boolean);
  const fn = fnParts.join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcardText(fn)}`,
    `N:${escapeVcardText(last)};${escapeVcardText(first)};;;`,
  ];

  const telVal = values?.vcardTel;
  let telLine = "";
  if (telVal && typeof telVal === "object") {
    telLine = e164FromPhoneValue(telVal);
  } else {
    const t = String(telVal ?? "").trim();
    if (t) telLine = t;
  }
  if (telLine) lines.push(`TEL:${escapeVcardText(telLine)}`);

  const email = String(values?.vcardEmail ?? "").trim();
  if (email) lines.push(`EMAIL:${escapeVcardText(email)}`);

  const org = String(values?.vcardOrg ?? "").trim();
  if (org) lines.push(`ORG:${escapeVcardText(org)}`);

  const title = String(values?.vcardTitle ?? "").trim();
  if (title) lines.push(`TITLE:${escapeVcardText(title)}`);

  const urlRaw = String(values?.vcardUrl ?? "").trim();
  if (urlRaw) {
    const url = normalizeHttpUrl(urlRaw);
    if (url) lines.push(`URL:${escapeVcardText(url)}`);
  }

  const street = String(values?.vcardAddress ?? "").trim();
  const city = String(values?.vcardCity ?? "").trim();
  const state = String(values?.vcardState ?? "").trim();
  const postal = String(values?.vcardPostalCode ?? "").trim();
  const country = String(values?.vcardCountry ?? "").trim();
  if (street || city || state || postal || country) {
    // ADR: PO Box;Extended;Street;City;Region;Postal;Country (vCard 3.0)
    lines.push(
      `ADR:;;${escapeVcardText(street)};${escapeVcardText(city)};${escapeVcardText(state)};${escapeVcardText(postal)};${escapeVcardText(country)}`,
    );
  }

  const note = String(values?.vcardNote ?? "").trim();
  if (note) lines.push(`NOTE:${escapeVcardText(note)}`);

  lines.push("END:VCARD");
  return lines.join("\n");
}

/**
 * Build the QR `data` string from informed form values.
 * Returns empty string when required fields are missing or invalid.
 */
export function buildQrPayload(values) {
  const type = values?.payloadType ?? DEFAULT_PAYLOAD_TYPE;

  switch (type) {
    case "link": {
      return normalizeHttpUrl(values?.link);
    }
    case "email": {
      const to = String(values?.emailTo ?? "").trim();
      if (!to || !to.includes("@")) return "";
      const subject = String(values?.emailSubject ?? "").trim();
      const body = String(values?.emailBody ?? "").trim();
      // Use encodeURIComponent so spaces become %20. URLSearchParams#toString
      // uses + for spaces (x-www-form-urlencoded), which iOS Mail treats as literal "+".
      const parts = [];
      if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
      if (body) parts.push(`body=${encodeURIComponent(body)}`);
      const qs = parts.join("&");
      return qs ? `mailto:${to}?${qs}` : `mailto:${to}`;
    }
    case "phone": {
      const pv = values?.phoneNumber;
      if (pv && typeof pv === "object") {
        const e164 = e164FromPhoneValue(pv);
        return e164 ? `tel:${e164}` : "";
      }
      const raw = String(pv ?? "").trim();
      if (!raw) return "";
      const compact = raw.replace(/[\s().-]/g, "");
      const digitsOnly = compact.replace(/\D/g, "");
      if (digitsOnly.length < 7) return "";
      return `tel:${compact}`;
    }
    case "sms": {
      const sv = values?.smsNumber;
      let num = "";
      if (sv && typeof sv === "object") {
        num = e164FromPhoneValue(sv);
        if (!num) return "";
      } else {
        const raw = String(sv ?? "").trim();
        if (!raw) return "";
        const n = raw.replace(/[\s().-]/g, "");
        const digitsOnly = n.replace(/\D/g, "");
        if (digitsOnly.length < 7) return "";
        num = n;
      }
      const body = String(values?.smsBody ?? "");
      if (body) {
        return `sms:${num}?body=${encodeURIComponent(body)}`;
      }
      return `sms:${num}`;
    }
    case "wifi": {
      const ssid = String(values?.wifiSsid ?? "").trim();
      if (!ssid) return "";
      const enc = values?.wifiEncryption ?? "WPA";
      const hidden = values?.wifiHidden ? "true" : "false";
      const S = escapeWifiField(ssid);
      if (enc === "nopass") {
        return `WIFI:T:nopass;S:${S};H:${hidden};;`;
      }
      const password = String(values?.wifiPassword ?? "");
      const P = escapeWifiField(password);
      return `WIFI:T:${enc};S:${S};P:${P};H:${hidden};;`;
    }
    case "vcard": {
      return buildVcardPayload(values);
    }
    default:
      return "";
  }
}
