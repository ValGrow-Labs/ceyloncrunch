import { createClient } from '@/lib/supabase-server'
import { getAllSettings } from '@/lib/settings'
import ShopClient from '@/components/storefront/ShopClient'

export const metadata = { title: 'Shop — Ceylon Crunch' }

export default async function ShopPage() {
  const [supabase, settings] = await Promise.all([createClient(), getAllSettings()])
  const { data: products } = await supabase.from('products').select('*').eq('active', true).order('name')

  const branding = settings.branding || {}

  return (
    <main className="page-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>The Collection</p>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--green-dark)' }}>Every Product, Every Batch</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12, maxWidth: 500, fontWeight: 300, lineHeight: 1.7 }}>Chosen for character, not quantity. Nothing is here by accident.</p>
      </div>
      <ShopClient products={products || []} />
    </main>
  )
}
