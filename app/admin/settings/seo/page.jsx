import { getSetting } from '@/lib/settings'
import SEOClient from './SEOClient'
import PageHeader from '@/components/admin/PageHeader'
export const metadata = { title: 'SEO — Settings' }
export default async function SEOPage() {
  const seo = await getSetting('seo') || {}
  return <div><PageHeader title="SEO" subtitle="Default meta title, description and Open Graph image" /><SEOClient initial={seo} /></div>
}
