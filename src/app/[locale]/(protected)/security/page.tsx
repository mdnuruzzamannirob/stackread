import { SettingsSections } from '@/components/settings/settings-sections'
import { SettingsShell } from '@/components/settings/settings-shell'

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <SettingsShell locale={locale}>
      <SettingsSections focusSection="security" />
    </SettingsShell>
  )
}
