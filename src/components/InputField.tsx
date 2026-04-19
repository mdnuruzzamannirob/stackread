import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'

interface InputFieldProps {
  icon?: React.ReactNode
  type?: string
  name: string
  placeholder?: string
  value?: string
  className?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  autoComplete?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      icon,
      type = 'text',
      name,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      className,
      label,
      required,
      disabled = false,
      error,
      autoComplete,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
    const id = `field-${name}`

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(e)
    }

    const wrapperClass = [
      'flex items-center gap-2.5 px-3.5 h-11 w-full rounded-lg border bg-gray-50 cursor-text transition-all duration-150',
      disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
        : error
          ? focused
            ? 'border-red-400 bg-white ring-[2.5px] ring-red-400/10'
            : 'border-red-400 hover:border-red-400'
          : focused
            ? 'border-teal-600 bg-white ring-[2.5px] ring-teal-600/10'
            : 'border-gray-200 hover:border-gray-300',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const iconClass = [
      'transition-colors duration-150 shrink-0',
      disabled
        ? 'text-gray-300'
        : error
          ? 'text-red-400'
          : focused
            ? 'text-teal-600'
            : 'text-gray-400',
    ].join(' ')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-600 select-none cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <label htmlFor={id} className={wrapperClass}>
          {icon && <span className={iconClass}>{icon}</span>}

          <input
            ref={ref}
            id={id}
            type={inputType}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete={autoComplete}
            required={required}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              // ✅ FIX: onMouseDown এ preventDefault — input blur হবে না
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
              disabled={disabled}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </label>

        {/* ✅ error message */}
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  },
)

InputField.displayName = 'InputField'

export default InputField
