-- ==============================================================================
-- CEYLON CRUNCH - SEED 6 MISSING NUTS & HAMPERS INTO SUPABASE
-- Run this script in: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

-- Step 1: Ensure missing categories exist in public.categories
INSERT INTO public.categories (id, name, description, display_order, is_active)
VALUES
  ('mixes', 'Artisan Mixes', 'Nutritious roasted bites, crunch clusters, and wholesome blends', 11, true),
  ('berries', 'Berries', 'Antioxidant-rich dried berries and superfruits', 12, true),
  ('exotic-nuts', 'Exotic Nuts', 'Rare and premium tree nuts from around the globe', 13, true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Step 2: Insert the 6 missing products & their variants

-- 1. Roasted Almonds
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'roasted-almonds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'roasted-almonds',
      'Roasted Almonds',
      'Crunchy Slow-Roasted California Almonds',
      'nuts',
      'Popular Pick',
      'Selected Groves',
      'Slow dry-roasted with light sea salt',
      4.9,
      42,
      ARRAY['/products/nuts/almonds.jpg'],
      'Whole premium crunchy almonds, slow dry-roasted to golden perfection. Packed with plant protein, vitamin E, and wholesome dietary fibre for your daily vitality.',
      ARRAY['Carefully selected whole kernel almonds.', 'Evenly roasted without excess oils for a clean, rich nutty flavour.'],
      '100% Whole Roasted Almonds, Sea Salt',
      'Store in an airtight container in a cool, dry pantry.',
      '9 Months',
      'Contains tree nuts (almonds).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 650, 747, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1450, 1667, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2800, 3136, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5400, 5940, 10);
  END IF;
END $$;

-- 2. Puttalam Roasted Cashews
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'roasted-cashews';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'roasted-cashews',
      'Puttalam Roasted Cashews',
      'Grade W-210 Golden Roasted Jumbo Cashews',
      'nuts',
      'Popular Pick',
      'Puttalam Cashew Belt, Sri Lanka',
      'Artisan slow-roasted with mineral sea salt',
      5,
      68,
      ARRAY['/products/nuts/cashews.jpg'],
      'Sri Lanka’s finest coastal Grade W-210 jumbo cashew nuts, slow-roasted in small batches to an alluring golden shade with a naturally sweet, buttery finish.',
      ARRAY['Directly sourced from the saline soil of the Puttalam coastal cashew belt.', 'No chemical bleaching or artificial glazing—100% pure artisan roast.'],
      '100% Puttalam Jumbo Cashews, Mineral Sea Salt',
      'Airtight sealed jar in cool dry environment.',
      '8 Months',
      'Contains tree nuts (cashews).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 850, 977, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1950, 2243, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3750, 4200, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 7200, 7920, 10);
  END IF;
END $$;

-- 3. Roasted Salted Pistachios
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'roasted-pistachios';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'roasted-pistachios',
      'Roasted Salted Pistachios',
      'Naturally Opened Roasted & Lightly Salted',
      'nuts',
      'Popular Pick',
      'Sun-Drenched Groves',
      'In-shell gently roasted with pink mineral salt',
      4.9,
      39,
      ARRAY['/products/nuts/pistachios.jpg'],
      'Gourmet whole in-shell pistachios, naturally smile-opened on the tree, slow-roasted and lightly salted to reveal vibrant emerald-green kernels rich in potassium and antioxidants.',
      ARRAY['Naturally tree-ripened and sun-cured for effortless shelling.', 'Satisfying savoury crunch ideal for mindful snacking.'],
      '100% Whole In-Shell Pistachios, Mineral Salt',
      'Store tightly sealed away from direct sunlight.',
      '9 Months',
      'Contains tree nuts (pistachios).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 780, 897, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1800, 2070, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3450, 3864, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6600, 7260, 10);
  END IF;
END $$;

-- 4. Artisan Mixed Nuts
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'mixed-nuts';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'mixed-nuts',
      'Artisan Mixed Nuts',
      'Roasted Cashews, Almonds, Pistachios & Walnuts',
      'mixes',
      'Popular Pick',
      'Ceylon Crunch Reserve',
      'Evenly roasted master blend',
      4.9,
      54,
      ARRAY['/products/nuts/mixed-nuts.jpg'],
      'A harmonious medley of slow-roasted jumbo cashews, California almonds, buttery walnuts, and shelled pistachios. The ultimate balance of crunch, healthy fats, and rich flavour.',
      ARRAY['Balanced ratio of 4 premium tree nuts with zero fillers or peanuts.', 'Gently roasted to perfection for everyday vitality and celebratory sharing.'],
      'Cashews, Almonds, Pistachios, Walnuts, Pure Sea Salt',
      'Keep airtight in a dry, dark cupboard.',
      '7 Months',
      'Contains tree nuts (cashews, almonds, pistachios, walnuts).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 800, 920, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1850, 2128, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3550, 3976, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6800, 7480, 10);
  END IF;
END $$;

-- 5. Curated Celebration Hamper
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'curated-hamper';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'curated-hamper',
      'Curated Celebration Hamper',
      'Luxury Gift Basket with Artisan Nuts, Dates & Fruits',
      'gifts-hampers',
      'Popular Pick',
      'Ceylon Crunch Artisan Gifting',
      'Curated gift packaging with silk ribbon',
      5,
      62,
      ARRAY['/products/gifting/curated-hamper.jpg'],
      'An opulent gift presentation in a handwoven wicker basket adorned with satin ribbon, featuring jars of roasted jumbo cashews, Medjool dates, dried fruits, and artisan nuts.',
      ARRAY['Perfect for weddings, corporate milestones, festive gifting, and gratitude.', 'Includes complimentary gift card with your handwritten personalized note.'],
      'Assorted roasted nuts, premium Medjool dates, dried fruits',
      'Store at room temperature in cool area.',
      '6 Months',
      'Contains various tree nuts and sesame.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = 'Standard Wicker Basket') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, 'Standard Wicker Basket', 6500, 7200, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = 'Deluxe Grand Basket') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, 'Deluxe Grand Basket', 9800, 11000, 12);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = 'Royal Executive Chest') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, 'Royal Executive Chest', 14500, 16000, 8);
  END IF;
END $$;

-- 6. Signature Wooden Nuts Box
DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'nuts-box';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'nuts-box',
      'Signature Wooden Nuts Box',
      '4-Section Handcrafted Wooden Gift Box with Assorted Nuts',
      'gifts-hampers',
      'Popular Pick',
      'Ceylon Crunch Bespoke Gifting',
      'Hand-finished wooden gift box',
      5,
      47,
      ARRAY['/products/gifting/nuts-box.jpg'],
      'A solid wooden presentation box with 4 partitioned compartments showcasing golden cashews, roasted almonds, cracked pistachios, and tender dried fruits with brass hardware.',
      ARRAY['Re-usable heirloom wooden keepsake box crafted by local wood artisans.', 'Sealed freshness compartments preserving aromatic crunch.'],
      'Puttalam Cashews, Roasted Almonds, In-shell Pistachios, Sun-dried Fruits',
      'Cool dry storage.',
      '6 Months',
      'Contains tree nuts.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '400g Keepsake Box') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '400g Keepsake Box', 4800, 5400, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '800g Family Feast Box') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '800g Family Feast Box', 8200, 9200, 15);
  END IF;
END $$;
