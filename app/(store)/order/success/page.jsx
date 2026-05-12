import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export const metadata = { title: 'Order Confirmed — Ceylon Crunch' }

export default async function OrderSuccessPage({ searchParams }) {
  const id = searchParams?.id
  const method = searchParams?.method
  let order = null

  if (id) {
    const supabase = await createClient()
    const { data } = await supabase.from('orders').select('*').eq('id', id).single()
    order = data
  }

  const isBankTransfer = method === 'bank_transfer' || order?.payment_method === 'bank_transfer'
  const isCOD = method === 'cod' || order?.payment_method === 'cod'

  return (
    <main style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ marginBottom: 32 }}>
        <svg width={72} height={72} viewBox="0 0 72 72" fill="none" style={{ margin: '0 auto 24px' }}>
          <circle cx="36" cy="36" r="36" fill="var(--green)" />
          <polyline points="22,36 32,46 52,26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 36, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          Thank you for choosing Ceylon Crunch. Your order has been received.
        </p>
      </div>

      {order && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'left' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Order Reference</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', fontFamily: 'monospace', marginBottom: 16 }}>
            #{order.id.slice(-8).toUpperCase()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <span style={{ color: 'var(--muted)' }}>Total</span>
            <span style={{ fontWeight: 700 }}>LKR {order.total?.toLocaleString()}</span>
          </div>
        </div>
      )}

      {isBankTransfer && (
        <div style={{ background: 'var(--cream-dark)', borderRadius: 20, padding: 28, marginBottom: 28, textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>Next Step: Send Payment Slip</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            Please complete your bank transfer and WhatsApp or email us the payment slip with your order reference. Your order will be processed once payment is confirmed.
          </p>
        </div>
      )}

      {isCOD && (
        <div style={{ background: 'var(--cream-dark)', borderRadius: 20, padding: 28, marginBottom: 28, textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 12 }}>Cash on Delivery</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            Please have the exact amount ready when your order arrives. You'll receive a confirmation call before delivery.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/shop"><button className="btn-primary">Continue Shopping</button></Link>
        <Link href={`/track?id=${id}`}><button className="btn-outline">Track Order</button></Link>
      </div>
    </main>
  )
}
