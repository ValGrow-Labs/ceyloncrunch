'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconCheck, IconTruck, IconBank, IconLeaf } from './Icons'

export default function OrderConfirmationClient({ initialOrder, orderId, orderNumberProp, paymentMethod }) {
  const [order, setOrder] = useState(initialOrder)

  useEffect(() => {
    // If server didn't find the order (e.g. different worker or refresh), check sessionStorage
    if (!order && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('cc_last_order')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && (parsed.id === orderId || parsed.order_number === orderNumberProp || !orderId)) {
            setOrder(parsed)
          }
        }
      } catch {}
    }
  }, [order, orderId, orderNumberProp])

  const orderNum = order?.order_number || orderNumberProp || (orderId ? `CC-2026-${orderId.slice(-6).toUpperCase()}` : 'CC-2026-CONFIRMED')
  const isBankTransfer = paymentMethod === 'bank_transfer' || order?.payment_method === 'bank_transfer'
  const isCOD = paymentMethod === 'cod' || order?.payment_method === 'cod' || (!isBankTransfer)

  const formatPrice = (val) => `Rs. ${(val || 0).toLocaleString()}`

  const formatDate = (dateStr) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date()
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Just now'
    }
  }

  const items = Array.isArray(order?.items)
    ? order.items
    : (typeof order?.items === 'string' ? JSON.parse(order.items || '[]') : [])

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '50px 20px 100px' }}>

      {/* ── Success Celebration Banner ── */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: 'var(--green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 30px rgba(30,86,49,0.28)',
          animation: 'pulse 1.8s ease-in-out infinite',
        }}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--green)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          ORDER CONFIRMED
        </p>

        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px, 4.5vw, 44px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 12,
        }}>
          Thank You for Your Order.
        </h1>

        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 580,
          margin: '0 auto 16px',
          lineHeight: 1.6,
        }}>
          We&apos;ve received your order and will begin preparing it shortly.
        </p>

        {/* Order Number Badge */}
        <div style={{
          display: 'inline-block',
          background: 'var(--cream-dark)',
          border: '1.5px solid var(--border)',
          borderRadius: 50,
          padding: '8px 24px',
          margin: '8px auto',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', letterSpacing: '0.04em' }}>
            Your order number is #{orderNum}.
          </span>
        </div>

        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 14 }}>
          We&apos;ll contact you with the relevant order and delivery updates.
        </p>
      </div>

      {/* ── Order Details Card ── */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '36px 32px',
        boxShadow: '0 4px 28px rgba(0,0,0,0.06)',
        border: '1px solid var(--border)',
        marginBottom: 32,
      }}>
        {/* Header row of the receipt */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 24,
          borderBottom: '1px solid var(--border)',
          marginBottom: 28,
        }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', fontWeight: 600 }}>
              Order Reference
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--green-dark)',
              marginTop: 4,
            }}>
              #{orderNum}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', fontWeight: 600 }}>
              Order Date & Time
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 4 }}>
              {formatDate(order?.created_at)}
            </div>
          </div>
        </div>

        {/* ── Products List ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--green-dark)',
            marginBottom: 16,
          }}>
            Purchased Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={`${item.id || idx}-${item.variant || ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '14px 18px',
                    background: 'var(--cream)',
                    borderRadius: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {item.variant ? `Size: ${item.variant} • ` : ''}Qty: {item.qty || 1} • Unit: {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontFamily: 'Playfair Display,serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--green-dark)',
                    flexShrink: 0,
                  }}>
                    {formatPrice((item.price || 0) * (item.qty || 1))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 14, color: 'var(--muted)', fontStyle: 'italic' }}>
                Gourmet Ceylon Crunch selection
              </div>
            )}
          </div>
        </div>

        {/* ── Customer & Delivery Details Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          padding: '24px',
          background: 'var(--cream-dark)',
          borderRadius: 18,
          marginBottom: 28,
        }}>
          {/* Customer Information */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', marginBottom: 8 }}>
              Customer Information
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
              <div><strong>Name:</strong> {order?.customer_name || 'Valued Customer'}</div>
              <div><strong>Phone:</strong> {order?.customer_phone || '—'}</div>
              <div><strong>Email:</strong> {order?.customer_email || '—'}</div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown)', marginBottom: 8 }}>
              Delivery Destination
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
              <div><strong>Address:</strong> {order?.shipping_address || '—'}</div>
              <div><strong>City:</strong> {order?.city || '—'}</div>
              <div><strong>District:</strong> {order?.district || 'Colombo'}</div>
              <div><strong>Status:</strong> <span style={{ color: 'var(--green)', fontWeight: 700 }}>{order?.status || 'Confirmed'}</span></div>
            </div>
          </div>
        </div>

        {/* ── Pricing Summary Row ── */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{formatPrice(order?.subtotal)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            <span>Delivery Charge</span>
            <span style={{ color: order?.delivery === 0 ? 'var(--green)' : 'var(--ink)', fontWeight: 600 }}>
              {order?.delivery === 0 ? 'Free' : formatPrice(order?.delivery)}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '2px dashed var(--border)',
            paddingTop: 16,
          }}>
            <div>
              <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Grand Total</span>
              <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)' }}>Total Paid / Due</span>
            </div>
            <span style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--green)',
            }}>
              {formatPrice(order?.total)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Payment Specific Instructions ── */}
      {isBankTransfer && (
        <div style={{
          background: 'var(--cream-dark)',
          borderRadius: 20,
          padding: '28px 30px',
          marginBottom: 36,
          border: '1.5px solid #e2d2ba',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <IconBank size={24} color="var(--green)" />
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
              Bank Transfer Instructions
            </h3>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
            Please transfer <strong>{formatPrice(order?.total)}</strong> to our corporate bank account with reference <strong>#{orderNum}</strong> and WhatsApp your deposit slip to <strong>+94 77 944 3867</strong>.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#25D366',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
          }}>
            <a
              href={`https://wa.me/94779443867?text=Hi%20Ceylon%20Crunch,%20here%20is%20the%20payment%20slip%20for%20order%20%23${orderNum}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              WhatsApp Payment Slip →
            </a>
          </div>
        </div>
      )}

      {isCOD && (
        <div style={{
          background: '#f0f7f2',
          borderRadius: 20,
          padding: '24px 28px',
          marginBottom: 36,
          border: '1.5px solid #cce5d4',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--green)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconTruck size={20} color="#fff" />
          </div>
          <div>
            <h4 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>
              Cash on Delivery (COD)
            </h4>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
              Please have <strong>{formatPrice(order?.total)}</strong> in cash ready when our delivery rider arrives. You will receive an SMS or call before delivery.
            </p>
          </div>
        </div>
      )}

      {/* ── Brand Gratitude Note & Slogan ── */}
      <div style={{ textAlign: 'center', margin: '40px 0 36px' }}>
        <p style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 6,
        }}>
          Thank you for choosing Ceylon Crunch.
        </p>
        <p style={{
          fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
        }}>
          From Nature to Your Doorstep.
        </p>
      </div>

      {/* ── Primary Action CTA ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/shop">
          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 50, fontWeight: 700 }}>
            CONTINUE SHOPPING
          </button>
        </Link>
        <Link href={`/track?id=${encodeURIComponent(orderId || '')}`}>
          <button className="btn-outline" style={{ padding: '15px 36px', fontSize: 15, borderRadius: 50 }}>
            Track Order Status
          </button>
        </Link>
      </div>

    </main>
  )
}
