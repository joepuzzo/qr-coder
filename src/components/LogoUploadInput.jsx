import { useRef } from 'react'
import { useField } from 'informed'
import './LogoUploadInput.css'

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml'
const MAX_BYTES = 2 * 1024 * 1024

export function LogoUploadInput(props) {
  const fileInputRef = useRef(null)

  const { fieldState, fieldApi, render, userProps } = useField({
    ...props,
    id: props.id ?? props.name,
  })

  const { maskedValue, error, showError } = fieldState
  const { setValue, setTouched, setError } = fieldApi
  const { label, id, className } = userProps

  const inputId = id ?? props.name
  const dataUrl =
    maskedValue !== undefined && maskedValue !== null && maskedValue !== ''
      ? maskedValue
      : ''

  const rootClassName = ['logo-upload', className].filter(Boolean).join(' ')

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file (PNG, JPG, WebP, GIF, or SVG).', e)
      e.target.value = ''
      return
    }

    if (file.size > MAX_BYTES) {
      setError('Image must be 2 MB or smaller.', e)
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setValue(reader.result, e)
      setError(undefined, e)
    }
    reader.onerror = () => {
      setError('Could not read that file.', e)
      e.target.value = ''
    }
    reader.readAsDataURL(file)
    setTouched(true, e)
  }

  function handleClear(e) {
    setValue('', e)
    setError(undefined, e)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return render(
    <div className={rootClassName}>
      {label ? (
        <span className="logo-upload__label" id={`${inputId}-label`}>
          {label}
        </span>
      ) : null}
      <div
        className="logo-upload__controls"
        role="group"
        aria-labelledby={label ? `${inputId}-label` : undefined}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          className="logo-upload__file"
          accept={ACCEPT}
          onChange={handleFileChange}
          aria-invalid={showError}
          aria-describedby={showError ? `${props.name}-error` : undefined}
        />
        <label htmlFor={inputId} className="logo-upload__choose">
          Choose image
        </label>
        {dataUrl ? (
          <button
            type="button"
            className="logo-upload__clear"
            onClick={handleClear}
          >
            Remove logo
          </button>
        ) : null}
      </div>
      {dataUrl ? (
        <div className="logo-upload__preview">
          <img src={dataUrl} alt="" className="logo-upload__thumb" />
        </div>
      ) : null}
      {showError ? (
        <p id={`${props.name}-error`} className="logo-upload__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>,
  )
}
