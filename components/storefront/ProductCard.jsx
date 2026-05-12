'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Stars from './Stars'

export default function ProductCard({ product }) {
  const { addToCart, currency } = useCart()
  const [variant, setVariant] = useState(product.variants?.[0] || 'Standard')

  return (
    <div className="card-hover" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <Link href={`/shop/${product.slug}`}>
        <div className="prod-card-img" style={{ position: 'relative', overflow: 'hidden', height: 220, flexShrink: 0 }}>
          <img src={product.image_url || '/img/placeholder.jpg'} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          {product.badge && (
            <span className={`badge badge-${product.badge_type}`} style={{ position: 'absolute', top: 10, left: 10 }}>
              {product.badge}
            </span>
          )}
          <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(250,246,239,0.92)', fontSize: 10, padding: '2px 8px', borderRadius: 50, fontWeight: 600, color: 'var(--muted)', backdropFilter: 'blur(4px)' }}>
            {product.category}
          </span>
        </div>
      </Link>

      <div className="prod-card-body" style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="prod-card-title"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, lineHeight: 1.3, transition: 'color 0.2s', color: 'var(--ink)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{product.rating} ({product.reviews})</span>
        </div>

        {product.variants?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {product.variants.map(v => (
              <button key={v} className={`pill-btn prod-card-pill ${variant === v ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
          <span className="prod-card-price" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>
            {currency} {product.price.toLocaleString()}
          </span>
          <button className="btn-primary prod-card-add" style={{ padding: '9px 18px', fontSize: 13 }}
            onClick={() => addToCart({ id: product.id, name: product.name, image: product.image_url, price: product.price, variant })}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
