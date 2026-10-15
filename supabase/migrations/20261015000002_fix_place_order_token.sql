-- ==============================================================================
-- CEYLON CRUNCH - MIGRATION 002: FIX PLACE_ORDER ACCESS TOKEN GENERATION
-- File: supabase/migrations/20261015000002_fix_place_order_token.sql
-- ==============================================================================

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
set search_path = public, extensions, pg_temp
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

grant execute on function public.place_order(text, text, text, text, text, text, jsonb, text, text, text, text, text, text) to anon, authenticated;
