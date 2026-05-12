'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => { window.location.href = '/admin/login' }, 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/img/logo.png" alt="Ceylon Crunch" style={{ height: 72, margin: '0 auto 20px' }} />
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, fontWeight: 700, color: 'var(--green-dark)' }}>Reset Your Password</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>Enter your new password below</p>
        </div>

        {done ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, color: 'var(--green-dark)', marginBottom: 8 }}>Password updated!</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: 18 }}>
              <label style={lStyle}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="Min. 8 characters"
                style={iStyle} onFocus={e => e.target.style.borderColor='var(--green)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={lStyle}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required placeholder="Re-enter password"
                style={iStyle} onFocus={e => e.target.style.borderColor='var(--green)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const lStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }
const iStyle = { width: '100%', padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
