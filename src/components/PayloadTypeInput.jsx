import { useField } from 'informed'
import { PAYLOAD_TYPES } from '../payloadTypes.js'
import './ShapeStyleInput.css'

export function PayloadTypeInput(props) {
  const { fieldState, fieldApi, render, userProps } = useField({
    ...props,
    id: props.id ?? props.name,
  })

  const { error, showError } = fieldState
  const { setValue, setTouched } = fieldApi
  const { label, id, className } = userProps

  const current = fieldState.value ?? PAYLOAD_TYPES[0].id

  const labelId = id ? `${id}-label` : `${props.name}-label`
  const groupClassName = ['shape-style-input__group', className]
    .filter(Boolean)
    .join(' ')

  return render(
    <div className="shape-style-input">
      {label ? (
        <span className="shape-style-input__label" id={labelId}>
          {label}
        </span>
      ) : null}
      <div
        className={groupClassName}
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={showError}
        aria-describedby={showError ? `${props.name}-error` : undefined}
      >
        {PAYLOAD_TYPES.map((item) => {
          const selected = current === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`shape-style-input__option${selected ? ' shape-style-input__option--selected' : ''}`}
              onClick={(e) => {
                setValue(item.id, e)
                setTouched(true, e)
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {showError ? (
        <p id={`${props.name}-error`} className="shape-style-input__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>,
  )
}
