import { useState } from 'react'

interface InputFieldProps {
  icon: React.ReactNode
  type: string
  name: string
  placeholder: string
  value: string
  className?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  className,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 h-12 w-full rounded-lg border bg-gray-50 transition-all duration-150
        ${
          focused
            ? 'border-teal-600 bg-white ring-2 ring-teal-600/10'
            : 'border-gray-200 hover:border-gray-300'
        } ${className}`}
    >
      <span
        className={`transition-colors duration-150 ${focused ? 'text-teal-600' : 'text-gray-400'}`}
      >
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
      />
    </div>
  )
}
