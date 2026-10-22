import { getSetting } from '@/lib/settings'
import PaymentsClient from './PaymentsClient'
import PageHeader from '@/components/admin/PageHeader'

export const metadata = { title: 'Payments — Settings' }

export default async function PaymentsPage() {
  const payments = await getSetting('payments') || {}
  return (
    <div>
      <PageHeader title="Payment Methods" subtitle="Enable or disable payment options and configure credentials" />
      <PaymentsClient initial={payments} />
    </div>
  )
}
