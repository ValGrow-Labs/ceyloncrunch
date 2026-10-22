import { getSetting } from '@/lib/settings'
import BrandingClient from './BrandingClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Branding — Settings' }

export default async function BrandingPage() {
  const branding = await getSetting('branding') || {}
  return (
    <div>
      <PageHeader title="Branding" subtitle="Logo, site name, tagline and identity" />
      <BrandingClient initial={branding} />
    </div>
  )
}
