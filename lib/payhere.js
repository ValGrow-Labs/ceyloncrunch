import crypto from 'crypto';

/**
 * Generates the MD5 signature hash required by PayHere Checkout API
 */
export function generatePayHereHash({ merchantId, orderId, amount, currency = 'LKR', merchantSecret }) {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const formattedAmount = Number(amount).toFixed(2);
  const payload = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;

  return crypto.createHash('md5').update(payload).digest('hex').toUpperCase();
}

/**
 * Verifies the incoming PayHere Server-to-Server Webhook signature
 */
export function verifyPayHereWebhook({ merchantId, orderId, payhereAmount, payhereCurrency, statusCode, md5sig, merchantSecret }) {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const localSig = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`)
    .digest('hex')
    .toUpperCase();

  return localSig === md5sig;
}
