import crypto from 'crypto'

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Checkout hash — for initiating payment:
 * md5(merchantId + orderId + amount + currency + md5(secret).toUpperCase()).toUpperCase()
 */
export function generatePayHereHash({ merchantId, orderId, amount, currency, secret }) {
  const hashedSecret = md5(secret).toUpperCase()
  return md5(`${merchantId}${orderId}${amount}${currency}${hashedSecret}`).toUpperCase()
}

/**
 * Webhook verification hash — includes status_code:
 * md5(merchantId + orderId + amount + currency + statusCode + md5(secret).toUpperCase()).toUpperCase()
 */
export function generateWebhookHash({ merchantId, orderId, amount, currency, statusCode, secret }) {
  const hashedSecret = md5(secret).toUpperCase()
  return md5(`${merchantId}${orderId}${amount}${currency}${statusCode}${hashedSecret}`).toUpperCase()
}

// All PayHere credentials come from site_settings (admin dashboard), never from env vars.
export function buildPayHerePayload({ order, appUrl, merchantId, secret, sandbox }) {
  if (!merchantId || !secret) return null

  const baseUrl = sandbox ? 'https://sandbox.payhere.lk' : 'https://www.payhere.lk'

  // Amount must be formatted as "1000.00" — 2 decimal places, no thousand separators
  const amount = parseFloat(order.total).toFixed(2)
  const currency = 'LKR'
  const hash = generatePayHereHash({ merchantId, orderId: order.id, amount, currency, secret })

  const nameParts = (order.customer_name || '').trim().split(' ')
  const firstName = nameParts[0] || 'Customer'
  const lastName  = nameParts.slice(1).join(' ') || 'N/A'

  return {
    checkoutUrl: `${baseUrl}/pay/checkout`,
    payload: {
      merchant_id:  merchantId,
      return_url:   `${appUrl}/order/success?id=${order.id}`,
      cancel_url:   `${appUrl}/order/cancel?id=${order.id}`,
      notify_url:   `${appUrl}/api/orders/webhook`,
      order_id:     order.id,
      items:        `Ceylon Crunch Order #${order.id.slice(-8).toUpperCase()}`,
      currency,
      amount,
      hash,
      first_name:   firstName,
      last_name:    lastName,
      email:        order.customer_email,
      phone:        order.customer_phone,
      address:      order.shipping_address,
      city:         order.city || 'Colombo',
      country:      'Sri Lanka',
      custom_1:     order.id,
    },
  }
}
