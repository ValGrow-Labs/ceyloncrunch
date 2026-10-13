import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import { IconLeaf, IconCheck, IconBox, IconTruck, IconShield } from '@/components/storefront/Icons'

export const metadata = {
  title: 'About Us — Ceylon Crunch',
  description: 'Good Products. Carefully Chosen. Learn about Ceylon Crunch, our story, approach, and commitment to wholesome food.',
}

export default async function AboutPage() {
  const settings = await getAllSettings()
  const branding = settings.branding || {}

  return (
    <main>
      {/* ── 1. HERO HEADER ── */}
      <section style={{
        background: 'linear-gradient(150deg, var(--green-dark) 0%, var(--green) 100%)',
        padding: '90px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/img/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-light)',
            fontWeight: 700,
            marginBottom: 14,
          }}>
            ABOUT CEYLON CRUNCH
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            Good Products.<br />
            <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Carefully Chosen.</span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7,
            maxWidth: 620,
            margin: '0 auto 28px',
          }}>
            Quality nuts, dried fruits, dates and wholesome treats — sourced with care and delivered across Sri Lanka.
          </p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 50,
            padding: '8px 24px',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#fff',
          }}>
            From Nature to Your Doorstep.
          </div>
        </div>
      </section>

      {/* ── 2. OUR STORY SECTION ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 56,
          alignItems: 'center',
        }}>
          {/* Story Text */}
          <div>
            <div style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--brown)',
              marginBottom: 10,
            }}>
              OUR STORY
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 'clamp(28px, 3.8vw, 40px)',
              fontWeight: 700,
              color: 'var(--green-dark)',
              lineHeight: 1.25,
              marginBottom: 24,
            }}>
              Good Products. Carefully Chosen.
            </h2>
            <div style={{
              fontSize: 16,
              color: 'var(--ink-soft)',
              lineHeight: 1.85,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <p>
                Ceylon Crunch began with a simple goal — to make quality nuts, dried fruits and wholesome foods more accessible to people across Sri Lanka.
              </p>
              <p>
                We believe choosing good food shouldn&apos;t have to be complicated.
              </p>
              <p>
                That&apos;s why we focus on the things that matter: good products, careful selection, clean presentation and reliable service.
              </p>
              <p>
                From sourcing to packing to delivery, we pay attention to the details.
              </p>
              <p style={{ fontWeight: 600, color: 'var(--green-dark)' }}>
                We are building Ceylon Crunch one product and one customer at a time.
              </p>
            </div>

            <div style={{
              marginTop: 28,
              padding: '16px 22px',
              borderLeft: '4px solid var(--gold)',
              background: 'var(--cream-dark)',
              borderRadius: '0 14px 14px 0',
              fontStyle: 'italic',
              fontFamily: 'Playfair Display,serif',
              fontSize: 18,
              color: 'var(--green-dark)',
            }}>
              &ldquo;From Nature to Your Doorstep.&rdquo;
            </div>
          </div>

          {/* Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              border: '2px solid var(--border)',
              aspectRatio: '4/3',
              background: 'var(--cream-dark)',
            }}>
              <img
                src="/img/product-1.jpg"
                alt="Ceylon Crunch Quality Products"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: -20,
              right: 20,
              background: '#fff',
              borderRadius: 18,
              padding: '16px 22px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--green)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconLeaf size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-dark)' }}>100% Quality Inspected</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Natural ingredients only</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. OUR APPROACH & OUR PROMISE CARDS ── */}
      <section style={{ background: 'var(--cream-dark)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <p style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              WHAT WE STAND FOR
            </p>
            <h2 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 700,
              color: 'var(--green-dark)',
            }}>
              Our Core Commitments
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
          }}>
            {/* OUR APPROACH */}
            <div style={{
              background: '#fff',
              borderRadius: 24,
              padding: '40px 36px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                }}>
                  <IconShield size={24} color="var(--green)" />
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--brown)',
                  marginBottom: 8,
                }}>
                  OUR APPROACH
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 26,
                  fontWeight: 700,
                  color: 'var(--green-dark)',
                  marginBottom: 18,
                }}>
                  Quality Comes First.
                </h3>
                <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p>
                    We don&apos;t believe in offering products simply to make the range bigger.
                  </p>
                  <p>
                    We would rather offer products we can stand behind.
                  </p>
                  <p>
                    We look for quality, freshness, value and consistency when selecting what goes into our collection.
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: 28,
                paddingTop: 18,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: 'var(--green)',
                fontWeight: 600,
              }}>
                <IconCheck size={18} color="var(--green)" />
                <span>Small batch roasting & careful selection</span>
              </div>
            </div>

            {/* OUR PROMISE */}
            <div style={{
              background: '#fff',
              borderRadius: 24,
              padding: '40px 36px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                }}>
                  <IconBox size={24} color="var(--green)" />
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--brown)',
                  marginBottom: 8,
                }}>
                  OUR PROMISE
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 26,
                  fontWeight: 700,
                  color: 'var(--green-dark)',
                  marginBottom: 18,
                }}>
                  Simple. Honest. Reliable.
                </h3>
                <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p>
                    We aim to make every part of your experience straightforward — from choosing your products to receiving your order.
                  </p>
                  <p style={{ fontWeight: 600, color: 'var(--green-dark)' }}>
                    Good products. Clear information. Careful packing. Reliable service.
                  </p>
                  <p>
                    That&apos;s Ceylon Crunch.
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: 28,
                paddingTop: 18,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: 'var(--green)',
                fontWeight: 600,
              }}>
                <IconTruck size={18} color="var(--green)" />
                <span>Island-wide doorstep dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CALL TO ACTION ── */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: 780,
        margin: '0 auto',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 16,
        }}>
          Taste the Ceylon Crunch Difference
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
          From roasted nuts to dried exotic fruits and gifting hampers, explore our wholesome collection today.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '15px 36px', fontSize: 16, borderRadius: 50 }}>
              Shop the Collection
            </button>
          </Link>
          <Link href="/contact">
            <button className="btn-outline" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 50 }}>
              Get in Touch
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}
