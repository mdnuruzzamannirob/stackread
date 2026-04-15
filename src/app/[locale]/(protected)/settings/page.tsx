'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useChangeMyPasswordMutation,
  useUpdateMyNotificationPreferencesMutation,
} from '@/store/features/auth/authApi'

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [
    updateNotificationPreferences,
    { isLoading: isUpdatingNotifications },
  ] = useUpdateMyNotificationPreferencesMutation()
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeMyPasswordMutation()

  const onSaveNotifications = async () => {
    try {
      await updateNotificationPreferences({
        email: emailNotifications,
        push: pushNotifications,
      }).unwrap()

      toast.success('Notification settings updated')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update notifications'))
    }
  }

  const onChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to change password'))
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <article className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update notifications and account security settings.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(event) => setEmailNotifications(event.target.checked)}
            />
            <span>Email notifications</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(event) => setPushNotifications(event.target.checked)}
            />
            <span>Push notifications</span>
          </label>
        </div>

        <Button
          type="button"
          className="mt-4"
          onClick={onSaveNotifications}
          disabled={isUpdatingNotifications}
        >
          {isUpdatingNotifications ? 'Saving...' : 'Save notifications'}
        </Button>
      </article>

      <article className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">Change password</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Current password</span>
            <input
              type="password"
              className="h-10 w-full rounded-lg border border-input bg-background px-3"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>New password</span>
            <input
              type="password"
              className="h-10 w-full rounded-lg border border-input bg-background px-3"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
        </div>

        <Button
          type="button"
          className="mt-4"
          onClick={onChangePassword}
          disabled={isChangingPassword}
        >
          {isChangingPassword ? 'Updating...' : 'Update password'}
        </Button>
      </article>
    </section>
  )
}
