'use client'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { IconTrash, IconTruck, IconLeaf, IconShield } from './Icons'

export default function CartPageClient() {
  const { cart, dispatch, subtotal, delivery, total, currency, freeThreshold } = useCart()

  // Format currency with Rs. or LKR
  const formatPrice = (val) => `Rs. ${(val || 0).toLocaleString()}`

  if (cart.length === 0) {
    return (
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 20px 100px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--brown)',
            fontWeight: 700,
            marginBottom: 8
          }}>
            Your Selection
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(28px, 4.5vw, 42px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            letterSpacing: '-0.02em',
            marginBottom: 12
          }}>
            YOUR CART
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, margin: '0 auto' }}>
            Review your products before checking out.
          </p>
        </div>

        {/* Empty State Box */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: '64px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--cream-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 34
          }}>
            🛒
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 10
          }}>
            Your cart is empty.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Looks like you haven&apos;t added any Ceylon Crunch favourites yet. Explore our handcrafted nuts, dried fruits, and gourmet snacks.
          </p>
          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 15, borderRadius: 50 }}>
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 90px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>
        <Link href="/" style={{ color: 'var(--muted)', transition: 'color 0.2s' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>Your Cart</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 8
        }}>
          Your Selection
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(30px, 4vw, 44px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          letterSpacing: '-0.02em',
          marginBottom: 10
        }}>
          YOUR CART
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)' }}>
          Review your products before checking out.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="checkout-grid" style={{ alignItems: 'start' }}>

        {/* ── LEFT: Cart Items List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Desktop Table Header */}
          <div className="hide-mobile" style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 44px',
            gap: 16,
            padding: '12px 24px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            background: 'var(--cream-dark)',
            borderRadius: 14
          }}>
            <span>Product</span>
            <span style={{ textAlign: 'center' }}>Unit Price</span>
            <span style={{ textAlign: 'center' }}>Quantity</span>
            <span style={{ textAlign: 'right' }}>Total Price</span>
            <span></span>
          </div>

          {/* Item Rows */}
          {cart.map((item) => {
            const key = `${item.id}-${item.variant}`
            const itemTotal = (item.price || 0) * (item.qty || 1)

            return (
              <div
                key={key}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: '20px 24px',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 18,
                  alignItems: 'center',
                }}>
                  {/* Product Image */}
                  <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 14, overflow: 'hidden', background: 'var(--cream-dark)', flexShrink: 0 }}>
                    <img
                      src={item.image || '/img/placeholder.jpg'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details + Responsive Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <h2 style={{
                          fontFamily: 'Playfair Display,serif',
                          fontSize: 18,
                          fontWeight: 700,
                          color: 'var(--green-dark)',
                          lineHeight: 1.3,
                          margin: 0,
                        }}>
                          {item.name}
                        </h2>
                        {item.variant && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--brown)',
                            background: '#fcf6ec',
                            border: '1px solid #ebd9bd',
                            padding: '2px 10px',
                            borderRadius: 20,
                            marginTop: 4,
                          }}>
                            Size: {item.variant}
                          </div>
                        )}
                      </div>

                      {/* Remove Button for desktop & mobile */}
                      <button
                        onClick={() => dispatch({ type: 'REMOVE', key })}
                        title="Remove product"
                        aria-label={`Remove ${item.name}`}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--muted)',
                          background: 'transparent',
                          transition: 'all 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#c0392b'; e.currentTarget.style.background = '#fef2f2' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}
                      >
                        <IconTrash size={17} />
                      </button>
                    </div>

                    {/* Price & Quantity Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                      marginTop: 8,
                      paddingTop: 12,
                      borderTop: '1px solid #f2ede4',
                    }}>
                      {/* Unit Price */}
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</span>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatPrice(item.price)}</span>
                      </div>

                      {/* Quantity Controls: [-] quantity [+] */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="qty-btn"
                          aria-label="Decrease quantity"
                          onClick={() => {
                            if (item.qty > 1) {
                              dispatch({ type: 'UPDATE_QTY', key, qty: item.qty - 1 })
                            } else {
                              dispatch({ type: 'REMOVE', key })
                            }
                          }}
                          style={{ width: 32, height: 32, fontSize: 16 }}
                        >
                          −
                        </button>
                        <span style={{
                          fontSize: 15,
                          fontWeight: 700,
                          minWidth: 28,
                          textAlign: 'center',
                          color: 'var(--ink)',
                        }}>
                          {item.qty}
                        </span>
                        <button
                          className="qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty + 1 })}
                          style={{ width: 32, height: 32, fontSize: 16 }}
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>Total Price</span>
                        <span style={{
                          fontFamily: 'Playfair Display,serif',
                          fontSize: 17,
                          fontWeight: 700,
                          color: 'var(--green)',
                        }}>
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Continue Shopping secondary action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: '0 4px' }}>
            <Link href="/shop" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--green)',
            }}>
              ← Continue Shopping
            </Link>
            <button
              onClick={() => dispatch({ type: 'CLEAR' })}
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* ── RIGHT: Cart Summary ── */}
        <div className="order-summary-sticky">
          <div style={{
            background: '#fff',
            borderRadius: 22,
            padding: '28px 26px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid var(--border)',
          }}>
            <h3 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--green-dark)',
              marginBottom: 20,
              paddingBottom: 14,
              borderBottom: '1px solid var(--border)',
            }}>
              Order Summary
            </h3>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--ink-soft)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--ink-soft)' }}>
                <span>Delivery</span>
                <span style={{ fontWeight: 600, color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>
                  {delivery === 0 ? 'Free' : formatPrice(delivery)}
                </span>
              </div>

              {freeThreshold > 0 && freeThreshold < 1e9 && subtotal < freeThreshold && (
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--cream)',
                  borderRadius: 10,
                  fontSize: 12,
                  color: 'var(--brown)',
                  border: '1px solid #ebd9bd',
                  lineHeight: 1.4,
                }}>
                  Add <strong>{formatPrice(freeThreshold - subtotal)}</strong> more to qualify for <strong>FREE island-wide delivery</strong>!
                </div>
              )}
            </div>

            {/* Total Line */}
            <div style={{
              borderTop: '2px dashed var(--border)',
              paddingTop: 18,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <div>
                <span style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Estimated</span>
                <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)' }}>Total</span>
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

            {/* Primary CTA */}
            <Link href="/checkout" style={{ display: 'block', textDecoration: 'none' }}>
              <button
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '16px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 14,
                  letterSpacing: '0.03em',
                  boxShadow: '0 4px 16px rgba(30,86,49,0.25)',
                }}
              >
                PROCEED TO CHECKOUT →
              </button>
            </Link>

            {/* Trust Assurances */}
            <div style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontSize: 13,
              color: 'var(--muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconTruck size={17} color="var(--green)" />
                <span>Fast island-wide delivery in 1-3 business days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconLeaf size={17} color="var(--green)" />
                <span>100% natural, freshly packed Ceylon ingredients</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconShield size={17} color="var(--green)" />
                <span>Cash on delivery & secure payment options</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
