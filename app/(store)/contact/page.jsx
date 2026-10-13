import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import ContactFormClient from '@/components/storefront/ContactFormClient'

export const metadata = {
  title: 'Contact Us — Ceylon Crunch',
  description: "Have a Question? We'd love to hear from you. Get in touch with Ceylon Crunch via WhatsApp, phone, email, or social media.",
}

export default async function ContactPage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}

  const contactPhone = footer.contact_phone || '+94 77 944 3867'
  const whatsappNumber = footer.social?.whatsapp || footer.contact_phone || '+94779443867'
  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '')
  const contactEmail = footer.contact_email || 'ceyloncrunch26@gmail.com'
  const address = footer.address || 'Colombo, Sri Lanka'

  // Social handles
  const instagramHandle = footer.social?.instagram ? `@${footer.social.instagram.replace('@', '')}` : '@ceyloncrunch'
  const facebookPage = footer.social?.facebook || 'Ceylon Crunch'
  const tiktokHandle = footer.social?.tiktok ? `@${footer.social.tiktok.replace('@', '')}` : '@ceyloncrunch'

  const businessDays = 'Monday – Saturday'
  const businessHours = '9:00 AM – 7:00 PM'

  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: '50px 24px 100px' }}>

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
          Have a Question?
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px, 5vw, 50px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          WE&apos;D LOVE TO HEAR FROM YOU
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 620,
          margin: '0 auto 28px',
          lineHeight: 1.7,
        }}>
          Whether you need help choosing a product, want to ask about an order or simply want to get in touch, we&apos;re here to help.
        </p>

        {/* Primary CTA */}
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=Hi%20Ceylon%20Crunch,%20I%20have%20a%20question.`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          <button
            className="btn-primary"
            style={{
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 50,
              background: '#25D366',
              boxShadow: '0 6px 24px rgba(37,211,102,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            CHAT ON WHATSAPP
          </button>
        </a>
      </div>

      {/* ── 2. TWO-COLUMN LAYOUT: CONTACT BLOCKS & FORM ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 36,
        alignItems: 'start',
      }}>

        {/* ── LEFT: CONTACT DETAILS & BLOCKS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Direct Channels Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {/* WhatsApp Block */}
            <div style={blockCardStyle}>
              <div style={iconBadgeStyle}>💬</div>
              <div style={blockLabelStyle}>WhatsApp</div>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi%20Ceylon%20Crunch`}
                target="_blank"
                rel="noopener noreferrer"
                style={blockLinkStyle}
              >
                {contactPhone}
              </a>
              <span style={{ fontSize: 12, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>● Instant response</span>
            </div>

            {/* Call Us Block */}
            <div style={blockCardStyle}>
              <div style={iconBadgeStyle}>📞</div>
              <div style={blockLabelStyle}>Call Us</div>
              <a href={`tel:${cleanWhatsapp}`} style={blockLinkStyle}>
                {contactPhone}
              </a>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Voice inquiries & orders</span>
            </div>

            {/* Email Block */}
            <div style={blockCardStyle}>
              <div style={iconBadgeStyle}>✉️</div>
              <div style={blockLabelStyle}>Email</div>
              <a href={`mailto:${contactEmail}`} style={blockLinkStyle}>
                {contactEmail}
              </a>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>For general inquiries</span>
            </div>

            {/* Location Block */}
            <div style={blockCardStyle}>
              <div style={iconBadgeStyle}>📍</div>
              <div style={blockLabelStyle}>Address</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{address}</div>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Island-wide courier dispatch</span>
            </div>
          </div>

          {/* Social Channels Block */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '24px 26px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
          }}>
            <h3 style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--green-dark)',
              marginBottom: 16,
            }}>
              Follow & Connect
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {/* Instagram */}
              <div style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Instagram
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                  {instagramHandle}
                </div>
              </div>

              {/* Facebook */}
              <div style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Facebook
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                  {facebookPage}
                </div>
              </div>

              {/* TikTok */}
              <div style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TikTok
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                  {tiktokHandle}
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours Block */}
          <div style={{
            background: 'var(--cream-dark)',
            borderRadius: 20,
            padding: '22px 26px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brown)', marginBottom: 4 }}>
                Business Hours
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)' }}>
                {businessDays}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                {businessHours}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Web orders accepted 24/7
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: INTERACTIVE FORM ── */}
        <div>
          <ContactFormClient />
        </div>

      </div>

    </main>
  )
}

const blockCardStyle = {
  background: '#fff',
  borderRadius: 18,
  padding: '20px',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
  display: 'flex',
  flexDirection: 'column',
}

const iconBadgeStyle = {
  fontSize: 22,
  marginBottom: 10,
}

const blockLabelStyle = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--muted)',
  marginBottom: 4,
}

const blockLinkStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--green-dark)',
  textDecoration: 'none',
  wordBreak: 'break-word',
}
