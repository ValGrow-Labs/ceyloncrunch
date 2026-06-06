import Link from 'next/link'

export const metadata = {
  title: 'Refund Policy — Ceylon Crunch',
  description: 'Read our refund and return policy. Ceylon Crunch is committed to your satisfaction with every order of premium Sri Lankan nuts and healthy snacks.',
}

export default function RefundPolicyPage() {
  const sections = [
    {
      title: 'Returns',
      content: 'We accept returns within 7 days from the date of delivery. To be eligible for a return, your item must be unused, unopened, and in the same condition that you received it. It must also be in the original packaging. Please note that due to the perishable nature of our products, we can only accept returns for items that are properly sealed and have not been tampered with.',
    },
    {
      title: 'Refunds',
      content: 'Once we receive your return and inspect the item, we will notify you of the status of your refund via email or WhatsApp. If your return is approved, we will initiate a refund to your original method of payment — whether that is PayHere, bank transfer, or cash on delivery (COD). Please note that the refund amount will exclude any shipping charges incurred during the initial purchase.',
    },
    {
      title: 'Exchanges',
      content: 'If you would like to exchange your item for a different variant, size, or product, please contact our customer support team within 7 days of receiving your order. We will provide you with further instructions on how to proceed with the exchange, subject to product availability.',
    },
    {
      title: 'Non-Returnable Items',
      content: 'Certain items are non-returnable and non-refundable. These include:',
      list: [
        'Gift vouchers and promotional codes',
        'Personalized or custom-made gift packs',
        'Perishable goods that have been opened or consumed',
        'Products with broken seals or tampered packaging',
      ],
    },
    {
      title: 'Damaged or Defective Items',
      content: 'In the unfortunate event that your item arrives damaged or defective, please contact us immediately via WhatsApp at +94 77 944 3867 or email us at ceyloncrunch26@gmail.com. Include photos of the damaged product and packaging. We will arrange for a replacement or issue a full refund, depending on your preference and product availability.',
    },
    {
      title: 'Return Shipping',
      content: 'You will be responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g., wrong item shipped, defective product). In such cases, we will arrange a pickup or provide you with a prepaid shipping solution for island-wide returns within Sri Lanka.',
    },
    {
      title: 'Processing Time',
      content: 'Refunds and exchanges will be processed within 5–7 business days after we receive your returned item. For PayHere payments, please note that it may take an additional 3–5 business days for the refund to appear in your account, depending on your bank or payment provider. COD refunds will be processed via bank transfer to your nominated account.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions or concerns regarding our refund policy, please reach out to our customer support team. We are here to assist you and ensure your experience with Ceylon Crunch is enjoyable and hassle-free.',
      contact: true,
    },
  ]

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)', padding: '120px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 20 }}>
            Customer Satisfaction
          </p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
            Refund <em>Policy</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300 }}>
            Your satisfaction matters to us. If something isn't right, we'll make it right.
          </p>
        </div>
      </section>

      {/* Last updated */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '48px 48px 0' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          Last updated: June 7, 2026
        </p>
      </section>

      {/* Sections */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '32px 48px 88px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: '36px 40px', background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--green)' }}>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14 }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300 }}>{s.content}</p>
              {s.list && (
                <ul style={{ marginTop: 14, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, fontWeight: 300 }}>{item}</li>
                  ))}
                </ul>
              )}
              {s.contact && (
                <div style={{ marginTop: 20, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a href="mailto:ceyloncrunch26@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'var(--green)', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}>
                    Email Us
                  </a>
                  <a href="https://wa.me/94779443867" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#25D366', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}>
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--cream-dark)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>
          Shop with confidence.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.75, fontWeight: 300 }}>
          Every product is packed with care and backed by our satisfaction guarantee.
        </p>
        <Link href="/shop">
          <button className="btn-primary">Shop the Collection</button>
        </Link>
      </section>
    </main>
  )
}
