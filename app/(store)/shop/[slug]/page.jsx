import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getAllSettings } from '@/lib/settings'
import ProductDetailClient from '@/components/storefront/ProductDetailClient'
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data'

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

export async function generateMetadata({ params }) {
  const { slug } = await params
  let product = null

  try {
    const supabase = await createClient()
    const { data } = await withTimeout(
      supabase.from('products').select('name, description').eq('slug', slug).single()
    )
    product = data
  } catch {}

  if (!product) {
    product = FALLBACK_PRODUCTS.find(p => p.slug === slug)
  }

  if (!product) return { title: 'Product Not Found — Ceylon Crunch' }
  return { title: `${product.name} — Ceylon Crunch`, description: product.description?.slice(0, 160) }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const settings = await getAllSettings()
  let product = null
  let related = []

  try {
    const supabase = await createClient()
    const { data } = await withTimeout(
      supabase.from('products').select('*').eq('slug', slug).single()
    )
    product = data
    if (product) {
      const { data: rel } = await withTimeout(
        supabase.from('products').select('*')
          .eq('active', true).eq('category', product.category).neq('id', product.id).limit(4)
      )
      related = rel || []
    }
  } catch {}

  if (!product) {
    product = FALLBACK_PRODUCTS.find(p => p.slug === slug)
    if (product) {
      related = FALLBACK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
      if (related.length === 0) {
        related = FALLBACK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4)
      }
    }
  }

  if (!product) notFound()

  const store = settings.store || {}
  const currency = store.currency_symbol || store.currency || 'Rs.'

  return (
    <main className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px clamp(16px, 4vw, 48px) 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--muted)', marginBottom: 32, alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--green)' }}>Home</Link>
        <span>/</span>
        <Link href="/shop" style={{ color: 'var(--green)' }}>Shop</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </div>

      <ProductDetailClient product={product} currency={currency} related={related} />
    </main>
  )
}
