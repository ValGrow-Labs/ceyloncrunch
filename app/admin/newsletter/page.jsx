import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import NewsletterClient from './NewsletterClient'

export const metadata = { title: 'Newsletter — Admin' }

export default async function NewsletterPage() {
  const supabase = await createClient()
  const { data: subscribers } = await supabase.from('newsletter').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader title="Newsletter" subtitle={`${subscribers?.filter(s => s.active).length || 0} active subscribers`} />
      <NewsletterClient subscribers={subscribers || []} />
    </div>
  )
}
