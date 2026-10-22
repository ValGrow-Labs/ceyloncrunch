-- ==============================================================================
-- CEYLON CRUNCH - MIGRATION 001: CORE SCHEMA, RLS POLICIES, RPC FUNCTIONS & STORAGE
-- File: supabase/migrations/20261015000001_core_schema_and_security.sql
-- 
-- Run this script in the Supabase Dashboard:
-- SQL Editor > New Query > Paste and Run (Runs as Superuser/Service Role)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ADMINS TABLE & ADMIN HELPER FUNCTION
-- ------------------------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz default now()
);

-- Secure helper function to check if the current user is an authenticated admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE (All 10 artisan categories)
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key, -- slug: 'nuts', 'dried-fruits', etc.
  name text not null,
  description text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Seed all 10 store categories
insert into public.categories (id, name, description, display_order, is_active)
values
  ('nuts', 'Nuts', 'Premium single-origin cashews, roasted almonds, and artisan trail nuts', 1, true),
  ('dried-fruits', 'Dried Fruits', 'Sun-cured tropical fruits and slow-dehydrated heritage produce', 2, true),
  ('dates', 'Dates', 'Succulent Medjool, Kimia, and gourmet filled dates', 3, true),
  ('seeds', 'Seeds', 'Nutrient-dense roasted and raw edible seeds', 4, true),
  ('spices', 'Spices', 'Pure Ceylon cinnamon, black pepper, cloves, and whole spices', 5, true),
  ('healthy-snacks', 'Healthy Snacks', 'Nutritious roasted bites, crunch clusters, and wholesome snacks', 6, true),
  ('honey', 'Honey', 'Wild bee raw Ceylon forest honey and artisanal infusions', 7, true),
  ('tea-coffee', 'Tea & Coffee', 'Single-estate Ceylon highland black teas and artisanal roasts', 8, true),
  ('chocolates', 'Chocolates', 'Handcrafted stone-ground dark chocolate slabs with Ceylon sea salt', 9, true),
  ('gifts-hampers', 'Gifts & Hampers', 'Handwoven reed gift boxes, corporate collections, and bespoke hampers', 10, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order;

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS TABLE & COLUMNS
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  category text not null references public.categories(id) on update cascade on delete restrict,
  badge text,
  origin text not null default 'Sri Lanka',
  roast_style text,
  rating numeric(3,2) default 5.0,
  review_count integer default 0,
  images text[] default '{}',
  description text not null,
  extended_about text[] default '{}',
  ingredients text not null,
  storage text default 'Store in a cool, dry place.',
  shelf_life text default 'See package.',
  allergen_notice text,
  is_featured boolean default false,
  is_active boolean default true,
  compare_at_price numeric(10,2),
  allergen_info text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure all required columns exist if the table was previously created
alter table public.products add column if not exists is_active boolean default true;
alter table public.products add column if not exists compare_at_price numeric(10,2);
alter table public.products add column if not exists allergen_info text;
alter table public.products add column if not exists display_order integer default 0;
alter table public.products add column if not exists updated_at timestamptz default now();

-- Ensure existing products map cleanly to category foreign key
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'products_category_fkey'
  ) then
    alter table public.products 
      add constraint products_category_fkey 
      foreign key (category) references public.categories(id) 
      on update cascade on delete restrict;
  end if;
exception
  when others then null;
end $$;

-- ------------------------------------------------------------------------------
-- 5. PRODUCT VARIANTS TABLE & COLUMNS
-- Unit of Price: Integer Sri Lankan Rupees (LKR)
-- ------------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  weight text not null, -- '100g', '250g', '500g', '1kg'
  price integer not null check (price >= 0),
  original_price integer check (original_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  is_active boolean default true,
  compare_at_price integer check (compare_at_price >= 0),
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.product_variants add column if not exists is_active boolean default true;
alter table public.product_variants add column if not exists compare_at_price integer check (compare_at_price >= 0);
alter table public.product_variants add column if not exists display_order integer default 0;
alter table public.product_variants add column if not exists updated_at timestamptz default now();

-- ------------------------------------------------------------------------------
-- 6. PRODUCT IMAGES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  display_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Populate product_images from existing products.images arrays if table is currently empty
insert into public.product_images (product_id, url, display_order, is_primary)
select 
  p.id, 
  img.url, 
  img.idx - 1 as display_order,
  case when img.idx = 1 then true else false end as is_primary
from public.products p
cross join lateral unnest(p.images) with ordinality as img(url, idx)
where not exists (select 1 from public.product_images);

-- ------------------------------------------------------------------------------
-- 7. DELIVERY ZONES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.delivery_zones (
  id text primary key, -- 'islandwide'
  name text not null,
  rate integer not null default 450 check (rate >= 0),
  free_threshold integer default 5000 check (free_threshold >= 0),
  estimated_days text default '1-2 business days',
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into public.delivery_zones (id, name, rate, free_threshold, estimated_days, is_active)
values ('islandwide', 'Island-wide Express Delivery', 450, 5000, '1-2 business days', true)
on conflict (id) do update set
  rate = excluded.rate,
  free_threshold = excluded.free_threshold;

-- ------------------------------------------------------------------------------
-- 8. SITE SETTINGS TABLE & RESTRICTED PUBLIC VIEW
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'default',
  store_name text not null default 'Ceylon Crunch',
  announcement_banner text default 'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed',
  free_delivery_threshold integer not null default 5000 check (free_delivery_threshold >= 0),
  standard_delivery_fee integer not null default 450 check (standard_delivery_fee >= 0),
  bank_details text default 'Commercial Bank of Ceylon · Acc: 1000482910 · Ceylon Crunch (Pvt) Ltd',
  contact_email text default 'ceyloncrunch26@gmail.com',
  contact_phone text default '+94 77 944 3867',
  whatsapp_number text default '+94779443867',
  instagram_url text default 'https://www.instagram.com/ceyloncrunch',
  facebook_url text default 'https://www.facebook.com/profile.php?id=61578330752174',
  tiktok_url text default 'https://www.tiktok.com/@ceylon.crunch',
  -- Admin / private settings (never exposed to anon)
  payhere_merchant_id text,
  payhere_merchant_secret text,
  updated_at timestamptz default now()
);

insert into public.site_settings (id) values ('default')
on conflict (id) do nothing;

-- Public view exposing only safe customer-facing columns
create or replace view public.public_site_settings as
select
  id,
  store_name,
  announcement_banner,
  free_delivery_threshold,
  standard_delivery_fee,
  bank_details,
  contact_email,
  contact_phone,
  whatsapp_number,
  instagram_url,
  facebook_url,
  tiktok_url,
  updated_at
from public.site_settings
where id = 'default';

-- ------------------------------------------------------------------------------
-- 9. ORDERS & ORDER ITEMS TABLES
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key, -- e.g. CC-100245
  access_token text default gen_random_uuid()::text,
  idempotency_key text unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_street text not null,
  shipping_city text not null,
  shipping_district text not null,
  shipping_postal text,
  landmark text,
  payment_method text not null check (payment_method in ('cod', 'bank', 'card')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'received', 'verified')),
  payment_slip_url text,
  order_notes text,
  gift_note text,
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  status text not null default 'placed' check (status in ('placed', 'confirmed', 'packed', 'dispatched', 'delivered')),
  waybill text,
  estimated_arrival text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders add column if not exists access_token text default gen_random_uuid()::text;
alter table public.orders add column if not exists idempotency_key text unique;
alter table public.orders add column if not exists updated_at timestamptz default now();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_weight text not null,
  price integer not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  image text
);

alter table public.order_items add column if not exists variant_id uuid references public.product_variants(id) on delete set null;

-- ------------------------------------------------------------------------------
-- 10. REVIEWS & INQUIRIES TABLES (With Length & Content Limits)
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  author text not null check (char_length(author) between 2 and 100),
  location text default 'Sri Lanka' check (location is null or char_length(location) <= 100),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null check (char_length(comment) between 5 and 1000),
  verified boolean default true,
  is_approved boolean default false, -- reviews default to unapproved for moderation
  created_at timestamptz default now()
);

-- Ensure check constraints exist if table already existed
alter table public.reviews alter column is_approved set default false;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 255),
  phone text check (phone is null or char_length(phone) <= 30),
  subject text not null check (char_length(subject) between 3 and 200),
  message text not null check (char_length(message) between 10 and 2000),
  status text default 'unread' check (status in ('unread', 'in_progress', 'resolved')),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 11. INDEXES
-- ------------------------------------------------------------------------------
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_variants_active on public.product_variants(is_active);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_access_token on public.orders(access_token);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_reviews_approved on public.reviews(is_approved);

-- ------------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- Drop ALL pre-existing policies on every table first
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.inquiries enable row level security;

-- 12.1 Explicit DROP POLICY IF EXISTS for all pre-existing / legacy policies
drop policy if exists "Admins can manage admins" on public.admins;

drop policy if exists "Public can read categories" on public.categories;
drop policy if exists "Public can read active categories" on public.categories;
drop policy if exists "Admins can manage categories" on public.categories;

drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins can manage products" on public.products;

drop policy if exists "Public can read variants" on public.product_variants;
drop policy if exists "Public can read active variants" on public.product_variants;
drop policy if exists "Admins can manage variants" on public.product_variants;

drop policy if exists "Public can read product images" on public.product_images;
drop policy if exists "Public can read active product images" on public.product_images;
drop policy if exists "Admins can manage product images" on public.product_images;

drop policy if exists "Public can read delivery zones" on public.delivery_zones;
drop policy if exists "Admins can manage delivery zones" on public.delivery_zones;

drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;

drop policy if exists "Public can insert orders" on public.orders;
drop policy if exists "Public can read order by ID" on public.orders;
drop policy if exists "Admins can manage all orders" on public.orders;

drop policy if exists "Public can insert order items" on public.order_items;
drop policy if exists "Public can view order items" on public.order_items;
drop policy if exists "Admins can manage order items" on public.order_items;

drop policy if exists "Public can read approved reviews" on public.reviews;
drop policy if exists "Public can submit reviews" on public.reviews;
drop policy if exists "Admins can manage reviews" on public.reviews;

drop policy if exists "Public can submit inquiries" on public.inquiries;
drop policy if exists "Admins can view and manage inquiries" on public.inquiries;

-- 12.2 Create Fresh RLS Policies

-- ADMINS TABLE: Only authenticated admins can read/write admins table
create policy "Admins can manage admins" on public.admins
  for all using (public.is_admin());

-- CATEGORIES: Public reads active categories; Admins full write
create policy "Public can read active categories" on public.categories
  for select using (is_active = true);

create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin());

-- PRODUCTS: Public reads active products; Admins full write
create policy "Public can read active products" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

-- PRODUCT VARIANTS: Public reads active variants; Admins full write
create policy "Public can read active variants" on public.product_variants
  for select using (is_active = true);

create policy "Admins can manage variants" on public.product_variants
  for all using (public.is_admin());

-- PRODUCT IMAGES: Public reads images of active products; Admins full write
create policy "Public can read active product images" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id
      and p.is_active = true
    )
  );

create policy "Admins can manage product images" on public.product_images
  for all using (public.is_admin());

-- DELIVERY ZONES: Public reads active zones; Admins full write
create policy "Public can read delivery zones" on public.delivery_zones
  for select using (is_active = true);

create policy "Admins can manage delivery zones" on public.delivery_zones
  for all using (public.is_admin());

-- SITE SETTINGS: Public can only select via public_site_settings view or public columns; Admins full write
create policy "Admins can manage site settings" on public.site_settings
  for all using (public.is_admin());

-- Revoke default broad grants and restrict anon to public columns on site_settings
revoke all on public.site_settings from anon;
grant select (id, store_name, announcement_banner, free_delivery_threshold, standard_delivery_fee, bank_details, contact_email, contact_phone, whatsapp_number, instagram_url, facebook_url, tiktok_url, updated_at) 
  on public.site_settings to anon, authenticated;
grant select on public.public_site_settings to anon, authenticated;

-- ORDERS & ORDER ITEMS:
-- Public has NO direct access. Customer orders must use place_order() RPC and track_order() RPC.
-- Only authenticated Admins can view/update/manage orders.
create policy "Admins can manage all orders" on public.orders
  for all using (public.is_admin());

create policy "Admins can manage order items" on public.order_items
  for all using (public.is_admin());

-- REVIEWS: Public reads approved reviews, public submits (unapproved), Admins full write
create policy "Public can read approved reviews" on public.reviews
  for select using (is_approved = true);

create policy "Public can submit reviews" on public.reviews
  for insert with check (
    is_approved = false 
    and char_length(author) between 2 and 100 
    and char_length(comment) between 5 and 1000
    and rating between 1 and 5
  );

create policy "Admins can manage reviews" on public.reviews
  for all using (public.is_admin());

-- INQUIRIES: Public submits unread inquiries with length limits, Admins manage
create policy "Public can submit inquiries" on public.inquiries
  for insert with check (
    status = 'unread'
    and char_length(name) between 2 and 100
    and char_length(email) between 5 and 255
    and char_length(subject) between 3 and 200
    and char_length(message) between 10 and 2000
  );

create policy "Admins can view and manage inquiries" on public.inquiries
  for all using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 13. SECURITY DEFINER ORDER PLACEMENT RPC (place_order)
-- ------------------------------------------------------------------------------
create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_shipping_street text,
  p_shipping_city text,
  p_shipping_district text,
  p_payment_method text,
  p_items jsonb, -- array: [{"variant_id": "uuid", "quantity": 1}]
  p_customer_email text default null,
  p_shipping_postal text default null,
  p_landmark text default null,
  p_order_notes text default null,
  p_gift_note text default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item record;
  v_variant record;
  v_product record;
  v_subtotal integer := 0;
  v_delivery_fee integer := 450;
  v_free_threshold integer := 5000;
  v_total integer := 0;
  v_order_id text;
  v_access_token text;
  v_status text;
  v_waybill text;
  v_next_num integer;
  v_random_waybill text;
  v_items_count integer;
begin
  -- 1. Idempotency Check: return existing order if key was already processed
  if p_idempotency_key is not null and trim(p_idempotency_key) <> '' then
    if exists (select 1 from public.orders where idempotency_key = trim(p_idempotency_key)) then
      select id, access_token, subtotal, delivery_fee, total, status, waybill
      into v_order_id, v_access_token, v_subtotal, v_delivery_fee, v_total, v_status, v_waybill
      from public.orders
      where idempotency_key = trim(p_idempotency_key);

      return jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'access_token', v_access_token,
        'subtotal', v_subtotal,
        'delivery_fee', v_delivery_fee,
        'total', v_total,
        'status', v_status,
        'waybill', v_waybill,
        'is_duplicate', true
      );
    end if;
  end if;

  -- 2. Input validation
  if trim(coalesce(p_customer_name, '')) = '' then
    raise exception 'Customer name is required.';
  end if;
  if char_length(p_customer_name) > 100 then
    raise exception 'Customer name exceeds 100 characters.';
  end if;

  if trim(coalesce(p_customer_phone, '')) = '' then
    raise exception 'Customer phone is required.';
  end if;
  if char_length(p_customer_phone) > 30 then
    raise exception 'Customer phone exceeds 30 characters.';
  end if;

  if trim(coalesce(p_shipping_street, '')) = '' or trim(coalesce(p_shipping_city, '')) = '' then
    raise exception 'Shipping street address and city are required.';
  end if;

  if p_payment_method not in ('cod', 'bank', 'card') then
    raise exception 'Invalid payment method: %', p_payment_method;
  end if;

  -- 3. Validate items array
  v_items_count := jsonb_array_length(p_items);
  if v_items_count is null or v_items_count = 0 then
    raise exception 'Cart cannot be empty.';
  end if;
  if v_items_count > 50 then
    raise exception 'Cart item limit exceeded.';
  end if;

  -- 4. Load delivery settings from site_settings or delivery_zones
  select standard_delivery_fee, free_delivery_threshold
  into v_delivery_fee, v_free_threshold
  from public.site_settings
  where id = 'default';

  if v_delivery_fee is null then
    v_delivery_fee := 450;
    v_free_threshold := 5000;
  end if;

  -- 5. Lock and validate each item, recalculate real subtotal from database
  for v_item in select * from jsonb_to_recordset(p_items) as x(variant_id uuid, quantity integer) loop
    if v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Item quantity must be greater than zero.';
    end if;
    if v_item.quantity > 500 then
      raise exception 'Quantity exceeds maximum allowable single order limit.';
    end if;

    -- Row-lock variant to prevent race conditions during high-concurrency checkout
    select id, product_id, weight, price, stock, is_active
    into v_variant
    from public.product_variants
    where id = v_item.variant_id
    for update;

    if not found then
      raise exception 'Product variant with ID % not found.', v_item.variant_id;
    end if;

    if v_variant.is_active = false then
      raise exception 'Variant % is currently unavailable.', v_variant.weight;
    end if;

    if v_variant.stock < v_item.quantity then
      raise exception 'Insufficient stock for % (Available: %, Requested: %).', v_variant.weight, v_variant.stock, v_item.quantity;
    end if;

    -- Decrement stock atomically
    update public.product_variants
    set stock = stock - v_item.quantity,
        updated_at = now()
    where id = v_variant.id;

    -- Add to database-verified subtotal (client prices are completely ignored)
    v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
  end loop;

  -- 6. Calculate delivery fee and total
  if v_subtotal >= v_free_threshold then
    v_delivery_fee := 0;
  end if;
  v_total := v_subtotal + v_delivery_fee;

  -- 7. Generate next order number CC-XXXXXX
  select coalesce(max(nullif(regexp_replace(id, '\D', '', 'g'), '')::integer), 100) + 1
  into v_next_num
  from public.orders;

  v_order_id := 'CC-' || lpad(v_next_num::text, 6, '0');
  v_access_token := replace(gen_random_uuid()::text, '-', '');
  v_random_waybill := 'CLN-' || floor(10000000 + random() * 90000000)::bigint::text || '-LK';

  -- 8. Insert into public.orders
  insert into public.orders (
    id,
    access_token,
    idempotency_key,
    customer_name,
    customer_phone,
    customer_email,
    shipping_street,
    shipping_city,
    shipping_district,
    shipping_postal,
    landmark,
    payment_method,
    payment_status,
    order_notes,
    gift_note,
    subtotal,
    delivery_fee,
    total,
    status,
    waybill,
    estimated_arrival
  ) values (
    v_order_id,
    v_access_token,
    nullif(trim(p_idempotency_key), ''),
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_shipping_street,
    p_shipping_city,
    p_shipping_district,
    p_shipping_postal,
    p_landmark,
    p_payment_method,
    'pending',
    p_order_notes,
    p_gift_note,
    v_subtotal,
    v_delivery_fee,
    v_total,
    'placed',
    v_random_waybill,
    'In 1-2 business days'
  );

  -- 9. Insert items into public.order_items
  for v_item in select * from jsonb_to_recordset(p_items) as x(variant_id uuid, quantity integer) loop
    select p.id as product_id, p.name as product_name, pv.weight as variant_weight, pv.price, (
      coalesce((select url from public.product_images where product_id = p.id and is_primary = true limit 1),
               p.images[1], '')
    ) as image
    into v_product
    from public.product_variants pv
    join public.products p on p.id = pv.product_id
    where pv.id = v_item.variant_id;

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_weight,
      price,
      quantity,
      image
    ) values (
      v_order_id,
      v_product.product_id,
      v_item.variant_id,
      v_product.product_name,
      v_product.variant_weight,
      v_product.price,
      v_item.quantity,
      v_product.image
    );
  end loop;

  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'access_token', v_access_token,
    'waybill', v_random_waybill,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_total,
    'status', 'placed'
  );
end;
$$;

-- ------------------------------------------------------------------------------
-- 14. SECURITY DEFINER ORDER TRACKING RPC (track_order)
-- ------------------------------------------------------------------------------
create or replace function public.track_order(
  p_order_id text,
  p_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
stable
as $$
declare
  v_clean_order text;
  v_clean_phone text;
  v_order record;
  v_items jsonb;
begin
  if p_order_id is null or trim(p_order_id) = '' then
    return jsonb_build_object('found', false, 'error', 'Order number is required.');
  end if;
  if p_phone is null or trim(p_phone) = '' then
    return jsonb_build_object('found', false, 'error', 'Customer phone number is required.');
  end if;

  v_clean_order := upper(trim(replace(p_order_id, '#', '')));
  if not v_clean_order like 'CC-%' then
    v_clean_order := 'CC-' || v_clean_order;
  end if;

  -- Extract last 9 digits of customer phone number for robust comparison (+94 vs 0 matching)
  v_clean_phone := right(regexp_replace(p_phone, '\D', '', 'g'), 9);
  if char_length(v_clean_phone) < 7 then
    return jsonb_build_object('found', false, 'error', 'Invalid phone number format.');
  end if;

  select 
    id,
    status,
    payment_method,
    payment_status,
    payment_slip_url,
    subtotal,
    delivery_fee,
    total,
    waybill,
    estimated_arrival,
    shipping_city,
    shipping_district,
    created_at
  into v_order
  from public.orders
  where upper(id) = v_clean_order
  and right(regexp_replace(customer_phone, '\D', '', 'g'), 9) = v_clean_phone;

  if not found then
    return jsonb_build_object('found', false, 'error', 'No order found matching this order number and phone number.');
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'product_name', product_name,
      'variant_weight', variant_weight,
      'price', price,
      'quantity', quantity,
      'image', image
    )
  )
  into v_items
  from public.order_items
  where order_id = v_order.id;

  return jsonb_build_object(
    'found', true,
    'order', jsonb_build_object(
      'id', v_order.id,
      'status', v_order.status,
      'payment_method', v_order.payment_method,
      'payment_status', v_order.payment_status,
      'payment_slip_url', v_order.payment_slip_url,
      'subtotal', v_order.subtotal,
      'delivery_fee', v_order.delivery_fee,
      'total', v_order.total,
      'waybill', v_order.waybill,
      'estimated_arrival', v_order.estimated_arrival,
      'shipping_city', v_order.shipping_city,
      'shipping_district', v_order.shipping_district,
      'created_at', v_order.created_at,
      'items', coalesce(v_items, '[]'::jsonb)
    )
  );
end;
$$;

-- ------------------------------------------------------------------------------
-- 15. STORAGE BUCKETS & STORAGE RLS POLICIES (With File Type & Size Limits)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760, -- 10 MB limit for product photos
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-slips',
  'payment-slips',
  false,
  5242880, -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

drop policy if exists "Public can read product images" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can manage product images" on storage.objects;
drop policy if exists "Public can upload payment slips" on storage.objects;
drop policy if exists "Customers can upload payment slips" on storage.objects;
drop policy if exists "Customers can upload payment slips with valid order" on storage.objects;
drop policy if exists "Admins can view and manage payment slips" on storage.objects;
drop policy if exists "Admins can manage payment slips" on storage.objects;

-- product-images bucket: Public reads, Admins manage
create policy "Public can read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins can manage product images" on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin());

-- payment-slips bucket:
-- Upload only permitted if path references a valid order id (e.g. 'slips/CC-000125_timestamp.png')
create policy "Customers can upload payment slips with valid order" on storage.objects
  for insert with check (
    bucket_id = 'payment-slips'
    and exists (
      select 1 from public.orders o
      where o.id = substring(name from '^(?:slips/)?([A-Za-z0-9-]+)(?:_[0-9]+|\..*)')
    )
  );

create policy "Admins can manage payment slips" on storage.objects
  for all using (bucket_id = 'payment-slips' and public.is_admin());

-- ------------------------------------------------------------------------------
-- 16. REALTIME REPLICATION CONFIGURATION
-- ------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'products') then
    alter publication supabase_realtime add table public.products;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'product_variants') then
    alter publication supabase_realtime add table public.product_variants;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'product_images') then
    alter publication supabase_realtime add table public.product_images;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'categories') then
    alter publication supabase_realtime add table public.categories;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'site_settings') then
    alter publication supabase_realtime add table public.site_settings;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 17. FUNCTION EXECUTE PERMISSIONS
-- ------------------------------------------------------------------------------
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.place_order(text, text, text, text, text, text, jsonb, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
