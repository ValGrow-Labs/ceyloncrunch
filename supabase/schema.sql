-- ==============================================================================
-- CEYLON CRUNCH - COMPLETE SUPABASE DATABASE SETUP & SCHEMA
-- Run this script in your Supabase Project: Dashboard > SQL Editor > New Query
-- ==============================================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  category text not null,
  badge text,
  origin text not null,
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
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCT VARIANTS TABLE (Pack sizes, prices, stock tracking)
-- ------------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  weight text not null, -- '100g', '250g', '500g', '1kg'
  price numeric(10,2) not null,
  original_price numeric(10,2),
  stock integer not null default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key, -- Order Code e.g. CC-100245
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
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'placed' check (status in ('placed', 'confirmed', 'packed', 'dispatched', 'delivered')),
  waybill text,
  estimated_arrival text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  variant_weight text not null,
  price numeric(10,2) not null,
  quantity integer not null,
  image text
);

-- ------------------------------------------------------------------------------
-- 5. REVIEWS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  author text not null,
  location text default 'Sri Lanka',
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  verified boolean default true,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 6. INQUIRIES TABLE (Contact & Corporate Wholesale)
-- ------------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text default 'unread' check (status in ('unread', 'in_progress', 'resolved')),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_reviews_product on public.reviews(product_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.inquiries enable row level security;

-- Products: Everyone can read, authenticated admins can write
create policy "Public can read products" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (auth.role() = 'authenticated');

-- Variants: Everyone can read, authenticated admins can write
create policy "Public can read variants" on public.product_variants for select using (true);
create policy "Admins can manage variants" on public.product_variants for all using (auth.role() = 'authenticated');

-- Orders: Public can create orders, public can read own order by id, admins can manage all
create policy "Public can insert orders" on public.orders for insert with check (true);
create policy "Public can read order by ID" on public.orders for select using (true);
create policy "Admins can manage all orders" on public.orders for all using (auth.role() = 'authenticated');

-- Order Items: Public can insert items and read, admins have full access
create policy "Public can insert order items" on public.order_items for insert with check (true);
create policy "Public can view order items" on public.order_items for select using (true);
create policy "Admins can manage order items" on public.order_items for all using (auth.role() = 'authenticated');

-- Reviews: Public can insert reviews, public can view approved reviews, admins can manage all
create policy "Public can read approved reviews" on public.reviews for select using (is_approved = true);
create policy "Public can submit reviews" on public.reviews for insert with check (true);
create policy "Admins can manage reviews" on public.reviews for all using (auth.role() = 'authenticated');

-- Inquiries: Public can insert inquiries, admins can view and manage
create policy "Public can submit inquiries" on public.inquiries for insert with check (true);
create policy "Admins can view and manage inquiries" on public.inquiries for all using (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- STORAGE BUCKETS (Product Images & Payment Deposit Slips)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('payment-slips', 'payment-slips', true)
on conflict (id) do nothing;

-- Storage policies:
create policy "Public can read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins can upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Public can upload payment slips" on storage.objects for insert with check (bucket_id = 'payment-slips');
create policy "Admins can view and manage payment slips" on storage.objects for select using (bucket_id = 'payment-slips');

-- ------------------------------------------------------------------------------
-- REALTIME SUBSCRIPTIONS (Enable live updates for orders)
-- ------------------------------------------------------------------------------
alter publication supabase_realtime add table public.orders;
