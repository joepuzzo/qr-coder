/** Default dark modules on white (matches previous hard-coded look). */
export const DEFAULT_QR_COLOR = '#0f172a'

/**
 * Normalize to lowercase `#rrggbb` or fall back to default.
 */
export function normalizeQrColor(raw) {
  if (raw == null || String(raw).trim() === '') {
    return DEFAULT_QR_COLOR
  }
  const s = String(raw).trim()
  const hex = s.startsWith('#') ? s : `#${s}`
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return hex.toLowerCase()
  }
  return DEFAULT_QR_COLOR
}
