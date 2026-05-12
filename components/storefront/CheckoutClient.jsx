'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { IconCash, IconBank, IconCard } from './Icons'

export default function CheckoutClient({ paymentSettings, deliverySettings }) {
  const { cart, subtotal, currency, freeThreshold, deliveryFee, dispatch } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Colombo', notes: '' })

  const payments = paymentSettings || {}
  const delivery = subtotal >= (freeThreshold || 3000) ? 0 : (deliveryFee || 300)
  const total = subtotal + delivery

  const availableMethods = [
    payments.cod?.enabled && { key: 'cod', label: payments.cod.label || 'Cash on Delivery', desc: payments.cod.description || 'Pay when your order arrives', icon: <IconCash size={20} /> },
    payments.bank_transfer?.enabled && { key: 'bank_transfer', label: payments.bank_transfer.label || 'Bank Transfer', desc: payments.bank_transfer.description || 'Transfer to our bank account', icon: <IconBank size={20} /> },
    payments.payhere?.enabled && { key: 'payhere', label: payments.payhere.label || 'Pay Online', desc: payments.payhere.description || 'Credit/Debit card via PayHere', icon: <IconCard size={20} /> },
  ].filter(Boolean)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('Please fill all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: form.address,
          city: form.city,
          items: cart,
          subtotal,
          delivery,
          payment_method: paymentMethod,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      if (paymentMethod === 'payhere' && data.paymentUrl) {
        const f2 = document.createElement('form')
        f2.method = 'POST'
        f2.action = data.paymentUrl
        Object.entries(data.paymentData || {}).forEach(([k, v]) => {
          const inp = document.createElement('input')
          inp.type = 'hidden'; inp.name = k; inp.value = v
          f2.appendChild(inp)
        })
        document.body.appendChild(f2)
        f2.submit()
      } else {
        dispatch({ type: 'CLEAR' })
        window.location.href = `/order/success?id=${data.id}&method=${paymentMethod}`
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, color: 'var(--green-dark)', marginBottom: 16 }}>Your cart is empty</h2>
        <Link href="/shop" className="btn-primary" style={{ display: 'inline-flex' }}>Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="checkout-grid">

      {/* ── LEFT: Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Contact & Delivery */}
        <div style={cardStyle}>
          <h2 style={cardTitle}>Contact & Delivery</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-row-2col">
              <Field label="Full Name *">
                <Input value={form.name} onChange={v => set('name', v)} placeholder="John Silva" required />
              </Field>
              <Field label="Phone *">
                <Input value={form.phone} onChange={v => set('phone', v)} placeholder="+94 77 xxx xxxx" required />
              </Field>
            </div>
            <Field label="Email *">
              <Input type="email" value={form.email} onChange={v => set('email', v)} placeholder="john@example.com" required />
            </Field>
            <Field label="Delivery Address *">
              <textarea value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="No. 123, Main Street, Colombo 3" required rows={3}
                style={{ ...IS, resize: 'vertical' }} onFocus={fp.onFocus} onBlur={fp.onBlur} />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={v => set('city', v)} placeholder="Colombo" />
            </Field>
            <Field label="Order Notes (optional)">
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Any special instructions?" rows={2}
                style={{ ...IS, resize: 'vertical' }} onFocus={fp.onFocus} onBlur={fp.onBlur} />
            </Field>
          </div>
        </div>

        {/* Payment */}
        <div style={cardStyle}>
          <h2 style={cardTitle}>Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableMethods.map(m => (
              <div key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                style={{
                  border: `2px solid ${paymentMethod === m.key ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                  background: paymentMethod === m.key ? '#f0f7f2' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s',
                }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: paymentMethod === m.key ? 'var(--green)' : 'var(--cream-dark)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: paymentMethod === m.key ? '#fff' : 'var(--ink)', transition: 'all 0.15s',
                }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{m.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${paymentMethod === m.key ? 'var(--green)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {paymentMethod === m.key && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />}
                </div>
              </div>
            ))}
          </div>

          {/* Bank transfer details */}
          {paymentMethod === 'bank_transfer' && payments.bank_transfer && (
            <div style={{ marginTop: 16, padding: 16, background: 'var(--cream-dark)', borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 10 }}>Bank Details</div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-soft)' }}>
                <div><strong>Bank:</strong> {payments.bank_transfer.bank_name}</div>
                <div><strong>Account Name:</strong> {payments.bank_transfer.account_name}</div>
                <div><strong>Account No:</strong> {payments.bank_transfer.account_number}</div>
                <div><strong>Branch:</strong> {payments.bank_transfer.branch}</div>
              </div>
              {payments.bank_transfer.instructions && (
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>{payments.bank_transfer.instructions}</p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 12, color: '#c0392b', fontSize: 14 }}>{error}</div>
        )}

        <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary"
          style={{ justifyContent: 'center', padding: '16px', fontSize: 17, width: '100%', opacity: loading ? 0.75 : 1 }}>
          {loading
            ? <><span className="spinner" style={{ width: 18, height: 18, marginRight: 8 }} />Processing...</>
            : `Place Order — ${currency} ${total.toLocaleString()}`}
        </button>
      </div>

      {/* ── RIGHT: Order Summary ── */}
      <div className="order-summary-sticky">
        <div style={cardStyle}>
          <h3 style={{ ...cardTitle, fontSize: 17 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {cart.map(item => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={item.image || '/img/placeholder.jpg'} alt={item.name}
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10 }} />
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: 'var(--green)', color: '#fff', borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.variant}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', flexShrink: 0 }}>{currency} {(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              <span>Subtotal</span><span style={{ color: 'var(--ink)' }}>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>
                {delivery === 0 ? 'Free' : `${currency} ${delivery.toLocaleString()}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700, fontFamily: 'Playfair Display,serif' }}>
              <span>Total</span>
              <span style={{ color: 'var(--green)' }}>{currency} {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

const cardStyle = { background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }
const cardTitle = { fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }
const IS = { width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', background: '#fff' }
const fp = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = 'var(--border)' }

function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{label}</label>{children}</div>
}
function Input({ value, onChange, placeholder, type = 'text', required }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={IS} onFocus={fp.onFocus} onBlur={fp.onBlur} />
}
