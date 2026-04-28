import { SHAPE_STYLES } from "./shapeStyles.js";
import { DEFAULT_QR_COLOR, normalizeQrColor } from "./qrColor.js";
import {
  DEFAULT_PAYLOAD_TYPE,
  PAYLOAD_IDS,
  WIFI_ENC_IDS,
} from "./payloadTypes.js";
import { isPhoneCountryEnabled } from "./phoneCountries.js";

const SHAPE_IDS = new Set(SHAPE_STYLES.map((s) => s.id));

const DEFAULTS = {
  payloadType: DEFAULT_PAYLOAD_TYPE,
  link: "",
  plainText: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phoneNumber: { country: "US", number: "" },
  smsNumber: { country: "US", number: "" },
  smsBody: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  vcardFirstName: "",
  vcardLastName: "",
  vcardTel: { country: "US", number: "" },
  vcardEmail: "",
  vcardOrg: "",
  vcardTitle: "",
  vcardAddress: "",
  vcardCity: "",
  vcardState: "",
  vcardPostalCode: "",
  vcardCountry: "",
  vcardUrl: "",
  vcardNote: "",
  shapeStyle: "rounded",
  logo: "",
  qrColor: DEFAULT_QR_COLOR,
  downloadTransparentBackground: false,
};

/**
 * Read query params including `payload` type and type-specific fields.
 */
export function getFormInitialValuesFromSearch(search) {
  if (!search || typeof search !== "string") {
    return { ...DEFAULTS };
  }
  const normalized = search.startsWith("?") ? search : `?${search}`;
  const params = new URLSearchParams(normalized);

  const linkRaw = (params.get("link") ?? params.get("url") ?? "").trim();
  const shapeRaw = (
    params.get("shape") ??
    params.get("shapeStyle") ??
    ""
  ).trim();
  const colorRaw = (params.get("color") ?? "").trim();
  const payloadRaw = (params.get("payload") ?? "").trim();

  const textRaw = (params.get("text") ?? "").trim();

  let payloadType = DEFAULT_PAYLOAD_TYPE;
  if (PAYLOAD_IDS.has(payloadRaw)) {
    payloadType = payloadRaw;
  } else if (!payloadRaw && linkRaw) {
    payloadType = "link";
  } else if (!payloadRaw && textRaw) {
    payloadType = "text";
  }

  const shapeStyle =
    shapeRaw && SHAPE_IDS.has(shapeRaw) ? shapeRaw : DEFAULTS.shapeStyle;

  const qrColor = colorRaw
    ? normalizeQrColor(colorRaw.startsWith("#") ? colorRaw : `#${colorRaw}`)
    : DEFAULT_QR_COLOR;

  const wifiEncRaw = params.get("wifiEnc") ?? "";
  const wifiEncryption = WIFI_ENC_IDS.has(wifiEncRaw) ? wifiEncRaw : "WPA";

  return {
    ...DEFAULTS,
    payloadType,
    link: linkRaw,
    plainText: textRaw,
    emailTo: (params.get("emailTo") ?? "").trim(),
    emailSubject: (params.get("emailSubject") ?? "").trim(),
    emailBody: (params.get("emailBody") ?? "").trim(),
    phoneNumber: (() => {
      const digits = (params.get("phone") ?? "").replace(/\D/g, "");
      const pc = (params.get("phoneCountry") ?? "").trim().toUpperCase();
      if (!digits && !pc) return DEFAULTS.phoneNumber;
      const country = isPhoneCountryEnabled(pc) ? pc : "US";
      return { country, number: digits };
    })(),
    smsNumber: (() => {
      const digits = (params.get("sms") ?? "").replace(/\D/g, "");
      const pc = (params.get("smsCountry") ?? "").trim().toUpperCase();
      if (!digits && !pc) return DEFAULTS.smsNumber;
      const country = isPhoneCountryEnabled(pc) ? pc : "US";
      return { country, number: digits };
    })(),
    smsBody: (params.get("smsBody") ?? "").trim(),
    wifiSsid: (params.get("wifiSsid") ?? "").trim(),
    wifiPassword: (params.get("wifiPass") ?? "").trim(),
    wifiEncryption,
    wifiHidden: params.get("wifiH") === "1",
    ...(() => {
      let vcardFirstName = (params.get("vcardFirst") ?? "").trim();
      let vcardLastName = (params.get("vcardLast") ?? "").trim();
      const legacyFn = (params.get("vcardFn") ?? "").trim();
      if (!vcardFirstName && !vcardLastName && legacyFn) {
        const i = legacyFn.indexOf(" ");
        if (i === -1) {
          vcardFirstName = legacyFn;
        } else {
          vcardFirstName = legacyFn.slice(0, i).trim();
          vcardLastName = legacyFn.slice(i + 1).trim();
        }
      }
      return { vcardFirstName, vcardLastName };
    })(),
    vcardTel: (() => {
      const digits = (params.get("vcardTel") ?? "").replace(/\D/g, "");
      const pc = (params.get("vcardTelCountry") ?? "").trim().toUpperCase();
      if (!digits && !pc) return DEFAULTS.vcardTel;
      const country = isPhoneCountryEnabled(pc) ? pc : "US";
      return { country, number: digits };
    })(),
    vcardEmail: (params.get("vcardEmail") ?? "").trim(),
    vcardOrg: (params.get("vcardOrg") ?? "").trim(),
    vcardTitle: (params.get("vcardTitle") ?? "").trim(),
    vcardAddress: (params.get("vcardAddress") ?? "").trim(),
    vcardCity: (params.get("vcardCity") ?? "").trim(),
    vcardState: (params.get("vcardState") ?? "").trim(),
    vcardPostalCode: (params.get("vcardPostal") ?? "").trim(),
    vcardCountry: (params.get("vcardCountry") ?? "").trim(),
    vcardUrl: (params.get("vcardUrl") ?? "").trim(),
    vcardNote: (params.get("vcardNote") ?? "").trim(),
    shapeStyle,
    qrColor,
  };
}

/**
 * Build query string for share/copy.
 */
export function buildShareQueryString(values) {
  const params = new URLSearchParams();
  const pt = values.payloadType ?? DEFAULT_PAYLOAD_TYPE;

  if (pt !== "link") {
    params.set("payload", pt);
  }

  switch (pt) {
    case "link": {
      const link = String(values.link ?? "").trim();
      if (link) params.set("link", link);
      break;
    }
    case "text": {
      const t = String(values.plainText ?? "").trim();
      if (t) params.set("text", t);
      break;
    }
    case "email": {
      const to = String(values.emailTo ?? "").trim();
      if (to) params.set("emailTo", to);
      const sub = String(values.emailSubject ?? "").trim();
      if (sub) params.set("emailSubject", sub);
      const body = String(values.emailBody ?? "").trim();
      if (body) params.set("emailBody", body);
      break;
    }
    case "phone": {
      const pn = values.phoneNumber;
      if (pn && typeof pn === "object" && pn.number) {
        params.set("phone", String(pn.number).replace(/\D/g, ""));
        if (pn.country && pn.country !== "US") {
          params.set("phoneCountry", pn.country);
        }
      } else if (typeof pn === "string" && pn.trim()) {
        params.set("phone", pn.trim());
      }
      break;
    }
    case "sms": {
      const sn = values.smsNumber;
      if (sn && typeof sn === "object" && sn.number) {
        params.set("sms", String(sn.number).replace(/\D/g, ""));
        if (sn.country && sn.country !== "US") {
          params.set("smsCountry", sn.country);
        }
      } else if (typeof sn === "string" && sn.trim()) {
        params.set("sms", sn.trim());
      }
      const body = String(values.smsBody ?? "").trim();
      if (body) params.set("smsBody", body);
      break;
    }
    case "wifi": {
      const ssid = String(values.wifiSsid ?? "").trim();
      if (ssid) params.set("wifiSsid", ssid);
      const enc = values.wifiEncryption ?? "WPA";
      params.set("wifiEnc", enc);
      if (enc !== "nopass") {
        const pass = String(values.wifiPassword ?? "");
        if (pass) params.set("wifiPass", pass);
      }
      if (values.wifiHidden) params.set("wifiH", "1");
      break;
    }
    case "vcard": {
      const first = String(values.vcardFirstName ?? "").trim();
      if (first) params.set("vcardFirst", first);
      const last = String(values.vcardLastName ?? "").trim();
      if (last) params.set("vcardLast", last);
      const tel = values.vcardTel;
      if (tel && typeof tel === "object" && tel.number) {
        params.set("vcardTel", String(tel.number).replace(/\D/g, ""));
        if (tel.country && tel.country !== "US") {
          params.set("vcardTelCountry", tel.country);
        }
      } else if (typeof tel === "string" && tel.trim()) {
        params.set("vcardTel", tel.trim());
      }
      const em = String(values.vcardEmail ?? "").trim();
      if (em) params.set("vcardEmail", em);
      const org = String(values.vcardOrg ?? "").trim();
      if (org) params.set("vcardOrg", org);
      const title = String(values.vcardTitle ?? "").trim();
      if (title) params.set("vcardTitle", title);
      const addr = String(values.vcardAddress ?? "").trim();
      if (addr) params.set("vcardAddress", addr);
      const city = String(values.vcardCity ?? "").trim();
      if (city) params.set("vcardCity", city);
      const st = String(values.vcardState ?? "").trim();
      if (st) params.set("vcardState", st);
      const postal = String(values.vcardPostalCode ?? "").trim();
      if (postal) params.set("vcardPostal", postal);
      const country = String(values.vcardCountry ?? "").trim();
      if (country) params.set("vcardCountry", country);
      const url = String(values.vcardUrl ?? "").trim();
      if (url) params.set("vcardUrl", url);
      const note = String(values.vcardNote ?? "").trim();
      if (note) params.set("vcardNote", note);
      break;
    }
    default:
      break;
  }

  const shape = String(values.shapeStyle ?? "").trim();
  if (shape && SHAPE_IDS.has(shape)) {
    params.set("shape", shape);
  }
  const qrColor = normalizeQrColor(values.qrColor);
  if (qrColor !== DEFAULT_QR_COLOR) {
    params.set("color", qrColor.slice(1));
  }
  return params.toString();
}

/** Full shareable URL for the current page + form query. */
export function buildShareUrl(values) {
  const qs = buildShareQueryString(values);
  const base = `${window.location.origin}${window.location.pathname}`;
  return qs ? `${base}?${qs}` : base;
}
