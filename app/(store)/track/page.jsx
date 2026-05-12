export const metadata = { title: 'Track Order — Ceylon Crunch' }

export default function TrackPage() {
  return (
    <main className="page-pad" style={{ maxWidth: 800, margin: '0 auto', padding: '100px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: 'var(--green-dark)' }}>Track Your Order</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12 }}>Enter your order ID and billing email to check its status.</p>
      </div>
      <TrackForm />
    </main>
  )
}

function TrackForm() {
  'use client'
  return (
    <form action="/api/orders/track" method="GET"
      style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', padding: 40, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Order ID</label>
        <input name="id" type="text" required placeholder="e.g. a1b2c3d4-..." className="search-input" style={{ background: '#f9f9f9' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Billing Email</label>
        <input name="email" type="email" required placeholder="email@example.com" className="search-input" style={{ background: '#f9f9f9' }} />
      </div>
      <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '16px', marginTop: 10, fontSize: 16 }}>
        Track Status
      </button>
    </form>
  )
}
