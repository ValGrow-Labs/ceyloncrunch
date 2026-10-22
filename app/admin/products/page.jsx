import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import AdminProductsClient from './AdminProductsClient'
import { isDevBypass, SAMPLE_PRODUCTS } from '@/lib/mock-data'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  let products = []
  try {
    const supabase = await createClient()
    const res = await supabase.from('products').select('*').order('created_at', { ascending: false })
    products = res?.data || []
  } catch {}

  if ((!products || products.length === 0) && isDevBypass()) {
    products = SAMPLE_PRODUCTS
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products?.length || 0} products total`}
        action={
          <Link href="/admin/products/new">
            <button style={{ padding: '10px 22px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Add Product
            </button>
          </Link>
        }
      />
      <AdminProductsClient initialProducts={products || []} />
    </div>
  )
}
