import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'

export const metadata = {
  title: 'Privacy Policy — Ceylon Crunch',
  description: 'Your Privacy Matters. Learn how Ceylon Crunch protects and uses your information responsibly.',
}

export default async function PrivacyPolicyPage() {
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
          Your Privacy Matters.
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          lineHeight: 1.25,
          margin: 0,
        }}>
          PRIVACY POLICY
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
          <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, margin: 0 }}>
            We respect your privacy and take reasonable steps to protect the information you provide when using our website or placing an order.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Information We Collect</h2>
          <p style={{ margin: 0 }}>
            Information may include your name, contact number, email address and delivery details.
          </p>
          <p style={{ marginTop: 12, margin: 0, color: 'var(--muted)', fontSize: 14 }}>
            This information is collected when you place an order, contact our support team, or register an account with us.
          </p>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>How We Use Your Information</h2>
          <p style={{ margin: 0 }}>
            We use this information to process orders, arrange delivery, communicate with customers and improve our services.
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            <li>Ensuring accurate doorstep delivery with our courier partners.</li>
            <li>Providing order confirmation, status updates, and dispatch notifications.</li>
            <li>Responding to your customer service questions and inquiries.</li>
          </ul>
        </section>

        <section>
          <h2 style={sectionHeadingStyle}>Information Protection &amp; Sharing</h2>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--green-dark)' }}>
            We do not sell your personal information.
          </p>
          <p style={{ marginTop: 8, margin: 0 }}>
            Your details are shared solely with operational partners strictly necessary to fulfill your purchases (such as delivery couriers).
          </p>
        </section>

        <section style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={sectionHeadingStyle}>Contact Us</h2>
          <p style={{ margin: 0 }}>
            For questions regarding your information, please contact us at{' '}
            <a href={`mailto:${email}`} style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'underline' }}>
              {email}
            </a>.
          </p>
        </section>

      </div>

      {/* Simple Footer Link */}
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
