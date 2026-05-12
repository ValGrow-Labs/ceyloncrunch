import { getSetting } from '@/lib/settings'
import DeliveryClient from './DeliveryClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Delivery — Settings' }

export default async function DeliveryPage() {
  const delivery = await getSetting('delivery') || {}
  return (
    <div>
      <PageHeader title="Delivery Settings" subtitle="Fees, free delivery threshold, zones and dispatch time" />
      <DeliveryClient initial={delivery} />
    </div>
  )
}
