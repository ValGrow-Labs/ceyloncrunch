import { createClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminDate from '@/components/admin/AdminDate'
import '../globals.css'

export const metadata = { title: 'Admin — Ceylon Crunch' }

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page renders its own full-page layout — no sidebar needed
  if (!user) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning style={{ margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {children}
        </body>
      </html>
    )
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', background: '#f4f4f5' }}>
        <AdminSidebar profile={profile} />
        <div style={{ marginLeft: 240, minHeight: '100vh' }}>
          {/* Top bar */}
          <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>
              <a href="/" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--green)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                ↗ View Store
              </a>
            </div>
            <AdminDate />
          </div>
          <div style={{ padding: 32 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
