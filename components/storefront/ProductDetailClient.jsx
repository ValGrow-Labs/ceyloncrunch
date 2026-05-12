'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import Stars from './Stars'
import { IconLeaf, IconFlag, IconBox, IconCheck } from './Icons'

export default function ProductDetailClient({ product, currency }) {
  const { addToCart, showToast } = useCart()
  const [variant, setVariant] = useState(product.variants?.[0] || 'Standard')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')

  const nutrition = product.nutrition_info || {}

  const highlights = [
    { icon: <IconLeaf color="var(--green)" size={16} />, text: '100% Natural, No Additives' },
    { icon: <IconFlag color="var(--green)" size={16} />, text: 'Single-Origin Sri Lanka' },
    { icon: <IconBox  color="var(--green)" size={16} />, text: 'Small-Batch Packed' },
    { icon: <IconCheck color="var(--green)" size={16} />, text: 'Quality Verified Each Batch' },
  ]

  const reviews = [
    { name: 'Nimal Perera', init: 'NP', rating: 5, text: 'Absolutely outstanding. You can taste the difference — no artificial coating, just honest roasting.' },
    { name: 'Amara Silva',  init: 'AS', rating: 5, text: 'Extraordinary quality. Restrained sweetness, no chemical after-taste. Ordered three times already.' },
    { name: 'Dinesh R.',    init: 'DR', rating: 4, text: 'Quality is evident the moment you open the pack. Worth every rupee.' },
  ]

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name: product.name, image: product.image_url, price: product.price, variant })
    }
  }

  return (
    <>
      {/* 2-col layout */}
      <div className="detail-grid">
        <div className="detail-img" style={{ borderRadius: 20, overflow: 'hidden', height: 520, position: 'relative' }}>
          <img src={product.image_url || '/img/placeholder.jpg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.badge && <span className={`badge badge-${product.badge_type}`} style={{ position: 'absolute', top: 20, left: 20, fontSize: 12, padding: '5px 14px' }}>{product.badge}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{product.category}</span>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: 'var(--green-dark)', marginTop: 8, lineHeight: 1.2 }}>{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars rating={product.rating} size={16} />
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 32, fontWeight: 700, color: 'var(--green)' }}>
            {currency} {product.price.toLocaleString()}
          </div>

          {product.variants?.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Select Weight</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants.map(v => (
                  <button key={v} className={`pill-btn ${variant === v ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-brown" style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }}
              onClick={() => { handleAddToCart(); showToast('Added — proceed to checkout') }}>
              Buy Now
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 20, background: 'var(--cream-dark)', borderRadius: 16 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                {h.icon}<span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 64 }}>
        <div className="tab-bar">
          {['description', 'nutrition', 'reviews'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === 'description' && (
          <p style={{ fontSize: 16, lineHeight: 1.9, color: 'var(--ink-soft)', maxWidth: 680, fontWeight: 300 }}>{product.description}</p>
        )}
        {tab === 'nutrition' && (
          <table className="nutrition-table" style={{ maxWidth: 420 }}>
            <tbody>
              {[
                ['Serving Size', nutrition.serving || '30g'],
                ['Calories', nutrition.calories || '—'],
                ['Total Fat', nutrition.fat || '—'],
                ['Protein', nutrition.protein || '—'],
                ['Carbohydrates', nutrition.carbs || '—'],
                ['Fibre', nutrition.fibre || '—'],
                ['Sodium', nutrition.sodium || '—'],
              ].map(([k, v]) => (
                <tr key={k}><td style={{ color: 'var(--muted)' }}>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 24, background: '#fff', borderRadius: 16 }}>
                <div className="review-avatar">{r.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
                  <div style={{ marginBottom: 10 }}><Stars rating={r.rating} size={13} /></div>
                  <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
