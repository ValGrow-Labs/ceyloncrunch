import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import { IconTruck, IconBox, IconPin, IconShield } from '@/components/storefront/Icons'

export const metadata = {
  title: 'Delivery Information — Ceylon Crunch',
  description: 'We Deliver Across Sri Lanka. Learn about our delivery areas, dispatch times, delivery charges, and island-wide coverage.',
}

export default async function DeliveryInformationPage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}
  const whatsappNumber = (footer.social?.whatsapp || footer.contact_phone || '+94779443867').replace(/\D/g, '')

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '50px 24px 100px' }}>

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
          DELIVERY INFORMATION
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          We Deliver Across Sri Lanka.
        </h1>
        <p style={{
          fontSize: 18,
          color: 'var(--ink-soft)',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          We carefully pack every order before it leaves us.
        </p>
      </div>

      {/* ── 2. CORE INFORMATION SECTIONS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>

        {/* DELIVERY AREAS */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={iconBadgeStyle}>
              <IconPin size={24} color="var(--green)" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={sectionHeadingStyle}>DELIVERY AREAS</h2>
              <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, marginBottom: 8 }}>
                Island-wide delivery is available.
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                We proudly deliver to all 25 districts across Sri Lanka — from Colombo and the Western Province to Kandy, Galle, Jaffna, Batticaloa, and everywhere in between. Every package is sealed in protective food-grade packaging.
              </p>
            </div>
          </div>
        </div>

        {/* DELIVERY TIME */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={iconBadgeStyle}>
              <IconTruck size={24} color="var(--green)" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={sectionHeadingStyle}>DELIVERY TIME</h2>
              <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, marginBottom: 8 }}>
                Orders are normally dispatched within 1-2 working days.
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 6 }}>
                Delivery time may vary depending on your location and courier service.
              </p>
              <div style={{
                marginTop: 12,
                padding: '12px 18px',
                background: 'var(--cream)',
                borderRadius: 12,
                fontSize: 13,
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
              }}>
                • <strong>Colombo & Suburbs:</strong> Usually delivered within 1–2 working days after dispatch.<br />
                • <strong>Outstation Locations:</strong> Usually delivered within 2–4 working days after dispatch.
              </div>
            </div>
          </div>
        </div>

        {/* DELIVERY CHARGES */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={iconBadgeStyle}>
              <IconBox size={24} color="var(--green)" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={sectionHeadingStyle}>DELIVERY CHARGES</h2>
              <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, marginBottom: 8 }}>
                Delivery charges are calculated according to your delivery location and order.
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                Standard delivery within Sri Lanka is calculated transparently during checkout (typically Rs. 350 for standard orders). Free delivery promotions are automatically applied when order minimums are met.
              </p>
            </div>
          </div>
        </div>

        {/* IMPORTANT NOTICE */}
        <div style={{
          ...cardStyle,
          background: '#fffdf8',
          border: '1.5px solid #ebd9bd',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ ...iconBadgeStyle, background: '#fdf3e2' }}>
              <IconShield size={24} color="var(--brown)" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ ...sectionHeadingStyle, color: 'var(--brown)' }}>IMPORTANT</h2>
              <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600, marginBottom: 8, lineHeight: 1.6 }}>
                Please make sure your delivery address and contact number are correct when placing your order.
              </p>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                Our courier partners require a working phone number to contact you before doorstep handover.
              </p>
              <p style={{ fontSize: 14, color: 'var(--green-dark)', fontWeight: 600, marginTop: 10 }}>
                For any delivery questions, contact us on WhatsApp.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── 3. CALL TO ACTION ── */}
      <div style={{
        textAlign: 'center',
        padding: '36px 24px',
        background: 'var(--cream-dark)',
        borderRadius: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
          Have Questions About an Upcoming Delivery?
        </h3>
        <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 460, margin: 0 }}>
          Reach out directly to our customer care team on WhatsApp or check your order tracking status.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20have%20a%20delivery%20question.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-primary" style={{ padding: '14px 34px', fontSize: 15, borderRadius: 50 }}>
              CONTACT US
            </button>
          </a>
          <Link href="/track">
            <button className="btn-outline" style={{ padding: '13px 30px', fontSize: 15, borderRadius: 50 }}>
              Track Existing Order
            </button>
          </Link>
        </div>
      </div>

    </main>
  )
}

const cardStyle = {
  background: '#fff',
  borderRadius: 22,
  padding: '32px 30px',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
}

const iconBadgeStyle = {
  width: 50,
  height: 50,
  borderRadius: 14,
  background: 'var(--cream-dark)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const sectionHeadingStyle = {
  fontFamily: 'Playfair Display,serif',
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--green-dark)',
  marginBottom: 8,
  letterSpacing: '0.02em',
}
