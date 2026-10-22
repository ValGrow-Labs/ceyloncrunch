import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { generateWebhookHash } from '@/lib/payhere'
import { getSetting } from '@/lib/settings'

export async function POST(request) {
  // PayHere sends application/x-www-form-urlencoded, not JSON
  const body = await request.formData()
  const data = Object.fromEntries(body.entries())

  const paymentSettings = await getSetting('payments')
  const secret     = paymentSettings?.payhere?.secret
  const merchantId = paymentSettings?.payhere?.merchant_id

  // Verify md5sig checksum — must match before updating order
  if (secret && merchantId) {
    const expectedHash = generateWebhookHash({
      merchantId,
      orderId:    data.order_id,
      amount:     data.payhere_amount,
      currency:   data.payhere_currency,
      statusCode: data.status_code,
      secret,
    })
    if (data.md5sig?.toUpperCase() !== expectedHash) {
      console.error('PayHere webhook: invalid md5sig', { received: data.md5sig, expected: expectedHash })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  // Map PayHere status codes to our order statuses
  const statusCode = parseInt(data.status_code)
  let status = null
  if (statusCode === 2)  status = 'paid'
  if (statusCode === 0)  status = 'pending'
  if (statusCode === -1) status = 'cancelled'
  if (statusCode === -2) status = 'failed'
  if (statusCode === -3) status = 'cancelled' // chargedback

  if (status) {
    const supabase = await createAdminClient()
    await supabase.from('orders').update({
      status,
      payment_id: data.payment_id || data.payment_no || null,
    }).eq('id', data.order_id)
  }

  // PayHere expects a 200 OK — always return it
  return new Response('OK', { status: 200 })
}
