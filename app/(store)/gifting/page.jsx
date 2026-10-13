import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import { IconBox, IconCheck } from '@/components/storefront/Icons'

export const metadata = {
  title: 'Gifting & Hampers — Ceylon Crunch',
  description: 'A Simple Gift. Thoughtfully Prepared. Curated nuts, dried fruits, and dates hampers for weddings, corporate gifts, birthdays, and celebrations.',
}

export default async function GiftingPage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}
  const whatsappNumber = (footer.social?.whatsapp || footer.contact_phone || '+94779443867').replace(/\D/g, '')

  const occasions = [
    {
      title: 'Weddings & Nikah',
      tag: 'Celebration',
      desc: 'Elegant bespoke favours and artisanal hampers for your special day and guests.',
      icon: '💍',
    },
    {
      title: 'Corporate Gifts',
      tag: 'Business',
      desc: 'Sophisticated executive gifts, client appreciation packs, and team hampers with custom branding.',
      icon: '🏢',
    },
    {
      title: 'Birthdays',
      tag: 'Personal',
      desc: 'Wholesome, delicious gift boxes filled with premium roasted nuts and sweet glazed treats.',
      icon: '🎂',
    },
    {
      title: 'Festive Gifting',
      tag: 'Seasonal',
      desc: 'Special collections for Ramadan & Eid, Avurudu, Christmas, Diwali, and New Year.',
      icon: '✨',
    },
    {
      title: 'Return Gifts',
      tag: 'Gatherings',
      desc: 'Memorable thank-you boxes and parcel favours for events, parties, and family ceremonies.',
      icon: '🎁',
    },
    {
      title: 'Thank-You Gifts',
      tag: 'Gratitude',
      desc: 'A gracious, healthy gesture to express appreciation to mentors, doctors, partners, or teachers.',
      icon: '🙏',
    },
    {
      title: 'Family & Friends',
      tag: 'Everyday',
      desc: 'Warm care packages of fresh nutritious snacks delivered directly to loved ones across Sri Lanka.',
      icon: '❤️',
    },
  ]

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20would%20like%20to%20enquire%20about%20Gifting%20%26%20Hampers.`

  return (
    <main style={{ maxWidth: 1140, margin: '0 auto', padding: '50px 24px 100px' }}>

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
          GIFTING
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px, 5.2vw, 50px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 18,
          letterSpacing: '-0.02em',
        }}>
          A Simple Gift. Thoughtfully Prepared.
        </h1>
        <div style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 680,
          margin: '0 auto 28px',
          lineHeight: 1.75,
        }}>
          <p style={{ marginBottom: 10 }}>Looking for something different to give?</p>
          <p>
            Our nuts, dried fruits, dates and other products can be prepared as gifts and hampers for different occasions.
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
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 50,
                background: 'var(--green)',
                boxShadow: '0 6px 24px rgba(30,86,49,0.3)',
              }}
            >
              ENQUIRE ABOUT GIFTING
            </button>
          </a>
          <Link href="/shop?category=Gifts+%26+Hampers">
            <button className="btn-outline" style={{ padding: '15px 32px', fontSize: 15, borderRadius: 50 }}>
              Browse Ready Hampers
            </button>
          </Link>
        </div>
      </div>

      {/* ── 2. OCCASIONS GRID ── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
          }}>
            Occasions & Celebrations
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>
            Crafted with premium natural ingredients, elegant ribbons, and personalized cards.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {occasions.map((occ) => (
            <div
              key={occ.title}
              style={{
                background: '#fff',
                borderRadius: 22,
                padding: '28px 26px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 32 }}>{occ.icon}</div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--brown)',
                    background: '#fcf6ec',
                    border: '1px solid #ebd9bd',
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}>
                    {occ.tag}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display,serif',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--green-dark)',
                  marginBottom: 10,
                }}>
                  {occ.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                  {occ.desc}
                </p>
              </div>

              <div style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: '1px solid #f2ede4',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: 'var(--green)',
                fontWeight: 600,
              }}>
                <IconCheck size={16} color="var(--green)" />
                <span>Custom packaging & note available</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. CUSTOMISED LARGE ORDERS BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cream-dark) 0%, #faedd8 100%)',
        borderRadius: 26,
        padding: '48px 36px',
        border: '1.5px solid #e7d6be',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--green)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <IconBox size={28} color="#fff" />
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 'clamp(24px, 3.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--green-dark)',
            marginBottom: 14,
          }}>
            Customised Gifting for Larger Quantities
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--ink-soft)',
            lineHeight: 1.7,
            marginBottom: 28,
          }}>
            We can also discuss customised orders for larger quantities. Whether you have specific dietary preferences, custom box formats, or branded sleeves, our team is ready to curate the ideal collection.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            <button
              className="btn-primary"
              style={{
                padding: '16px 36px',
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 50,
              }}
            >
              ENQUIRE ABOUT GIFTING →
            </button>
          </a>
        </div>
      </div>

    </main>
  )
}
