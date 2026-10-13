'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { IconCart, IconMenu, IconX, IconSearch, IconUser } from './Icons'

export default function Navbar() {
  const { itemCount, setDrawerOpen, isHydrated } = useCart()
  const settings = useSettings()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const branding = settings.branding || {}
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Gifting', href: '/gifting' },
    { label: 'Corporate', href: '/corporate' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('#')) return false
    return pathname.startsWith(href.split('?')[0])
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setMobileOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 900 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={branding.logo_url || '/img/logo.png'}
            alt={branding.site_name || 'Ceylon Crunch'}
            className="nav-logo"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              style={{
                fontSize: 15,
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? 'var(--green)' : 'var(--ink-soft)',
                borderBottom: isActive(link.href) ? '2px solid var(--green)' : '2px solid transparent',
                paddingBottom: 4,
                transition: 'all 0.2s',
              }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right-side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(o => !o)}
            aria-label="Search"
            style={{
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-soft)',
              transition: 'background 0.2s',
            }}
            title="Search products"
          >
            <IconSearch size={20} color="var(--ink)" />
          </button>

          {/* Account */}
          <Link
            href="/admin/login"
            className="hide-mobile"
            aria-label="Account"
            title="Account & Admin"
            style={{
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)',
            }}
          >
            <IconUser size={20} color="var(--ink)" />
          </Link>

          {/* Cart */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Cart"
            style={{ position: 'relative', padding: 8, display: 'flex', alignItems: 'center' }}
          >
            <IconCart color="var(--ink)" />
            {isHydrated && itemCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--green)', color: '#fff',
                fontSize: 11, fontWeight: 700, width: 20, height: 20,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 0.4s ease',
              }}>{itemCount}</span>
            )}
          </button>

          {/* Shop Now CTA */}
          <Link href="/shop" className="hide-mobile" style={{ marginLeft: 6 }}>
            <button
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: 13, letterSpacing: '0.02em', borderRadius: 50 }}
            >
              Shop Now
            </button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="show-mobile-only"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle Menu"
            style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {mobileOpen ? <IconX color="var(--ink)" size={24} /> : <IconMenu color="var(--ink)" size={24} />}
          </button>
        </div>
      </nav>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div style={{
          background: 'var(--cream)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          animation: 'fadeUp 0.25s ease',
          position: 'sticky',
          top: 96,
          zIndex: 890,
        }}>
          <form onSubmit={handleSearchSubmit} style={{ maxWidth: 700, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <IconSearch size={18} color="var(--muted)" />
              </span>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search nuts, dried fruits, seeds..."
                style={{
                  width: '100%',
                  padding: '12px 18px 12px 46px',
                  borderRadius: 50,
                  border: '1.5px solid var(--border)',
                  background: '#fff',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              style={{ padding: '8px 12px', fontSize: 14, color: 'var(--muted)', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 80, left: 0, right: 0, bottom: 0, zIndex: 850,
          background: 'rgba(250,246,239,0.99)', backdropFilter: 'blur(16px)',
          padding: '20px 24px 40px',
          display: 'flex', flexDirection: 'column', gap: 6,
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Mobile search form */}
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <IconSearch size={16} color="var(--muted)" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  borderRadius: 50,
                  border: '1.5px solid var(--border)',
                  background: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </form>

          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '14px 0',
                fontSize: 17,
                fontWeight: 500,
                color: isActive(link.href) ? 'var(--green)' : 'var(--ink)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {link.label}
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>→</span>
            </Link>
          ))}

          {/* Cart link on mobile */}
          <Link
            href="/cart"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '14px 0',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--green-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconCart size={18} color="var(--green)" />
              Your Cart
            </span>
            <span style={{
              background: 'var(--green)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 20,
            }}>
              {isHydrated ? itemCount : 0} item{(isHydrated ? itemCount : 0) !== 1 ? 's' : ''}
            </span>
          </Link>

          {/* Account link on mobile */}
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '14px 0',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--ink-soft)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <IconUser size={18} color="var(--muted)" />
            Account & Admin Portal
          </Link>

          {/* Mobile CTA */}
          <div style={{ marginTop: 24 }}>
            <Link href="/shop" onClick={() => setMobileOpen(false)} style={{ display: 'block' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px' }}>
                Shop All Products
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
