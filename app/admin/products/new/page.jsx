import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Add Product — Admin' }

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="Add Product" subtitle="Create a new product listing" />
      <ProductForm />
    </div>
  )
}
