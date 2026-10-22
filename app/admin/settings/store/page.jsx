import { getSetting } from '@/lib/settings'
import StoreClient from './StoreClient'
import PageHeader from '@/components/admin/PageHeader'
export const metadata = { title: 'Store — Settings' }
export default async function StorePage() {
  const store = await getSetting('store') || {}
  return <div><PageHeader title="Store Settings" subtitle="Currency, minimum order and tax" /><StoreClient initial={store} /></div>
}
