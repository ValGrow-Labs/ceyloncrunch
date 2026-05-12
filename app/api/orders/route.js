import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { buildPayHerePayload } from '@/lib/payhere'
import { getSetting } from '@/lib/settings'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()
  const { customer_name, customer_email, customer_phone, shipping_address, city, items, subtotal, delivery, payment_method, notes } = body

  if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const total = subtotal + delivery

  const { data: order, error } = await supabase.from('orders').insert([{
    customer_name, customer_email, customer_phone,
    shipping_address, city: city || 'Colombo',
    items: JSON.stringify(items),
    subtotal, delivery, total,
    payment_method: payment_method || 'cod',
    notes: notes || null,
    status: 'pending',
  }]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insert order items
  if (items?.length) {
    await supabase.from('order_items').insert(
      items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        name: i.name,
        price: i.price,
        variant: i.variant || 'Standard',
        quantity: i.qty,
      }))
    )
  }

  // PayHere — credentials come exclusively from admin dashboard (site_settings)
  if (payment_method === 'payhere') {
    const paymentSettings = await getSetting('payments')
    const ph = paymentSettings?.payhere

    if (ph?.enabled && ph?.merchant_id && ph?.secret) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ceyloncrunch.lk'
      const payment = buildPayHerePayload({
        order,
        appUrl,
        merchantId: ph.merchant_id,
        secret: ph.secret,
        sandbox: ph.sandbox !== false,
      })

      if (payment) {
        await supabase.from('orders').update({ payment_url: payment.checkoutUrl }).eq('id', order.id)
        return NextResponse.json({ ...order, paymentUrl: payment.checkoutUrl, paymentData: payment.payload })
      }
    }

    // PayHere enabled by customer but not configured by admin yet
    return NextResponse.json({ error: 'Online payment is not configured. Please choose Cash on Delivery or Bank Transfer.' }, { status: 400 })
  }

  return NextResponse.json(order)
}
