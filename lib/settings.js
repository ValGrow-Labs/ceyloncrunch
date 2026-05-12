import { createClient } from './supabase-server'

export async function getAllSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error || !data) return {}
  return Object.fromEntries(data.map(({ key, value }) => [key, value]))
}

export async function getSetting(key) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return data?.value ?? null
}
