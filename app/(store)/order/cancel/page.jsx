import Link from 'next/link'

export const metadata = { title: 'Payment Cancelled — Ceylon Crunch' }

export default function OrderCancelPage({ searchParams }) {
  const id = searchParams?.id
  return (
    <main style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ marginBottom: 32 }}>
        <svg width={72} height={72} viewBox="0 0 72 72" fill="none" style={{ margin: '0 auto 24px' }}>
          <circle cx="36" cy="36" r="36" fill="#f39c12" />
          <line x1="36" y1="22" x2="36" y2="42" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="36" cy="50" r="2.5" fill="#fff" />
        </svg>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 34, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Payment Cancelled</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
          Your payment was not completed. Your order has been saved — you can retry checkout below.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/checkout"><button className="btn-primary">Retry Checkout</button></Link>
        <Link href="/shop"><button className="btn-outline">Continue Shopping</button></Link>
      </div>
    </main>
  )
}
