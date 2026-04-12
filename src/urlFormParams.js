import { SHAPE_STYLES } from './shapeStyles.js'
import { DEFAULT_QR_COLOR, normalizeQrColor } from './qrColor.js'
import {
  DEFAULT_PAYLOAD_TYPE,
  PAYLOAD_IDS,
  WIFI_ENC_IDS,
} from './payloadTypes.js'

const SHAPE_IDS = new Set(SHAPE_STYLES.map((s) => s.id))

const DEFAULTS = {
  payloadType: DEFAULT_PAYLOAD_TYPE,
  link: '',
  emailTo: '',
  emailSubject: '',
  emailBody: '',
  phoneNumber: '',
  smsNumber: '',
  smsBody: '',
  wifiSsid: '',
  wifiPassword: '',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  shapeStyle: 'rounded',
  logo: '',
  qrColor: DEFAULT_QR_COLOR,
}

/**
 * Read query params including `payload` type and type-specific fields.
 */
export function getFormInitialValuesFromSearch(search) {
  if (!search || typeof search !== 'string') {
    return { ...DEFAULTS }
  }
  const normalized = search.startsWith('?') ? search : `?${search}`
  const params = new URLSearchParams(normalized)

  const linkRaw = (params.get('link') ?? params.get('url') ?? '').trim()
  const shapeRaw = (params.get('shape') ?? params.get('shapeStyle') ?? '').trim()
  const colorRaw = (params.get('color') ?? '').trim()
  const payloadRaw = (params.get('payload') ?? '').trim()

  let payloadType = DEFAULT_PAYLOAD_TYPE
  if (PAYLOAD_IDS.has(payloadRaw)) {
    payloadType = payloadRaw
  } else if (!payloadRaw && linkRaw) {
    payloadType = 'link'
  }

  const shapeStyle =
    shapeRaw && SHAPE_IDS.has(shapeRaw) ? shapeRaw : DEFAULTS.shapeStyle

  const qrColor = colorRaw
    ? normalizeQrColor(colorRaw.startsWith('#') ? colorRaw : `#${colorRaw}`)
    : DEFAULT_QR_COLOR

  const wifiEncRaw = params.get('wifiEnc') ?? ''
  const wifiEncryption = WIFI_ENC_IDS.has(wifiEncRaw) ? wifiEncRaw : 'WPA'

  return {
    ...DEFAULTS,
    payloadType,
    link: linkRaw,
    emailTo: (params.get('emailTo') ?? '').trim(),
    emailSubject: (params.get('emailSubject') ?? '').trim(),
    emailBody: (params.get('emailBody') ?? '').trim(),
    phoneNumber: (params.get('phone') ?? '').trim(),
    smsNumber: (params.get('sms') ?? '').trim(),
    smsBody: (params.get('smsBody') ?? '').trim(),
    wifiSsid: (params.get('wifiSsid') ?? '').trim(),
    wifiPassword: (params.get('wifiPass') ?? '').trim(),
    wifiEncryption,
    wifiHidden: params.get('wifiH') === '1',
    shapeStyle,
    qrColor,
  }
}

/**
 * Build query string for share/copy.
 */
export function buildShareQueryString(values) {
  const params = new URLSearchParams()
  const pt = values.payloadType ?? DEFAULT_PAYLOAD_TYPE

  if (pt !== 'link') {
    params.set('payload', pt)
  }

  switch (pt) {
    case 'link': {
      const link = String(values.link ?? '').trim()
      if (link) params.set('link', link)
      break
    }
    case 'email': {
      const to = String(values.emailTo ?? '').trim()
      if (to) params.set('emailTo', to)
      const sub = String(values.emailSubject ?? '').trim()
      if (sub) params.set('emailSubject', sub)
      const body = String(values.emailBody ?? '').trim()
      if (body) params.set('emailBody', body)
      break
    }
    case 'phone': {
      const p = String(values.phoneNumber ?? '').trim()
      if (p) params.set('phone', p)
      break
    }
    case 'sms': {
      const s = String(values.smsNumber ?? '').trim()
      if (s) params.set('sms', s)
      const body = String(values.smsBody ?? '').trim()
      if (body) params.set('smsBody', body)
      break
    }
    case 'wifi': {
      const ssid = String(values.wifiSsid ?? '').trim()
      if (ssid) params.set('wifiSsid', ssid)
      const enc = values.wifiEncryption ?? 'WPA'
      params.set('wifiEnc', enc)
      if (enc !== 'nopass') {
        const pass = String(values.wifiPassword ?? '')
        if (pass) params.set('wifiPass', pass)
      }
      if (values.wifiHidden) params.set('wifiH', '1')
      break
    }
    default:
      break
  }

  const shape = String(values.shapeStyle ?? '').trim()
  if (shape && SHAPE_IDS.has(shape)) {
    params.set('shape', shape)
  }
  const qrColor = normalizeQrColor(values.qrColor)
  if (qrColor !== DEFAULT_QR_COLOR) {
    params.set('color', qrColor.slice(1))
  }
  return params.toString()
}

/** Full shareable URL for the current page + form query. */
export function buildShareUrl(values) {
  const qs = buildShareQueryString(values)
  const base = `${window.location.origin}${window.location.pathname}`
  return qs ? `${base}?${qs}` : base
}
