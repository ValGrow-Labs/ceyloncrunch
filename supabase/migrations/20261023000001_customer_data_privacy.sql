-- ==============================================================================
-- CEYLON CRUNCH - CUSTOMER DATA PRIVACY MIGRATION
-- File: supabase/migrations/20261023000001_customer_data_privacy.sql
-- Run this script in: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

-- 1. ADD USER_ID COLUMN TO ORDERS TABLE
-- Link orders to auth.users so customers can only access their own orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- 2. CREATE SAVED DELIVERY ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  recipient_name text NOT NULL,
  phone text NOT NULL,
  street text NOT NULL,
  landmark text,
  city text NOT NULL,
  district text NOT NULL,
  postal_code text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON public.customer_addresses(user_id);

-- 3. CREATE CUSTOMER WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.customer_wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT customer_wishlist_user_product_key UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_wishlist_user ON public.customer_wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_wishlist_product ON public.customer_wishlist(product_id);

-- 4. CREATE CUSTOMER PROFILES TABLE (Patron Profile)
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  phone text,
  email text,
  city text DEFAULT 'Colombo',
  district text DEFAULT 'Colombo',
  dietary_preferences text[] DEFAULT '{}',
  loyalty_tier text DEFAULT 'Ceylon Patron',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all relevant tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- 5.1 ORDERS POLICIES
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can update own orders" ON public.orders;

-- Admins retain full access to manage all orders
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- Customers can only SELECT their own orders
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  );

-- Customers can update their own orders (e.g. uploading payment slip)
CREATE POLICY "Customers can update own orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  ) WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  );

-- 5.2 ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;

CREATE POLICY "Admins can manage order items" ON public.order_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Customers can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 5.3 CUSTOMER ADDRESSES POLICIES
DROP POLICY IF EXISTS "Customers can view own addresses" ON public.customer_addresses;
DROP POLICY IF EXISTS "Customers can insert own addresses" ON public.customer_addresses;
DROP POLICY IF EXISTS "Customers can update own addresses" ON public.customer_addresses;
DROP POLICY IF EXISTS "Customers can delete own addresses" ON public.customer_addresses;
DROP POLICY IF EXISTS "Admins can view addresses" ON public.customer_addresses;

CREATE POLICY "Customers can view own addresses" ON public.customer_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own addresses" ON public.customer_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update own addresses" ON public.customer_addresses
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can delete own addresses" ON public.customer_addresses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view addresses" ON public.customer_addresses
  FOR SELECT USING (public.is_admin());

-- 5.4 CUSTOMER WISHLIST POLICIES
DROP POLICY IF EXISTS "Customers can view own wishlist" ON public.customer_wishlist;
DROP POLICY IF EXISTS "Customers can insert own wishlist" ON public.customer_wishlist;
DROP POLICY IF EXISTS "Customers can update own wishlist" ON public.customer_wishlist;
DROP POLICY IF EXISTS "Customers can delete own wishlist" ON public.customer_wishlist;

CREATE POLICY "Customers can view own wishlist" ON public.customer_wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own wishlist" ON public.customer_wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update own wishlist" ON public.customer_wishlist
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can delete own wishlist" ON public.customer_wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- 5.5 CUSTOMER PROFILES POLICIES
DROP POLICY IF EXISTS "Customers can view own profile" ON public.customer_profiles;
DROP POLICY IF EXISTS "Customers can insert own profile" ON public.customer_profiles;
DROP POLICY IF EXISTS "Customers can update own profile" ON public.customer_profiles;
DROP POLICY IF EXISTS "Admins can view profiles" ON public.customer_profiles;

CREATE POLICY "Customers can view own profile" ON public.customer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own profile" ON public.customer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update own profile" ON public.customer_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view profiles" ON public.customer_profiles
  FOR SELECT USING (public.is_admin());

-- 6. GRANT TABLE ACCESS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_wishlist TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customer_profiles TO authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

-- 7. UPDATE place_order FUNCTION TO ACCEPT AND ATTACH user_id
CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_shipping_street text,
  p_shipping_city text,
  p_shipping_district text,
  p_payment_method text,
  p_items jsonb,
  p_customer_email text default null,
  p_shipping_postal text default null,
  p_landmark text default null,
  p_order_notes text default null,
  p_gift_note text default null,
  p_idempotency_key text default null,
  p_user_id uuid default null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
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
  v_final_user_id uuid;
BEGIN
  -- Determine user_id: explicit parameter or current authenticated user
  v_final_user_id := coalesce(p_user_id, auth.uid());

  -- 1. Idempotency Check: return existing order if key was already processed
  IF p_idempotency_key IS NOT NULL AND trim(p_idempotency_key) <> '' THEN
    IF EXISTS (SELECT 1 FROM public.orders WHERE idempotency_key = trim(p_idempotency_key)) THEN
      SELECT id, access_token, subtotal, delivery_fee, total, status, waybill
      INTO v_order_id, v_access_token, v_subtotal, v_delivery_fee, v_total, v_status, v_waybill
      FROM public.orders
      WHERE idempotency_key = trim(p_idempotency_key);

      RETURN jsonb_build_object(
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
    END IF;
  END IF;

  -- 2. Input validation
  IF trim(coalesce(p_customer_name, '')) = '' THEN
    RAISE EXCEPTION 'Customer name is required.';
  END IF;
  IF char_length(p_customer_name) > 100 THEN
    RAISE EXCEPTION 'Customer name exceeds 100 characters.';
  END IF;

  IF trim(coalesce(p_customer_phone, '')) = '' THEN
    RAISE EXCEPTION 'Customer phone is required.';
  END IF;
  IF char_length(p_customer_phone) > 30 THEN
    RAISE EXCEPTION 'Customer phone exceeds 30 characters.';
  END IF;

  IF trim(coalesce(p_shipping_street, '')) = '' OR trim(coalesce(p_shipping_city, '')) = '' THEN
    RAISE EXCEPTION 'Shipping street address and city are required.';
  END IF;

  IF p_payment_method NOT IN ('cod', 'bank', 'card') THEN
    RAISE EXCEPTION 'Invalid payment method: %', p_payment_method;
  END IF;

  -- 3. Validate items array
  v_items_count := jsonb_array_length(p_items);
  IF v_items_count IS NULL OR v_items_count = 0 THEN
    RAISE EXCEPTION 'Cart cannot be empty.';
  END IF;
  IF v_items_count > 50 THEN
    RAISE EXCEPTION 'Cart item limit exceeded.';
  END IF;

  -- 4. Load delivery settings from site_settings
  SELECT standard_delivery_fee, free_delivery_threshold
  INTO v_delivery_fee, v_free_threshold
  FROM public.site_settings
  WHERE id = 'default';

  IF v_delivery_fee IS NULL THEN
    v_delivery_fee := 450;
    v_free_threshold := 5000;
  END IF;

  -- 5. Lock and validate each item, recalculate real subtotal from database
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(variant_id uuid, quantity integer) LOOP
    IF v_item.quantity IS NULL OR v_item.quantity <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero.';
    END IF;
    IF v_item.quantity > 500 THEN
      RAISE EXCEPTION 'Quantity exceeds maximum allowable single order limit.';
    END IF;

    SELECT id, product_id, weight, price, stock, is_active
    INTO v_variant
    FROM public.product_variants
    WHERE id = v_item.variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product variant with ID % not found.', v_item.variant_id;
    END IF;

    IF v_variant.is_active = false THEN
      RAISE EXCEPTION 'Variant % is currently unavailable.', v_variant.weight;
    END IF;

    IF v_variant.stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for % (Available: %, Requested: %).', v_variant.weight, v_variant.stock, v_item.quantity;
    END IF;

    -- Decrement stock atomically
    UPDATE public.product_variants
    SET stock = stock - v_item.quantity,
        updated_at = now()
    WHERE id = v_variant.id;

    v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
  END LOOP;

  -- 6. Calculate delivery fee and total
  IF v_subtotal >= v_free_threshold THEN
    v_delivery_fee := 0;
  END IF;
  v_total := v_subtotal + v_delivery_fee;

  -- 7. Generate next order number CC-XXXXXX
  SELECT coalesce(max(nullif(regexp_replace(id, '\D', '', 'g'), '')::integer), 100) + 1
  INTO v_next_num
  FROM public.orders;

  v_order_id := 'CC-' || lpad(v_next_num::text, 6, '0');
  v_access_token := replace(gen_random_uuid()::text, '-', '');
  v_random_waybill := 'CLN-' || floor(10000000 + random() * 90000000)::bigint::text || '-LK';

  -- 8. Insert into public.orders with user_id
  INSERT INTO public.orders (
    id,
    user_id,
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
  ) VALUES (
    v_order_id,
    v_final_user_id,
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
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(variant_id uuid, quantity integer) LOOP
    SELECT p.id AS product_id, p.name AS product_name, pv.weight AS variant_weight, pv.price, (
      coalesce((SELECT url FROM public.product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
               p.images[1], '')
    ) AS image
    INTO v_product
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = v_item.variant_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_weight,
      price,
      quantity,
      image
    ) VALUES (
      v_order_id,
      v_product.product_id,
      v_item.variant_id,
      v_product.product_name,
      v_product.variant_weight,
      v_product.price,
      v_item.quantity,
      v_product.image
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'access_token', v_access_token,
    'waybill', v_random_waybill,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_total,
    'status', 'placed'
  );
END;
$$;

-- Grant execution to anon (guest checkout) and authenticated (registered customers)
GRANT EXECUTE ON FUNCTION public.place_order(text, text, text, text, text, text, jsonb, text, text, text, text, text, text, uuid) TO anon, authenticated;

-- Keep backward compatibility overload for legacy calls without p_user_id
CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_shipping_street text,
  p_shipping_city text,
  p_shipping_district text,
  p_payment_method text,
  p_items jsonb,
  p_customer_email text default null,
  p_shipping_postal text default null,
  p_landmark text default null,
  p_order_notes text default null,
  p_gift_note text default null,
  p_idempotency_key text default null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  RETURN public.place_order(
    p_customer_name,
    p_customer_phone,
    p_shipping_street,
    p_shipping_city,
    p_shipping_district,
    p_payment_method,
    p_items,
    p_customer_email,
    p_shipping_postal,
    p_landmark,
    p_order_notes,
    p_gift_note,
    p_idempotency_key,
    auth.uid()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order(text, text, text, text, text, text, jsonb, text, text, text, text, text, text) TO anon, authenticated;

-- 8. LINK GUEST ORDER TO AUTHENTICATED CUSTOMER ACCOUNT
CREATE OR REPLACE FUNCTION public.link_customer_order(
  p_order_id text,
  p_phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_order_id text;
  v_clean_phone text;
  v_uid uuid;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required to link orders.');
  END IF;

  v_clean_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  IF length(v_clean_phone) > 9 AND v_clean_phone LIKE '94%' THEN
    v_clean_phone := substring(v_clean_phone from 3);
  END IF;
  IF length(v_clean_phone) = 10 AND v_clean_phone LIKE '0%' THEN
    v_clean_phone := substring(v_clean_phone from 2);
  END IF;

  SELECT id INTO v_order_id
  FROM public.orders
  WHERE (upper(id) = upper(trim(p_order_id)) OR upper(id) = upper('CC-' || trim(p_order_id)))
    AND (
      regexp_replace(customer_phone, '\D', '', 'g') LIKE '%' || v_clean_phone
      OR v_clean_phone LIKE '%' || regexp_replace(customer_phone, '\D', '', 'g')
    )
  LIMIT 1;

  IF v_order_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No matching order found for this Order ID and phone number.');
  END IF;

  -- Attach user_id to order
  UPDATE public.orders
  SET user_id = v_uid,
      updated_at = now()
  WHERE id = v_order_id;

  RETURN jsonb_build_object('success', true, 'order_id', v_order_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_customer_order(text, text) TO authenticated;

-- 9. ENABLE REALTIME SYNC ON ADDRESSES & WISHLIST
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'customer_addresses') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_addresses;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'customer_wishlist') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_wishlist;
  END IF;
END $$;
