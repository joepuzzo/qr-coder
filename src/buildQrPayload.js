import { DEFAULT_PAYLOAD_TYPE } from "./payloadTypes.js";

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
      const raw = String(values?.phoneNumber ?? "").trim();
      if (!raw) return "";
      const compact = raw.replace(/[\s().-]/g, "");
      const digitsOnly = compact.replace(/\D/g, "");
      if (digitsOnly.length < 7) return "";
      return `tel:${compact}`;
    }
    case "sms": {
      const raw = String(values?.smsNumber ?? "").trim();
      if (!raw) return "";
      const num = raw.replace(/[\s().-]/g, "");
      const digitsOnly = num.replace(/\D/g, "");
      if (digitsOnly.length < 7) return "";
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
    default:
      return "";
  }
}
