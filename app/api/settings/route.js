import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { isDevBypass } from '@/lib/mock-data'
import { getAllSettings, setLocalDevSetting } from '@/lib/settings'

export async function GET() {
  const all = await getAllSettings()
  return NextResponse.json(all)
}

export async function PATCH(request) {
  const bypass = isDevBypass()
  let user = null
  if (!bypass) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user
    } catch {}
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { key, value } = body
  if (!key || value === undefined) return NextResponse.json({ error: 'key and value required' }, { status: 400 })

  setLocalDevSetting(key, value)

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('site_settings')
      .upsert([{ key, value }], { onConflict: 'key' }).select().single()
    if (!error && data) return NextResponse.json(data)
  } catch {}

  if (bypass) {
    return NextResponse.json({ key, value, success: true })
  }

  return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
}

export async function PUT(request) {
  const bypass = isDevBypass()
  let user = null
  if (!bypass) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user
    } catch {}
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = await request.json()
  Object.entries(updates).forEach(([key, value]) => setLocalDevSetting(key, value))

  try {
    const supabase = await createClient()
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    if (!error) return NextResponse.json({ success: true })
  } catch {}

  if (bypass) {
    return NextResponse.json({ success: true, dev_mock: true })
  }

  return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
}
