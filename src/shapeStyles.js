/** Presets for qr-code-styling: dot modules + outer QR shape (square vs circle). */
export const SHAPE_STYLES = [
  {
    id: 'square',
    label: 'Square',
    options: {
      shape: 'square',
      dotsOptions: { type: 'square' },
      cornersSquareOptions: { type: 'square' },
      cornersDotOptions: { type: 'square' },
    },
  },
  {
    id: 'dots',
    label: 'Dots',
    options: {
      shape: 'square',
      dotsOptions: { type: 'dots' },
      cornersSquareOptions: { type: 'dot' },
      cornersDotOptions: { type: 'dot' },
    },
  },
  {
    id: 'rounded',
    label: 'Rounded',
    options: {
      shape: 'square',
      dotsOptions: { type: 'rounded' },
      cornersSquareOptions: { type: 'extra-rounded' },
      cornersDotOptions: { type: 'dot' },
    },
  },
  {
    id: 'extra-rounded',
    label: 'Extra rounded',
    options: {
      shape: 'square',
      dotsOptions: { type: 'extra-rounded' },
      cornersSquareOptions: { type: 'extra-rounded' },
      cornersDotOptions: { type: 'dot' },
    },
  },
  {
    id: 'classy',
    label: 'Classy',
    options: {
      shape: 'square',
      dotsOptions: { type: 'classy' },
      cornersSquareOptions: { type: 'extra-rounded' },
      cornersDotOptions: { type: 'dot' },
    },
  },
  {
    id: 'classy-rounded',
    label: 'Classy rounded',
    options: {
      shape: 'square',
      dotsOptions: { type: 'classy-rounded' },
      cornersSquareOptions: { type: 'classy-rounded' },
      cornersDotOptions: { type: 'dot' },
    },
  },
  {
    id: 'circle',
    label: 'Circular',
    options: {
      shape: 'circle',
      dotsOptions: { type: 'rounded' },
      cornersSquareOptions: { type: 'extra-rounded' },
      cornersDotOptions: { type: 'dot' },
    },
  },
]

const byId = Object.fromEntries(SHAPE_STYLES.map((s) => [s.id, s]))

export function getShapeStyleOrDefault(id) {
  return byId[id] ?? SHAPE_STYLES[2]
}
