'use client'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { IconX } from './Icons'

export default function CartDrawer() {
  const { cart, dispatch, drawerOpen, setDrawerOpen, currency, subtotal, delivery, total, freeThreshold } = useCart()

  if (!drawerOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />

      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100dvh',
        width: 'min(420px, 100vw)',
        background: 'var(--cream)', zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.32s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        overflowY: 'hidden',
      }}>

        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 19 }}>
            Your Cart{' '}
            {cart.length > 0 && (
              <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontWeight: 400 }}>
                ({cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''})
              </span>
            )}
          </h3>
          <button onClick={() => setDrawerOpen(false)}
            style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
            <IconX size={18} />
          </button>
        </div>

        {/* Items — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12, WebkitOverflowScrolling: 'touch' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: 16, marginBottom: 6 }}>Your cart is empty.</p>
              <p style={{ fontSize: 13 }}>Good things take time.</p>
              <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setDrawerOpen(false)}>
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => {
              const key = `${item.id}-${item.variant}`
              return (
                <div key={key} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', borderRadius: 14, padding: 12 }}>
                  <img src={item.image || '/img/placeholder.jpg'} alt={item.name}
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{item.variant}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginTop: 3 }}>{currency} {(item.price * item.qty).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button className="qty-btn" style={{ width: 28, height: 28, fontSize: 16 }}
                        onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty - 1 })}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                      <button className="qty-btn" style={{ width: 28, height: 28, fontSize: 16 }}
                        onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty + 1 })}>+</button>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE', key })}
                      style={{ fontSize: 10, color: 'var(--muted)', padding: '2px 6px', borderRadius: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer — always visible, pinned to bottom */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 20px 24px', borderTop: '1px solid var(--border)', background: 'var(--cream)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--ink)' }}>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>
                {delivery === 0 ? 'Free' : `${currency} ${delivery.toLocaleString()}`}
              </span>
            </div>
            {delivery > 0 && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, padding: '7px 12px', background: '#fff', borderRadius: 8 }}>
                Add {currency} {(freeThreshold - subtotal).toLocaleString()} more for free delivery
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, fontFamily: 'Playfair Display,serif', marginBottom: 14 }}>
              <span>Total</span>
              <span style={{ color: 'var(--green)' }}>{currency} {total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={() => setDrawerOpen(false)} style={{ display: 'block' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 16, borderRadius: 14 }}>
                Proceed to Checkout →
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
