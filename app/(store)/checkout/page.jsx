import { getAllSettings } from '@/lib/settings'
import CheckoutClient from '@/components/storefront/CheckoutClient'

export const metadata = {
  title: 'Checkout — Ceylon Crunch',
  description: 'Enter your details below so we can prepare and deliver your Ceylon Crunch order.',
}

export default async function CheckoutPage() {
  const settings = await getAllSettings()

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 90px' }}>
      {/* Checkout Page Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          Almost There.
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(30px, 4vw, 44px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          letterSpacing: '-0.02em',
          marginBottom: 10,
        }}>
          CHECKOUT
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 640 }}>
          Enter your details below so we can prepare and deliver your order.
        </p>
      </div>

      <CheckoutClient paymentSettings={settings.payments} deliverySettings={settings.delivery} />
    </main>
  )
}
