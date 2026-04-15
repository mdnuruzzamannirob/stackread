'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useLazyGetTwoFactorBackupCodesCountQuery,
  useMeQuery,
  useRegenerateBackupCodesMutation,
  useVerifyTwoFactorMutation,
} from '@/store/features/auth/authApi'

export default function SecurityPage() {
  const [setupOtp, setSetupOtp] = useState('')
  const [disableOtp, setDisableOtp] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [backupOtp, setBackupOtp] = useState('')
  const [backupPassword, setBackupPassword] = useState('')
  const [setupData, setSetupData] = useState<{
    secret: string
    qrCodeUrl: string
    backupCodes: string[]
  } | null>(null)
  const [regeneratedBackupCodes, setRegeneratedBackupCodes] = useState<
    string[]
  >([])

  const { data: meResponse, refetch: refetchMe } = useMeQuery()
  const twoFactorEnabled = Boolean(meResponse?.data?.twoFactorEnabled)

  const [enableTwoFactor, { isLoading: isEnabling }] =
    useEnableTwoFactorMutation()
  const [verifyTwoFactor, { isLoading: isVerifying }] =
    useVerifyTwoFactorMutation()
  const [disableTwoFactor, { isLoading: isDisabling }] =
    useDisableTwoFactorMutation()
  const [regenerateBackupCodes, { isLoading: isRegeneratingBackupCodes }] =
    useRegenerateBackupCodesMutation()
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
      await refetchMe()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to verify 2FA setup'))
    }
  }

  const onDisable = async () => {
    if (!disablePassword && !/^\d{6}$/.test(disableOtp)) {
      toast.error('Provide either a valid OTP or your current password')
      return
    }

    try {
      await disableTwoFactor({
        ...(disableOtp ? { otp: disableOtp } : {}),
        ...(disablePassword ? { currentPassword: disablePassword } : {}),
      }).unwrap()
      toast.success('2FA disabled successfully')
      setDisableOtp('')
      setDisablePassword('')
      setSetupData(null)
      setRegeneratedBackupCodes([])
      await refetchMe()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to disable 2FA'))
    }
  }

  const onRegenerateBackupCodes = async () => {
    if (!backupPassword && !/^\d{6}$/.test(backupOtp)) {
      toast.error('Provide either a valid OTP or your current password')
      return
    }

    try {
      const response = await regenerateBackupCodes({
        ...(backupOtp ? { otp: backupOtp } : {}),
        ...(backupPassword ? { currentPassword: backupPassword } : {}),
      }).unwrap()

      setRegeneratedBackupCodes(response.data?.backupCodes ?? [])
      setBackupOtp('')
      setBackupPassword('')
      toast.success('Backup codes regenerated. Save them now.')
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to regenerate backup codes'),
      )
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
          Manage two-factor authentication for your account.
        </p>

        <div className="mt-3 rounded-lg border border-border bg-background p-3 text-sm">
          <p>
            Status:{' '}
            <span className="font-medium">
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </p>
          <p className="text-muted-foreground">
            Current method: Authenticator app (with email OTP and backup code
            challenge support).
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onEnable}
            disabled={isEnabling || twoFactorEnabled}
          >
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
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm with either your current OTP or your current password.
        </p>
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
          <label className="space-y-1 text-sm">
            <span>Or current password</span>
            <input
              type="password"
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={disablePassword}
              onChange={(event) => setDisablePassword(event.target.value)}
              placeholder="Current password"
            />
          </label>
          <Button type="button" onClick={onDisable} disabled={isDisabling}>
            {isDisabling ? 'Disabling...' : 'Disable 2FA'}
          </Button>
        </div>
      </article>

      <article className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Backup codes status</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Backup codes are shown once. Regeneration invalidates all previous
          codes.
        </p>
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

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="space-y-1 text-sm">
            <span>OTP to regenerate</span>
            <input
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={backupOtp}
              onChange={(event) => setBackupOtp(event.target.value)}
              placeholder="6-digit OTP"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Or current password</span>
            <input
              type="password"
              className="h-10 w-52 rounded-lg border border-input bg-background px-3"
              value={backupPassword}
              onChange={(event) => setBackupPassword(event.target.value)}
              placeholder="Current password"
            />
          </label>
          <Button
            type="button"
            variant="outline"
            onClick={() => void onRegenerateBackupCodes()}
            disabled={isRegeneratingBackupCodes}
          >
            {isRegeneratingBackupCodes
              ? 'Regenerating...'
              : 'Regenerate backup codes'}
          </Button>
        </div>

        {backupCodesResponse?.data ? (
          <p className="mt-3 text-sm">
            Remaining backup codes:{' '}
            {backupCodesResponse.data.remainingBackupCodes}
          </p>
        ) : null}

        {regeneratedBackupCodes.length > 0 ? (
          <div className="mt-3 rounded-lg border border-border bg-background p-3 text-sm">
            <p className="font-medium">New backup codes</p>
            <p className="mt-1 break-all">
              {regeneratedBackupCodes.join(', ')}
            </p>
          </div>
        ) : null}
      </article>
    </section>
  )
}
