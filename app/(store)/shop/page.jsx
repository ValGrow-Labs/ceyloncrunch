import { createClient } from '@/lib/supabase-server'
import ShopClient from '@/components/storefront/ShopClient'

export const metadata = { title: 'Shop — Ceylon Crunch' }

export default async function ShopPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').eq('active', true).order('name')

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>The Collection</p>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,4vw,46px)', fontWeight: 700, color: 'var(--green-dark)' }}>Every Product, Every Batch</h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 10, maxWidth: 500, fontWeight: 300, lineHeight: 1.7 }}>Chosen for character, not quantity. Nothing is here by accident.</p>
      </div>
      <ShopClient products={products || []} />
    </main>
  )
}
