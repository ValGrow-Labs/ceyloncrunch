import { createClient } from '@/lib/supabase-server'
import ShopClient from '@/components/storefront/ShopClient'
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data'

export const metadata = {
  title: 'Shop Our Collection — Ceylon Crunch',
  description: 'Explore our full range of carefully selected nuts, dried fruits, dates, seeds and wholesome snacks.',
}

async function withTimeout(promise, ms = 1500) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

export default async function ShopPage() {
  let products = FALLBACK_PRODUCTS
  try {
    const supabase = await createClient()
    const { data } = await withTimeout(
      supabase.from('products').select('*').eq('active', true).order('name')
    )
    if (data && data.length > 0) {
      products = data
    }
  } catch {
    // Graceful fallback to seeded products
  }

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '40px clamp(16px, 4vw, 40px) 96px' }}>
      <ShopClient products={products} />
    </main>
  )
}
