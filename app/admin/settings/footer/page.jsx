import { getSetting } from '@/lib/settings'
import FooterClient from './FooterClient'
import PageHeader from '@/components/admin/PageHeader'
export const metadata = { title: 'Footer — Settings' }
export default async function FooterPage() {
  const footer = await getSetting('footer') || {}
  return <div><PageHeader title="Footer" subtitle="Contact info, social links, and copyright" /><FooterClient initial={footer} /></div>
}
