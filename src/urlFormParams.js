import { SHAPE_STYLES } from './shapeStyles.js'
import { DEFAULT_QR_COLOR, normalizeQrColor } from './qrColor.js'

const SHAPE_IDS = new Set(SHAPE_STYLES.map((s) => s.id))

const DEFAULTS = {
  link: '',
  shapeStyle: 'rounded',
  logo: '',
  qrColor: DEFAULT_QR_COLOR,
}

/**
 * Read `link`, `shape`, and optional `color` (6 hex chars, no #) from the URL.
 * Logo is not read from the URL (data URLs exceed practical URL length).
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

  const shapeStyle =
    shapeRaw && SHAPE_IDS.has(shapeRaw) ? shapeRaw : DEFAULTS.shapeStyle

  const qrColor = colorRaw
    ? normalizeQrColor(colorRaw.startsWith('#') ? colorRaw : `#${colorRaw}`)
    : DEFAULT_QR_COLOR

  return {
    ...DEFAULTS,
    link: linkRaw,
    shapeStyle,
    qrColor,
  }
}

/**
 * Build query string for share/copy (link, shape, optional color).
 */
export function buildShareQueryString(values) {
  const params = new URLSearchParams()
  const link = String(values.link ?? '').trim()
  if (link) {
    params.set('link', link)
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
