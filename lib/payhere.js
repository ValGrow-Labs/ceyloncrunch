import crypto from 'crypto'

export function generatePayHereHash({ merchantId, orderId, amount, currency, secret }) {
  const str = `${merchantId}${orderId}${amount}${currency}${secret}`
  return crypto.createHash('sha256').update(str).digest('hex').toUpperCase()
}

// All PayHere credentials come from site_settings (admin dashboard), never from env vars.
export function buildPayHerePayload({ order, appUrl, merchantId, secret, sandbox }) {
  if (!merchantId || !secret) return null

  const baseUrl = sandbox ? 'https://sandbox.payhere.lk' : 'https://www.payhere.lk'
  const amount = order.total.toFixed(2)
  const currency = 'LKR'
  const hash = generatePayHereHash({ merchantId, orderId: order.id, amount, currency, secret })

  return {
    checkoutUrl: `${baseUrl}/pay/checkout`,
    payload: {
      merchant_id: merchantId,
      return_url: `${appUrl}/order/success?id=${order.id}`,
      cancel_url: `${appUrl}/order/cancel?id=${order.id}`,
      notify_url: `${appUrl}/api/orders/webhook`,
      order_id: order.id,
      items: `Ceylon Crunch Order #${order.id.slice(-8).toUpperCase()}`,
      currency,
      amount,
      hash,
      first_name: order.customer_name.split(' ')[0] || order.customer_name,
      last_name: order.customer_name.split(' ').slice(1).join(' ') || '',
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.shipping_address,
      city: order.city || 'Colombo',
      country: 'Sri Lanka',
      custom_1: order.id,
    },
  }
}
