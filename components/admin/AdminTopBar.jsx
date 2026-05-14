'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AdminDate from './AdminDate'

export default function AdminTopBar({ profile }) {
  const router = useRouter()

  const handleLogout = async () => {
    if (!confirm('Sign out of the admin panel?')) return
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, gap: 12 }}>
      <a href="/" target="_blank" rel="noopener noreferrer"
        style={{ color: 'var(--green)', fontWeight: 500, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
        ↗ View Store
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AdminDate />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: '1px solid #e5e7eb' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
            {profile?.full_name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ display: 'none' }} className="show-on-tablet">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{profile?.full_name || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{profile?.role?.replace('_', ' ') || 'admin'}</div>
          </div>
        </div>

        <button onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fca5a5'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#991b1b' }}>
          ⎋ Sign Out
        </button>
      </div>
    </div>
  )
}
