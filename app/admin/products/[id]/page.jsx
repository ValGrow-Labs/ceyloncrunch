import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'
import { isDevBypass, SAMPLE_PRODUCTS } from '@/lib/mock-data'

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }) {
  const { id } = await params
  let product = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    product = data
  } catch {}

  if (!product && isDevBypass()) {
    product = SAMPLE_PRODUCTS.find(p => p.id === id || p.slug === id) || null
  }

  if (!product) notFound()

  return (
    <div>
      <PageHeader title={`Edit: ${product.name}`} subtitle={`/${product.slug}`} />
      <ProductForm initial={product} />
    </div>
  )
}
