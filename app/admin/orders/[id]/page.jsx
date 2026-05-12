import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import OrderDetailClient from './OrderDetailClient'

export const metadata = { title: 'Order Detail — Admin' }

export default async function OrderDetailPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) notFound()

  let items = []
  try { items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []) } catch {}

  return (
    <div>
      <PageHeader
        title={`Order #${order.id.slice(-8).toUpperCase()}`}
        subtitle={new Date(order.created_at).toLocaleString('en-LK', { dateStyle: 'full', timeStyle: 'short' })}
        action={<StatusBadge status={order.status} size="lg" />}
      />
      <OrderDetailClient order={order} items={items} />
    </div>
  )
}
