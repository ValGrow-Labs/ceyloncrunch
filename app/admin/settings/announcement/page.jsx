import { getSetting } from '@/lib/settings'
import AnnouncementClient from './AnnouncementClient'
import PageHeader from '@/components/admin/PageHeader'
export const metadata = { title: 'Announcement Bar — Settings' }
export default async function AnnouncementPage() {
  const bar = await getSetting('announcement_bar') || {}
  return <div><PageHeader title="Announcement Bar" subtitle="Optional top banner shown on every page" /><AnnouncementClient initial={bar} /></div>
}
