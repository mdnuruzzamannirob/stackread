'use client'

import { Fingerprint, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useChangeMyPasswordMutation,
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useMeQuery,
  useVerifyTwoFactorMutation,
} from '@/store/features/auth/authApi'

import {
  BusyIcon,
  Modal,
  SectionTitle,
  StatusIcon,
} from '@/components/settings/SettingsShared'

export default function SecurityPage() {
  const { data: meResponse } = useMeQuery()
  const [changeMyPassword, { isLoading: isUpdatingPassword }] =
    useChangeMyPasswordMutation()
  const [enableTwoFactor, { isLoading: isGeneratingTwoFactor }] =
    useEnableTwoFactorMutation()
  const [verifyTwoFactor, { isLoading: isVerifyingTwoFactor }] =
    useVerifyTwoFactorMutation()
  const [disableTwoFactor, { isLoading: isDisablingTwoFactor }] =
    useDisableTwoFactorMutation()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEnableTwoFactorModal, setShowEnableTwoFactorModal] =
    useState(false)
  const [showDisableTwoFactorModal, setShowDisableTwoFactorModal] =
    useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [setupOtp, setSetupOtp] = useState('')
  const [generatedTwoFactorData, setGeneratedTwoFactorData] = useState<{
    secret: string
    qrCodeUrl: string
    backupCodes: string[]
  } | null>(null)

  const [disableOtp, setDisableOtp] = useState('')
  const [disablePassword, setDisablePassword] = useState('')

  const twoFactorEnabled = Boolean(meResponse?.data.twoFactorEnabled)

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Current and new password are required.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.')
      return
    }

    try {
      await changeMyPassword({ currentPassword, newPassword }).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordModal(false)
      toast.success('Password changed successfully.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to change password.'))
    }
  }

  const handleGenerateTwoFactor = async () => {
    try {
      const response = await enableTwoFactor().unwrap()
      setGeneratedTwoFactorData(response.data)
      setShowEnableTwoFactorModal(true)
      toast.success('2FA setup generated. Verify OTP to finish enabling.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to start 2FA setup.'))
    }
  }

  const handleVerifyTwoFactor = async () => {
    if (!/^\d{6}$/.test(setupOtp.trim())) {
      toast.error('Please enter a valid 6-digit OTP.')
      return
    }

    try {
      await verifyTwoFactor({ otp: setupOtp.trim() }).unwrap()
      setSetupOtp('')
      setGeneratedTwoFactorData(null)
      setShowEnableTwoFactorModal(false)
      toast.success('2FA enabled successfully.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to verify 2FA OTP.'))
    }
  }

  const handleDisableTwoFactor = async () => {
    if (!disableOtp.trim() && !disablePassword.trim()) {
      toast.error('Provide OTP or current password to disable 2FA.')
      return
    }

    if (disableOtp.trim() && !/^\d{6}$/.test(disableOtp.trim())) {
      toast.error('OTP must be 6 digits.')
      return
    }

    try {
      await disableTwoFactor({
        otp: disableOtp.trim() || undefined,
        currentPassword: disablePassword.trim() || undefined,
      }).unwrap()
      setDisableOtp('')
      setDisablePassword('')
      setShowDisableTwoFactorModal(false)
      toast.success('2FA disabled successfully.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to disable 2FA.'))
    }
  }

  return (
    <section>
      <SectionTitle tone="brand" text="Security Protocols" />
      <article className="space-y-4 rounded-xl border border-slate-200 bg-[#f9fbfc] p-5 sm:p-6">
        <div className="rounded-md border border-slate-200 bg-[#eef2f4] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#c9dcfb] p-2.5 text-[#305ea8]">
                <KeyRound className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-700">
                  Password Update
                </p>
                <p className="text-sm font-medium text-slate-500">
                  Keep your account secure by updating passwords regularly.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="self-start rounded-md border border-slate-300 bg-[#f8fafb] px-4 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-white sm:self-auto"
            >
              Update
            </button>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-[#eef2f4] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#bfeff4] p-2.5 text-[#1b7f89]">
                <Fingerprint className="size-4" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-700">
                  Two-factor Authentication
                </p>
                <p
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                    twoFactorEnabled ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  <StatusIcon enabled={twoFactorEnabled} />
                  {twoFactorEnabled ? 'Enabled and Protected' : 'Disabled'}
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <button
                type="button"
                onClick={() => setShowDisableTwoFactorModal(true)}
                className="self-start rounded-md border border-red-300 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 sm:self-auto"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleGenerateTwoFactor()}
                disabled={isGeneratingTwoFactor}
                className="inline-flex self-start items-center gap-2 rounded-md border border-slate-300 bg-[#f8fafb] px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
              >
                {isGeneratingTwoFactor ? <BusyIcon /> : null}
                Enable 2FA
              </button>
            )}
          </div>
        </div>
      </article>

      <Modal
        open={showPasswordModal}
        title="Change Password"
        subtitle="Update your password to keep your account secure."
        onClose={() => setShowPasswordModal(false)}
      >
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowPasswordModal(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handlePasswordChange()}
            disabled={isUpdatingPassword}
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingPassword ? <BusyIcon /> : null}
            Save Password
          </button>
        </div>
      </Modal>

      <Modal
        open={showEnableTwoFactorModal}
        title="Enable 2FA"
        subtitle="Scan QR code and verify with OTP to activate two-factor authentication."
        onClose={() => setShowEnableTwoFactorModal(false)}
      >
        {generatedTwoFactorData ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                QR Setup
              </p>
              <div className="mt-2 flex justify-center">
                <img
                  src={generatedTwoFactorData.qrCodeUrl}
                  alt="2FA QR code"
                  className="size-44 rounded-lg border border-slate-200 bg-white p-2"
                />
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">
                Secret: {generatedTwoFactorData.secret}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Backup Codes
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {generatedTwoFactorData.backupCodes.map((code) => (
                  <div
                    key={code}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                OTP Verification Code
              </label>
              <input
                value={setupOtp}
                onChange={(event) => setSetupOtp(event.target.value)}
                placeholder="6-digit code"
                className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Generate setup first.</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowEnableTwoFactorModal(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleVerifyTwoFactor()}
            disabled={!generatedTwoFactorData || isVerifyingTwoFactor}
            className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifyingTwoFactor ? <BusyIcon /> : null}
            Verify & Enable
          </button>
        </div>
      </Modal>

      <Modal
        open={showDisableTwoFactorModal}
        title="Disable 2FA"
        subtitle="Provide OTP or your current password to disable 2FA."
        onClose={() => setShowDisableTwoFactorModal(false)}
      >
        <div className="space-y-3">
          <input
            value={disableOtp}
            onChange={(event) => setDisableOtp(event.target.value)}
            placeholder="OTP (optional if password provided)"
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
          />
          <input
            type="password"
            value={disablePassword}
            onChange={(event) => setDisablePassword(event.target.value)}
            placeholder="Current password (optional if OTP provided)"
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-500"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDisableTwoFactorModal(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleDisableTwoFactor()}
            disabled={isDisablingTwoFactor}
            className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDisablingTwoFactor ? <BusyIcon /> : null}
            Disable 2FA
          </button>
        </div>
      </Modal>
    </section>
  )
}
