import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import FaqAccordionClient from '@/components/storefront/FaqAccordionClient'

export const metadata = {
  title: 'Frequently Asked Questions — Ceylon Crunch',
  description: 'Find answers to frequently asked questions about Ceylon Crunch ordering, island-wide delivery, product sizes, storage, and bulk orders.',
}

export default async function FaqPage() {
  const settings = await getAllSettings()
  const footer = settings.footer || {}
  const whatsappNumber = (footer.social?.whatsapp || footer.contact_phone || '+94779443867').replace(/\D/g, '')

  const faqs = [
    {
      q: 'How can I place an order?',
      a: 'You can order directly through our website. You can also contact us through WhatsApp for assistance.',
    },
    {
      q: 'Do you deliver across Sri Lanka?',
      a: 'Yes. We offer island-wide delivery.',
    },
    {
      q: 'What sizes are available?',
      a: 'Available sizes depend on the product. Common sizes include 100g, 250g and 500g.',
    },
    {
      q: 'How should I store my products?',
      a: 'Store products in a cool, dry place away from direct sunlight. Once opened, keeping them properly sealed helps maintain freshness.',
    },
    {
      q: 'How long will my order take?',
      a: 'Delivery times depend on your location and courier service. You will receive relevant order and delivery updates.',
    },
    {
      q: 'Can I place a bulk order?',
      a: 'Yes. Contact us for corporate, event, wedding, gifting and other bulk requirements.',
    },
    {
      q: 'Can I customise a hamper?',
      a: 'Yes. Contact us with your requirements and we\'ll let you know what options are available.',
    },
    {
      q: 'Do you accept returns?',
      a: 'Please refer to our Returns & Refunds Policy for details.',
      link: {
        text: 'Returns & Refunds Policy',
        href: '/refund-policy',
      },
    },
    {
      q: 'How can I contact Ceylon Crunch?',
      a: 'You can contact us through WhatsApp, phone, email or our social media pages.',
    },
  ]

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '50px 24px 100px' }}>

      {/* ── 1. PAGE HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 10,
        }}>
          HELP &amp; SUPPORT
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(30px, 4.8vw, 46px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p style={{
          fontSize: 16,
          color: 'var(--muted)',
          maxWidth: 580,
          margin: '0 auto',
          lineHeight: 1.65,
        }}>
          Everything you need to know about our products, ordering process, delivery times, and customized orders.
        </p>
      </div>

      {/* ── 2. ACCORDION FAQ ── */}
      <div style={{ marginBottom: 56 }}>
        <FaqAccordionClient faqs={faqs} />
      </div>

      {/* ── 3. STILL HAVE QUESTIONS CTA ── */}
      <div style={{
        background: 'var(--cream-dark)',
        borderRadius: 24,
        padding: '38px 28px',
        textAlign: 'center',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--green-dark)',
          marginBottom: 8,
        }}>
          Still Have a Question?
        </h3>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6 }}>
          We&apos;re here to assist you anytime. Chat with us directly on WhatsApp or drop us an email.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 34px', fontSize: 15, borderRadius: 50 }}>
              CONTACT US
            </button>
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi%20Ceylon%20Crunch,%20I%20have%20a%20question.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-outline" style={{ padding: '13px 30px', fontSize: 15, borderRadius: 50 }}>
              Chat on WhatsApp
            </button>
          </a>
        </div>
      </div>

    </main>
  )
}
