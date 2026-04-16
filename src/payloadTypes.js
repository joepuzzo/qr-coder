export const PAYLOAD_TYPES = [
  { id: 'link', label: 'Link' },
  { id: 'text', label: 'Text' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'sms', label: 'SMS' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'vcard', label: 'vCard' },
]

export const DEFAULT_PAYLOAD_TYPE = 'link'

export const PAYLOAD_IDS = new Set(PAYLOAD_TYPES.map((p) => p.id))

export const WIFI_ENCRYPTION_OPTIONS = [
  { value: 'WPA', label: 'WPA' },
  { value: 'WPA2', label: 'WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'None (open)' },
]

export const WIFI_ENC_IDS = new Set(
  WIFI_ENCRYPTION_OPTIONS.map((o) => o.value),
)
