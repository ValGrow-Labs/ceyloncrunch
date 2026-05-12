import { getAllSettings } from '@/lib/settings'
import CheckoutClient from '@/components/storefront/CheckoutClient'

export const metadata = { title: 'Checkout — Ceylon Crunch' }

export default async function CheckoutPage() {
  const settings = await getAllSettings()
  return (
    <main className="page-pad" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 8 }}>Secure Checkout</p>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: 'var(--green-dark)' }}>Complete Your Order</h1>
      </div>
      <CheckoutClient paymentSettings={settings.payments} deliverySettings={settings.delivery} />
    </main>
  )
}
