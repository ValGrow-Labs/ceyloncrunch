import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { generatePayHereHash } from '@/lib/payhere'
import { getSetting } from '@/lib/settings'

export async function POST(request) {
  const body = await request.formData()
  const data = Object.fromEntries(body.entries())

  // Credentials come exclusively from admin dashboard (site_settings)
  const paymentSettings = await getSetting('payments')
  const secret = paymentSettings?.payhere?.secret
  const merchantId = paymentSettings?.payhere?.merchant_id

  if (secret && merchantId) {
    const expectedHash = generatePayHereHash({
      merchantId,
      orderId: data.order_id,
      amount: data.payhere_amount,
      currency: data.payhere_currency,
      secret,
    })
    if (data.md5sig?.toUpperCase() !== expectedHash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  const statusCode = parseInt(data.status_code)
  let status = 'pending'
  if (statusCode === 2)  status = 'paid'
  if (statusCode === 0)  status = 'pending'
  if (statusCode === -1) status = 'cancelled'
  if (statusCode === -2) status = 'failed'

  const supabase = await createAdminClient()
  await supabase.from('orders').update({
    status,
    payment_id: data.payment_no || null,
  }).eq('id', data.order_id)

  return NextResponse.json({ received: true })
}
