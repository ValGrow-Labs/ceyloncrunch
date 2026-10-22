import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/PageHeader'
import NewsletterClient from './NewsletterClient'
import { isDevBypass, SAMPLE_SUBSCRIBERS } from '@/lib/mock-data'

export const metadata = { title: 'Newsletter — Admin' }

export default async function NewsletterPage() {
  let subscribers = []
  try {
    const supabase = await createClient()
    const res = await supabase.from('newsletter').select('*').order('created_at', { ascending: false })
    subscribers = res?.data || []
  } catch {}

  if ((!subscribers || subscribers.length === 0) && isDevBypass()) {
    subscribers = SAMPLE_SUBSCRIBERS
  }

  return (
    <div>
      <PageHeader title="Newsletter" subtitle={`${subscribers?.filter(s => s.active).length || 0} active subscribers`} />
      <NewsletterClient subscribers={subscribers || []} />
    </div>
  )
}
