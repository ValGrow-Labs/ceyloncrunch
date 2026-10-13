import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import { IconCheck, IconTruck, IconShield, IconBox } from '@/components/storefront/Icons'

export const metadata = {
  title: 'Corporate & Bulk Orders — Ceylon Crunch',
  description: 'Buying for a Business or Event? Ceylon Crunch supplies premium nuts, dried fruits, and snack packs for corporate offices, hotels, restaurants, gyms, and events.',
}

export default async function CorporatePage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}
  const whatsappNumber = (footer.social?.whatsapp || footer.contact_phone || '+94779443867').replace(/\D/g, '')

  const suitableCategories = [
    { title: 'Corporate Offices', desc: 'Employee wellness snacks, executive pantry supply & milestone gifts.', icon: '🏢' },
    { title: 'Hotels', desc: 'Mini-bar selections, welcome amenities & turndown artisanal packs.', icon: '🏨' },
    { title: 'Restaurants', desc: 'Culinary grade nuts, garnishes & dessert ingredients.', icon: '🍽️' },
    { title: 'Gyms', desc: 'High-protein snacks, clean energy trail mixes & fitness fuel.', icon: '🏋️' },
    { title: 'Cafés', desc: 'Counter impulse snack pouches & grab-and-go healthy pairings.', icon: '☕' },
    { title: 'Events', desc: 'Conferences, product launches & seminar delegate goodie bags.', icon: '🎪' },
    { title: 'Weddings & Nikah', desc: 'Custom celebration favor boxes & celebratory guest packaging.', icon: '💍' },
    { title: 'Gift Hampers', desc: 'Festive, seasonal & executive customized client hampers.', icon: '🎁' },
    { title: 'Retailers', desc: 'Shelf-ready packaged gourmet nuts & premium dried fruits.', icon: '🛍️' },
  ]

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20am%20enquiring%20about%20Corporate%20%26%20Bulk%20Orders%20for%20my%20business/event.`

  return (
    <main style={{ maxWidth: 1160, margin: '0 auto', padding: '50px 24px 100px' }}>

      {/* ── 1. PAGE HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: 54 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 10,
        }}>
          BUSINESS ORDERS
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px, 5.2vw, 50px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 18,
          letterSpacing: '-0.02em',
        }}>
          Buying for a Business or Event?
        </h1>
        <div style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 700,
          margin: '0 auto 28px',
          lineHeight: 1.75,
        }}>
          <p style={{ marginBottom: 10 }}>
            We supply products for businesses, events and larger orders.
          </p>
          <p>
            Whether you&apos;re looking for staff gifts, corporate hampers, event packs or regular supply, speak to us about your requirements.
          </p>
        </div>

        {/* Primary CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button
              className="btn-primary"
              style={{
                padding: '16px 38px',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 50,
                background: 'var(--green)',
                boxShadow: '0 6px 24px rgba(30,86,49,0.3)',
              }}
            >
              ENQUIRE NOW
            </button>
          </a>
          <Link href="/contact">
            <button className="btn-outline" style={{ padding: '15px 32px', fontSize: 15, borderRadius: 50 }}>
              Contact Sales Team
            </button>
          </Link>
        </div>
      </div>

      {/* ── 2. SUITABLE FOR GRID ── */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
          }}>
            Suitable for Every Industry & Occasion
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>
            Reliable supply schedules, tiered pricing for bulk orders, and custom branding options.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 22,
        }}>
          {suitableCategories.map((item) => (
            <div
              key={item.title}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '26px 24px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
              }}
            >
              <div style={{
                fontSize: 30,
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'var(--cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--green-dark)',
                  marginBottom: 6,
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. WHY PARTNER WITH US ── */}
      <div style={{
        background: 'var(--cream-dark)',
        borderRadius: 26,
        padding: '48px 36px',
        border: '1px solid var(--border)',
        marginBottom: 56,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
          }}>
            Why Businesses Choose Ceylon Crunch
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--green)', marginBottom: 12 }}><IconCheck size={24} /></div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>Small-Batch Freshness</h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              We roast and pack strictly to order to ensure your guests and staff receive peak crunch and aroma.
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--green)', marginBottom: 12 }}><IconBox size={24} /></div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>Custom Co-Branding</h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Option to include corporate logos, tailored gift notes, and bespoke packaging for events and holidays.
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--green)', marginBottom: 12 }}><IconTruck size={24} /></div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>Dedicated Logistics</h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Scheduled bulk deliveries directly to your office, venue, or multiple recipient addresses across Sri Lanka.
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. CTA BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%)',
        borderRadius: 24,
        padding: '50px 32px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(26px, 4vw, 36px)',
          fontWeight: 700,
          marginBottom: 14,
        }}>
          Ready to Discuss Your Corporate Order?
        </h2>
        <p style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.85)',
          maxWidth: 580,
          margin: '0 auto 28px',
          lineHeight: 1.7,
        }}>
          Connect directly with our bulk orders coordinator on WhatsApp for quotation and sample inquiries.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <button
            className="btn-primary"
            style={{
              padding: '16px 42px',
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 50,
              background: '#25D366',
              boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            ENQUIRE NOW ON WHATSAPP →
          </button>
        </a>
      </div>

    </main>
  )
}
