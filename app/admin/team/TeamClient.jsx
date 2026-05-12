'use client'
import { useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'

export default function TeamClient({ members, currentUserId, isSuperAdmin }) {
  const [list, setList] = useState(members)
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'admin' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const invite = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) { setMsg('Invitation sent! They will receive an email to set their password.'); setInviting(false); setForm({ email: '', full_name: '', role: 'admin' }) }
    else setMsg(data.error || 'Failed to invite')
    setLoading(false)
  }

  const updateMember = async (id, updates) => {
    const res = await fetch('/api/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    if (res.ok) setList(l => l.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {msg && <div style={{ padding: '12px 16px', background: msg.includes('sent') ? '#f0fdf4' : '#fff0f0', border: `1px solid ${msg.includes('sent') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 10, fontSize: 14, color: msg.includes('sent') ? '#166534' : '#dc2626' }}>{msg}</div>}

      {/* Invite form */}
      {isSuperAdmin && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          {!inviting ? (
            <button onClick={() => setInviting(true)}
              style={{ padding: '10px 22px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Invite Team Member
            </button>
          ) : (
            <form onSubmit={invite} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 4 }}>Invite New Admin</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required style={inputStyle} placeholder="Jane Silva"
                    onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={inputStyle} placeholder="jane@ceyloncrunch.lk"
                    onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading}
                  style={{ padding: '10px 22px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {loading ? 'Sending…' : 'Send Invitation'}
                </button>
                <button type="button" onClick={() => setInviting(false)}
                  style={{ padding: '10px 20px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Members table */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{list.length} Team Members</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Name', 'Role', 'Status', 'Joined', isSuperAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(member => (
              <tr key={member.id} style={{ borderTop: '1px solid #f3f4f6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {member.full_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                        {member.full_name || 'Admin'}
                        {member.id === currentUserId && <span style={{ marginLeft: 8, fontSize: 11, background: '#f0f7f2', color: 'var(--green)', padding: '2px 8px', borderRadius: 50, fontWeight: 600 }}>You</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={member.role} /></td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={member.active ? 'active' : 'inactive'} /></td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af' }}>
                  {new Date(member.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                {isSuperAdmin && (
                  <td style={{ padding: '14px 16px' }}>
                    {member.id !== currentUserId && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => updateMember(member.id, { role: member.role === 'admin' ? 'super_admin' : 'admin' })}
                          style={{ padding: '5px 10px', background: '#ede9fe', color: '#6d28d9', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          {member.role === 'admin' ? 'Make Super' : 'Make Admin'}
                        </button>
                        <button onClick={() => updateMember(member.id, { active: !member.active })}
                          style={{ padding: '5px 10px', background: member.active ? '#fee2e2' : '#dcfce7', color: member.active ? '#991b1b' : '#166534', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          {member.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }
