import { getSupabaseAdmin } from '../lib/supabase-server.js';

async function seed() {
  const supabase = getSupabaseAdmin();
  console.log('Seeding Ceylon Crunch database via Supabase PostgreSQL...');
}

seed();
