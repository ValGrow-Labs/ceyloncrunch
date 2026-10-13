import { createAdminClient, createClient } from './supabase-server'

// Resilient memory store for environments where Supabase is offline or loading
const globalOrderStore = globalThis.__ceyloncrunch_orders || new Map()
if (process.env.NODE_ENV !== 'production') {
  globalThis.__ceyloncrunch_orders = globalOrderStore
}

async function withTimeout(promise, ms = 1500) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

export function generateOrderNumber() {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(100000 + Math.random() * 900000)
  return `CC-${year}-${randomSuffix}`
}

export async function createOrder(orderPayload) {
  const orderNumber = generateOrderNumber()
  const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cc-${Date.now()}`
  const now = new Date().toISOString()

  const fullOrder = {
    id: orderId,
    order_number: orderNumber,
    customer_name: orderPayload.customer_name,
    customer_email: orderPayload.customer_email,
    customer_phone: orderPayload.customer_phone,
    shipping_address: orderPayload.shipping_address,
    city: orderPayload.city || 'Colombo',
    district: orderPayload.district || 'Colombo',
    items: orderPayload.items || [],
    subtotal: Number(orderPayload.subtotal || 0),
    delivery: Number(orderPayload.delivery || 0),
    total: Number(orderPayload.total || (Number(orderPayload.subtotal || 0) + Number(orderPayload.delivery || 0))),
    payment_method: orderPayload.payment_method || 'cod',
    notes: orderPayload.notes || null,
    status: 'Confirmed',
    created_at: now,
    updated_at: now,
  }

  // Always cache in memory
  globalOrderStore.set(orderId, fullOrder)
  globalOrderStore.set(orderNumber, fullOrder)

  // Attempt to write to Supabase if available
  try {
    const supabase = await createAdminClient()
    const cityWithDistrict = fullOrder.district && !fullOrder.city.includes(fullOrder.district)
      ? `${fullOrder.city}, ${fullOrder.district}`
      : fullOrder.city

    const { data: dbOrder, error } = await withTimeout(
      supabase.from('orders').insert([{
        id: orderId,
        customer_name: fullOrder.customer_name,
        customer_email: fullOrder.customer_email,
        customer_phone: fullOrder.customer_phone,
        shipping_address: fullOrder.shipping_address,
        city: cityWithDistrict,
        items: JSON.stringify(fullOrder.items),
        subtotal: fullOrder.subtotal,
        delivery: fullOrder.delivery,
        total: fullOrder.total,
        payment_method: fullOrder.payment_method,
        notes: fullOrder.notes,
        status: 'pending',
      }]).select().single()
    )

    if (!error && dbOrder) {
      if (fullOrder.items?.length) {
        try {
          await withTimeout(
            supabase.from('order_items').insert(
              fullOrder.items.map(i => ({
                order_id: dbOrder.id,
                product_id: i.id && typeof i.id === 'string' && i.id.includes('-') ? i.id : null,
                name: i.name,
                price: i.price,
                variant: i.variant || 'Standard',
                quantity: i.qty || 1,
              }))
            )
          )
        } catch {}
      }
      return { ...fullOrder, ...dbOrder, order_number: orderNumber }
    }
  } catch (err) {
    console.warn('[Orders] Supabase write skipped or timed out, order saved in fallback store:', err?.message)
  }

  return fullOrder
}

export async function getOrder(idOrNumber) {
  if (!idOrNumber) return null

  // 1. Check local cache
  if (globalOrderStore.has(idOrNumber)) {
    return globalOrderStore.get(idOrNumber)
  }

  // 2. Try Supabase
  try {
    const supabase = await createClient()
    const { data, error } = await withTimeout(
      supabase.from('orders').select('*, order_items(*)').eq('id', idOrNumber).single()
    )
    if (!error && data) {
      let items = []
      try {
        items = typeof data.items === 'string' ? JSON.parse(data.items) : (data.items || [])
      } catch {
        items = data.items || []
      }
      const order = {
        ...data,
        items,
        order_number: data.order_number || `CC-2026-${data.id.slice(-6).toUpperCase()}`,
      }
      globalOrderStore.set(data.id, order)
      return order
    }
  } catch (err) {
    console.warn('[Orders] Supabase lookup skipped or timed out:', err?.message)
  }

  return null
}
