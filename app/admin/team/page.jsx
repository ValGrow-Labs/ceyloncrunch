import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import TeamClient from './TeamClient'

export const metadata = { title: 'Team — Admin' }

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { data: members } = await supabase.from('profiles').select('id, full_name, role, active, created_at').order('created_at', { ascending: true })

  return (
    <div>
      <PageHeader title="Team" subtitle="Manage admin users and permissions" />
      <TeamClient members={members || []} currentUserId={user.id} isSuperAdmin={profile?.role === 'super_admin'} />
    </div>
  )
}
