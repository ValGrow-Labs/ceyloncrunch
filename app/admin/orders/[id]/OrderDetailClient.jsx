'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default function OrderDetailClient({ order, items }) {
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState(order.notes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setSaving(false)
    router.refresh()
  }

  const cardStyle = { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Items */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Order Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={item.image || '/img/placeholder.jpg'} alt={item.name}
                  style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid #f3f4f6' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{item.variant} × {item.qty}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>LKR {(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
              <span>Subtotal</span><span>LKR {(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
              <span>Delivery</span><span style={{ color: order.delivery === 0 ? '#16a34a' : '#111' }}>{order.delivery === 0 ? 'Free' : `LKR ${order.delivery?.toLocaleString()}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
              <span>Total</span><span style={{ color: 'var(--green)' }}>LKR {(order.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Customer Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Name',    order.customer_name],
              ['Email',   order.customer_email],
              ['Phone',   order.customer_phone],
              ['City',    order.city || 'Colombo'],
              ['Payment', (order.payment_method || 'cod').replace('_', ' ').toUpperCase()],
              ['Payment ID', order.payment_id || '—'],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={labelStyle}>{l}</div>
                <div style={{ fontSize: 14, color: '#111', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={labelStyle}>Shipping Address</div>
            <div style={{ fontSize: 14, color: '#111', lineHeight: 1.6 }}>{order.shipping_address}</div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 92 }}>
        {/* Status update */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Update Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {STATUSES.map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', borderRadius: 10, background: status === s ? '#f0f7f2' : 'transparent', border: `1.5px solid ${status === s ? 'var(--green)' : '#f3f4f6'}`, transition: 'all 0.15s' }}>
                <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)}
                  style={{ accentColor: 'var(--green)' }} />
                <StatusBadge status={s} />
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>Internal Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Add notes visible only to admins..."
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = 'var(--green)'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <button onClick={save} disabled={saving}
            style={{ width: '100%', padding: '12px', background: saved ? '#16a34a' : 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Timeline */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Order Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATUSES.filter(s => s !== 'cancelled').map((s, i) => {
              const statusOrder = { pending: 0, paid: 1, shipped: 2, delivered: 3 }
              const currentIdx = statusOrder[order.status] ?? -1
              const stepIdx = statusOrder[s] ?? 0
              const done = currentIdx >= stepIdx
              return (
                <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? 'var(--green)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    {i < 3 && <div style={{ width: 2, height: 20, background: done ? 'var(--green)' : '#e5e7eb' }} />}
                  </div>
                  <div style={{ paddingBottom: i < 3 ? 12 : 0, paddingTop: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: done ? '#111' : '#9ca3af', textTransform: 'capitalize' }}>{s}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
