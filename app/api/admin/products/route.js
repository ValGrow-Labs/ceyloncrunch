import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (search) query = query.ilike('name', `%${search}%`)
  if (category && category !== 'All') query = query.eq('category', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
