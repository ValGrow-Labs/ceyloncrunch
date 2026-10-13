import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'

export const metadata = {
  title: 'Terms & Conditions — Ceylon Crunch',
  description: 'Website Terms. Read the terms and conditions governing the use of the Ceylon Crunch website and order placement.',
}

export default async function TermsPage() {
  const settings = await getAllSettings()
  const email = settings.footer?.contact_email || 'ceyloncrunch26@gmail.com'

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
          Website Terms
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          lineHeight: 1.25,
          margin: 0,
        }}>
          TERMS &amp; CONDITIONS
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
          <h2 style={sectionHeadingStyle}>Acceptance of Terms</h2>
          <p style={{ margin: 0 }}>
            By using the Ceylon Crunch website, you agree to use the website responsibly and provide accurate information when placing an order.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Pricing &amp; Product Availability</h2>
          <p style={{ margin: 0 }}>
            Product availability, prices and offers may change without prior notice.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Product Information &amp; Packaging</h2>
          <p style={{ margin: 0 }}>
            We make reasonable efforts to ensure that product information and images are accurate. However, packaging, appearance and availability may occasionally vary.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Order Confirmation</h2>
          <p style={{ margin: 0 }}>
            Orders are subject to product availability and confirmation.
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={sectionHeadingStyle}>Questions &amp; Contact</h2>
          <p style={{ margin: 0 }}>
            For questions regarding these terms, please contact us at{' '}
            <a href={`mailto:${email}`} style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'underline' }}>
              {email}
            </a>.
          </p>
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
