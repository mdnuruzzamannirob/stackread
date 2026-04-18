'use client'

import InputField from '@/components/InputField'
import { Home, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <div className="flex flex-1 min-h-dvh">
        {/* Left - fixed */}
        <section className="w-1/2 fixed top-0 left-0 min-h-dvh bg-red-50">
          Left
        </section>

        {/* Right - scrollable */}
        <section className="w-1/2 ml-[50%] min-h-dvh flex items-center justify-center bg-white overflow-y-auto">
          <div className="mx-auto w-full rounded-xl max-w-lg px-4 py-10 sm:px-6">
            <div className="mb-10 space-y-4">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Create Account
              </h1>
              <p>Start your reading journey with StackRead.</p>
            </div>
            <form action="">
              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <InputField
                  icon={<User size={17} />}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <InputField
                  icon={<User size={17} />}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <InputField
                  icon={<Mail size={17} />}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <InputField
                  icon={<Phone size={17} />}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <InputField
                  icon={<Home size={17} />}
                  type="text"
                  name="address"
                  placeholder="Address (optional)"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <InputField
                  icon={<Lock size={17} />}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <InputField
                  icon={<Lock size={17} />}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 mb-5 mt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-teal-700 cursor-pointer"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-sm text-gray-500 leading-relaxed"
                >
                  I agree to the{' '}
                  <a href="#" className="text-teal-700 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-teal-700 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full h-12 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white text-sm font-medium rounded-lg transition-all duration-150"
              >
                Create Account
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
