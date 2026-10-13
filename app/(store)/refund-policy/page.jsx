import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'

export const metadata = {
  title: 'Returns & Refunds — Ceylon Crunch',
  description: 'Our Approach to returns and refunds. Transparent food-safety and order resolution policies for Ceylon Crunch.',
}

export default async function ReturnsRefundsPage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}
  const email = footer.contact_email || 'ceyloncrunch26@gmail.com'
  const whatsappNumber = (footer.social?.whatsapp || footer.contact_phone || '+94779443867').replace(/\D/g, '')

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 100px' }}>

      {/* ── Document Header ── */}
      <header style={{ marginBottom: 40, borderBottom: '1px solid var(--border)', paddingBottom: 28 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Our Approach
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          lineHeight: 1.25,
          margin: 0,
        }}>
          RETURNS &amp; REFUNDS
        </h1>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
          Last updated: October 2026
        </div>
      </header>

      {/* ── Document Content ── */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '36px 32px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        fontSize: 15,
        lineHeight: 1.85,
        color: 'var(--ink-soft)',
      }}>

        <section>
          <h2 style={sectionHeadingStyle}>Food Safety &amp; Returns</h2>
          <p style={{ margin: 0 }}>
            Because our products are food items, returns are subject to food-safety considerations.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Damaged, Incorrect or Defective Orders</h2>
          <p style={{ margin: 0 }}>
            If you receive an incorrect, damaged or defective product, please contact us as soon as possible with your order details and photographs where applicable.
          </p>
          <p style={{ marginTop: 12, margin: 0 }}>
            We will review the issue and provide an appropriate solution.
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={sectionHeadingStyle}>Order Inquiries</h2>
          <p style={{ margin: 0, marginBottom: 16 }}>
            For questions about a specific order, contact us through{' '}
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20have%20an%20order%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'underline' }}
            >
              WhatsApp
            </a>{' '}
            or{' '}
            <a href={`mailto:${email}`} style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'underline' }}>
              {email}
            </a>.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20have%20an%20order%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                background: '#25D366',
                color: '#fff',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Chat on WhatsApp
            </a>
            <a
              href={`mailto:${email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                background: 'var(--cream-dark)',
                color: 'var(--ink)',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid var(--border)',
              }}
            >
              Email Customer Care
            </a>
          </div>
        </section>

      </div>

      {/* Simple Back Link */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Back to Ceylon Crunch Home
        </Link>
      </div>

    </main>
  )
}

const sectionHeadingStyle = {
  fontFamily: 'Playfair Display,serif',
  fontSize: 18,
  fontWeight: 700,
  color: 'var(--green-dark)',
  marginBottom: 8,
}
