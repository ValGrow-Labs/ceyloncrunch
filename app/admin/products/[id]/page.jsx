import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) notFound()

  return (
    <div>
      <PageHeader title={`Edit: ${product.name}`} subtitle={`/${product.slug}`} />
      <ProductForm initial={product} />
    </div>
  )
}
