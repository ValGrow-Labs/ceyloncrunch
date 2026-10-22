import { createClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { isDevBypass } from '@/lib/mock-data'
import '../globals.css'

export const metadata = { title: 'Admin — Ceylon Crunch' }

export default async function AdminLayout({ children }) {
  const bypass = isDevBypass()
  let user = null
  let profile = null

  if (!bypass) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user
      if (user?.id) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        profile = prof
      }
    } catch {}
  }

  const headerList = await headers()
  const pathname = headerList.get('x-pathname') || ''
  const isLoginPage = pathname === '/admin/login'

  // Login page renders its own full-page layout without sidebar when not bypassed
  if (isLoginPage && !bypass && !user) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning style={{ margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {children}
        </body>
      </html>
    )
  }

  const activeProfile = profile || {
    id: user?.id || 'dev-admin',
    full_name: user?.email ? user.email.split('@')[0] : 'Admin (Dev Mode)',
    role: 'super_admin',
    email: user?.email || 'admin@ceyloncrunch.lk',
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', background: '#f4f4f5' }}>
        <AdminSidebar profile={activeProfile} />
        <div className="admin-content" style={{ marginLeft: 240, minHeight: '100vh' }}>
          <AdminTopBar profile={activeProfile} />
          {bypass && (
            <div style={{
              background: '#fffbeb',
              borderBottom: '1px solid #fef3c7',
              color: '#92400e',
              padding: '10px 24px',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 500,
            }}>
              <span>⚡ <strong>Admin Dev Bypass Active</strong>: You are viewing the admin portal in local preview mode without database authentication.</span>
              <span style={{ fontSize: 12, background: '#fde68a', padding: '2px 8px', borderRadius: 4, color: '#78350f' }}>Local Dev</span>
            </div>
          )}
          <div style={{ padding: 24 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
