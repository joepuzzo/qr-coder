import { SHAPE_STYLES } from './shapeStyles.js'

const SHAPE_IDS = new Set(SHAPE_STYLES.map((s) => s.id))

const DEFAULTS = {
  link: '',
  shapeStyle: 'rounded',
  logo: '',
}

/**
 * Read `link` and `shape` (shape style id) from the URL query string.
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

  const shapeStyle =
    shapeRaw && SHAPE_IDS.has(shapeRaw) ? shapeRaw : DEFAULTS.shapeStyle

  return {
    ...DEFAULTS,
    link: linkRaw,
    shapeStyle,
  }
}

/**
 * Build query string for the current form values (link + shape only).
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
  return params.toString()
}

/** Full shareable URL for the current page + form query. */
export function buildShareUrl(values) {
  const qs = buildShareQueryString(values)
  const base = `${window.location.origin}${window.location.pathname}`
  return qs ? `${base}?${qs}` : base
}
