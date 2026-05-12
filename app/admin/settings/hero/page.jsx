import { getSetting } from '@/lib/settings'
import HeroClient from './HeroClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Hero Section — Settings' }

export default async function HeroPage() {
  const hero = await getSetting('hero') || {}
  return (
    <div>
      <PageHeader title="Hero Section" subtitle="Homepage hero — headline, subtext, CTAs, background" />
      <HeroClient initial={hero} />
    </div>
  )
}
