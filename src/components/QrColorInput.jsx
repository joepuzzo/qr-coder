import { useField } from 'informed'
import { DEFAULT_QR_COLOR, normalizeQrColor } from '../qrColor.js'
import './QrColorInput.css'

export function QrColorInput(props) {
  const { fieldState, fieldApi, render, ref, userProps } = useField({
    ...props,
    id: props.id ?? props.name,
  })

  const { maskedValue, error, showError } = fieldState
  const { setValue, setTouched, setFocused } = fieldApi
  const { label, id, className } = userProps

  const inputId = id ?? props.name
  const value = normalizeQrColor(
    maskedValue !== undefined && maskedValue !== null && maskedValue !== ''
      ? maskedValue
      : DEFAULT_QR_COLOR,
  )

  const rootClass = ['qr-color-input', className].filter(Boolean).join(' ')

  return render(
    <div className={rootClass}>
      {label ? (
        <label className="qr-color-input__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="qr-color-input__row">
        <input
          id={inputId}
          ref={ref}
          className="qr-color-input__swatch"
          type="color"
          value={value}
          onChange={(e) => {
            setValue(normalizeQrColor(e.target.value), e)
          }}
          onBlur={(e) => {
            setTouched(true, e)
          }}
          onFocus={(e) => {
            setFocused(true, e)
          }}
          aria-invalid={showError}
          aria-describedby={showError ? `${props.name}-error` : undefined}
        />
        <span className="qr-color-input__hex" aria-hidden="true">
          {value}
        </span>
      </div>
      {showError && error ? (
        <p
          id={`${props.name}-error`}
          className="qr-color-input__error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>,
  )
}
