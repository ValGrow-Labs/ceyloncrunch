'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { IconCash, IconBank, IconCard, IconCheck, IconShield, IconTruck } from './Icons'

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
]

export default function CheckoutClient({ paymentSettings }) {
  const { cart, subtotal, freeThreshold, deliveryFee, dispatch } = useCart()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Colombo',
    district: 'Colombo',
    notes: '',
  })

  const payments = paymentSettings || {}
  const delivery = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : (deliveryFee || 350)
  const total = subtotal + delivery

  const formatPrice = (val) => `Rs. ${(val || 0).toLocaleString()}`

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Form Validation
  const validateForm = () => {
    const errors = {}

    if (!form.name.trim()) {
      errors.name = 'Full name is required'
    }

    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else {
      const cleanPhone = form.phone.replace(/[\s\-\(\)]/g, '')
      if (cleanPhone.length < 9) {
        errors.phone = 'Please enter a valid phone number (e.g. 077 123 4567)'
      }
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!form.address.trim()) {
      errors.address = 'Street address is required'
    }

    if (!form.city.trim()) {
      errors.city = 'City is required'
    }

    if (!form.district.trim()) {
      errors.district = 'District is required'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add products before checking out.')
      return
    }

    if (!validateForm()) {
      setErrorMessage('Please correct the highlighted fields before placing your order.')
      // Scroll smoothly to the first error
      const firstErrorEl = document.querySelector('.input-error')
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setLoading(true)

    try {
      const payload = {
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim(),
        shipping_address: form.address.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        items: cart,
        subtotal,
        delivery,
        total,
        payment_method: paymentMethod,
        notes: form.notes.trim() || null,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.')
      }

      // Handle Online Payment (PayHere) if configured
      if (paymentMethod === 'payhere' && data.paymentUrl) {
        const payForm = document.createElement('form')
        payForm.method = 'POST'
        payForm.action = data.paymentUrl
        Object.entries(data.paymentData || {}).forEach(([k, v]) => {
          const inp = document.createElement('input')
          inp.type = 'hidden'
          inp.name = k
          inp.value = v
          payForm.appendChild(inp)
        })
        document.body.appendChild(payForm)
        payForm.submit()
        return
      }

      // Store placed order in sessionStorage so Order Confirmation has instant offline backup
      try {
        sessionStorage.setItem('cc_last_order', JSON.stringify(data))
      } catch {}

      // Clear Cart on successful order
      dispatch({ type: 'CLEAR' })

      // Redirect to Order Confirmation
      const orderParam = data.order_number ? `&order_number=${encodeURIComponent(data.order_number)}` : ''
      router.push(`/order/success?id=${encodeURIComponent(data.id)}${orderParam}&method=${paymentMethod}`)
    } catch (err) {
      console.error('Order submission error:', err)
      setErrorMessage(err.message || 'A network error occurred while submitting your order. Please check your connection and retry.')
      setLoading(false)
    }
  }

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '72px 24px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        maxWidth: 680,
        margin: '0 auto',
      }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, color: 'var(--green-dark)', marginBottom: 12 }}>
          Your cart is empty.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6 }}>
          You need at least one Ceylon Crunch item in your cart to proceed with checkout.
        </p>
        <Link href="/shop">
          <button className="btn-primary" style={{ padding: '14px 34px', fontSize: 15, borderRadius: 50 }}>
            CONTINUE SHOPPING
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-grid">

      {/* ── LEFT: Checkout Form & Payment ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Breadcrumb Steps */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: 'var(--muted)',
          padding: '12px 18px',
          background: 'var(--cream-dark)',
          borderRadius: 12,
        }}>
          <Link href="/cart" style={{ color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>1. Cart</span>
          </Link>
          <span>→</span>
          <span style={{ color: 'var(--green-dark)', fontWeight: 700 }}>2. Checkout</span>
          <span>→</span>
          <span style={{ color: 'var(--muted)' }}>3. Confirmation</span>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div style={{
            padding: '14px 18px',
            background: '#fff0f0',
            border: '1.5px solid #f87171',
            borderRadius: 14,
            color: '#b91c1c',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ flex: 1 }}>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Section 1: Contact Information */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={stepCircleStyle}>1</div>
              <div>
                <h2 style={{ ...cardTitle, marginBottom: 2 }}>CONTACT INFORMATION</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>We&apos;ll use these details to send your order and delivery updates.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Full Name *" error={fieldErrors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Kasun Jayawardena"
                  required
                  style={{ ...inputStyle, borderColor: fieldErrors.name ? '#ef4444' : 'var(--border)' }}
                  className={fieldErrors.name ? 'input-error' : ''}
                />
              </Field>

              <div className="form-row-2col">
                <Field label="Phone Number *" error={fieldErrors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    required
                    style={{ ...inputStyle, borderColor: fieldErrors.phone ? '#ef4444' : 'var(--border)' }}
                    className={fieldErrors.phone ? 'input-error' : ''}
                  />
                </Field>

                <Field label="Email Address *" error={fieldErrors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="e.g. kasun@example.com"
                    required
                    style={{ ...inputStyle, borderColor: fieldErrors.email ? '#ef4444' : 'var(--border)' }}
                    className={fieldErrors.email ? 'input-error' : ''}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={stepCircleStyle}>2</div>
              <div>
                <h2 style={{ ...cardTitle, marginBottom: 2 }}>DELIVERY ADDRESS</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Please provide your complete Sri Lankan shipping address.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Address *" error={fieldErrors.address}>
                <textarea
                  value={form.address}
                  onChange={e => setField('address', e.target.value)}
                  placeholder="Street address, building / apartment number, area"
                  required
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', borderColor: fieldErrors.address ? '#ef4444' : 'var(--border)' }}
                  className={fieldErrors.address ? 'input-error' : ''}
                />
              </Field>

              <div className="form-row-2col">
                <Field label="City *" error={fieldErrors.city}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setField('city', e.target.value)}
                    placeholder="e.g. Colombo 03, Kandy, Galle"
                    required
                    style={{ ...inputStyle, borderColor: fieldErrors.city ? '#ef4444' : 'var(--border)' }}
                    className={fieldErrors.city ? 'input-error' : ''}
                  />
                </Field>

                <Field label="District *" error={fieldErrors.district}>
                  <select
                    value={form.district}
                    onChange={e => setField('district', e.target.value)}
                    style={{ ...inputStyle, borderColor: fieldErrors.district ? '#ef4444' : 'var(--border)', cursor: 'pointer' }}
                    className={fieldErrors.district ? 'input-error' : ''}
                  >
                    {SRI_LANKA_DISTRICTS.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Section 3: Order Notes (Optional) */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ ...stepCircleStyle, background: 'var(--cream-dark)', color: 'var(--ink-soft)' }}>3</div>
              <div>
                <h2 style={{ ...cardTitle, marginBottom: 2 }}>ORDER NOTES</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Optional special instructions for delivery or packaging.</p>
              </div>
            </div>

            <Field label="Order Notes (Optional)">
              <textarea
                value={form.notes}
                onChange={e => setField('notes', e.target.value)}
                placeholder="e.g. Deliver between 2-5 PM, leave with security gate, or gift packaging notes."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>
          </div>

          {/* Section 4: Payment */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={stepCircleStyle}>4</div>
              <div>
                <h2 style={{ ...cardTitle, marginBottom: 2 }}>PAYMENT METHOD</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Select your preferred method to complete your purchase.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 16,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  background: paymentMethod === 'cod' ? '#f0f7f2' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: paymentMethod === 'cod' ? 'var(--green)' : 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: paymentMethod === 'cod' ? '#fff' : 'var(--ink)',
                  flexShrink: 0,
                }}>
                  <IconCash size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green-dark)' }}>
                    Cash on Delivery
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    Pay in cash directly to the courier when your order arrives at your doorstep.
                  </div>
                </div>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--green)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {paymentMethod === 'cod' && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                  )}
                </div>
              </div>

              {/* Bank Transfer */}
              <div
                onClick={() => setPaymentMethod('bank_transfer')}
                style={{
                  border: `2px solid ${paymentMethod === 'bank_transfer' ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 16,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  background: paymentMethod === 'bank_transfer' ? '#f0f7f2' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: paymentMethod === 'bank_transfer' ? 'var(--green)' : 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: paymentMethod === 'bank_transfer' ? '#fff' : 'var(--ink)',
                  flexShrink: 0,
                }}>
                  <IconBank size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green-dark)' }}>
                    Direct Bank Transfer
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    Transfer directly to our Ceylon Crunch corporate account and share your slip.
                  </div>
                </div>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `2px solid ${paymentMethod === 'bank_transfer' ? 'var(--green)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {paymentMethod === 'bank_transfer' && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                  )}
                </div>
              </div>

              {/* Bank Transfer Details Drawer */}
              {paymentMethod === 'bank_transfer' && (
                <div style={{
                  padding: '18px 20px',
                  background: 'var(--cream-dark)',
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  fontSize: 14,
                  lineHeight: 1.7,
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Corporate Banking Details:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px 12px', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>Bank:</span>
                    <strong style={{ color: 'var(--ink)' }}>{payments.bank_transfer?.bank_name || 'Commercial Bank of Ceylon'}</strong>
                    <span style={{ color: 'var(--muted)' }}>Account Name:</span>
                    <strong style={{ color: 'var(--ink)' }}>{payments.bank_transfer?.account_name || 'Ceylon Crunch (Pvt) Ltd'}</strong>
                    <span style={{ color: 'var(--muted)' }}>Account No:</span>
                    <strong style={{ color: 'var(--ink)', fontFamily: 'monospace', fontSize: 14 }}>{payments.bank_transfer?.account_number || '1000 4829 3841'}</strong>
                    <span style={{ color: 'var(--muted)' }}>Branch:</span>
                    <strong style={{ color: 'var(--ink)' }}>{payments.bank_transfer?.branch || 'Kollupitiya Branch'}</strong>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-soft)', borderTop: '1px solid #ebd9bd', paddingTop: 8 }}>
                    📌 Please WhatsApp or email your transfer receipt along with your order number. Orders begin roasting and packing immediately once confirmed.
                  </p>
                </div>
              )}

              {/* Online Card Payment Architecture (PayHere / Future Gateway) */}
              <div
                style={{
                  border: '1.5px dashed var(--border)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  background: '#fbfbfb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: 0.85,
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  flexShrink: 0,
                }}>
                  <IconCard size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-soft)' }}>
                      Online Card Payment (Visa / Mastercard)
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: 'var(--cream-dark)',
                      color: 'var(--brown)',
                    }}>
                      Gateway Integration Ready
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    Prepared for secure direct payment gateway integration. Currently Cash on Delivery & Bank Transfer are active for all orders.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Primary CTA: PLACE ORDER */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '18px 24px',
              fontSize: 17,
              fontWeight: 700,
              borderRadius: 16,
              width: '100%',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 20px rgba(30,86,49,0.3)',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, marginRight: 10 }} />
                PREPARING YOUR ORDER...
              </>
            ) : (
              `PLACE ORDER — ${formatPrice(total)}`
            )}
          </button>
        </form>
      </div>

      {/* ── RIGHT: Order Summary ── */}
      <div className="order-summary-sticky">
        <div style={{
          background: '#fff',
          borderRadius: 22,
          padding: '28px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--green-dark)',
              margin: 0,
            }}>
              Order Summary
            </h3>
            <Link href="/cart" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
              Edit Cart
            </Link>
          </div>

          {/* Product Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: 'var(--cream-dark)', flexShrink: 0 }}>
                  <img
                    src={item.image || '/img/placeholder.jpg'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    background: 'var(--green)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {item.qty}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  {item.variant && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      Size: {item.variant}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-dark)', flexShrink: 0 }}>
                  {formatPrice((item.price || 0) * (item.qty || 1))}
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal, Delivery, and Grand Total */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)', fontWeight: 600 }}>
                {delivery === 0 ? 'Free' : formatPrice(delivery)}
              </span>
            </div>

            {/* Total Highlight */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '2px dashed var(--border)',
              paddingTop: 16,
              marginTop: 4,
            }}>
              <div>
                <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Total Amount</span>
                <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)' }}>Total</span>
              </div>
              <span style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--green)',
              }}>
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Guarantees */}
          <div style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontSize: 12,
            color: 'var(--muted)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconTruck size={15} color="var(--green)" />
              <span>Island-wide doorstep dispatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconShield size={15} color="var(--green)" />
              <span>Safe packaging & trusted delivery</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: '24px 26px',
  boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
  border: '1px solid var(--border)',
}

const cardTitle = {
  fontFamily: 'Playfair Display,serif',
  fontSize: 19,
  fontWeight: 700,
  color: 'var(--green-dark)',
  letterSpacing: '0.02em',
}

const stepCircleStyle = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'var(--green)',
  color: '#fff',
  fontSize: 13,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  border: '1.5px solid var(--border)',
  borderRadius: 12,
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 700,
        color: error ? '#b91c1c' : 'var(--ink-soft)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ display: 'block', fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  )
}
