import { getSetting } from '@/lib/settings'
import HomepageClient from './HomepageClient'
import PageHeader from '@/components/admin/PageHeader'
export const metadata = { title: 'Homepage — Settings' }
export default async function HomepagePage() {
  const [features, bestsellers, categories, aboutStrip, newsletter] = await Promise.all([
    getSetting('features'), getSetting('bestsellers_section'), getSetting('categories_section'),
    getSetting('about_strip'), getSetting('newsletter_section'),
  ])
  return (
    <div>
      <PageHeader title="Homepage Sections" subtitle="Edit every section on the home page" />
      <HomepageClient initial={{ features: features || [], bestsellers: bestsellers || {}, categories: categories || {}, about_strip: aboutStrip || {}, newsletter_section: newsletter || {} }} />
    </div>
  )
}
