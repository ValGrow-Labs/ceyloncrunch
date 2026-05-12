'use client'
import { useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'

export default function TeamClient({ members, currentUserId, isSuperAdmin }) {
  const [list, setList] = useState(members)
  const [inviting, setInviting] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'admin' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: 'success' })
  const [resetting, setResetting] = useState(null)

  const showMsg = (text, type = 'success') => setMsg({ text, type })

  const invite = async (e) => {
    e.preventDefault()
    setLoading(true)
    showMsg('')
    const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      showMsg('Invitation sent! They will receive an email with a link to set their password.', 'success')
      setInviting(false)
      setForm({ email: '', full_name: '', role: 'admin' })
    } else {
      showMsg(data.error || 'Failed to invite', 'error')
    }
    setLoading(false)
  }

  const updateMember = async (id, updates) => {
    const res = await fetch('/api/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    if (res.ok) setList(l => l.map(m => m.id === id ? { ...m, ...updates } : m))
    else showMsg('Failed to update member', 'error')
  }

  const sendResetPassword = async (member) => {
    if (!confirm(`Send a password reset email to ${member.full_name || member.id}?`)) return
    setResetting(member.id)
    showMsg('')
    const res = await fetch('/api/team/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: member.email || member.full_name }),
    })
    const data = await res.json()
    if (res.ok) showMsg(`Password reset email sent to ${member.full_name || 'the user'}.`, 'success')
    else showMsg(data.error || 'Failed to send reset email', 'error')
    setResetting(null)
  }

  const deleteMember = async (member) => {
    if (!confirm(`⚠️ Permanently delete "${member.full_name || 'this user'}"?\n\nThis will remove their account completely and cannot be undone.`)) return
    showMsg('')
    const res = await fetch('/api/team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id }),
    })
    const data = await res.json()
    if (res.ok) {
      setList(l => l.filter(m => m.id !== member.id))
      showMsg(`${member.full_name || 'User'} has been permanently deleted.`, 'success')
    } else {
      showMsg(data.error || 'Failed to delete user', 'error')
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {msg.text && (
        <div style={{
          padding: '12px 16px',
          background: msg.type === 'success' ? '#f0fdf4' : '#fff0f0',
          border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
          borderRadius: 10, fontSize: 14,
          color: msg.type === 'success' ? '#166534' : '#dc2626',
        }}>
          {msg.text}
        </div>
      )}

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
              <div style={{ padding: '10px 14px', background: '#f0f7f2', borderRadius: 10, fontSize: 13, color: 'var(--green-dark)' }}>
                ℹ️ They will receive an email with a link to set their own password.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading}
                  style={{ padding: '10px 22px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending...' : 'Send Invitation'}
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
              <tr key={member.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {member.full_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                        {member.full_name || 'Admin'}
                        {member.id === currentUserId && (
                          <span style={{ marginLeft: 8, fontSize: 11, background: '#f0f7f2', color: 'var(--green)', padding: '2px 8px', borderRadius: 50, fontWeight: 600 }}>You</span>
                        )}
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
                    {member.id !== currentUserId ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button onClick={() => updateMember(member.id, { role: member.role === 'admin' ? 'super_admin' : 'admin' })}
                          style={btn('#6d28d9', '#ede9fe')}>
                          {member.role === 'admin' ? 'Make Super' : 'Make Admin'}
                        </button>
                        <button onClick={() => sendResetPassword(member)} disabled={resetting === member.id}
                          style={btn('#d97706', '#fef3c7')}>
                          {resetting === member.id ? '...' : 'Reset Password'}
                        </button>
                        <button onClick={() => updateMember(member.id, { active: !member.active })}
                          style={btn(member.active ? '#b45309' : '#16a34a', member.active ? '#fef3c7' : '#dcfce7')}>
                          {member.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteMember(member)}
                          style={btn('#dc2626', '#fee2e2')}>
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
        <strong style={{ color: '#374151' }}>How password management works:</strong><br />
        • <strong>Invite:</strong> New team members receive an email → click the link → set their own password<br />
        • <strong>Reset Password:</strong> Sends a secure reset email to the team member — they reset it themselves<br />
        • <strong>Deactivate:</strong> Blocks login without deleting — account can be reactivated<br />
        • <strong>Delete:</strong> Permanently removes the account — cannot be undone
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }
const btn = (color, bg) => ({
  padding: '5px 10px', background: bg, color: color,
  border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
})
