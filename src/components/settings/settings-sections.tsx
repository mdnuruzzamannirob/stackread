'use client'

import { Fingerprint, KeyRound } from 'lucide-react'
import { useEffect } from 'react'

type SectionKey = 'profile' | 'security' | 'preferences' | 'danger'

type SettingsSectionsProps = {
  focusSection: SectionKey
}

function SectionTitle({
  tone,
  text,
}: {
  tone: 'brand' | 'danger'
  text: string
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={`h-1 w-8 rounded-full ${tone === 'danger' ? 'bg-red-600' : 'bg-brand-700'}`}
      />
      <h2
        className={`text-sm font-semibold uppercase tracking-[2.8px] ${tone === 'danger' ? 'text-red-700' : 'text-slate-700'}`}
      >
        {text}
      </h2>
    </div>
  )
}

function PreferenceToggle({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        checked ? 'bg-brand-700' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </span>
  )
}

export function SettingsSections({ focusSection }: SettingsSectionsProps) {
  useEffect(() => {
    const element = document.getElementById(`settings-section-${focusSection}`)
    if (!element) return
    element.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [focusSection])

  return (
    <>
      <section id="settings-section-profile">
        <SectionTitle tone="brand" text="Profile Identity" />
        <article className="rounded-xl border border-slate-200 bg-[#f9fbfc] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Full Name
              </span>
              <input
                className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-sm font-medium text-slate-700"
                defaultValue="Elena Rodriguez"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Phone Number
              </span>
              <input
                className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-sm font-medium text-slate-700"
                defaultValue="+1 (555) 234-8890"
              />
            </label>
          </div>

          <label className="mt-4 block space-y-1 text-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Email Address
            </span>
            <input
              className="h-11 w-full rounded-md border border-slate-200 bg-[#eef2f4] px-3 text-sm font-medium text-slate-700"
              defaultValue="elena.r@editorial.stackread.com"
            />
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_-8px_rgba(4,63,49,0.65)]"
            >
              Save Profile Changes
            </button>
          </div>
        </article>
      </section>

      <section id="settings-section-security" className="pt-5">
        <SectionTitle tone="brand" text="Security Protocols" />
        <article className="space-y-4 rounded-xl border border-slate-200 bg-[#f9fbfc] p-5">
          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-[#eef2f4] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#c9dcfb] p-2.5 text-[#305ea8]">
                <KeyRound className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Password update
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Last changed 4 months ago
                </p>
              </div>
            </div>
            <button
              type="button"
              className="self-start rounded-md border border-slate-300 bg-[#f8fafb] px-4 py-1.5 text-xs font-semibold text-slate-600 sm:self-auto"
            >
              Update
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-[#eef2f4] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-[#bfeff4] p-2.5 text-[#1b7f89]">
                <Fingerprint className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  2FA setup status
                </p>
                <p className="text-xs font-semibold text-teal-700">
                  Active and Protected
                </p>
              </div>
            </div>
            <button
              type="button"
              className="self-start rounded-md border border-slate-300 bg-[#f8fafb] px-4 py-1.5 text-xs font-semibold text-slate-600 sm:self-auto"
            >
              Manage
            </button>
          </div>
        </article>
      </section>

      <section id="settings-section-preferences" className="pt-5">
        <SectionTitle tone="brand" text="Preferences" />
        <article className="rounded-xl border border-slate-200 bg-[#f9fbfc] p-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Email digests
                </p>
                <p className="mt-0.5 max-w-xl text-xs font-medium leading-5 text-slate-500">
                  Receive weekly curated reports of your reading progress and
                  top recommendations.
                </p>
              </div>
              <PreferenceToggle checked />
            </div>

            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Push notifications
                </p>
                <p className="mt-0.5 max-w-xl text-xs font-medium leading-5 text-slate-500">
                  Instant alerts for community highlights and direct curator
                  messages.
                </p>
              </div>
              <PreferenceToggle checked={false} />
            </div>

            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Beta features{' '}
                  <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500">
                    EXPERIMENTAL
                  </span>
                </p>
                <p className="mt-0.5 max-w-xl text-xs font-medium leading-5 text-slate-500">
                  Early access to AI-driven summary insights and advanced
                  taxonomy tools.
                </p>
              </div>
              <PreferenceToggle checked />
            </div>
          </div>
        </article>
      </section>

      <section id="settings-section-danger" className="pt-5">
        <SectionTitle tone="danger" text="Danger Zone" />
        <article className="rounded-xl border border-red-100 bg-[#fffafb] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-red-700">
                Delete account
              </p>
              <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
                Permanently delete your profile, library history, and all
                editorial notes. This action is irreversible.
              </p>
            </div>
            <button
              type="button"
              className="rounded-md bg-red-700 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Deactivate My Account
            </button>
          </div>
        </article>
      </section>
      <div className="h-4" />
    </>
  )
}
