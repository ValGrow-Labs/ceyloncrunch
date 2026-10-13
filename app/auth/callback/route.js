import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

// API Route Handler: app/auth/callback/route.js
export async function GET(request) {
  const supabase = getSupabaseAdmin();
  return NextResponse.json({ status: 'ok', route: 'app/auth/callback/route.js' });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  return NextResponse.json({ success: true, route: 'app/auth/callback/route.js', data: body });
}
