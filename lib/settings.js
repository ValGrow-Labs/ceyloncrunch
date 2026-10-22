import { createClient } from './supabase-server'
import { DEFAULT_SETTINGS } from './mock-data'

// In-memory runtime override for settings saved in dev bypass mode
const localSettingsOverride = {}

export function setLocalDevSetting(key, value) {
  localSettingsOverride[key] = value
}

export async function getAllSettings() {
  const fallback = { ...DEFAULT_SETTINGS, ...localSettingsOverride }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (error || !data || data.length === 0) return fallback
    const dbSettings = Object.fromEntries(data.map(({ key, value }) => [key, value]))
    return { ...fallback, ...dbSettings }
  } catch {
    return fallback
  }
}

export async function getSetting(key) {
  if (localSettingsOverride[key] !== undefined) {
    return localSettingsOverride[key]
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()
    if (!error && data?.value !== undefined) return data.value
  } catch {}
  return DEFAULT_SETTINGS[key] ?? null
}
