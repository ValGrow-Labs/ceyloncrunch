import { getSetting } from '@/lib/settings'
import ThemeClient from './ThemeClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Theme — Settings' }

export default async function ThemePage() {
  const theme = await getSetting('theme') || {}
  return (
    <div>
      <PageHeader title="Theme & Colors" subtitle="All brand colors — changes apply live to the store" />
      <ThemeClient initial={theme} />
    </div>
  )
}
