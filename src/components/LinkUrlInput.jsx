import { useField } from 'informed'
import './LinkUrlInput.css'

function validateUrl(value) {
  if (value == null || String(value).trim() === '') {
    return 'Paste a link'
  }
  const raw = String(value).trim()
  const candidate = raw.includes('://') ? raw : `https://${raw}`
  try {
    new URL(candidate)
    return undefined
  } catch {
    return 'Enter a valid URL'
  }
}

export function LinkUrlInput(props) {
  const { fieldState, fieldApi, render, ref, userProps } = useField({
    ...props,
    id: props.id ?? props.name,
    validate: validateUrl,
    validateOn: 'blur',
  })

  const { maskedValue, error, showError } = fieldState
  const { setValue, setTouched } = fieldApi
  const { label, id, className, ...rest } = userProps

  const inputId = id ?? props.name
  const fieldClassName = [
    'link-url-input__field',
    showError ? 'link-url-input__field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return render(
    <div className="link-url-input">
      {label ? (
        <label className="link-url-input__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        {...rest}
        id={inputId}
        ref={ref}
        className={fieldClassName}
        type="url"
        autoComplete="url"
        inputMode="url"
        value={!maskedValue && maskedValue !== 0 ? '' : maskedValue}
        onChange={(e) => {
          setValue(e.target.value, e)
        }}
        onBlur={(e) => {
          setTouched(true, e)
        }}
        onFocus={(e) => {
          fieldApi.setFocused(true, e)
        }}
        aria-invalid={showError}
        aria-describedby={showError ? `${props.name}-error` : undefined}
      />
      {showError ? (
        <p id={`${props.name}-error`} className="link-url-input__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>,
  )
}
