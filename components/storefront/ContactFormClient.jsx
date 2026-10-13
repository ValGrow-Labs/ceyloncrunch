'use client'
import { useState } from 'react'

export default function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    // Construct WhatsApp message or confirm submission
    const text = encodeURIComponent(
      `Hello Ceylon Crunch,\n\nName: ${form.name}\nPhone: ${form.phone || 'N/A'}\nEmail: ${form.email || 'N/A'}\nMessage: ${form.message}`
    )
    window.open(`https://wa.me/94779443867?text=${text}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        background: '#f0f7f2',
        border: '1.5px solid #cce5d4',
        borderRadius: 20,
        padding: '36px 28px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--green)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 22,
        }}>
          ✓
        </div>
        <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>
          Thank You!
        </h3>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          We&apos;ve opened your message in WhatsApp. Our team will get back to you shortly during business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-outline"
          style={{ marginTop: 20, fontSize: 13, padding: '8px 20px' }}
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      borderRadius: 22,
      padding: '32px 28px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>
        Send Us a Message
      </h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: -6, marginBottom: 8 }}>
        Fill out the form below to reach us immediately on WhatsApp or email.
      </p>

      <div>
        <label style={labelStyle}>Your Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Priyantha Jayasuriya"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="077 xxx xxxx"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="priyantha@example.com"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Message / Inquiry *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="How can we assist you with our products or your order?"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '14px',
          fontSize: 15,
          fontWeight: 700,
          borderRadius: 14,
          marginTop: 6,
        }}
      >
        Send Message via WhatsApp →
      </button>
    </form>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--ink-soft)',
  marginBottom: 6,
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 12,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  boxSizing: 'border-box',
}
