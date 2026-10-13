'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Stars from './Stars'
import { normalizeVariants } from '@/lib/variants'

export default function ProductCard({ product }) {
  const { addToCart, currency } = useCart()
  const variants = useMemo(() => normalizeVariants(product), [product])
  const [variant, setVariant] = useState(variants[0]?.size || 'Standard')
  const [qty, setQty] = useState(1)

  const isOutOfStock = product.active === false || product.in_stock === false
  const selectedPrice = variants.find(v => v.size === variant)?.price ?? product.price

  const handleAdd = () => {
    if (isOutOfStock) return
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image_url,
        price: selectedPrice,
        variant,
      })
    }
  }

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
        border: '1px solid var(--border)',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Product Image */}
      <Link href={`/shop/${product.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
        <div className="prod-card-img" style={{ position: 'relative', overflow: 'hidden', height: 220, flexShrink: 0, background: 'var(--cream)' }}>
          <img
            src={product.image_url || '/img/placeholder.jpg'}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.badge && (
              <span className={`badge badge-${product.badge_type}`}>
                {product.badge}
              </span>
            )}
            {isOutOfStock && (
              <span className="badge badge-red">
                Out of Stock
              </span>
            )}
          </div>

          {/* Category Tag */}
          <span style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(250,246,239,0.92)',
            fontSize: 11,
            padding: '3px 9px',
            borderRadius: 50,
            fontWeight: 600,
            color: 'var(--muted)',
            backdropFilter: 'blur(4px)',
          }}>
            {product.category}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="prod-card-body" style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Availability & Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Stars rating={product.rating} size={13} />
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
              {product.rating} {product.reviews ? `(${product.reviews})` : ''}
            </span>
          </div>

          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: isOutOfStock ? '#c0392b' : 'var(--green)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{ fontSize: 8 }}>●</span>
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            className="prod-card-title"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3,
              transition: 'color 0.2s',
              color: 'var(--ink)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}
          >
            {product.name}
          </h3>
        </Link>

        {/* Short Product Description */}
        {product.description && (
          <p style={{
            fontSize: 13,
            color: 'var(--ink-soft)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
            fontWeight: 400,
          }}>
            {product.description}
          </p>
        )}

        {/* Available Size variants */}
        {variants.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {variants.map(v => (
                <button
                  key={v.size}
                  type="button"
                  className={`pill-btn prod-card-pill ${variant === v.size ? 'active' : ''}`}
                  onClick={() => setVariant(v.size)}
                  style={{
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: variant === v.size ? 600 : 500,
                  }}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 10,
          borderTop: '1px solid #f4ede3',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
              Price
            </span>
            <span
              className="prod-card-price"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 19,
                fontWeight: 700,
                color: 'var(--green)',
              }}
            >
              Rs. {selectedPrice.toLocaleString()}
            </span>
          </div>

          {/* Quantity & Add to Cart button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Quick Qty Modifier */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              borderRadius: 50,
              padding: '2px 4px',
              background: '#faf6ef',
            }}>
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink-soft)',
                }}
              >
                −
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink-soft)',
                }}
              >
                +
              </button>
            </div>

            <button
              className="btn-primary prod-card-add"
              style={{
                padding: '8px 16px',
                fontSize: 13,
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
              disabled={isOutOfStock}
              onClick={handleAdd}
            >
              {isOutOfStock ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>

        {/* View Product Link */}
        <div style={{ textAlign: 'center', paddingTop: 2 }}>
          <Link
            href={`/shop/${product.slug}`}
            style={{
              fontSize: 12,
              color: 'var(--green)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            View Product details →
          </Link>
        </div>
      </div>
    </div>
  )
}
