import Link from 'next/link'

export default function Footer({ settings }) {
  const footer = settings?.footer || {}
  const branding = settings?.branding || {}
  const navLinks = settings?.nav_links || []

  return (
    <footer className="footer">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'start', marginBottom: 48 }}>
          <div>
            <img src={branding.logo_url || '/img/logo.png'} alt={branding.site_name || 'Ceylon Crunch'} height="100" style={{ marginBottom: 20 }} />
            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 280, whiteSpace: 'pre-line' }}>
              {footer.tagline || 'Healthy Crunch for Every Home.\nFrom the land. Handled with care. Shared with intention.'}
            </p>
            {footer.social && (
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {footer.social.instagram && (
                  <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>Instagram</a>
                )}
                {footer.social.facebook && (
                  <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>Facebook</a>
                )}
                {footer.social.whatsapp && (
                  <a href={`https://wa.me/${footer.social.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>WhatsApp</a>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 16, fontWeight: 600 }}>Navigation</div>
              {navLinks.map((link) => (
                <div key={link.href} style={{ marginBottom: 10 }}>
                  <Link href={link.href} style={{ fontSize: 14 }}>{link.label}</Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 16, fontWeight: 600 }}>Contact</div>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>
              {footer.contact_email || 'hello@ceyloncrunch.lk'}<br />
              {footer.address || 'Colombo, Sri Lanka'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>{footer.copyright || '© 2020–2026 Ceylon Crunch. All rights reserved.'}</span>
          <span style={{ fontSize: 13, color: '#555' }}>{footer.sub_tagline || 'Crafted with patience. Packed with care.'}</span>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center', borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
          <span style={{ fontSize: 12, color: '#444' }}>
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
