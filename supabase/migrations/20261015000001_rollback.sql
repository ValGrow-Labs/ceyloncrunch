-- ==============================================================================
-- CEYLON CRUNCH - ROLLBACK FOR MIGRATION 001
-- File: supabase/migrations/20261015000001_rollback.sql
-- 
-- Run this script in Supabase Dashboard SQL Editor ONLY if you need to 
-- completely revert Migration 001 to the initial baseline schema.
-- ==============================================================================

-- 1. DROP SECURITY DEFINER FUNCTIONS & VIEWS
drop function if exists public.place_order(text, text, text, text, text, text, jsonb, text, text, text, text, text, text);
drop function if exists public.track_order(text, text);
drop function if exists public.is_admin();
drop view if exists public.public_site_settings;

-- 2. REMOVE TABLES FROM REALTIME PUBLICATION
do $$
begin
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'products') then
    alter publication supabase_realtime drop table public.products;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'product_variants') then
    alter publication supabase_realtime drop table public.product_variants;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'product_images') then
    alter publication supabase_realtime drop table public.product_images;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'categories') then
    alter publication supabase_realtime drop table public.categories;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_settings') then
    alter publication supabase_realtime drop table public.site_settings;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders') then
    alter publication supabase_realtime drop table public.orders;
  end if;
end $$;

-- 3. DROP NEW STORAGE POLICIES
drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Admins can manage product images" on storage.objects;
drop policy if exists "Customers can upload payment slips with valid order" on storage.objects;
drop policy if exists "Admins can manage payment slips" on storage.objects;

-- 4. DROP NEW POLICIES ON EXISTING TABLES
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Public can read active variants" on public.product_variants;
drop policy if exists "Admins can manage variants" on public.product_variants;
drop policy if exists "Admins can manage all orders" on public.orders;
drop policy if exists "Admins can manage order items" on public.order_items;
drop policy if exists "Public can read approved reviews" on public.reviews;
drop policy if exists "Public can submit reviews" on public.reviews;
drop policy if exists "Admins can manage reviews" on public.reviews;
drop policy if exists "Public can submit inquiries" on public.inquiries;
drop policy if exists "Admins can view and manage inquiries" on public.inquiries;

-- 5. DROP NEW TABLES
drop table if exists public.delivery_zones cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.product_images cascade;
alter table public.products drop constraint if exists products_category_fkey;
drop table if exists public.categories cascade;
drop table if exists public.admins cascade;

-- 6. DROP COLUMNS ADDED TO EXISTING TABLES
alter table public.orders drop column if exists access_token;
alter table public.orders drop column if exists idempotency_key;
alter table public.orders drop column if exists updated_at;

alter table public.order_items drop column if exists variant_id;

alter table public.products drop column if exists is_active;
alter table public.products drop column if exists compare_at_price;
alter table public.products drop column if exists allergen_info;
alter table public.products drop column if exists display_order;
alter table public.products drop column if exists updated_at;

alter table public.product_variants drop column if exists is_active;
alter table public.product_variants drop column if exists compare_at_price;
alter table public.product_variants drop column if exists display_order;
alter table public.product_variants drop column if exists updated_at;

-- 7. RESTORE BASELINE RLS POLICIES (FROM INITIAL SCHEMA)
create policy "Public can read products" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (auth.role() = 'authenticated');

create policy "Public can read variants" on public.product_variants for select using (true);
create policy "Admins can manage variants" on public.product_variants for all using (auth.role() = 'authenticated');

create policy "Public can insert orders" on public.orders for insert with check (true);
create policy "Public can read order by ID" on public.orders for select using (true);
create policy "Admins can manage all orders" on public.orders for all using (auth.role() = 'authenticated');

create policy "Public can insert order items" on public.order_items for insert with check (true);
create policy "Public can view order items" on public.order_items for select using (true);
create policy "Admins can manage order items" on public.order_items for all using (auth.role() = 'authenticated');

create policy "Public can read approved reviews" on public.reviews for select using (is_approved = true);
create policy "Public can submit reviews" on public.reviews for insert with check (true);
create policy "Admins can manage reviews" on public.reviews for all using (auth.role() = 'authenticated');

create policy "Public can submit inquiries" on public.inquiries for insert with check (true);
create policy "Admins can view and manage inquiries" on public.inquiries for all using (auth.role() = 'authenticated');
