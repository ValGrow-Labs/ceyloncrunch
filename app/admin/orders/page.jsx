import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import AdminOrdersClient from './AdminOrdersClient'
import { isDevBypass, SAMPLE_ORDERS } from '@/lib/mock-data'

export const metadata = { title: 'Orders — Admin' }

export default async function AdminOrdersPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {}
  const status = resolvedParams?.status || ''

  let orders = []
  let count = 0

  try {
    const supabase = await createClient()
    let query = supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(50)
    if (status) query = query.eq('status', status)
    const res = await query
    orders = res?.data || []
    count = res?.count || orders.length
  } catch {}

  if ((!orders || orders.length === 0) && isDevBypass()) {
    orders = status ? SAMPLE_ORDERS.filter(o => o.status === status) : SAMPLE_ORDERS
    count = orders.length
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${count || 0} orders total`} />
      <AdminOrdersClient initialOrders={orders || []} initialStatus={status} />
    </div>
  )
}
