import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions — Ceylon Crunch',
  description: 'Read the terms and conditions governing your use of Ceylon Crunch and the purchase of premium Sri Lankan nuts and snacks.',
}

export default function TermsPage() {
  const sections = [
    {
      title: 'Use of the Website',
      list: [
        'You must be at least 18 years old to use our website or make purchases.',
        'You are responsible for maintaining the confidentiality of your account information, including your username and password.',
        'You agree to provide accurate and current information during the registration and checkout process.',
        'You may not use our website for any unlawful or unauthorized purposes.',
      ],
    },
    {
      title: 'Product Information and Pricing',
      list: [
        'We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee the accuracy or completeness of such information.',
        'All prices are listed in Sri Lankan Rupees (LKR) unless otherwise specified.',
        'Prices are subject to change without notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms.',
      ],
    },
    {
      title: 'Orders and Payments',
      list: [
        'By placing an order on our website, you are making an offer to purchase the selected products.',
        'We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraudulent activity.',
        'You agree to provide valid payment information and authorize us to charge the total order amount, including applicable taxes and shipping fees.',
        'We accept payments via PayHere (credit/debit cards), bank transfer, and cash on delivery (COD).',
        'We use PayHere as our trusted third-party payment processor to handle your payment information securely. We do not store your full payment details.',
      ],
    },
    {
      title: 'Shipping and Delivery',
      list: [
        'We provide island-wide delivery across Sri Lanka and will make reasonable efforts to ensure timely shipping.',
        'Shipping and delivery times provided are estimates and may vary based on your location and other factors.',
        'Shipping fees are calculated based on your delivery zone and order value. Orders above the free shipping threshold qualify for free delivery.',
      ],
    },
    {
      title: 'Returns and Refunds',
      content: 'Our Returns and Refund Policy governs the process and conditions for returning products and seeking refunds.',
      cta: { label: 'View Refund Policy', href: '/refund-policy' },
    },
    {
      title: 'Intellectual Property',
      list: [
        'All content and materials on ceyloncrunch.lk, including text, images, logos, and graphics, are protected by intellectual property rights and are the property of Ceylon Crunch or its licensors.',
        'You may not use, reproduce, distribute, or modify any content from our website without our prior written consent.',
      ],
    },
    {
      title: 'Limitation of Liability',
      list: [
        'In no event shall Ceylon Crunch, its directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our website or the purchase of our products.',
        'We make no warranties or representations, express or implied, regarding the quality, accuracy, or suitability of the products offered on our website.',
      ],
    },
    {
      title: 'Amendments and Termination',
      content: 'We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions about these Terms and Conditions, please contact us.',
      contact: true,
    },
  ]

  return (
    <main>
      <section style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)', padding: '120px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 20 }}>Legal</p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
            Terms & <em>Conditions</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300 }}>
            Please read these terms carefully before using ceyloncrunch.lk.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '48px 48px 0' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>Last updated: June 7, 2026</p>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '24px 48px 0' }}>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300, textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          Welcome to Ceylon Crunch. These Terms and Conditions govern your use of ceyloncrunch.lk and the purchase of products from our platform. By accessing and using our website, you agree to comply with these terms.
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '32px 48px 88px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: '36px 40px', background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--brown)' }}>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14 }}>{s.title}</h2>
              {s.content && <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300 }}>{s.content}</p>}
              {s.list && (
                <ol style={{ marginTop: s.content ? 14 : 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, fontWeight: 300 }}>{item}</li>
                  ))}
                </ol>
              )}
              {s.cta && (
                <div style={{ marginTop: 16 }}>
                  <Link href={s.cta.href}><button className="btn-outline" style={{ padding: '10px 24px', fontSize: 14 }}>{s.cta.label}</button></Link>
                </div>
              )}
              {s.contact && (
                <div style={{ marginTop: 20, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a href="mailto:ceyloncrunch26@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'var(--green)', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Email Us</a>
                  <a href="https://wa.me/94779443867" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#25D366', color: '#fff', borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>WhatsApp</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--cream-dark)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>Ready to shop?</h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.75, fontWeight: 300 }}>Browse our collection of premium Sri Lankan nuts and healthy snacks.</p>
        <Link href="/shop"><button className="btn-primary">Shop the Collection</button></Link>
      </section>
    </main>
  )
}
