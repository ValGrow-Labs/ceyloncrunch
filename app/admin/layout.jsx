import { createClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import '../globals.css'

export const metadata = { title: 'Admin — Ceylon Crunch' }

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page renders its own full-page layout — no sidebar needed
  if (!user) {
    return (
      <div style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', minHeight: '100vh' }}>
        {children}
      </div>
    )
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', background: '#f4f4f5', minHeight: '100vh' }}>
      <AdminSidebar profile={profile} />
      <div className="admin-content" style={{ marginLeft: 240, minHeight: '100vh' }}>
        <AdminTopBar profile={profile} />
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
