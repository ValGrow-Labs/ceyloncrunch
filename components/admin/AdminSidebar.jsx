'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const nav = [
  { label: 'Dashboard',  href: '/admin',                   icon: '▦' },
  { label: 'Orders',     href: '/admin/orders',            icon: '📦' },
  { label: 'Products',   href: '/admin/products',          icon: '🥜' },
  { label: 'Newsletter', href: '/admin/newsletter',        icon: '✉' },
  { label: 'Team',       href: '/admin/team',              icon: '👥' },
  { label: '─────', href: null, icon: '' },
  { label: 'Branding',   href: '/admin/settings/branding',     icon: '🎨' },
  { label: 'Theme',      href: '/admin/settings/theme',        icon: '🖌' },
  { label: 'Hero',       href: '/admin/settings/hero',         icon: '🖼' },
  { label: 'Homepage',   href: '/admin/settings/homepage',     icon: '🏠' },
  { label: 'Navigation', href: '/admin/settings/navigation',   icon: '🔗' },
  { label: 'Footer',     href: '/admin/settings/footer',       icon: '📄' },
  { label: 'Payments',   href: '/admin/settings/payments',     icon: '💳' },
  { label: 'Delivery',   href: '/admin/settings/delivery',     icon: '🚚' },
  { label: 'Store',      href: '/admin/settings/store',        icon: '🏪' },
  { label: 'Announcement', href: '/admin/settings/announcement', icon: '📢' },
  { label: 'SEO',        href: '/admin/settings/seo',          icon: '🔍' },
]

export default function AdminSidebar({ profile }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href) => {
    if (!href) return false
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: '#111', display: 'flex',
      flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #222' }}>
        <Link href="/admin">
          <img src="/img/logo.png" alt="Ceylon Crunch" style={{ height: 52, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        </Link>
        <div style={{ fontSize: 11, color: '#555', marginTop: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Portal</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {nav.map((item, i) => {
          if (!item.href) return (
            <div key={i} style={{ padding: '4px 20px', fontSize: 11, color: '#333', userSelect: 'none', marginTop: 4 }}>SETTINGS</div>
          )
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? '#fff' : '#888',
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#ccc' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#888' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Profile + logout */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {profile?.full_name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ccc' }}>{profile?.full_name || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#555', textTransform: 'capitalize' }}>{profile?.role?.replace('_', ' ') || 'admin'}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: '100%', padding: '9px', background: '#1a1a1a', color: '#888', border: '1px solid #222', borderRadius: 8, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#888' }}>
          Sign Out
        </button>
        <div style={{ marginTop: 12, fontSize: 11, color: '#333', textAlign: 'center' }}>
          <a href="https://valgrowlabs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#444' }}>ValGrow Labs</a>
        </div>
      </div>
    </aside>
  )
}
