-- ==============================================================================
-- CEYLON CRUNCH - INITIAL CATALOG SEED DATA
-- Run this script in: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'black-raisins';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'black-raisins',
      'Black Raisins',
      'Naturally Sweet & Seedless · Sun-Dried',
      'dried-fruits',
      'Sun-Dried',
      'Selected Mediterranean Vineyards',
      'Sun-dried raw whole vine fruit',
      4.9,
      24,
      ARRAY['/products/dried-fruits/black-raisins.jpeg'],
      'Naturally sun-dried plump black raisins with rich natural sweetness, succulent texture, and high iron and antioxidant content. Excellent for soaking, daily vitality, and wholesome baking.',
      ARRAY['Carefully harvested from sun-drenched vineyards and gently sun-dried to lock in natural sugars and dense minerals.', '100% seedless with a luscious chew and clean finish without artificial additives.'],
      '100% Sun-Dried Seedless Black Raisins',
      'Store in an airtight container in a cool, dry pantry.',
      '9 Months',
      'Processed in a facility that handles tree nuts and seeds.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 450, 518, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 950, 1093, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1800, 2016, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3450, 3795, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-apricots';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-apricots',
      'Dried Apricots',
      'Tender Sun-Dried Mediterranean Apricots',
      'dried-fruits',
      'High Fibre',
      'Sun-Drenched Mediterranean Orchards',
      'Naturally sun-cured whole pitted fruit',
      4.8,
      31,
      ARRAY['/products/dried-fruits/dried-apricots.jpeg'],
      'Plump, golden-orange dried apricots with a delicate honeyed aroma, chewy bite, and rich vitamin A profile. A nourishing sweet snack for all ages.',
      ARRAY['Grown in mountain valleys where hot sunny days and cool nights produce unusually sweet, plump apricots.', 'Carefully hand-pitted and sun-dried to preserve soft, moist fruit centers.'],
      '100% Whole Dried Apricots',
      'Keep refrigerated or in cool dry storage.',
      '8 Months',
      'Processed in a facility that handles tree nuts.',
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
    VALUES (v_prod_id, '500g', 2750, 3080, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5200, 5720, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-banana';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-banana',
      'Dried Natural Bananas',
      'Chewy Sun-Cured Sweet Banana Slices',
      'dried-fruits',
      'Potassium Rich',
      'Ceylon Tropical Plantations',
      'Dehydrated raw sweet banana coins',
      4.7,
      19,
      ARRAY['/products/dried-fruits/dried-banana.jpeg'],
      'Naturally sweet dried banana slices prepared without added sugar or artificial preservatives. Excellent energy-boosting bite for workouts, trail walks, and breakfast bowls.',
      ARRAY['Harvested at peak ripeness from certified Sri Lankan tropical growers.', 'Retains concentrated potassium, dietary fibre, and natural fruit sugars.'],
      '100% Ripe Dehydrated Bananas',
      'Store in an airtight container in a cool pantry.',
      '6 Months',
      'All-natural fruit. Packaged in a facility handling tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 420, 483, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 890, 1023, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1700, 1904, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3250, 3575, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-cherries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-cherries',
      'Dried Cherries',
      'Tart & Sweet Ruby Red Pitted Cherries',
      'dried-fruits',
      'Antioxidant Rich',
      'Montmorency Valley Orchards',
      'Sun-cured and infused whole berries',
      4.9,
      28,
      ARRAY['/products/dried-fruits/dried-cherries.jpeg'],
      'Vibrant, tangy-sweet dried ruby cherries bursting with natural flavour. Perfect for breakfast cereals, artisan sourdough baking, salads, and charcuterie boards.',
      ARRAY['Pitted carefully while fresh and gently dried to retain their intense crimson tone and juicy bite.', 'Naturally abundant in anthocyanins and restorative plant antioxidants.'],
      'Dried Pitted Red Cherries, Natural Fruit Juice',
      'Store in a cool dry space.',
      '8 Months',
      'May contain occasional pit fragments.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 850, 977, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1890, 2174, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3600, 4032, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6900, 7590, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-cranberries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-cranberries',
      'Dried Cranberries',
      'Gently Infused Crisp Whole Berries',
      'dried-fruits',
      'Immunity Boost',
      'Highland Pure Bogs',
      'Air-dried whole plump cranberries',
      4.8,
      36,
      ARRAY['/products/dried-fruits/dried-cranberries.jpeg'],
      'Vibrant crimson dried cranberries with the classic sweet-tart balance. Excellent in oatmeals, trail mixes, festive salads, and holiday baking.',
      ARRAY['Picked from pristine cool climate bogs and gently infused to temper natural tartness.', 'Celebrated for urinary tract and gut microbiome wellness.'],
      'Dried Whole Cranberries, Natural Apple Juice Concentrate',
      'Store in cool pantry conditions.',
      '9 Months',
      'Packed in a facility handling tree nuts and seeds.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 590, 679, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1290, 1483, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2450, 2744, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4650, 5115, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-figs';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-figs',
      'Dried Figs',
      'Large Golden Garland Sun-Dried Figs',
      'dried-fruits',
      'Calcium & Iron',
      'Aegean Basin Terraces',
      'Naturally sun-dried whole figs',
      5,
      42,
      ARRAY['/products/dried-fruits/dried-figs.jpeg'],
      'Soft, chewy dried figs filled with natural crunchy seeds and luscious honey sweetness. Renowned for digestive vitality and exceptional calcium density.',
      ARRAY['Sun-dried on traditional wooden racks under Mediterranean sunshine.', 'Eaten whole or soaked overnight in warm water for traditional morning vitality.'],
      '100% Whole Sun-Dried Figs (Anjeer)',
      'Keep sealed in cool temperatures.',
      '8 Months',
      'Processed in a facility handling tree nuts.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 890, 1023, 25);
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

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-kiwi';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-kiwi',
      'Dried Kiwi Slices',
      'Zesty Emerald Green Fruit Coins',
      'dried-fruits',
      'Vitamin C Boost',
      'Pristine Mountain Valleys',
      'Low-heat dehydrated kiwi wheels',
      4.7,
      15,
      ARRAY['/products/dried-fruits/dried-kiwi.jpeg'],
      'Bright and pleasantly tart dried kiwi rings with tiny crunchy seeds. Delicious gourmet fruit treat with remarkable vitamin C retention and striking presentation.',
      ARRAY['Sliced evenly from fresh, fully ripened kiwifruit and low-temperature dried to retain green chlorophyll and zingy flavor.'],
      '100% Sliced Dehydrated Kiwi',
      'Store away from direct moisture.',
      '7 Months',
      'May contain traces of tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 550, 633, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1190, 1369, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2250, 2520, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4250, 4675, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-mango';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-mango',
      'Dried Tropical Mango Strips',
      'Chewy Sun-Ripened Sweet Alphonso & Willard Strips',
      'dried-fruits',
      '100% Natural',
      'Ceylon Coastal & Dry Zone Groves',
      'Solar-dehydrated mango spears',
      4.9,
      47,
      ARRAY['/products/dried-fruits/dried-mango.jpeg'],
      'Thick cut, vibrant sunshine-yellow dried mango slices packed with intense natural tropical sweetness and chewiness. Zero added sugar or colorings.',
      ARRAY['Sourced directly from local Sri Lankan orchards during peak harvest season.', 'Naturally full of beta-carotene, vitamin C, and wholesome fiber.'],
      '100% Ripe Mango Strips',
      'Store in an airtight jar in a cool place.',
      '8 Months',
      'All-natural fruit.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 620, 713, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1350, 1552, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2550, 2856, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4800, 5280, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-papaya';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-papaya',
      'Dried Golden Papaya Spears',
      'Tender Red Lady Papaya Spears',
      'dried-fruits',
      'Digestive Enzymes',
      'Tropical Agro Orchards, Sri Lanka',
      'Gently dehydrated papaya spears',
      4.6,
      18,
      ARRAY['/products/dried-fruits/dried-papaya.jpeg'],
      'Subtly sweet dried papaya spears rich in natural papain enzymes, beta carotene, and dietary fibre. A light, easy-to-digest tropical provision.',
      ARRAY['Dehydrated under hygienic low-temperature conditions to preserve wholesome fruit integrity.'],
      '100% Ripe Papaya',
      'Store in a dry cool place.',
      '7 Months',
      'Packaged in a nut-handling environment.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 480, 552, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1050, 1208, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1980, 2218, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3750, 4125, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-peach';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-peach',
      'Dried Peach Halves',
      'Velvety Sun-Dried Stone Fruit Halves',
      'dried-fruits',
      'Sweet & Tangy',
      'Highland Fruit Foothills',
      'Sun-dried pitted peach halves',
      4.8,
      22,
      ARRAY['/products/dried-fruits/dried-peach.jpeg'],
      'Large, luscious dried peach halves with a deep amber hue and aromatic stone-fruit fragrance. Full of natural sweetness, provitamin A, and potassium.',
      ARRAY['Whole peaches hand-halved and sun-cured naturally on orchard trays.'],
      '100% Sun-Dried Pitted Peaches',
      'Keep cool and dry.',
      '8 Months',
      'Processed in a facility handling tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 690, 793, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1490, 1713, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2850, 3192, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5400, 5940, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-pineapple';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-pineapple',
      'Dried Ceylon Pineapple Rings',
      'Mauritius Gold Pineapple Wheels',
      'dried-fruits',
      'Enzyme Rich',
      'Gampaha Valley, Sri Lanka',
      'Solar-cured pineapple wheels',
      4.9,
      39,
      ARRAY['/products/dried-fruits/dried-pineapple.jpeg'],
      'Dehydrated slices of famous Sri Lankan Mauritius pineapples. Tangy, concentrated sweetness with natural bromelain enzyme benefits and satisfying chewy rings.',
      ARRAY['Grown in the fertile red soils of western Sri Lanka and sliced fresh within hours of harvest.'],
      '100% Natural Dried Pineapple',
      'Airtight container in pantry.',
      '6 Months',
      'All-natural fruit.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 580, 667, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1250, 1438, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2350, 2632, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4450, 4895, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-plums';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-plums',
      'Dried Plums',
      'Sweet & Sour Sun-Cured Heritage Plums',
      'dried-fruits',
      'Traditional Taste',
      'Pristine Himalayan Foothills',
      'Naturally sun-cured whole plums',
      4.7,
      21,
      ARRAY['/products/dried-fruits/dried-plums.jpeg'],
      'Plump, juicy dried plums renowned across South Asian culinary traditions for refreshing sweet-sour chutneys, stews, biryanis, or direct wholesome snacking.',
      ARRAY['Hand-sorted for size, moisture, and classic tangy-sweet richness.'],
      'Sun-Dried Plums (Aaloobukhaara)',
      'Cool dry storage.',
      '9 Months',
      'Contains natural pits. Handle with care.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 520, 598, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1150, 1323, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2180, 2442, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4100, 4510, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-strawberries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-strawberries',
      'Whole Dried Strawberries',
      'Intensely Sweet Nuwara Eliya Mountain Strawberries',
      'dried-fruits',
      'Artisan Harvest',
      'Nuwara Eliya Highlands, Sri Lanka',
      'Dehydrated whole alpine berries',
      5,
      45,
      ARRAY['/products/dried-fruits/dried-strawberries.jpeg'],
      'Exquisite whole dried strawberries with concentrated berry perfume, gentle tartness, and luxurious ruby color. Perfect for breakfast bowls, granola, and gifting.',
      ARRAY['Grown in the misty, cool mountains of Nuwara Eliya and gently dried to preserve their natural heart shape and aroma.'],
      'Whole Dehydrated Strawberries',
      'Keep tightly sealed in a cool pantry.',
      '6 Months',
      'All-natural fruit.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 950, 1093, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 2100, 2415, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3980, 4458, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 7600, 8360, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'gojiberries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'gojiberries',
      'Himalayan Goji Berries',
      'Ancient Superfood Wolfberries · Sun-Dried',
      'dried-fruits',
      'Superfood',
      'Tibetan Plateau Valleys',
      'Sun-dried raw whole wolfberries',
      4.9,
      33,
      ARRAY['/products/dried-fruits/gojiberries.jpeg'],
      'Authentic nutrient-dense dried wolfberries with deep crimson color, gentle herbaceous sweetness, and extraordinary zeaxanthin and antioxidant levels.',
      ARRAY['Prized for millennia in traditional herbalism for supporting eye health, stamina, and cellular longevity.'],
      '100% Raw Dried Goji Berries',
      'Cool, dark, dry conditions.',
      '10 Months',
      'Packaged in a facility handling tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 790, 908, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1750, 2012, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3350, 3752, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6400, 7040, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'golden-raisins';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'golden-raisins',
      'Golden Raisins',
      'Honey-Sweet Seedless Golden Sultanas',
      'dried-fruits',
      'Clean & Tender',
      'Valley Vineyards',
      'Sun-cured seedless white grapes',
      4.8,
      29,
      ARRAY['/products/dried-fruits/golden-raisins.jpeg'],
      'Radiant golden raisins with soft, melt-in-the-mouth texture and honey-like sweetness. Essential for Sri Lankan biryanis, watalappam, yellow rice, and morning oats.',
      ARRAY['Carefully washed, stemmed, and sorted for consistent golden colour and plumpness.'],
      '100% Seedless Golden Raisins',
      'Airtight storage.',
      '9 Months',
      'Packaged in a facility handling tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 440, 506, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 920, 1058, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1750, 1960, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3300, 3630, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'pitted-prunes';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'pitted-prunes',
      'Tender Pitted Prunes',
      'Moist & Plump French D''Agen Dried Plums',
      'dried-fruits',
      'Digestive Health',
      'Pristine Orchard Valleys',
      'Steam-tenderized pitted dried plums',
      4.9,
      38,
      ARRAY['/products/dried-fruits/pitted-prunes.jpeg'],
      'Naturally sweet, tender, stone-free pitted prunes famous for promoting gut health and gentle digestion. Rich in sorbitol, potassium, and bone-strengthening vitamin K.',
      ARRAY['Pitted without tearing the fruit meat, leaving a plump, succulent prune ready to eat.'],
      '100% Pitted Dried Prunes',
      'Refrigerate after opening for peak freshness.',
      '9 Months',
      'May contain occasional pit fragments.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 620, 713, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1350, 1552, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2550, 2856, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4850, 5335, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'apricot-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'apricot-seeds',
      'Sweet Apricot Kernels',
      'Sun-Dried Natural Sweet Kernels',
      'seeds',
      'Nutrient Dense',
      'Highland Mountain Orchards',
      'Raw sun-dried sweet kernels',
      4.8,
      20,
      ARRAY['/products/seeds/apricot-seeds.jpeg'],
      'Crisp and almond-like sweet apricot kernels, rich in plant protein, dietary fiber, and healthy monounsaturated fatty acids. Delicious direct snack.',
      ARRAY['Selected strictly from sweet apricot varieties with zero bitterness.'],
      '100% Sweet Apricot Kernels',
      'Airtight cool pantry.',
      '8 Months',
      'Contains stone-fruit kernels.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 490, 564, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1080, 1242, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2050, 2296, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3900, 4290, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'black-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'black-seeds',
      'Black Seeds',
      'Blessed Seed · High Thymoquinone & Purity Tested',
      'seeds',
      'Immunity Vitality',
      'Traditional Agro Holdings',
      'Cleaned raw whole seeds',
      5,
      52,
      ARRAY['/products/seeds/black-seeds.jpeg'],
      'Revered for centuries across Ayurvedic and prophetic medicine. Aromatic, pitch-black seeds with intense herbal pungency and scientifically verified thymoquinone potency.',
      ARRAY['Carefully machine-cleaned and triple-sieved to remove dust and debris.', 'Enjoy whole with honey, brewed as herbal tea, or sprinkled over artisan breads.'],
      '100% Pure Nigella Sativa Seeds (Kalonji)',
      'Cool, dark dry container.',
      '12 Months',
      'Pure whole spice seed.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 380, 437, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 790, 908, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1480, 1658, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2800, 3080, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'chia-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'chia-seeds',
      'Raw Organic Chia Seeds',
      'Triple-Cleaned Black Salvia Hispanica Seeds',
      'seeds',
      'Omega-3 & Fibre',
      'South American Volcanic Soils',
      'Raw unprocessed whole seeds',
      4.9,
      64,
      ARRAY['/products/seeds/chia-seeds.jpeg'],
      'Super-clean black chia seeds that swell into a rich gel. Provides immense plant omega-3s, soluble fibre, and lasting hydration for active lifestyles.',
      ARRAY['Certified 99.9% purity seed grade with zero grit or sediment.', 'Mix into water, smoothies, overnight puddings, or juices for sustained endurance.'],
      '100% Whole Chia Seeds',
      'Sealed in a dry, cool jar.',
      '12 Months',
      'Gluten-free seed.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 420, 483, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 890, 1023, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1680, 1882, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3150, 3465, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'flax-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'flax-seeds',
      'Golden Flax Seeds',
      'Cold-Grown Lignan & Omega-3 Powerhouse',
      'seeds',
      'Heart Healthy',
      'Prairie Harvest Farms',
      'Cleaned raw golden seeds',
      4.8,
      34,
      ARRAY['/products/seeds/flax-seeds.jpeg'],
      'Golden flax seeds with a clean nutty aroma. Exceptionally high in ALA omega-3 and lignans. Ideal for smoothies, fresh milling, rotis, and baking.',
      ARRAY['Golden varieties feature a milder, more delicate taste than brown flaxseeds.'],
      '100% Whole Golden Flax Seeds',
      'Store in a cool pantry or fridge.',
      '10 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 320, 368, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 690, 793, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1280, 1434, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2390, 2629, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'hemp-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'hemp-seeds',
      'Shelled Hemp Hearts',
      'Raw Soft Nutty Hearts · Complete Plant Protein',
      'seeds',
      'Complete Protein',
      'Canadian Organic Valleys',
      'Mechanically hulled raw hemp hearts',
      5,
      41,
      ARRAY['/products/seeds/hemp-seeds.jpeg'],
      'Tender, creamy shelled hemp hearts containing all 9 essential amino acids with an optimal 3:1 ratio of omega-6 to omega-3 fatty acids. Soft enough to eat by the spoonful.',
      ARRAY['Gently mechanically hulled without heat or chemical treatment to preserve live enzymes.'],
      '100% Raw Shelled Hemp Hearts',
      'Keep refrigerated after opening.',
      '8 Months',
      'Pure hulled seeds.',
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
    VALUES (v_prod_id, '500g', 3700, 4144, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 7100, 7810, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'melon-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'melon-seeds',
      'Musk Melon Seeds',
      'White Hulled Cantaloupe Kernels',
      'seeds',
      'Cooling & Delicate',
      'Sun-Warmed Agricultural Plains',
      'Naturally hulled melon kernels',
      4.7,
      16,
      ARRAY['/products/seeds/melon-seeds.jpeg'],
      'Sweet, creamy hulled musk melon seeds used in traditional royal confectionery, creamy curries, dessert gravies, and cooling summer drinks.',
      ARRAY['Carefully washed, hulled, and sun-dried for a pure ivory white kernel.'],
      '100% Hulled Musk Melon Seeds (Magaz)',
      'Airtight jar in a cool cupboard.',
      '9 Months',
      'Hulled seed kernel.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 450, 518, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 980, 1127, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1850, 2072, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3500, 3850, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'moringa-powder';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'moringa-powder',
      'Pure Ceylon Moringa Leaf Powder',
      'Shade-Dried Miracle Tree Supergreen',
      'seeds',
      'Ceylon Green Miracle',
      'Dry Zone Groves, Sri Lanka',
      'Low-temperature dehydrated and micro-milled',
      4.9,
      48,
      ARRAY['/products/seeds/moringa-powder.jpeg'],
      'Micro-milled vibrant green powder made from 100% organically grown Sri Lankan drumstick (murunga) leaves. Rich in bioavailable iron, calcium, and 46 antioxidants.',
      ARRAY['Shade-dried immediately upon harvest to prevent heat breakdown of vitamins.', 'Stir half a teaspoon into warm water, morning green juices, or dhal curries.'],
      '100% Pure Moringa Oleifera Leaf Powder',
      'Keep in an airtight tin away from direct sunlight.',
      '12 Months',
      'Pure single-origin leaf powder.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 490, 564, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1100, 1265, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2050, 2296, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3900, 4290, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'psyllium-husk';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'psyllium-husk',
      'Whole Psyllium Husk',
      'Pure Dietary Soluble Fiber Flakes',
      'seeds',
      'Digestive Wellness',
      'Selected Agro Fields',
      'Milled seed husk flakes',
      4.8,
      37,
      ARRAY['/products/seeds/psyllium-husk.jpeg'],
      'Gentle, soluble dietary fibre flakes that support smooth digestion, regular bowel movements, and gut motility when mixed with warm water, juice, or curd.',
      ARRAY['99% grade white husk with high swelling capacity and zero grit.'],
      '100% Pure Psyllium Husk (Plantago ovata)',
      'Store in a dry pantry away from moisture.',
      '14 Months',
      'Drink with adequate water.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 550, 633, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1200, 1380, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2250, 2520, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4200, 4620, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'pumpkin-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'pumpkin-seeds',
      'Raw AAA Pepitas',
      'Dark Green Jumbo Austrian Style Pepitas',
      'seeds',
      'Zinc & Magnesium',
      'Certified Organic Plantations',
      'Raw hulled dark green pepitas',
      5,
      58,
      ARRAY['/products/seeds/pumpkin-seeds.jpeg'],
      'Crisp, whole dark-green pumpkin seed kernels without hulls. Abundant in dietary zinc, magnesium, and restorative antioxidants for restorative sleep and vitality.',
      ARRAY['Naturally hull-less variety selected for its high oil density and sweet nutty flavor.'],
      '100% Hulled Pumpkin Seeds (Pepitas)',
      'Airtight dry glass container.',
      '9 Months',
      'Allergen-free natural seed.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 540, 621, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1190, 1369, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2250, 2520, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4250, 4675, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'quinoa-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'quinoa-seeds',
      'Royal Organic Quinoa Seeds',
      'Saponin-Free Pre-Washed Andean Grains',
      'seeds',
      'Gluten-Free Grain',
      'Altiplano Plateaus',
      'De-saponified raw whole quinoa grain',
      4.8,
      26,
      ARRAY['/products/seeds/quinoa-seeds.jpeg'],
      'Wholesome complete-protein ancient seed grain. Pre-washed to eliminate bitterness and cooks into a light, fluffy, nutty rice alternative in 15 minutes.',
      ARRAY['Contains all nine essential amino acids with low glycemic impact.'],
      '100% Organic Quinoa Seeds',
      'Cool dry pantry storage.',
      '12 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 450, 518, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 980, 1127, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1850, 2072, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3500, 3850, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'rosemary';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'rosemary',
      'Aromatic Whole Dried Rosemary',
      'Mountain-Grown Needle Leaves',
      'seeds',
      'Herb & Culinary',
      'Sun-Drenched Mediterranean Terraces',
      'Naturally air-dried whole needle leaves',
      4.7,
      17,
      ARRAY['/products/seeds/rosemary.jpeg'],
      'Pungent, piney dried rosemary needle leaves rich in rosmarinic acid and natural botanical oils. Ideal for herbal infusions, sourdough baking, roast potatoes, and marinades.',
      ARRAY['Hand-harvested prior to flowering for maximum essential oil density.'],
      '100% Dried Whole Rosemary Leaves',
      'Airtight spice jar away from light.',
      '12 Months',
      'Pure dried herb.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 390, 448, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 850, 977, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1600, 1792, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3000, 3300, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'sesame-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'sesame-seeds',
      'Black Sesame Seeds',
      'Unpolished Natural Black Sesame',
      'seeds',
      'Calcium Rich',
      'Dry Zone Organic Allotments, Sri Lanka',
      'Triple-sieved raw black sesame',
      4.8,
      29,
      ARRAY['/products/seeds/sesame-seeds.jpeg'],
      'Naturally unpolished black sesame seeds with an earthy aroma and deep mineral richness. High in plant calcium, iron, and lignans for hair and bone strength.',
      ARRAY['Grown traditionally in the dry agricultural zones of northern and eastern Sri Lanka.'],
      '100% Natural Black Sesame Seeds',
      'Sealed cool pantry.',
      '10 Months',
      'Contains sesame.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 360, 414, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 790, 908, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1480, 1658, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2800, 3080, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'sunflower-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'sunflower-seeds',
      'Shelled Raw Sunflower Seeds',
      'Tender Kernel Seeds · High Vitamin E',
      'seeds',
      'Vitamin E Rich',
      'Rolling Sunflower Basins',
      'Mechanically hulled raw kernel seeds',
      4.9,
      43,
      ARRAY['/products/seeds/sunflower-seeds.jpeg'],
      'Plump, grey-striped sunflower seed hearts with a pleasant buttery snap. Loaded with cellular protective vitamin E, selenium, and copper for heart health.',
      ARRAY['Triple cleaned and screened for intact, fresh kernels without bitter shells.'],
      '100% Shelled Raw Sunflower Kernels',
      'Keep dry and cool.',
      '9 Months',
      'Packaged in a nut-handling environment.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 380, 437, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 820, 943, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1550, 1736, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2950, 3245, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'watermelon-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'watermelon-seeds',
      'Hulled Watermelon Kernels',
      'Crisp White Nutrient-Dense Seed Kernels',
      'seeds',
      'Protein Dense',
      'Fertile River Basins',
      'Hulled raw white watermelon seeds',
      4.7,
      18,
      ARRAY['/products/seeds/watermelon-seeds.jpeg'],
      'Carefully hulled watermelon seed kernels, packed with plant protein, B vitamins, and healthy unsaturated fats. Great snack or culinary thickening agent.',
      ARRAY['Light, crunchy kernels with a delicate buttery flavor.'],
      '100% Hulled Watermelon Kernels',
      'Airtight storage.',
      '9 Months',
      'Pure seed kernel.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 420, 483, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 920, 1058, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1750, 1960, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3300, 3630, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'white-quinoa';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'white-quinoa',
      'Pearl White Organic Quinoa',
      'Delicate Fluffy Ancient Seed Grain',
      'seeds',
      'Ancient Grain',
      'High Andean Terraces',
      'Triple-washed raw pearl quinoa',
      4.8,
      25,
      ARRAY['/products/seeds/white-quinoa.jpeg'],
      'Mild, delicate pearl-white quinoa seeds with gentle fluffiness and subtle nutty taste. Cooks in 15 minutes as a nutritious gluten-free staple.',
      ARRAY['The classic white variety is the fluffiest and quickest cooking of all quinoa strains.'],
      '100% Pearl White Quinoa Seeds',
      'Airtight container in dry place.',
      '12 Months',
      'Gluten-free seed.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 460, 529, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 990, 1139, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1880, 2106, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3550, 3905, 10);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'white-sesame';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'white-sesame',
      'Natural Hulled White Sesame Seeds',
      'Aromatic Golden-Ivory Sweet Seeds',
      'seeds',
      'Traditional Garnish',
      'Dry Zone Agro Orchards, Sri Lanka',
      'Gently hulled and cleaned white seeds',
      4.9,
      35,
      ARRAY['/products/seeds/white-sesame.jpeg'],
      'Clean, aromatic white sesame seeds with pleasant sweetness when toasted. Ideal for traditional Sri Lankan sweetmeats, tahini, stir-fries, and bakery garnishing.',
      ARRAY['Hulled gently using clean water washing without chemical bleach.'],
      '100% Natural White Sesame Seeds',
      'Dry sealed pantry.',
      '10 Months',
      'Contains sesame.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 360, 414, 25);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 780, 897, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1460, 1635, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2750, 3025, 10);
  END IF;
END $$;

