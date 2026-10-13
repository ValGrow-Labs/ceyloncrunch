import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ceyloncrunch.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-key',
    { auth: { persistSession: false } }
  );
}
