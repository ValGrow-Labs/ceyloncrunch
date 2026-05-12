import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request, { params }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const supabase = await createClient()

  let query = supabase.from('orders').select('*, order_items(*)').eq('id', id)
  if (email) query = query.eq('customer_email', email)

  const { data, error } = await query.single()
  if (error || !data) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase.from('orders').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
