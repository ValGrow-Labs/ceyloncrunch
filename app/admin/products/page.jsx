import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import StatusBadge from '@/components/admin/StatusBadge'
import AdminProductsClient from './AdminProductsClient'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

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
