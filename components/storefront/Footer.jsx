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
              <div style={{ display: 'flex', gap: 14, marginTop: 20, alignItems: 'center' }}>
                {footer.social.whatsapp && (
                  <a href={`https://wa.me/${footer.social.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                    style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: '50%', background: '#25D366', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </a>
                )}
                {footer.social.instagram && (
                  <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {footer.social.facebook && (
                  <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: '50%', background: '#1877F2', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {footer.social.tiktok && (
                  <a href={footer.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                    style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: '50%', background: '#000', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z"/></svg>
                  </a>
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
              {footer.contact_email || 'ceyloncrunch26@gmail.com'}<br />
              {footer.contact_phone || '+94 77 944 3867'}<br />
              {footer.address || 'Colombo, Sri Lanka'}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>{footer.copyright || '© 2026 Ceylon Crunch. All rights reserved.'}</span>
          <span style={{ fontSize: 13, color: '#555' }}>{footer.sub_tagline || 'Handled with Care'}</span>
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
