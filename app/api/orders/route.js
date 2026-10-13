import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { buildPayHerePayload } from '@/lib/payhere'
import { getSetting } from '@/lib/settings'
import { createOrder } from '@/lib/orders'

export async function GET(request) {
  try {
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
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      district,
      items,
      subtotal,
      delivery,
      payment_method,
      notes,
    } = body

    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items?.length) {
      return NextResponse.json({ error: 'Missing required order details.' }, { status: 400 })
    }

    // PayHere validation if chosen
    if (payment_method === 'payhere') {
      const paymentSettings = await getSetting('payments')
      const ph = paymentSettings?.payhere
      if (!ph?.enabled || !ph?.merchant_id || !ph?.secret) {
        return NextResponse.json({
          error: 'Online Card Payment is currently being set up. Please select Cash on Delivery or Bank Transfer.'
        }, { status: 400 })
      }
    }

    // Resilient order creation (Supabase + memory fallback)
    const order = await createOrder({
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city: city || 'Colombo',
      district: district || 'Colombo',
      items,
      subtotal,
      delivery,
      payment_method: payment_method || 'cod',
      notes,
    })

    // If PayHere is enabled and configured
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
          return NextResponse.json({
            ...order,
            paymentUrl: payment.checkoutUrl,
            paymentData: payment.payload,
          })
        }
      }
    }

    return NextResponse.json(order)
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: err.message || 'Failed to place order.' }, { status: 500 })
  }
}
