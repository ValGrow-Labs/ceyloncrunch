import { NextResponse } from 'next/server'
import { getOrder } from '@/lib/orders'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const email = searchParams.get('email')

  if (!id || !email) return NextResponse.json({ error: 'Order ID and email required' }, { status: 400 })

  const order = await getOrder(id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  if (order.customer_email && order.customer_email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    total: order.total,
    created_at: order.created_at,
    payment_method: order.payment_method,
    city: order.city,
    customer_name: order.customer_name,
  })
}
