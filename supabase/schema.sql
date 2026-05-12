-- ============================================================
-- CEYLON CRUNCH — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── updated_at trigger ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── PRODUCTS ────────────────────────────────────────────────
create table if not exists products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text unique not null,
  category      text not null,
  price         integer not null,              -- LKR, whole number
  variants      jsonb not null default '[]',   -- ["250g","500g","1kg"]
  badge         text,
  badge_type    text,                          -- green | gold | brown | red
  rating        numeric(3,1) default 4.5,
  reviews       integer default 0,
  image_url     text,
  description   text,
  nutrition_info jsonb,                        -- {serving:"30g", calories:"180 kcal", ...}
  active        boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists products_category_idx on products(category);
create index if not exists products_active_idx   on products(active);
create index if not exists products_slug_idx     on products(slug);

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  shipping_address text not null,
  city             text default 'Colombo',
  items            jsonb not null default '[]', -- snapshot of cart items
  subtotal         integer not null,
  delivery         integer not null default 0,
  total            integer not null,
  status           text not null default 'pending', -- pending|paid|shipped|delivered|cancelled
  payment_id       text,
  payment_url      text,
  payment_method   text not null default 'cod', -- payhere | cod | bank_transfer
  notes            text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists orders_status_idx     on orders(status);
create index if not exists orders_email_idx      on orders(customer_email);
create index if not exists orders_created_idx    on orders(created_at desc);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ── ORDER ITEMS ─────────────────────────────────────────────
create table if not exists order_items (
  id         uuid primary key default uuid_generate_v4(),
  order_id   uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name       text not null,
  price      integer not null,
  variant    text,
  quantity   integer not null default 1
);

create index if not exists order_items_order_idx   on order_items(order_id);
create index if not exists order_items_product_idx on order_items(product_id);

-- ── NEWSLETTER ──────────────────────────────────────────────
create table if not exists newsletter (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  active     boolean default true,
  created_at timestamptz default now()
);

-- ── PROFILES (extends auth.users) ───────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text not null default 'admin', -- admin | super_admin
  active     boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- auto-create profile on new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── SITE SETTINGS ────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products      enable row level security;
alter table orders        enable row level security;
alter table order_items   enable row level security;
alter table newsletter    enable row level security;
alter table profiles      enable row level security;
alter table site_settings enable row level security;

-- helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and active = true
  );
end;
$$ language plpgsql security definer;

create or replace function is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin' and active = true
  );
end;
$$ language plpgsql security definer;

-- PRODUCTS policies
create policy "Public can read active products"
  on products for select using (active = true);

create policy "Admins can do anything to products"
  on products for all using (is_admin()) with check (is_admin());

-- ORDERS policies
create policy "Anyone can create an order"
  on orders for insert with check (true);

create policy "Customers can view their own orders"
  on orders for select using (customer_email = current_setting('request.jwt.claims', true)::json->>'email' or is_admin());

create policy "Admins can manage all orders"
  on orders for all using (is_admin()) with check (is_admin());

-- ORDER ITEMS policies
create policy "Admins can manage order items"
  on order_items for all using (is_admin()) with check (is_admin());

create policy "Anyone can create order items"
  on order_items for insert with check (true);

-- NEWSLETTER policies
create policy "Anyone can subscribe"
  on newsletter for insert with check (true);

create policy "Admins can manage newsletter"
  on newsletter for all using (is_admin()) with check (is_admin());

-- PROFILES policies
create policy "Admins can view profiles"
  on profiles for select using (is_admin());

create policy "Super admins can manage profiles"
  on profiles for all using (is_super_admin()) with check (is_super_admin());

create policy "Users can view own profile"
  on profiles for select using (id = auth.uid());

-- SITE SETTINGS policies
create policy "Public can read settings"
  on site_settings for select using (true);

create policy "Admins can update settings"
  on site_settings for all using (is_admin()) with check (is_admin());
