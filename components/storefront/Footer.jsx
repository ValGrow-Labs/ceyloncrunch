import Link from 'next/link'

export default function Footer({ settings }) {
  const footer = settings?.footer || {}
  const branding = settings?.branding || {}

  const shopLinks = [
    { label: 'All Products', href: '/shop' },
    { label: 'Nuts', href: '/shop?category=Nuts' },
    { label: 'Dried Fruits', href: '/shop?category=Dried+Fruits' },
    { label: 'Dates', href: '/shop?category=Dates' },
    { label: 'Seeds', href: '/shop?category=Seeds' },
    { label: 'Spices', href: '/shop?category=Spices' },
    { label: 'Healthy Snacks', href: '/shop?category=Healthy+Snacks' },
    { label: 'Gifts & Hampers', href: '/gifting' },
  ]

  const companyLinks = [
    { label: 'Our Story', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'FAQs', href: '/faq' },
  ]

  const helpLinks = [
    { label: 'Delivery Information', href: '/delivery-information' },
    { label: 'Returns & Refunds', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  ]

  const whatsappNumber = footer.social?.whatsapp || footer.contact_phone || '+94779443867'
  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '')
  const emailAddress = footer.contact_email || 'ceyloncrunch26@gmail.com'

  const instagramHandle = footer.social?.instagram ? `@${footer.social.instagram.replace('@', '')}` : '@ceyloncrunch'
  const facebookPage = footer.social?.facebook || 'Ceylon Crunch'
  const tiktokHandle = footer.social?.tiktok ? `@${footer.social.tiktok.replace('@', '')}` : '@ceyloncrunch'

  return (
    <footer className="footer" id="contact">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid">

          {/* ── Brand info ── */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
              <img
                src={branding.logo_url || '/img/logo.png'}
                alt={branding.site_name || 'Ceylon Crunch'}
                style={{ height: 110, width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              CEYLON CRUNCH
            </div>
            <p style={{ fontSize: 13, color: 'var(--gold-light)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
              From Nature to Your Doorstep.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: '#999', maxWidth: 280 }}>
              Quality nuts, dried fruits, dates, seeds and more — carefully selected and delivered across Sri Lanka.
            </p>
          </div>

          {/* ── SHOP ── */}
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: 18, fontWeight: 700 }}>
              Shop
            </div>
            {shopLinks.map((link) => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                <Link href={link.href} style={{ fontSize: 13, color: '#ccc', transition: 'color 0.2s' }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* ── COMPANY ── */}
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: 18, fontWeight: 700 }}>
              Company
            </div>
            {companyLinks.map((link) => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                <Link href={link.href} style={{ fontSize: 13, color: '#ccc', transition: 'color 0.2s' }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* ── HELP ── */}
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: 18, fontWeight: 700 }}>
              Help
            </div>
            {helpLinks.map((link) => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                <Link href={link.href} style={{ fontSize: 13, color: '#ccc', transition: 'color 0.2s' }}>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* ── FOLLOW US & CONTACT ── */}
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: 18, fontWeight: 700 }}>
              Follow Us
            </div>

            {/* Social channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#ccc' }}>
                <strong style={{ color: '#fff' }}>Instagram:</strong>{' '}
                <span style={{ color: 'var(--gold-light)' }}>{instagramHandle}</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc' }}>
                <strong style={{ color: '#fff' }}>Facebook:</strong>{' '}
                <span style={{ color: 'var(--gold-light)' }}>{facebookPage}</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc' }}>
                <strong style={{ color: '#fff' }}>TikTok:</strong>{' '}
                <span style={{ color: 'var(--gold-light)' }}>{tiktokHandle}</span>
              </div>
            </div>

            {/* Direct contact */}
            <div style={{ borderTop: '1px solid #282828', paddingTop: 14 }}>
              <div style={{ fontSize: 13, color: '#ccc', marginBottom: 6 }}>
                <strong style={{ color: '#fff' }}>WhatsApp:</strong>{' '}
                <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                  {footer.contact_phone || '+94 77 944 3867'}
                </a>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', marginBottom: 16 }}>
                <strong style={{ color: '#fff' }}>Email:</strong>{' '}
                <a href={`mailto:${emailAddress}`} style={{ color: '#ccc', textDecoration: 'none' }}>
                  {emailAddress}
                </a>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi%20Ceylon%20Crunch`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  background: '#25D366',
                  color: '#fff',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>

          </div>
        </div>

        {/* ── Bottom copyright ── */}
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#aaa' }}>© 2026 Ceylon Crunch. All Rights Reserved.</span>
          <span style={{ fontSize: 13, color: 'var(--gold-light)' }}>From Nature to Your Doorstep.</span>
        </div>

        <div style={{ marginTop: 14, textAlign: 'center', borderTop: '1px solid #1a1a1a', paddingTop: 14 }}>
          <span style={{ fontSize: 12, color: '#555' }}>
            Designed & Developed by{' '}
            <a href="https://valgrowlabs.com" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.02em' }}>
              ValGrow Labs
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
