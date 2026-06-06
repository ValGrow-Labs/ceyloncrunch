import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Ceylon Crunch',
  description: 'Learn how Ceylon Crunch collects, uses, and safeguards your personal information.',
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'When you visit our website, we may collect certain information about you, including:',
      list: [
        'Personal identification information (name, email, phone number, delivery address) provided during registration or checkout.',
        'Payment and billing information necessary to process your orders, securely handled by PayHere. We do not store your full card details.',
        'Order information, including items purchased, order history, and delivery preferences.',
        'Browsing information such as your IP address, browser type, and device information, collected automatically using cookies.',
      ],
    },
    {
      title: 'Use of Information',
      content: 'We may use the collected information for the following purposes:',
      list: [
        'To process and fulfill your orders, including shipping and island-wide delivery.',
        'To communicate with you regarding your purchases and provide customer support via email and WhatsApp.',
        'To personalize your shopping experience and present relevant product recommendations.',
        'To improve our website, products, and services based on your feedback and browsing patterns.',
        'To send newsletters and promotional content if you have subscribed. You can unsubscribe at any time.',
        'To detect and prevent fraud, unauthorized activities, and abuse of our website.',
      ],
    },
    {
      title: 'Information Sharing',
      content: 'We respect your privacy and do not sell, trade, or transfer your personal information to third parties without your consent, except:',
      list: [
        'Trusted service providers who assist us in operating our website (Supabase), processing payments (PayHere), and delivering products (courier partners). These providers handle your data securely and confidentially.',
        'Legal requirements: We may disclose your information if required by law or in response to valid legal requests under Sri Lankan law.',
      ],
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information. Our platform uses SSL encryption for all data transmissions, and sensitive data is stored securely. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: 'We use cookies to enhance your browsing experience, maintain your shopping cart, and analyze website traffic. You can disable cookies through your browser settings, but this may limit certain features including the ability to complete checkout.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to:',
      list: [
        'Access the personal data we hold about you.',
        'Request correction of any inaccurate personal data.',
        'Request deletion of your personal data, subject to legal obligations.',
        'Unsubscribe from marketing communications at any time.',
      ],
    },
    {
      title: 'Changes to the Privacy Policy',
      content: 'We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised "last updated" date.',
    },
    {
      title: 'Contact Us',
      content: 'If you have any questions regarding our Privacy Policy, please contact us.',
      contact: true,
    },
  ]

  return (
    <main>
      <section style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)', padding: '120px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 20 }}>Your Privacy Matters</p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
            Privacy <em>Policy</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300 }}>
            We are committed to protecting the privacy and security of our customers.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '48px 48px 0' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>Last updated: June 7, 2026</p>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '24px 48px 0' }}>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300, textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          At Ceylon Crunch, we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or make a purchase on ceyloncrunch.lk. By using our website, you consent to the practices described in this policy.
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', padding: '32px 48px 88px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: '36px 40px', background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--gold)' }}>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14 }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300 }}>{s.content}</p>
              {s.list && (
                <ul style={{ marginTop: 14, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, fontWeight: 300 }}>{item}</li>
                  ))}
                </ul>
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
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>Shop with peace of mind.</h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.75, fontWeight: 300 }}>Your data is handled with the same care as our products.</p>
        <Link href="/shop"><button className="btn-primary">Shop the Collection</button></Link>
      </section>
    </main>
  )
}
