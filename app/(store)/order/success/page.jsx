import { getOrder } from '@/lib/orders'
import OrderConfirmationClient from '@/components/storefront/OrderConfirmationClient'

export const metadata = {
  title: 'Order Confirmed — Ceylon Crunch',
  description: 'Thank you for your order. We have received your order and will begin preparing it shortly.',
}

export default async function OrderSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const id = resolvedSearchParams?.id
  const orderNumber = resolvedSearchParams?.order_number
  const method = resolvedSearchParams?.method

  let order = null
  if (id || orderNumber) {
    order = await getOrder(id || orderNumber)
  }

  return (
    <OrderConfirmationClient
      initialOrder={order}
      orderId={id}
      orderNumberProp={orderNumber}
      paymentMethod={method}
    />
  )
}
