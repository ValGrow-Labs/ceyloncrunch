import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getAllSettings } from '@/lib/settings'
import ProductCard from '@/components/storefront/ProductCard'
import NewsletterForm from '@/components/storefront/NewsletterForm'
import { iconByName } from '@/components/storefront/Icons'
import Stars from '@/components/storefront/Stars'

export async function generateMetadata() {
  const settings = await getAllSettings()
  const seo = settings.seo || {}
  return {
    title: seo.title || 'Ceylon Crunch | Healthy Crunch for Every Home',
    description: seo.description || 'Premium Sri Lankan nuts and healthy snacks.',
  }
}

export default async function HomePage() {
  const [settings, supabase] = await Promise.all([getAllSettings(), createClient()])
  const { data: products } = await supabase.from('products').select('*').eq('active', true).order('rating', { ascending: false })
  const allProducts = products || []

  const hero            = settings.hero || {}
  const featuresRaw     = settings.features || []
  const bestsellersSection = settings.bestsellers_section || {}
  const categoriesSection  = settings.categories_section || {}
  const aboutStrip      = settings.about_strip || {}
  const newsletterSection = settings.newsletter_section || {}
  const store           = settings.store || {}
  const currency        = store.currency_symbol || store.currency || 'LKR'

  const featured = allProducts.filter(p => p.badge === 'Bestseller' || p.badge === 'Popular').slice(0, 3)
  const heroProduct = allProducts.find(p => p.badge === 'Bestseller') || allProducts[0]
  const displayFeatured = featured.length >= 3 ? featured : allProducts.slice(0, 3)

  const categories = categoriesSection.items || [
    { name: 'Roasted Nuts',     img: '/img/product-1.jpg' },
    { name: 'Raw Nuts',         img: '/img/product-4.jpg' },
    { name: 'Mixed Trails',     img: '/img/product-3.jpg' },
    { name: 'Specialty Snacks', img: '/img/product-5.jpg' },
  ]

  const marqueeItems = allProducts.map(p => p.name)

  return (
    <main>

      {/* ═══════════════════════════════════════════════
          HERO — split layout
      ═══════════════════════════════════════════════ */}
      <section className="grain" style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 60%, #e0d4c0 100%)',
        minHeight: '90vh', display: 'flex', alignItems: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${hero.bg_image || '/img/hero-bg.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: (hero.bg_opacity ?? 0.52) * 0.4 }} />

        <div className="hero-split" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(60px,8vw,80px) clamp(16px,4vw,48px)', display: 'grid', gridTemplateColumns: '1fr 480px', gap: 64, alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Left: text */}
          <div>
            <span className="animate-fadeUp" style={{ display: 'inline-block', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--green)', color: '#fff', padding: '5px 16px', borderRadius: 50, fontWeight: 700, marginBottom: 24 }}>
              {hero.eyebrow || 'Ceylon Crunch — Est. 2020'}
            </span>

            <h1 className="animate-fadeUp-2" style={{ fontSize: 'clamp(40px,5.5vw,76px)', fontWeight: 700, lineHeight: 1.07, color: 'var(--green-dark)', marginBottom: 28, letterSpacing: '-0.01em' }}>
              {hero.headline || 'In a world that rushes everything,'}<br />
              <em style={{ color: 'var(--brown)', fontStyle: 'italic', backgroundImage: 'linear-gradient(135deg, var(--brown) 0%, var(--gold) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {hero.headline_italic || 'we chose to wait.'}
              </em>
            </h1>

            <p className="animate-fadeUp-3" style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: 520, marginBottom: 40, fontWeight: 300 }}>
              {hero.subtext || 'Sourced from Sri Lankan growers who know when a nut is ready without checking a calendar. Honest food for moments that matter.'}
            </p>

            <div className="animate-fadeUp-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href={hero.primary_cta_link || '/shop'}>
                <button className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>{hero.primary_cta || 'Shop the Collection'}</button>
              </Link>
              <Link href={hero.secondary_cta_link || '/about'}>
                <button className="btn-outline" style={{ padding: '15px 32px', fontSize: 16 }}>{hero.secondary_cta || 'Our Story'}</button>
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stars rating={4.8} size={16} />
                <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>4.8 avg rating</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18 }}>🏝</span> Island-wide delivery
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18 }}>🌿</span> 100% Natural
              </div>
            </div>
          </div>

          {/* Right: hero product card */}
          {heroProduct && (
            <div className="hero-product-col" style={{ position: 'relative' }}>
              {/* Decorative ring */}
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1.5px dashed var(--gold)', opacity: 0.3, borderStyle: 'dashed' }} />

              <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 32px 80px rgba(30,86,49,0.18)', position: 'relative', background: '#fff' }}>
                <img src={heroProduct.image_url || '/img/product-1.jpg'} alt={heroProduct.name}
                  style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block' }} />

                {/* Floating badge */}
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                  {heroProduct.badge && (
                    <span className={`badge badge-${heroProduct.badge_type}`} style={{ fontSize: 12, padding: '5px 14px' }}>
                      {heroProduct.badge}
                    </span>
                  )}
                </div>

                {/* Bottom card */}
                <div style={{ padding: '20px 24px', background: '#fff' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{heroProduct.category}</div>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>{heroProduct.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars rating={heroProduct.rating} size={14} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{heroProduct.rating} ({heroProduct.reviews})</span>
                    </div>
                    <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{currency} {heroProduct.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Floating stat pill */}
              <div style={{ position: 'absolute', bottom: -18, left: -24, background: 'var(--green)', color: '#fff', borderRadius: 60, padding: '12px 20px', boxShadow: '0 8px 24px rgba(30,86,49,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🌿</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{allProducts.length}+</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>Products</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MARQUEE — scrolling product names
      ═══════════════════════════════════════════════ */}
      <div style={{ background: 'var(--green)', padding: '14px 0', overflow: 'hidden', borderTop: '2px solid var(--green-dark)', borderBottom: '2px solid var(--green-dark)' }}>
        <div style={{ display: 'flex', gap: 0, animation: 'marquee 28s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((name, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 28 }}>
              {name}
              <span style={{ color: 'var(--gold)', fontSize: 10 }}>✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
      </div>

      {/* ═══════════════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════════════ */}
      {featuresRaw.length > 0 && (
        <section style={{ background: 'var(--cream-dark)', padding: 'clamp(32px,5vw,48px) clamp(16px,4vw,48px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 32 }}>
            {featuresRaw.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {iconByName(f.icon, { color: '#fff', size: 20 })}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--green-dark)', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.55 }}>{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          FEATURED — top 3 editorial cards
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,48px) clamp(40px,6vw,64px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>
              {bestsellersSection.eyebrow || 'Trusted Favourites'}
            </p>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1.1 }}>
              {bestsellersSection.headline || 'Chosen for Character'}
            </h2>
          </div>
          <Link href="/shop" style={{ fontSize: 14, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            View all {allProducts.length} products →
          </Link>
        </div>

        {/* Editorial 3-col feature layout */}
        <div className="featured-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 64 }}>
          {displayFeatured.map((product, i) => (
            <Link key={product.id} href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                <div style={{ position: 'relative', height: 280 }}>
                  <img src={product.image_url || '/img/placeholder.jpg'} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
                  {product.badge && (
                    <span className={`badge badge-${product.badge_type}`} style={{ position: 'absolute', top: 16, left: 16 }}>{product.badge}</span>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{product.category}</div>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>{product.name}</div>
                  </div>
                </div>
                <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <Stars rating={product.rating} size={12} />
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{product.rating}</span>
                    </div>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{currency} {product.price.toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>
                    {product.variants?.join(' · ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Full product grid */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>The Full Collection</p>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, color: 'var(--green-dark)' }}>Every Product, Every Batch</h2>
        </div>
        <div className="prod-grid">
          {allProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/shop"><button className="btn-outline" style={{ padding: '14px 40px', fontSize: 16 }}>Browse & Filter All Products</button></Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(16px,4vw,48px) clamp(56px,8vw,96px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>
            {categoriesSection.eyebrow || 'Browse by Type'}
          </p>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, color: 'var(--green-dark)' }}>
            {categoriesSection.headline || 'Find Your Crunch'}
          </h2>
        </div>
        {/* 2+2 asymmetric grid */}
        <div className="categories-grid-asym" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr', gridTemplateRows: '320px', gap: 16 }}>
          {categories.slice(0, 4).map((c, i) => (
            <Link key={c.name} href="/shop" style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', display: 'block', textDecoration: 'none' }}>
              <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)', transition: 'opacity 0.3s' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px' }}>
                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display,serif', fontSize: 21, fontWeight: 600, marginBottom: 4 }}>{c.name}</h3>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ABOUT STRIP
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--green-dark)', padding: 'clamp(56px,8vw,96px) clamp(16px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />
        <div className="about-strip-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 16 }}>
              {aboutStrip.eyebrow || 'About Us'}
            </p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.15 }}>
              {aboutStrip.headline || 'Food That Earns Its Place at the Table'}
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.85, marginBottom: 36, fontWeight: 300 }}>
              {aboutStrip.body || 'Across Sri Lanka, there are still growers who know when a nut is ready without checking a calendar. We built this brand for them. And for you.'}
            </p>
            {aboutStrip.stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {aboutStrip.stats.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 36, fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <Link href={aboutStrip.cta_link || '/about'}>
              <button style={{ padding: '14px 34px', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                {aboutStrip.cta_label || 'Read Our Story'}
              </button>
            </Link>
          </div>
          <div className="about-strip-img" style={{ borderRadius: 24, overflow: 'hidden', height: 460, position: 'relative' }}>
            <img src={aboutStrip.image_url || '/img/product-12.jpg'} alt="Ceylon Crunch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,86,49,0.3) 0%, transparent 60%)' }} />
            {/* Floating review pill */}
            <div style={{ position: 'absolute', top: 28, right: 28, background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '14px 18px', backdropFilter: 'blur(8px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: 'var(--gold)', fontSize: 14 }}>★</span>)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500 }}>"Quality you can taste"</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream-dark)', padding: 'clamp(56px,8vw,88px) clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 16 }}>
            {newsletterSection.eyebrow || 'Stay Connected'}
          </p>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 16 }}>
            {newsletterSection.headline || 'For Moments That Matter'}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36 }}>
            {newsletterSection.body || 'Harvest updates, new batches, and quiet notes from the land. No noise — only what is worth your time.'}
          </p>
          <NewsletterForm buttonLabel={newsletterSection.button_label || 'Subscribe'} />
        </div>
      </section>

    </main>
  )
}
