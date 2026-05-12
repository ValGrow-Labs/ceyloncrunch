import { createClient } from '@/lib/supabase-server'
import StatCard from '@/components/admin/StatCard'
import StatusBadge from '@/components/admin/StatusBadge'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — Admin' }

export default async function AdminDashboard() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  const [
    { data: allOrders },
    { data: monthOrders },
    { data: lastMonthOrders },
    { data: products },
    { data: newsletter },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total, status'),
    supabase.from('orders').select('total, status').gte('created_at', startOfMonth),
    supabase.from('orders').select('total').gte('created_at', startOfLastMonth).lte('created_at', endOfLastMonth).in('status', ['paid','shipped','delivered']),
    supabase.from('products').select('id, active'),
    supabase.from('newsletter').select('id, active'),
    supabase.from('orders').select('id, customer_name, customer_email, total, status, payment_method, created_at').order('created_at', { ascending: false }).limit(8),
  ])

  const calcRevenue = (orders) => (orders || []).filter(o => ['paid','shipped','delivered'].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0)
  const monthRevenue = calcRevenue(monthOrders)
  const lastMonthRevenue = (lastMonthOrders || []).reduce((s, o) => s + (o.total || 0), 0)
  const revTrend = lastMonthRevenue > 0 ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : null

  const statusCounts = (allOrders || []).reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} — here's what's happening today.`} />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard label="Revenue This Month" value={`LKR ${monthRevenue.toLocaleString()}`} icon="💰" color="#16a34a" trend={revTrend} />
        <StatCard label="Total Orders" value={(allOrders?.length || 0).toLocaleString()} sub={`${statusCounts.pending || 0} pending`} icon="📦" color="#2563eb" />
        <StatCard label="Active Products" value={(products?.filter(p => p.active).length || 0).toString()} sub={`${products?.length || 0} total`} icon="🥜" color="#d97706" />
        <StatCard label="Newsletter Subscribers" value={(newsletter?.filter(n => n.active).length || 0).toString()} sub={`${newsletter?.length || 0} total`} icon="✉" color="#9333ea" />
      </div>

      {/* Order status overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Pending',   status: 'pending',   count: statusCounts.pending || 0 },
          { label: 'Paid',      status: 'paid',      count: statusCounts.paid || 0 },
          { label: 'Shipped',   status: 'shipped',   count: statusCounts.shipped || 0 },
          { label: 'Delivered', status: 'delivered', count: statusCounts.delivered || 0 },
          { label: 'Cancelled', status: 'cancelled', count: statusCounts.cancelled || 0 },
        ].map(({ label, status, count }) => (
          <Link key={status} href={`/admin/orders?status=${status}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111', fontFamily: 'Playfair Display,serif' }}>{count}</div>
              <StatusBadge status={status} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/orders/${order.id}`} style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{order.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{order.customer_email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111' }}>LKR {(order.total || 0).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>{(order.payment_method || 'cod').replace('_', ' ')}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={order.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>{new Date(order.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
              {!recentOrders?.length && (
                <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
