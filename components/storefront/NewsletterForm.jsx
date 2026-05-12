'use client'
import { useState } from 'react'

export default function NewsletterForm({ buttonLabel = 'Subscribe' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
      if (res.ok) setEmail('')
    } catch { setStatus('error') }
  }

  if (status === 'done') return (
    <div style={{ textAlign: 'center', color: 'var(--gold-light)', fontSize: 16, fontWeight: 500 }}>
      ✓ You're subscribed. Thank you.
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        style={{ flex: 1, minWidth: 220, padding: '13px 22px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 50, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
      <button type="submit" disabled={status === 'loading'}
        style={{ padding: '13px 28px', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
        {status === 'loading' ? '...' : buttonLabel}
      </button>
      {status === 'error' && <p style={{ width: '100%', textAlign: 'center', color: '#fca5a5', fontSize: 13 }}>Something went wrong. Try again.</p>}
    </form>
  )
}
