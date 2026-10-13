'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Stars from './Stars'
import ProductCard from './ProductCard'
import { IconLeaf, IconFlag, IconBox, IconCheck, IconTruck } from './Icons'
import { normalizeVariants } from '@/lib/variants'

export default function ProductDetailClient({ product, currency = 'Rs.', related = [] }) {
  const router = useRouter()
  const { addToCart, showToast } = useCart()
  const variants = useMemo(() => normalizeVariants(product), [product])
  const [variant, setVariant] = useState(variants[0]?.size || 'Standard')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('details')

  const isOutOfStock = product.active === false || product.in_stock === false
  const selectedPrice = variants.find(v => v.size === variant)?.price ?? product.price
  const nutrition = product.nutrition_info || {}

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image_url,
      price: selectedPrice,
      variant,
      qty,
    })
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image_url,
      price: selectedPrice,
      variant,
      qty,
    })
    router.push('/checkout')
  }

  const highlights = [
    { icon: <IconLeaf color="var(--green)" size={18} />, text: '100% Wholesome Ingredients' },
    { icon: <IconFlag color="var(--green)" size={18} />, text: 'Authentically Sri Lankan' },
    { icon: <IconBox color="var(--green)" size={18} />, text: 'Small-Batch Freshly Packed' },
    { icon: <IconCheck color="var(--green)" size={18} />, text: 'Quality Inspected Each Harvest' },
  ]

  const reviews = [
    { name: 'Nimal Perera', init: 'NP', rating: 5, text: 'Outstanding quality. You can taste the difference — no artificial glaze, just honest roasting.' },
    { name: 'Amara Silva', init: 'AS', rating: 5, text: 'Remarkable freshness and restrained seasoning. Have ordered multiple times for my family.' },
    { name: 'Dinesh R.', init: 'DR', rating: 5, text: 'The aroma and texture are superior to mass-market brands. Truly earns its place on the table.' },
  ]

  return (
    <div>
      {/* ═══════════════════════════════════════════════
          1. PRODUCT HERO (2-COLUMN DESKTOP / STACKED MOBILE)
      ═══════════════════════════════════════════════ */}
      <div className="detail-grid" style={{ marginBottom: 64 }}>
        {/* LEFT: Product Image Gallery */}
        <div className="detail-img" style={{
          borderRadius: 24,
          overflow: 'hidden',
          height: 'clamp(320px, 45vw, 540px)',
          position: 'relative',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        }}>
          <img
            src={product.image_url || '/img/placeholder.jpg'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {product.badge && (
              <span className={`badge badge-${product.badge_type}`} style={{ fontSize: 12, padding: '6px 14px' }}>
                {product.badge}
              </span>
            )}
            {isOutOfStock && (
              <span className="badge badge-red" style={{ fontSize: 12, padding: '6px 14px' }}>
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Category Tag & Stock Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <span style={{
              fontSize: 12,
              color: 'var(--muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              {product.category || 'Specialty Snack'}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: isOutOfStock ? '#c0392b' : 'var(--green)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <span style={{ fontSize: 9 }}>●</span>
              {isOutOfStock ? 'Currently Unavailable' : 'In Stock & Ready for Dispatch'}
            </span>
          </div>

          {/* Product Name */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1.18,
          }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stars rating={product.rating || 4.8} size={16} />
            <span style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 600 }}>
              {product.rating || 4.8}
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              ({product.reviews || 120} customer reviews)
            </span>
          </div>

          {/* Short Description */}
          <p style={{
            fontSize: 16,
            color: 'var(--ink-soft)',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            {product.description || 'A carefully selected product for everyday enjoyment.'}
          </p>

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            padding: '12px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Price:
            </span>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 34,
              fontWeight: 700,
              color: 'var(--green)',
            }}>
              Rs. {selectedPrice.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              (for {variant})
            </span>
          </div>

          {/* ═══════════════════════════════════════════════
              2. SIZE SELECTION
          ═══════════════════════════════════════════════ */}
          {variants.length > 0 && (
            <div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                Available Sizes:
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {variants.map(v => {
                  const isSelected = variant === v.size
                  return (
                    <button
                      key={v.size}
                      type="button"
                      onClick={() => setVariant(v.size)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: isSelected ? 600 : 500,
                        border: isSelected ? '2px solid var(--green)' : '1.5px solid var(--border)',
                        background: isSelected ? '#f0f7f2' : '#fff',
                        color: isSelected ? 'var(--green-dark)' : 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{v.size}</span>
                      <span style={{ fontSize: 12, color: isSelected ? 'var(--green)' : 'var(--muted)' }}>
                        Rs. {v.price.toLocaleString()}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              3. QUANTITY SELECTOR
          ═══════════════════════════════════════════════ */}
          <div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}>
              Quantity:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                style={{ width: 40, height: 40, fontSize: 20 }}
              >
                −
              </button>
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                minWidth: 40,
                textAlign: 'center',
                color: 'var(--ink)',
              }}>
                {qty}
              </span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty(q => q + 1)}
                aria-label="Increase quantity"
                style={{ width: 40, height: 40, fontSize: 20 }}
              >
                +
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              4. PURCHASE ACTIONS
          ═══════════════════════════════════════════════ */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
            <button
              className="btn-primary"
              style={{
                flex: 1,
                minWidth: 160,
                justifyContent: 'center',
                padding: '16px 28px',
                fontSize: 15,
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>

            <button
              className="btn-brown"
              style={{
                flex: 1,
                minWidth: 160,
                justifyContent: 'center',
                padding: '16px 28px',
                fontSize: 15,
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>

          {/* Quality Highlights Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            padding: '20px 22px',
            background: 'var(--cream-dark)',
            borderRadius: 16,
            marginTop: 8,
          }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                {h.icon}
                <span style={{ fontWeight: 500 }}>{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          5. PRODUCT DETAILS & SPECIFICATIONS
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid var(--border)',
        padding: 'clamp(28px, 4vw, 44px)',
        marginBottom: 48,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}>
        {/* Tab Navigation */}
        <div className="tab-bar" style={{ marginBottom: 32 }}>
          <button
            className={`tab-btn ${tab === 'details' ? 'active' : ''}`}
            onClick={() => setTab('details')}
          >
            Product Information
          </button>
          <button
            className={`tab-btn ${tab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setTab('nutrition')}
          >
            Nutritional Facts
          </button>
          <button
            className={`tab-btn ${tab === 'reviews' ? 'active' : ''}`}
            onClick={() => setTab('reviews')}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Product Information */}
        {tab === 'details' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brown)',
                fontWeight: 700,
                marginBottom: 8,
              }}>
                ABOUT THIS PRODUCT
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--ink-soft)', maxWidth: 740 }}>
                {product.description || 'A simple, delicious choice for snacking, sharing or adding to your favourite recipes.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28 }}>
              <h3 style={{
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--green-dark)',
                fontWeight: 700,
                marginBottom: 16,
              }}>
                PRODUCT INFORMATION
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                maxWidth: 800,
              }}>
                <div style={{ padding: '14px 18px', background: 'var(--cream)', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Available Weights
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    {variants.map(v => v.size).join(', ') || variant}
                  </span>
                </div>

                <div style={{ padding: '14px 18px', background: 'var(--cream)', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Ingredients
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    {product.ingredients || '100% natural, no artificial preservatives'}
                  </span>
                </div>

                <div style={{ padding: '14px 18px', background: 'var(--cream)', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Country of Origin
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    Sri Lanka
                  </span>
                </div>

                <div style={{ padding: '14px 18px', background: 'var(--cream)', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Storage
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    Store in a cool, dry place.
                  </span>
                </div>

                <div style={{ padding: '14px 18px', background: 'var(--cream)', borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                    Best Before
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    See package.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Nutritional Facts */}
        {tab === 'nutrition' && (
          <div>
            <h3 style={{
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--green-dark)',
              fontWeight: 700,
              marginBottom: 16,
            }}>
              Nutritional Value (Per Serving)
            </h3>
            <table className="nutrition-table" style={{ maxWidth: 460 }}>
              <tbody>
                {[
                  ['Serving Size', nutrition.serving || '30g'],
                  ['Calories', nutrition.calories || '180 kcal'],
                  ['Total Fat', nutrition.fat || '14g'],
                  ['Protein', nutrition.protein || '6g'],
                  ['Carbohydrates', nutrition.carbs || '9g'],
                  ['Dietary Fibre', nutrition.fibre || '2g'],
                  ['Sodium', nutrition.sodium || '5mg'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: 'var(--muted)', padding: '11px 0' }}>{k}</td>
                    <td style={{ padding: '11px 0', textAlign: 'right', fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 22px', background: 'var(--cream)', borderRadius: 16 }}>
                <div className="review-avatar">{r.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
                  <div style={{ marginBottom: 8 }}><Stars rating={r.rating} size={13} /></div>
                  <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════
          6. DELIVERY INFORMATION
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--cream-dark)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        padding: '28px 32px',
        marginBottom: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'var(--green)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconTruck size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--green-dark)',
              fontWeight: 700,
              marginBottom: 4,
            }}>
              DELIVERY
            </h3>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
              Island-wide delivery available.
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              Delivery charges are calculated at checkout based on your delivery location.
            </p>
          </div>
        </div>

        <Link href="/track" style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--green)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          textDecoration: 'underline',
        }}>
          Delivery Information →
        </Link>
      </section>

      {/* ═══════════════════════════════════════════════
          7. PRODUCT CALL TO ACTION (CTA)
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%)',
        color: '#fff',
        borderRadius: 24,
        padding: '40px 32px',
        textAlign: 'center',
        marginBottom: 64,
        boxShadow: '0 12px 40px rgba(30,86,49,0.18)',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(24px, 3.5vw, 36px)',
          fontWeight: 700,
          marginBottom: 12,
          color: '#fff',
        }}>
          Add Something Good to Your Day.
        </h2>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: 480,
          margin: '0 auto 24px',
          lineHeight: 1.6,
        }}>
          Freshly packed nuts and wholesome snacks delivered straight to your door.
        </p>
        <button
          className="btn-primary"
          style={{
            background: 'var(--gold)',
            color: '#fff',
            padding: '14px 38px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
          }}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </button>
      </section>

      {/* ═══════════════════════════════════════════════
          8. RELATED PRODUCTS ("You May Also Like")
      ═══════════════════════════════════════════════ */}
      {related && related.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <p style={{
                fontSize: 12,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--brown)',
                fontWeight: 700,
                marginBottom: 6,
              }}>
                DISCOVER MORE
              </p>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 700,
                color: 'var(--green-dark)',
              }}>
                You May Also Like
              </h2>
            </div>

            <Link href="/shop" style={{
              fontSize: 14,
              color: 'var(--green)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}>
              View All Products →
            </Link>
          </div>

          <div className="prod-grid" style={{ gap: 24 }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
