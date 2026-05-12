import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getAllSettings } from '@/lib/settings'
import ProductCard from '@/components/storefront/ProductCard'
import ProductDetailClient from '@/components/storefront/ProductDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, description').eq('slug', slug).single()
  if (!data) return { title: 'Product Not Found — Ceylon Crunch' }
  return { title: `${data.name} — Ceylon Crunch`, description: data.description?.slice(0, 160) }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const [supabase, settings] = await Promise.all([createClient(), getAllSettings()])
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (!product) notFound()

  const { data: related } = await supabase.from('products').select('*')
    .eq('active', true).eq('category', product.category).neq('id', product.id).limit(4)

  const store = settings.store || {}
  const currency = store.currency_symbol || store.currency || 'LKR'

  return (
    <main className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--muted)', marginBottom: 36, alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--green)' }}>Home</Link>
        <span>/</span>
        <Link href="/shop" style={{ color: 'var(--green)' }}>Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <ProductDetailClient product={product} currency={currency} />

      {/* Related products */}
      {related?.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 28 }}>From the Same Category</h2>
          <div className="prod-grid" style={{ gap: 24 }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </main>
  )
}
