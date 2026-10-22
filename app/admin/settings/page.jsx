import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'

const SETTINGS_SECTIONS = [
  { href: '/admin/settings/branding',     icon: '🎨', title: 'Branding',       desc: 'Logo, site name, tagline, established year' },
  { href: '/admin/settings/theme',        icon: '🖌', title: 'Theme & Colors', desc: 'Edit all brand colors — green, brown, gold, cream' },
  { href: '/admin/settings/hero',         icon: '🖼', title: 'Hero Section',   desc: 'Homepage hero headline, subtext, CTAs, background image' },
  { href: '/admin/settings/homepage',     icon: '🏠', title: 'Homepage',       desc: 'Features strip, bestsellers section, categories, about strip, newsletter section' },
  { href: '/admin/settings/navigation',   icon: '🔗', title: 'Navigation',     desc: 'Add, remove, or reorder navbar links' },
  { href: '/admin/settings/footer',       icon: '📄', title: 'Footer',         desc: 'Contact info, social links, copyright text' },
  { href: '/admin/settings/payments',     icon: '💳', title: 'Payments',       desc: 'Enable/disable PayHere, Cash on Delivery, Bank Transfer' },
  { href: '/admin/settings/delivery',     icon: '🚚', title: 'Delivery',       desc: 'Delivery fees, free delivery threshold, delivery zones' },
  { href: '/admin/settings/store',        icon: '🏪', title: 'Store',          desc: 'Currency, minimum order, tax rate' },
  { href: '/admin/settings/announcement', icon: '📢', title: 'Announcement Bar', desc: 'Top-of-page banner with custom message and link' },
  { href: '/admin/settings/seo',          icon: '🔍', title: 'SEO',            desc: 'Default meta title, description, OG image' },
]

export const metadata = { title: 'Settings — Admin' }

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Customize every aspect of your store" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
        {SETTINGS_SECTIONS.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
