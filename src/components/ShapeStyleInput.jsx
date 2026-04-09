import { useField } from 'informed'
import { SHAPE_STYLES } from '../shapeStyles'
import './ShapeStyleInput.css'

export function ShapeStyleInput(props) {
  const { fieldState, fieldApi, render, userProps } = useField({
    ...props,
    id: props.id ?? props.name,
  })

  const { error, showError } = fieldState
  const { setValue, setTouched } = fieldApi
  const { label, id, className } = userProps

  const current = fieldState.value ?? SHAPE_STYLES[0].id

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
        {SHAPE_STYLES.map((style) => {
          const selected = current === style.id
          return (
            <button
              key={style.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`shape-style-input__option${selected ? ' shape-style-input__option--selected' : ''}`}
              onClick={(e) => {
                setValue(style.id, e)
                setTouched(true, e)
              }}
            >
              {style.label}
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
