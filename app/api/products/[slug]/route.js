import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { isDevBypass, SAMPLE_PRODUCTS } from '@/lib/mock-data'

export async function GET(request, { params }) {
  const { slug } = await params
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (!error && data) return NextResponse.json(data)
  } catch {}

  const fallback = SAMPLE_PRODUCTS.find(p => p.slug === slug || p.id === slug)
  if (fallback) return NextResponse.json(fallback)

  return NextResponse.json({ error: 'Product not found' }, { status: 404 })
}

export async function PATCH(request, { params }) {
  const { slug } = await params
  const bypass = isDevBypass()
  let user = null
  if (!bypass) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user
    } catch {}
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').update(body).eq('slug', slug).select().single()
    if (!error && data) return NextResponse.json(data)
  } catch {}

  if (bypass) {
    return NextResponse.json({ slug, ...body, dev_mock: true })
  }

  return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
}

export async function DELETE(request, { params }) {
  const { slug } = await params
  const bypass = isDevBypass()
  let user = null
  if (!bypass) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user
    } catch {}
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().eq('slug', slug)
    if (!error) return NextResponse.json({ success: true })
  } catch {}

  if (bypass) {
    return NextResponse.json({ success: true, dev_mock: true })
  }

  return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
}
