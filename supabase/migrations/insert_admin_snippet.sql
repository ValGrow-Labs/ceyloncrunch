-- ==============================================================================
-- CEYLON CRUNCH - INSERT ADMIN USER SNIPPET
-- File: supabase/migrations/insert_admin_snippet.sql
--
-- Instructions:
-- 1. In your Supabase Dashboard, go to Authentication > Users.
-- 2. Click "Add User" > "Create User" (e.g. email: admin@ceyloncrunch.lk or your chosen email).
-- 3. Replace 'admin@ceyloncrunch.lk' below with the actual email you used.
-- 4. Run this snippet in SQL Editor.
-- ==============================================================================

-- Option A: Add admin by email (finds user_id automatically from auth.users)
insert into public.admins (user_id, email, role)
select id, email, 'admin'
from auth.users
where email = 'admin@ceyloncrunch.lk' -- <-- REPLACE WITH YOUR ADMIN EMAIL
on conflict (user_id) do nothing;

-- Verify admin user was successfully registered
select a.id, a.user_id, a.email, a.role, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id;
