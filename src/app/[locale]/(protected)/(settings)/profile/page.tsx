'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/error-message'
import { useMeQuery, useUpdateMeMutation } from '@/store/features/auth/authApi'

import {
  BusyIcon,
  COUNTRY_OPTIONS,
  createInitialProfileState,
  isValidUrl,
  type ProfileFormState,
  SectionTitle,
} from '@/components/settings/SettingsShared'

export default function ProfilePage() {
  const { data: meResponse, isFetching: isLoadingProfile } = useMeQuery()
  const [updateMe, { isLoading: isUpdatingProfile }] = useUpdateMeMutation()
  const [profileState, setProfileState] = useState<ProfileFormState>(
    createInitialProfileState(),
  )
  const [initialProfileState, setInitialProfileState] =
    useState<ProfileFormState>(createInitialProfileState())

  useEffect(() => {
    const user = meResponse?.data
    if (!user) {
      return
    }

    const nextState: ProfileFormState = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      countryCode: user.countryCode ?? 'BD',
      profilePicture: user.profilePicture ?? '',
      address: localStorage.getItem('settings:address') ?? '',
    }

    setProfileState(nextState)
    setInitialProfileState(nextState)
  }, [meResponse?.data])

  const hasChanges =
    profileState.firstName !== initialProfileState.firstName ||
    profileState.lastName !== initialProfileState.lastName ||
    profileState.phone !== initialProfileState.phone ||
    profileState.countryCode !== initialProfileState.countryCode ||
    profileState.profilePicture !== initialProfileState.profilePicture ||
    profileState.address !== initialProfileState.address

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setProfileState((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!hasChanges) {
      toast.error('No profile changes to save.')
      return
    }

    if (!profileState.firstName.trim()) {
      toast.error('First name is required.')
      return
    }

    if (profileState.phone.trim() && profileState.phone.trim().length < 6) {
      toast.error('Phone number must be at least 6 characters.')
      return
    }

    if (
      profileState.profilePicture.trim() &&
      !isValidUrl(profileState.profilePicture.trim())
    ) {
      toast.error('Profile picture must be a valid URL.')
      return
    }

    try {
      await updateMe({
        firstName: profileState.firstName.trim(),
        lastName: profileState.lastName.trim() || undefined,
        phone: profileState.phone.trim() || undefined,
        countryCode: profileState.countryCode.trim().toUpperCase(),
        profilePicture: profileState.profilePicture.trim() || undefined,
      }).unwrap()

      localStorage.setItem('settings:address', profileState.address.trim())
      setInitialProfileState(profileState)
      toast.success('Profile updated successfully.')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update profile.'))
    }
  }

  return (
    <section>
      <SectionTitle tone="brand" text="Profile Identity" />
      <article className="rounded-xl border border-slate-200 bg-[#f9fbfc] p-5 sm:p-6">
        {isLoadingProfile ? (
          <div className="space-y-4">
            <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-11 animate-pulse rounded bg-slate-200" />
              <div className="h-11 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-11 animate-pulse rounded bg-slate-200" />
            <div className="h-11 animate-pulse rounded bg-slate-200" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  First Name
                </span>
                <input
                  value={profileState.firstName}
                  onChange={(event) =>
                    handleFieldChange('firstName', event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-base font-medium text-slate-700 outline-none transition focus:border-brand-400"
                />
              </label>

              <label className="space-y-1.5 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Last Name
                </span>
                <input
                  value={profileState.lastName}
                  onChange={(event) =>
                    handleFieldChange('lastName', event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-base font-medium text-slate-700 outline-none transition focus:border-brand-400"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Phone Number
                </span>
                <input
                  value={profileState.phone}
                  onChange={(event) =>
                    handleFieldChange('phone', event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-base font-medium text-slate-700 outline-none transition focus:border-brand-400"
                />
              </label>

              <label className="space-y-1.5 text-sm">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Country
                </span>
                <select
                  value={profileState.countryCode || 'BD'}
                  onChange={(event) =>
                    handleFieldChange('countryCode', event.target.value)
                  }
                  className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-400"
                >
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code}) {country.dial}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-1.5 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Profile Picture URL
              </span>
              <input
                value={profileState.profilePicture}
                onChange={(event) =>
                  handleFieldChange('profilePicture', event.target.value)
                }
                placeholder="https://example.com/photo.jpg"
                className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-base font-medium text-slate-700 outline-none transition focus:border-brand-400"
              />
            </label>

            <label className="block space-y-1.5 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Email Address (Not Updatable)
              </span>
              <input
                disabled
                value={profileState.email}
                className="h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 text-base font-medium text-slate-500"
              />
            </label>

            <label className="block space-y-1.5 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Address
              </span>
              <input
                value={profileState.address}
                onChange={(event) =>
                  handleFieldChange('address', event.target.value)
                }
                placeholder="Your full address"
                className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-base font-medium text-slate-700 outline-none transition focus:border-brand-400"
              />
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!hasChanges || isUpdatingProfile}
                className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isUpdatingProfile ? <BusyIcon /> : null}
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  )
}
