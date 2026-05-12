'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import { IconCash, IconBank, IconCard } from './Icons'

export default function CheckoutClient({ paymentSettings, deliverySettings }) {
  const { cart, subtotal, currency, freeThreshold, deliveryFee, dispatch } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
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
        const form2 = document.createElement('form')
        form2.method = 'POST'
        form2.action = data.paymentUrl
        Object.entries(data.paymentData || {}).forEach(([k, v]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = k
          input.value = v
          form2.appendChild(input)
        })
        document.body.appendChild(form2)
        form2.submit()
      } else {
        dispatch({ type: 'CLEAR' })
        router.push(`/order/success?id=${data.id}&method=${paymentMethod}`)
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
        <a href="/shop" className="btn-primary" style={{ display: 'inline-flex' }}>Browse Products</a>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, background: '#fff', outline: 'none', transition: 'border-color 0.2s' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 48, alignItems: 'start' }}>
      {/* Left: form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Contact */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 24 }}>Contact & Delivery</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--green)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  placeholder="John Silva" required />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--green)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  placeholder="+94 77 xxx xxxx" required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="john@example.com" required />
            </div>
            <div>
              <label style={labelStyle}>Delivery Address *</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.address} onChange={e => set('address', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="No. 123, Main Street, Colombo 3" required />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="Colombo" />
            </div>
            <div>
              <label style={labelStyle}>Order Notes (optional)</label>
              <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="Any special instructions?" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 24 }}>Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {availableMethods.map(m => (
              <div key={m.key} className={`payment-card ${paymentMethod === m.key ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(m.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: paymentMethod === m.key ? 'var(--green)' : 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', color: paymentMethod === m.key ? '#fff' : 'var(--ink)', flexShrink: 0 }}>
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{m.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === m.key ? 'var(--green)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {paymentMethod === m.key && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />}
                </div>
              </div>
            ))}
          </div>

          {/* Bank transfer instructions */}
          {paymentMethod === 'bank_transfer' && payments.bank_transfer && (
            <div style={{ marginTop: 20, padding: 20, background: 'var(--cream-dark)', borderRadius: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 12 }}>Bank Details</div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-soft)' }}>
                <div><strong>Bank:</strong> {payments.bank_transfer.bank_name}</div>
                <div><strong>Account Name:</strong> {payments.bank_transfer.account_name}</div>
                <div><strong>Account No:</strong> {payments.bank_transfer.account_number}</div>
                <div><strong>Branch:</strong> {payments.bank_transfer.branch}</div>
              </div>
              {payments.bank_transfer.instructions && (
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>{payments.bank_transfer.instructions}</p>
              )}
            </div>
          )}
        </div>

        {error && <div style={{ padding: 16, background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 12, color: '#c0392b', fontSize: 14 }}>{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary"
          style={{ justifyContent: 'center', padding: '16px 32px', fontSize: 17, opacity: loading ? 0.7 : 1 }}>
          {loading ? <><span className="spinner" style={{ width: 18, height: 18, marginRight: 8 }} />Processing...</> : `Place Order — ${currency} ${total.toLocaleString()}`}
        </button>
      </form>

      {/* Right: order summary */}
      <div style={{ position: 'sticky', top: 100 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--green-dark)' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img src={item.image || '/img/placeholder.jpg'} alt={item.name}
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10 }} />
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: 'var(--green)', color: '#fff', borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.variant}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>{currency} {(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              <span>Subtotal</span><span style={{ color: 'var(--ink)' }}>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>{delivery === 0 ? 'Free' : `${currency} ${delivery.toLocaleString()}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 700, fontFamily: 'Playfair Display,serif' }}>
              <span>Total</span><span style={{ color: 'var(--green)' }}>{currency} {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
