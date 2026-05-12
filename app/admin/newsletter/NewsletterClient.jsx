'use client'
import { useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'

export default function NewsletterClient({ subscribers }) {
  const [list, setList] = useState(subscribers)
  const [search, setSearch] = useState('')

  const filtered = list.filter(s => s.email.toLowerCase().includes(search.toLowerCase()))
  const active = list.filter(s => s.active).length

  const toggle = async (sub) => {
    const res = await fetch('/api/newsletter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sub.email, active: !sub.active }),
    })
    if (res.ok) setList(l => l.map(s => s.id === sub.id ? { ...s, active: !s.active } : s))
  }

  const exportCSV = () => {
    const rows = [['Email', 'Status', 'Joined'], ...list.filter(s => s.active).map(s => [s.email, s.active ? 'Active' : 'Unsubscribed', new Date(s.created_at).toLocaleDateString()])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[['Total', list.length, '📧'], ['Active', active, '✅'], ['Unsubscribed', list.length - active, '🚫']].map(([l, v, i]) => (
          <div key={l} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 24 }}>{i}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#111', fontFamily: 'Playfair Display,serif' }}>{v}</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          <button onClick={exportCSV}
            style={{ padding: '9px 18px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ↓ Export CSV
          </button>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} results</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Email', 'Status', 'Joined', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} style={{ borderTop: '1px solid #f3f4f6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 16px', fontSize: 14, color: '#111' }}>{sub.email}</td>
                <td style={{ padding: '13px 16px' }}><StatusBadge status={sub.active ? 'active' : 'inactive'} /></td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#9ca3af' }}>{new Date(sub.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td style={{ padding: '13px 16px' }}>
                  <button onClick={() => toggle(sub)}
                    style={{ padding: '5px 12px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: sub.active ? '#fee2e2' : '#dcfce7', color: sub.active ? '#991b1b' : '#166534' }}>
                    {sub.active ? 'Unsubscribe' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>No subscribers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
