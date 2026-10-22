import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import TeamClient from './TeamClient'
import { isDevBypass, SAMPLE_MEMBERS } from '@/lib/mock-data'

export const metadata = { title: 'Team — Admin' }

export default async function TeamPage() {
  const bypass = isDevBypass()
  let user = null
  let profile = null
  let members = []

  if (!bypass) {
    try {
      const supabase = await createClient()
      const authRes = await supabase.auth.getUser()
      user = authRes?.data?.user
      if (user?.id) {
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        profile = prof
      }
      const { data: mems } = await supabase.from('profiles').select('id, full_name, role, active, created_at').order('created_at', { ascending: true })
      members = mems || []
    } catch {}
  }

  if ((!members || members.length === 0) && bypass) {
    members = SAMPLE_MEMBERS
  }

  const currentUserId = user?.id || 'dev-admin'
  const isSuperAdmin = profile?.role === 'super_admin' || bypass

  return (
    <div>
      <PageHeader title="Team" subtitle="Manage admin users and permissions" />
      <TeamClient members={members || []} currentUserId={currentUserId} isSuperAdmin={isSuperAdmin} />
    </div>
  )
}
