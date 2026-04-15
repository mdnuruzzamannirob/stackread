'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useLazyGetTwoFactorBackupCodesCountQuery,
  useVerifyTwoFactorMutation,
} from '@/store/features/auth/authApi'

export default function SecurityPage() {
  const [setupOtp, setSetupOtp] = useState('')
  const [disableOtp, setDisableOtp] = useState('')
  const [backupOtp, setBackupOtp] = useState('')
  const [setupData, setSetupData] = useState<{
    secret: string
    qrCodeUrl: string
    backupCodes: string[]
  } | null>(null)

  const [enableTwoFactor, { isLoading: isEnabling }] =
    useEnableTwoFactorMutation()
  const [verifyTwoFactor, { isLoading: isVerifying }] =
    useVerifyTwoFactorMutation()
  const [disableTwoFactor, { isLoading: isDisabling }] =
    useDisableTwoFactorMutation()
  const [
    loadBackupCodes,
    { data: backupCodesResponse, isLoading: isCheckingBackupCodes },
  ] = useLazyGetTwoFactorBackupCodesCountQuery()

  const onEnable = async () => {
    try {
      const response = await enableTwoFactor().unwrap()
      setSetupData(response.data)
      toast.success('2FA setup generated. Verify with OTP to activate.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to start 2FA setup'))
    }
  }

  const onVerifySetup = async () => {
    if (!/^\d{6}$/.test(setupOtp)) {
      toast.error('OTP must be 6 digits')
      return
    }

    try {
      await verifyTwoFactor({ otp: setupOtp }).unwrap()
      toast.success('2FA enabled successfully')
      setSetupOtp('')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to verify 2FA setup'))
    }
  }

  const onDisable = async () => {
    if (!/^\d{6}$/.test(disableOtp)) {
      toast.error('OTP must be 6 digits')
      return
    }

    try {
      await disableTwoFactor({ otp: disableOtp }).unwrap()
      toast.success('2FA disabled successfully')
      setDisableOtp('')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to disable 2FA'))
    }
  }

  const onCheckBackupCodes = async () => {
    if (!/^\d{6}$/.test(backupOtp)) {
      toast.error('OTP must be 6 digits')
      return
    }

    try {
      await loadBackupCodes({ otp: backupOtp }).unwrap()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to load backup code count'))
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <article className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Security and 2FA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage two-factor authentication using authenticator OTP.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={onEnable} disabled={isEnabling}>
            {isEnabling ? 'Generating...' : 'Generate 2FA setup'}
          </Button>
        </div>

        {setupData ? (
          <div className="mt-4 space-y-2 rounded-lg border border-border p-3 text-sm">
            <p>
              Secret: <span className="font-mono">{setupData.secret}</span>
            </p>
            <p className="break-all">QR URL: {setupData.qrCodeUrl}</p>
            <p>Backup codes: {setupData.backupCodes.join(', ')}</p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="space-y-1 text-sm">
            <span>OTP to verify setup</span>
            <input
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={setupOtp}
              onChange={(event) => setSetupOtp(event.target.value)}
              placeholder="6-digit OTP"
            />
          </label>
          <Button type="button" onClick={onVerifySetup} disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify and enable'}
          </Button>
        </div>
      </article>

      <article className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Disable 2FA</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="space-y-1 text-sm">
            <span>Current OTP</span>
            <input
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={disableOtp}
              onChange={(event) => setDisableOtp(event.target.value)}
              placeholder="6-digit OTP"
            />
          </label>
          <Button type="button" onClick={onDisable} disabled={isDisabling}>
            {isDisabling ? 'Disabling...' : 'Disable 2FA'}
          </Button>
        </div>
      </article>

      <article className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Backup codes status</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="space-y-1 text-sm">
            <span>OTP to check count</span>
            <input
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={backupOtp}
              onChange={(event) => setBackupOtp(event.target.value)}
              placeholder="6-digit OTP"
            />
          </label>
          <Button
            type="button"
            onClick={() => void onCheckBackupCodes()}
            disabled={isCheckingBackupCodes}
          >
            {isCheckingBackupCodes ? 'Checking...' : 'Check remaining'}
          </Button>
        </div>

        {backupCodesResponse?.data ? (
          <p className="mt-3 text-sm">
            Remaining backup codes:{' '}
            {backupCodesResponse.data.remainingBackupCodes}
          </p>
        ) : null}
      </article>
    </section>
  )
}
