import { createClient } from './supabase-server'
import { FALLBACK_SETTINGS } from './fallback-data'

async function withTimeout(promise, ms = 1500) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

export async function getAllSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await withTimeout(supabase.from('site_settings').select('key, value'))
    if (error || !data || data.length === 0) return FALLBACK_SETTINGS
    const dbSettings = Object.fromEntries(data.map(({ key, value }) => [key, value]))
    return { ...FALLBACK_SETTINGS, ...dbSettings }
  } catch {
    return FALLBACK_SETTINGS
  }
}

export async function getSetting(key) {
  try {
    const supabase = await createClient()
    const { data } = await withTimeout(
      supabase.from('site_settings').select('value').eq('key', key).single()
    )
    return data?.value ?? FALLBACK_SETTINGS[key] ?? null
  } catch {
    return FALLBACK_SETTINGS[key] ?? null
  }
}
