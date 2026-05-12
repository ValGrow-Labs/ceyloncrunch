'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { IconX } from './Icons'

export default function CartDrawer() {
  const { cart, dispatch, drawerOpen, setDrawerOpen, currency, subtotal, delivery, total, freeThreshold } = useCart()

  if (!drawerOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20 }}>
            Your Cart{' '}
            {cart.length > 0 && <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontWeight: 400 }}>({cart.length} item{cart.length > 1 ? 's' : ''})</span>}
          </h3>
          <button onClick={() => setDrawerOpen(false)}
            style={{ fontSize: 24, color: 'var(--muted)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <IconX size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>Your cart is empty.</p>
              <p style={{ fontSize: 14 }}>Good things take time.</p>
              <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setDrawerOpen(false)}>
                Browse Products
              </button>
            </div>
          ) : cart.map(item => {
            const key = `${item.id}-${item.variant}`
            return (
              <div key={key} style={{ display: 'flex', gap: 14, alignItems: 'center', background: '#fff', borderRadius: 14, padding: 12 }}>
                <img src={item.image || '/img/placeholder.jpg'} alt={item.name}
                  style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.variant}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>{currency} {(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty - 1 })}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty + 1 })}>+</button>
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE', key })}
                    style={{ fontSize: 11, color: 'var(--muted)', padding: '2px 8px', borderRadius: 20, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--cream)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--ink)' }}>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>
                {delivery === 0 ? 'Free' : `${currency} ${delivery.toLocaleString()}`}
              </span>
            </div>
            {delivery > 0 && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, padding: '8px 12px', background: '#fff', borderRadius: 8 }}>
                Add {currency} {(freeThreshold - subtotal).toLocaleString()} more for free delivery
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, fontFamily: 'Playfair Display,serif', marginBottom: 16 }}>
              <span>Total</span>
              <span style={{ color: 'var(--green)' }}>{currency} {total.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={() => setDrawerOpen(false)}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px 28px', fontSize: 16 }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
