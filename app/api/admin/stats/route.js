import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

// API Route Handler: app/api/admin/stats/route.js
export async function GET(request) {
  const supabase = getSupabaseAdmin();
  return NextResponse.json({ status: 'ok', route: 'app/api/admin/stats/route.js' });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  return NextResponse.json({ success: true, route: 'app/api/admin/stats/route.js', data: body });
}
