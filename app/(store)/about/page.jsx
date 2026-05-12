import Link from 'next/link'
import { getAllSettings } from '@/lib/settings'
import { iconByName } from '@/components/storefront/Icons'

export const metadata = { title: 'Our Story — Ceylon Crunch' }

export default async function AboutPage() {
  const settings = await getAllSettings()
  const about = settings.about_page || {}

  const sections = about.sections || [
    { icon: 'leaf',  title: 'How It Started',  text: 'Long before machines, discounts, and mass packing, nuts in Sri Lanka were handled slowly — grown by familiar hands, dried under open skies, traded with pride, and shared with respect.' },
    { icon: 'pin',   title: 'Our Farmers',     text: 'Across the island, there are still growers who know when a nut is ready without checking a calendar. We work with them directly — no brokers, no commodity chains.' },
    { icon: 'box',   title: 'Our Process',     text: 'We source only what we are proud to put our name on. Never rushed, never mixed, never hidden behind flavors or polish.' },
    { icon: 'check', title: 'Our Promise',     text: 'This is not a snack for everywhere. It is for moments that matter. From the land. Handled with care. Shared with intention.' },
  ]

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)', padding: '120px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 20 }}>
            {about.hero_eyebrow || 'The Ceylon Crunch Story'}
          </p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
            {about.hero_headline || 'Some things should still'}<br />
            <em>{about.hero_headline_italic || 'feel earned.'}</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300 }}>
            {about.hero_subtext || 'A brand built for growers who follow seasons and not demand.'}
          </p>
        </div>
      </section>

      {/* Quote */}
      {about.quote && (
        <section style={{ maxWidth: 780, margin: '0 auto', padding: '88px 48px 48px', textAlign: 'center' }}>
          <blockquote style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--green-dark)', lineHeight: 1.75, borderLeft: '4px solid var(--gold)', paddingLeft: 32, textAlign: 'left' }}>
            "{about.quote}"
          </blockquote>
        </section>
      )}

      {/* Story sections */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(460px,1fr))', gap: 40 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: 40, background: '#fff', borderRadius: 24, boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 52, height: 52, background: 'var(--cream-dark)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {iconByName(s.icon, { color: 'var(--green)', size: 24 })}
              </div>
              <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--cream-dark)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>
          {about.cta_headline || 'From the Land. Handled with Care.'}
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.75, fontWeight: 300 }}>
          {about.cta_subtext || 'Shared with intention. Every pack we send carries the patience of the land it came from.'}
        </p>
        <Link href="/shop">
          <button className="btn-primary">{about.cta_label || 'Shop the Collection'}</button>
        </Link>
      </section>
    </main>
  )
}
