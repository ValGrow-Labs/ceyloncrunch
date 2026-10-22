import { getSetting } from '@/lib/settings'
import NavigationClient from './NavigationClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Navigation — Settings' }

export default async function NavigationPage() {
  const navLinks = await getSetting('nav_links') || []
  return (
    <div>
      <PageHeader title="Navigation" subtitle="Add, remove, and reorder navbar links" />
      <NavigationClient initial={navLinks} />
    </div>
  )
}
