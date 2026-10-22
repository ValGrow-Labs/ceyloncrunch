'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'

const STATUSES = ['', 'pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersClient({ initialOrders, initialStatus }) {
  const [orders, setOrders] = useState(initialOrders)
  const [status, setStatus] = useState(initialStatus)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleStatusFilter = (s) => {
    setStatus(s)
    router.push(s ? `/admin/orders?status=${s}` : '/admin/orders')
  }

  const filtered = orders.filter(o =>
    !search ||
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.slice(-8).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* Filters */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => handleStatusFilter(s)}
              style={{ padding: '6px 14px', borderRadius: 50, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: status === s ? 'var(--green)' : '#f3f4f6', color: status === s ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, order ID..."
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} orders</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid #f3f4f6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{order.customer_name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{order.customer_email}</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111' }}>
                  LKR {(order.total || 0).toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>
                  {(order.payment_method || 'cod').replace('_', ' ')}
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={order.status} /></td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>
                  {new Date(order.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/admin/orders/${order.id}`}>
                    <button style={{ padding: '6px 14px', background: '#f0f7f2', color: 'var(--green)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
