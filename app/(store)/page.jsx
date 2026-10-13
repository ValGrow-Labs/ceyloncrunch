import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getAllSettings } from '@/lib/settings'
import ProductCard from '@/components/storefront/ProductCard'
import NewsletterForm from '@/components/storefront/NewsletterForm'
import { IconLeaf, IconCheck, IconTruck, IconBox, IconStar } from '@/components/storefront/Icons'
import Stars from '@/components/storefront/Stars'
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data'

export async function generateMetadata() {
  const settings = await getAllSettings()
  const seo = settings.seo || {}
  return {
    title: seo.title || 'Ceylon Crunch | Good Products. Carefully Chosen.',
    description: seo.description || 'Quality nuts, dried fruits, dates, seeds and more — selected with care and delivered to your doorstep across Sri Lanka.',
  }
}

async function withTimeout(promise, ms = 1500) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

export default async function HomePage() {
  const settings = await getAllSettings()
  let allProducts = FALLBACK_PRODUCTS

  try {
    const supabase = await createClient()
    const { data: products } = await withTimeout(
      supabase.from('products').select('*').eq('active', true).order('rating', { ascending: false })
    )
    if (products && products.length > 0) {
      allProducts = products
    }
  } catch {
    // Graceful fallback to seeded products
  }

  const store = settings.store || {}
  const currency = store.currency_symbol || store.currency || 'LKR'
  const footer = settings.footer || {}
  const social = footer.social || {}
  const followUrl = social.instagram || social.facebook || (social.whatsapp ? `https://wa.me/${social.whatsapp.replace(/\D/g, '')}` : 'https://instagram.com')

  // Popular Picks: top 4 products
  const popularPicks = allProducts.slice(0, 4)

  // Hero showcase product (Roasted Cashews or first product)
  const heroProduct = allProducts.find(p => p.slug === 'roasted-cashews') || allProducts[0]

  // Category cards for Section 6
  const categories = [
    {
      name: 'Nuts',
      desc: 'Almonds, cashews, pistachios, walnuts and more.',
      img: '/img/product-1.jpg',
      href: '/shop?category=Nuts',
    },
    {
      name: 'Dried Fruits',
      desc: 'Naturally sweet and convenient for everyday snacking.',
      img: '/img/product-7.jpg',
      href: '/shop?category=Dried+Fruits',
    },
    {
      name: 'Dates',
      desc: 'A selection of dates for snacking, sharing and gifting.',
      img: '/img/product-10.jpg',
      href: '/shop?category=Dates',
    },
    {
      name: 'Seeds',
      desc: 'Simple additions to your everyday meals.',
      img: '/img/product-12.jpg',
      href: '/shop?category=Seeds',
    },
    {
      name: 'Healthy Snacks',
      desc: 'Easy choices for home, work and on the go.',
      img: '/img/product-5.jpg',
      href: '/shop?category=Healthy+Snacks',
    },
    {
      name: 'Gifts & Hampers',
      desc: 'Thoughtful options for every occasion.',
      img: '/img/product-3.jpg',
      href: '/shop?category=Gifts+%26+Hampers',
    },
  ]

  // Occasions for Section 8
  const occasions = [
    { title: 'Birthdays', note: 'Curated celebration boxes', icon: '🎁' },
    { title: 'Weddings & Nikah', note: 'Elegant favors & guest trays', icon: '✨' },
    { title: 'Corporate Gifts', note: 'Professional client hampers', icon: '💼' },
    { title: 'Thank-You Gifts', note: 'Warm tokens of gratitude', icon: '🌿' },
    { title: 'Festive Gifting', note: 'Avurudu, Eid & seasonal packs', icon: '🌟' },
    { title: 'Return Gifts', note: 'Memorable event giveaways', icon: '🎀' },
  ]

  return (
    <main>

      {/* ═══════════════════════════════════════════════
          2. HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="grain" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 55%, #dfd3bd 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Subtle background photo overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/img/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.16,
          mixBlendMode: 'multiply',
        }} />

        <div className="hero-split" style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(56px,7vw,88px) clamp(16px,4vw,48px)',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: 56,
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Left: Heading & Call to Actions */}
          <div>
            {/* Brand Tagline */}
            <div className="animate-fadeUp" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 50,
              background: 'rgba(30,86,49,0.08)',
              border: '1px solid rgba(30,86,49,0.18)',
              color: 'var(--green-dark)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: 24,
            }}>
              <span style={{ color: 'var(--gold)', fontSize: 14 }}>✦</span>
              From Nature to Your Doorstep.
            </div>

            {/* Primary Brand Message */}
            <h1 className="animate-fadeUp-2" style={{
              fontSize: 'clamp(38px,5.2vw,70px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--green-dark)',
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}>
              GOOD PRODUCTS.<br />
              <span style={{
                color: 'var(--brown)',
                display: 'inline-block',
                fontStyle: 'normal',
                letterSpacing: '-0.01em',
              }}>
                CAREFULLY CHOSEN.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="animate-fadeUp-3" style={{
              fontSize: 'clamp(16px,1.8vw,19px)',
              color: 'var(--ink-soft)',
              lineHeight: 1.75,
              maxWidth: 540,
              marginBottom: 36,
              fontWeight: 400,
            }}>
              Quality nuts, dried fruits, dates, seeds and more — selected with care and delivered to your doorstep.
            </p>

            {/* Hero Action Buttons */}
            <div className="animate-fadeUp-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
              <Link href="/shop">
                <button className="btn-primary" style={{ padding: '15px 36px', fontSize: 16 }}>
                  SHOP NOW
                </button>
              </Link>
              <Link href="/about">
                <button className="btn-outline" style={{ padding: '14px 32px', fontSize: 16 }}>
                  OUR STORY
                </button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div style={{
              display: 'flex',
              gap: 28,
              flexWrap: 'wrap',
              paddingTop: 24,
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stars rating={4.8} size={15} />
                <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>4.8 Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                <span style={{ color: 'var(--green)', fontSize: 16 }}>✓</span>
                Island-Wide Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                <span style={{ color: 'var(--gold)', fontSize: 16 }}>★</span>
                100% Wholesome & Fresh
              </div>
            </div>
          </div>

          {/* Right: Premium Hero Showcase Card */}
          {heroProduct && (
            <div className="hero-product-col" style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 24,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 24px 60px rgba(30,86,49,0.14)',
                border: '1px solid var(--border)',
                position: 'relative',
              }}>
                <div style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
                  <img
                    src={heroProduct.image_url || '/img/product-1.jpg'}
                    alt={heroProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
                  }} />
                  <span className="badge badge-green" style={{ position: 'absolute', top: 18, left: 18 }}>
                    Customer Favourite
                  </span>
                  <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20, color: '#fff' }}>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.85 }}>
                      {heroProduct.category}
                    </span>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                      {heroProduct.name}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Stars rating={heroProduct.rating} size={14} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>({heroProduct.reviews} reviews)</span>
                    </div>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>
                      {currency} {heroProduct.price.toLocaleString()}
                    </div>
                  </div>
                  <Link href={`/shop/${heroProduct.slug}`}>
                    <button className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
                      View Product
                    </button>
                  </Link>
                </div>
              </div>

              {/* Floating Quality Stamp */}
              <div style={{
                position: 'absolute',
                top: -16,
                right: -16,
                background: 'var(--cream)',
                border: '1.5px solid var(--gold)',
                borderRadius: 50,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--brown)',
              }}>
                <span>🌿</span> Fresh Harvest
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. CUSTOMER FAVOURITES
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(56px,8vw,92px) clamp(16px,4vw,48px)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 44,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              OUR FAVOURITES
            </p>
            <h2 style={{
              fontSize: 'clamp(28px,4vw,44px)',
              fontWeight: 700,
              color: 'var(--green-dark)',
              lineHeight: 1.15,
            }}>
              Popular Picks
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 500 }}>
              A selection of products our customers love.
            </p>
          </div>

          <Link href="/shop" style={{
            fontSize: 15,
            color: 'var(--green)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'color 0.2s',
          }}>
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="prod-grid" style={{ marginBottom: 40 }}>
          {popularPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/shop">
            <button className="btn-outline" style={{ padding: '13px 36px', fontSize: 15 }}>
              VIEW ALL PRODUCTS →
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. WHY CEYLON CRUNCH
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--cream-dark)',
        padding: 'clamp(60px,8vw,96px) clamp(16px,4vw,48px)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              fontWeight: 700,
              marginBottom: 10,
            }}>
              WHY CEYLON CRUNCH
            </p>
            <h2 style={{
              fontSize: 'clamp(28px,3.8vw,44px)',
              fontWeight: 700,
              color: 'var(--green-dark)',
              lineHeight: 1.2,
              marginBottom: 16,
            }}>
              Simple Choices. Better Ingredients.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
              We believe good food starts with good ingredients.<br />
              From everyday snacking to gifting, we carefully select our products for quality, freshness and taste.
            </p>
          </div>

          {/* Three Premium Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}>
            {/* CARD 1 */}
            <div className="card-hover" style={{
              background: '#fff',
              borderRadius: 20,
              padding: '36px 30px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(30,86,49,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green)',
                marginBottom: 22,
              }}>
                <IconLeaf size={26} color="var(--green)" />
              </div>
              <h3 style={{
                fontSize: 21,
                fontWeight: 600,
                color: 'var(--green-dark)',
                marginBottom: 10,
              }}>
                Carefully Selected
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
                Products chosen with attention to quality and freshness.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="card-hover" style={{
              background: '#fff',
              borderRadius: 20,
              padding: '36px 30px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(201,168,76,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
                marginBottom: 22,
              }}>
                <IconCheck size={26} color="var(--gold)" />
              </div>
              <h3 style={{
                fontSize: 21,
                fontWeight: 600,
                color: 'var(--green-dark)',
                marginBottom: 10,
              }}>
                Quality You Can Trust
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
                We focus on products we are happy to put our name behind.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="card-hover" style={{
              background: '#fff',
              borderRadius: 20,
              padding: '36px 30px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(123,63,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brown)',
                marginBottom: 22,
              }}>
                <IconTruck size={26} color="var(--brown)" />
              </div>
              <h3 style={{
                fontSize: 21,
                fontWeight: 600,
                color: 'var(--green-dark)',
                marginBottom: 10,
              }}>
                Delivered With Care
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
                Packed carefully and delivered across Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. OUR COLLECTION
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(60px,8vw,96px) clamp(16px,4vw,48px)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 44,
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              OUR COLLECTION
            </p>
            <h2 style={{
              fontSize: 'clamp(28px,4vw,44px)',
              fontWeight: 700,
              color: 'var(--green-dark)',
              lineHeight: 1.15,
            }}>
              Something for Every Taste.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 540 }}>
              Explore our selection of nuts, dried fruits, dates, seeds and other wholesome foods.
            </p>
          </div>

          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '13px 30px', fontSize: 14 }}>
              SHOP ALL PRODUCTS
            </button>
          </Link>
        </div>

        {/* Editorial Product Showcase Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {allProducts.slice(0, 4).map((p) => (
            <Link key={p.id} href={`/shop/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                borderRadius: 22,
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <img
                    src={p.image_url || '/img/product-1.jpg'}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                  }} />
                  {p.badge && (
                    <span className={`badge badge-${p.badge_type}`} style={{ position: 'absolute', top: 12, left: 12 }}>
                      {p.badge}
                    </span>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.92)',
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 50,
                    fontWeight: 600,
                    color: 'var(--ink)',
                  }}>
                    {p.category}
                  </span>
                  <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, color: '#fff' }}>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700 }}>
                      {p.name}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Price</span>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>
                      {currency} {p.price.toLocaleString()}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. SHOP BY CATEGORY
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(60px,8vw,96px) clamp(16px,4vw,48px)',
        maxWidth: 1200,
        margin: '0 auto',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brown)',
            fontWeight: 700,
            marginBottom: 8,
          }}>
            SHOP BY CATEGORY
          </p>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,44px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1.15,
          }}>
            Find What You Need.
          </h2>
        </div>

        {/* 6 Category Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                borderRadius: 22,
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid var(--border)',
                height: 280,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(22,61,35,0.92) 0%, rgba(22,61,35,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1, padding: '24px 24px 26px', color: '#fff' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                    <h3 style={{
                      fontFamily: 'Playfair Display,serif',
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#fff',
                    }}>
                      {cat.name}
                    </h3>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--gold-light)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      Browse →
                    </span>
                  </div>
                  <p style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.5,
                  }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. ABOUT CEYLON CRUNCH
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--green-dark)',
        padding: 'clamp(64px,8vw,104px) clamp(16px,4vw,48px)',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/img/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
        }} />

        <div className="about-strip-grid" style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 64,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 700,
              marginBottom: 16,
            }}>
              ABOUT CEYLON CRUNCH
            </p>
            <h2 style={{
              fontSize: 'clamp(30px,4vw,48px)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 24,
              lineHeight: 1.15,
            }}>
              Good Food, Carefully Chosen.
            </h2>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p>
                Ceylon Crunch was created with a simple idea: make quality nuts, dried fruits and wholesome foods easier to enjoy.
              </p>
              <p>
                We carefully select our products, pack them with care and bring them straight to your doorstep.
              </p>
              <p>
                Whether you're buying for yourself, your family, your workplace or someone special, we want every order to be a good one.
              </p>
            </div>

            <Link href="/about">
              <button style={{
                padding: '14px 34px',
                background: 'var(--gold)',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
              }}>
                READ OUR STORY
              </button>
            </Link>
          </div>

          {/* Visual food imagery card */}
          <div className="about-strip-img" style={{
            borderRadius: 24,
            overflow: 'hidden',
            height: 440,
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          }}>
            <img
              src="/img/product-12.jpg"
              alt="Ceylon Crunch selection"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(30,86,49,0.3) 0%, transparent 60%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              background: 'rgba(250,246,239,0.96)',
              borderRadius: 18,
              padding: '16px 20px',
              backdropFilter: 'blur(8px)',
              color: 'var(--ink)',
            }}>
              <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 2 }}>
                From Nature to Your Doorstep.
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Carefully packed for freshness and taste.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. GIFTING SECTION
      ═══════════════════════════════════════════════ */}
      <section id="gifting" style={{
        padding: 'clamp(64px,8vw,100px) clamp(16px,4vw,48px)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brown)',
            fontWeight: 700,
            marginBottom: 8,
          }}>
            FOR EVERY OCCASION
          </p>
          <h2 style={{
            fontSize: 'clamp(28px,4vw,44px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1.15,
            marginBottom: 14,
          }}>
            Something Worth Sharing.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.75 }}>
            From simple gifts to carefully prepared hampers, Ceylon Crunch makes it easy to share something good.
          </p>
        </div>

        {/* Occasion Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 44,
        }}>
          {occasions.map((occ) => (
            <div key={occ.title} className="card-hover" style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '24px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{occ.icon}</span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 2 }}>
                  {occ.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {occ.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gifting CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/shop?category=Gifts+%26+Hampers">
            <button className="btn-primary" style={{ padding: '15px 38px', fontSize: 15 }}>
              EXPLORE GIFTING
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. CONNECT SECTION
      ═══════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--cream-dark)',
        padding: 'clamp(64px,8vw,96px) clamp(16px,4vw,48px)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brown)',
            fontWeight: 700,
            marginBottom: 10,
          }}>
            STAY CONNECTED
          </p>
          <h2 style={{
            fontSize: 'clamp(28px,3.8vw,42px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Fresh Products. New Ideas. Updates.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.75, marginBottom: 32 }}>
            Follow Ceylon Crunch for new products, offers, recipes, serving ideas and more.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
            <a
              href={followUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
                FOLLOW US
              </button>
            </a>
          </div>

          {/* Newsletter Form */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '28px 24px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, fontWeight: 500 }}>
              Or subscribe with your email to receive direct seasonal updates:
            </p>
            <NewsletterForm buttonLabel="Subscribe" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(72px,9vw,112px) clamp(16px,4vw,48px)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--cream) 0%, #ece2cf 100%)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(30px,4.5vw,50px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Ready to Find Your Favourites?
          </h2>
          <p style={{
            fontSize: 'clamp(16px,2vw,19px)',
            color: 'var(--ink-soft)',
            lineHeight: 1.7,
            marginBottom: 36,
          }}>
            Shop quality nuts, dried fruits, dates, seeds and more.
          </p>
          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '16px 42px', fontSize: 16 }}>
              SHOP NOW
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}
