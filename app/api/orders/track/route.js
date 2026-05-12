import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const email = searchParams.get('email')

  if (!id || !email) return NextResponse.json({ error: 'Order ID and email required' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase.from('orders').select('id, status, total, created_at, payment_method, city, customer_name')
    .eq('id', id).eq('customer_email', email).single()

  if (error || !data) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(data)
}
