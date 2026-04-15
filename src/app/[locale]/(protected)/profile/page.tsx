'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/api/error-message'
import {
  useLazyMeQuery,
  useUpdateMeMutation,
} from '@/store/features/auth/authApi'

export default function ProfilePage() {
  const [loadMe, { isFetching }] = useLazyMeQuery()
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [profilePicture, setProfilePicture] = useState('')

  useEffect(() => {
    void (async () => {
      try {
        const response = await loadMe().unwrap()
        const me = response.data
        setFirstName(me.firstName ?? '')
        setLastName(me.lastName ?? '')
        setPhone(me.phone ?? '')
        setCountryCode(me.countryCode ?? '')
        setProfilePicture(me.profilePicture ?? '')
      } catch {
        toast.error('Unable to load profile')
      }
    })()
  }, [loadMe])

  const onSave = async () => {
    if (!firstName.trim()) {
      toast.error('First name is required')
      return
    }

    try {
      await updateMe({
        firstName,
        lastName,
        phone,
        countryCode,
        profilePicture,
      }).unwrap()

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Profile update failed'))
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your personal information here.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
          {profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePicture}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Preview updates immediately. Save to persist changes.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>First name</span>
          <input
            className="h-10 w-full rounded-lg border border-input bg-background px-3"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Last name</span>
          <input
            className="h-10 w-full rounded-lg border border-input bg-background px-3"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Phone</span>
          <input
            className="h-10 w-full rounded-lg border border-input bg-background px-3"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Country code</span>
          <input
            className="h-10 w-full rounded-lg border border-input bg-background px-3"
            value={countryCode}
            onChange={(event) =>
              setCountryCode(event.target.value.toUpperCase())
            }
          />
        </label>
      </div>

      <label className="mt-3 block space-y-1 text-sm">
        <span>Profile picture URL</span>
        <input
          className="h-10 w-full rounded-lg border border-input bg-background px-3"
          value={profilePicture}
          onChange={(event) => setProfilePicture(event.target.value)}
        />
      </label>

      <Button
        type="button"
        className="mt-4"
        onClick={onSave}
        disabled={isSaving || isFetching}
      >
        {isSaving ? 'Saving...' : 'Save profile'}
      </Button>
    </section>
  )
}
