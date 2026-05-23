'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { IconCart, IconMenu, IconX } from './Icons'

export default function Navbar() {
  const { itemCount, setDrawerOpen } = useCart()
  const settings = useSettings()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const branding = settings.branding || {}
  const navLinks = settings.nav_links || [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Our Story', href: '/about' },
    { label: 'Track Order', href: '/track' },
  ]

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <nav className="navbar">
        <Link href="/">
          <img
            src={branding.logo_url || '/img/logo.png'}
            alt={branding.site_name || 'Ceylon Crunch'}
            className="nav-logo"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              style={{
                fontSize: 15,
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? 'var(--green)' : 'var(--ink-soft)',
                borderBottom: isActive(link.href) ? '2px solid var(--green)' : '2px solid transparent',
                paddingBottom: 2,
                transition: 'all 0.2s',
              }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative', padding: 8 }}>
            <IconCart color="var(--ink)" />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--green)', color: '#fff',
                fontSize: 11, fontWeight: 700, width: 20, height: 20,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 0.4s ease',
              }}>{itemCount}</span>
            )}
          </button>

          {/* Mobile menu button */}
          <button className="show-mobile-only" onClick={() => setMobileOpen(o => !o)} style={{ padding: 8 }}>
            {mobileOpen ? <IconX color="var(--ink)" /> : <IconMenu color="var(--ink)" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 80, left: 0, right: 0, zIndex: 800,
          background: 'rgba(250,246,239,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)', padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '14px 0', fontSize: 18, fontWeight: 500,
                color: isActive(link.href) ? 'var(--green)' : 'var(--ink)',
                borderBottom: '1px solid var(--border)',
              }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
