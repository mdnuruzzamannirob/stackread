import { SettingsSections } from '@/components/settings/settings-sections'
import { SettingsShell } from '@/components/settings/settings-shell'

export default async function DangerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <SettingsShell locale={locale}>
      <SettingsSections focusSection="danger" />
    </SettingsShell>
  )
}
