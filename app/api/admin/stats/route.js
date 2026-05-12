import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  const [
    { data: allOrders },
    { data: monthOrders },
    { data: lastMonthOrders },
    { data: products },
    { data: newsletter },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total, status'),
    supabase.from('orders').select('total, status').gte('created_at', startOfMonth),
    supabase.from('orders').select('total').gte('created_at', startOfLastMonth).lte('created_at', endOfLastMonth),
    supabase.from('products').select('id, name, active'),
    supabase.from('newsletter').select('id, active'),
    supabase.from('orders').select('id, customer_name, customer_email, total, status, payment_method, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const calcRevenue = (orders) => (orders || []).filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0)
  const countByStatus = (orders) => (orders || []).reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  const monthRevenue = calcRevenue(monthOrders)
  const lastMonthRevenue = calcRevenue(lastMonthOrders)
  const revenueChange = lastMonthRevenue > 0 ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : null

  return NextResponse.json({
    revenue: { month: monthRevenue, lastMonth: lastMonthRevenue, change: revenueChange },
    orders: {
      total: allOrders?.length || 0,
      month: monthOrders?.length || 0,
      byStatus: countByStatus(allOrders),
    },
    products: {
      total: products?.length || 0,
      active: products?.filter(p => p.active).length || 0,
    },
    newsletter: {
      total: newsletter?.length || 0,
      active: newsletter?.filter(n => n.active).length || 0,
    },
    recentOrders: recentOrders || [],
  })
}
