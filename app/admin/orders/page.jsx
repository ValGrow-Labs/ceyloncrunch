import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import AdminOrdersClient from './AdminOrdersClient'

export const metadata = { title: 'Orders — Admin' }

export default async function AdminOrdersPage({ searchParams }) {
  const supabase = await createClient()
  const status = searchParams?.status || ''
  let query = supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(50)
  if (status) query = query.eq('status', status)
  const { data: orders, count } = await query

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${count || 0} orders total`} />
      <AdminOrdersClient initialOrders={orders || []} initialStatus={status} />
    </div>
  )
}
