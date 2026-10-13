-- ==============================================================================
-- CEYLON CRUNCH - INITIAL CATALOG SEED DATA
-- Run this script in: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'walnuts-akhrot';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'walnuts-akhrot',
      'Walnuts (Akhrot)',
      'Premium Butterfly Halves · Cold-Cracked',
      'nuts',
      'Raw & Pure',
      'High-Altitude Cold-Cracked Orchards',
      'Sun-dried raw whole halves',
      4.9,
      38,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg/960px-Walnuts_-_whole_and_open_with_halved_kernel.jpg', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80'],
      'Crisp, intact walnut halves (Akhrot) with mild natural sweetness and zero bitterness. Rich in plant omega-3 fatty acids and antioxidants.',
      ARRAY['Carefully cracked by hand to preserve complete butterfly halves. Sourced from pristine high-altitude orchards and vacuum-packed for freshness.'],
      '100% Raw Walnut Kernels (Akhrot)',
      'Store in an airtight container in a cool, dry pantry or refrigerate after opening.',
      '6 Months',
      'Contains tree nuts (walnuts).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 878, 1014, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1950, 2243, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3705, 4193, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 7118, 7995, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'almonds-badam';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'almonds-badam',
      'Almonds (Badam)',
      'King Size Whole Kernels · Sun-Ripened',
      'nuts',
      'Best Seller',
      'Sun-Ripened Hand-Sorted Orchards',
      'Natural whole unblanched kernels',
      4.9,
      54,
      ARRAY['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg/960px-Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg'],
      'Sun-ripened whole raw almonds (Badam) with delicate golden-brown skin. Crunchy, naturally sweet, and packed with Vitamin E and plant protein.',
      ARRAY['Selected for uniform jumbo kernel size and sweet nutty crunch. Ideal for overnight soaking, daily snacking, or artisanal baking.'],
      '100% Whole Almond Kernels (Badam)',
      'Keep sealed in a cool, dry place away from sunlight.',
      '8 Months',
      'Contains tree nuts (almonds).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 608, 702, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1350, 1552, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2565, 2903, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4928, 5535, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'cashew-kaju';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'cashew-kaju',
      'Cashew (Kaju)',
      'Single-Estate W210 Jumbo · Ceylon Harvest',
      'nuts',
      'Ceylon Signature',
      'Puttalam & Mannar Belt, Sri Lanka',
      'Slow-cured whole ivory king kernels',
      5,
      72,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg/960px-Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80'],
      'Handpicked Grade-W210 jumbo Sri Lankan cashews (Kaju). Naturally creamy, buttery, and unmatched in crunch.',
      ARRAY['Harvested from smallholder orchards in Puttalam, Sri Lanka. Hand-graded for 100% whole ivory kernels with rich natural sweetness.'],
      '100% Pure Ceylon Whole Cashews (Kaju)',
      'Store in an airtight glass jar or resealed kraft pouch.',
      '6 Months',
      'Contains tree nuts (cashews).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 653, 754, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1450, 1667, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2755, 3118, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5293, 5945, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'pistachio-pista';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'pistachio-pista',
      'Pistachio (Pista)',
      'Roasted & Lightly Salted · Naturally Split',
      'nuts',
      'Harvest Fresh',
      'Emerald Kernel Reserve',
      'Pan-toasted in-shell with Hambantota sea salt',
      4.9,
      41,
      ARRAY['https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=900&q=80', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Pistachio_vera.jpg/960px-Pistachio_vera.jpg'],
      'Vibrant green open-shell roasted pistachios (Pista) finished with a whisper of pure sea salt crystals.',
      ARRAY['Sorted for naturally split shells and large emerald-purple kernels with a rich, savoury-sweet roast.'],
      'Pistachios (Pista), Pure Sea Salt',
      'Keep in an airtight container away from moisture.',
      '6 Months',
      'Contains tree nuts (pistachios).',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 1170, 1352, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 2600, 2990, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 4940, 5590, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 9490, 10660, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'raisins-kishmish';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'raisins-kishmish',
      'Raisins (Kishmish)',
      'Sun-Dried Golden & Long Green · Seedless',
      'dried-fruits',
      'Sun-Cured',
      'Sun-Drenched Vineyard Harvest',
      'Naturally shade-dried seedless grapes',
      4.8,
      29,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Raisins_01.jpg/960px-Raisins_01.jpg'],
      'Plump, honey-sweet seedless golden raisins (Kishmish), naturally dried without artificial glazing or added sugar.',
      ARRAY['Soft, juicy, and bursting with natural grape nectar. Perfect for festive Sri Lankan biryanis, cakes, oats, and healthy snacking.'],
      '100% Seedless Sun-Dried Raisins (Kishmish)',
      'Store in a cool, dry pantry.',
      '8 Months',
      'Naturally gluten-free. Packed in a facility that handles tree nuts.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 383, 442, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 850, 977, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1615, 1828, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3103, 3485, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-figs-anjeer';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-figs-anjeer',
      'Dried Figs (Anjeer)',
      'Whole Sun-Cured Rings · High Fibre',
      'dried-fruits',
      'Best Seller',
      'Traditional Sun-Dried Orchards',
      'Sun-cured whole tender figs',
      4.9,
      34,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Dried_figs_%282%29.jpg/960px-Dried_figs_%282%29.jpg', 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80'],
      'Soft, honey-rich sun-dried figs (Anjeer) with crunchy seed centres. Naturally rich in calcium, iron, and dietary fibre.',
      ARRAY['Cured under warm orchard sun without chemical bleaching. Delicious on their own, soaked overnight, or paired with walnuts and almonds.'],
      '100% Whole Sun-Dried Figs (Anjeer)',
      'Store in an airtight container; refrigerate in warm climates.',
      '8 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 833, 962, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1850, 2128, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3515, 3978, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6753, 7585, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-apricots-khubani';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-apricots-khubani',
      'Dried Apricots (Khubani)',
      'Pitted Golden Halves · Tangy-Sweet',
      'dried-fruits',
      'Orchard Pick',
      'Mountain Orchard Reserve',
      'Sun-ripened whole pitted apricots',
      4.8,
      24,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Ab_food_04.jpg/960px-Ab_food_04.jpg'],
      'Velvety, sun-dried golden apricots (Khubani) with a vibrant balance of floral sweetness and gentle orchard tang.',
      ARRAY['Rich in beta-carotene, potassium, and dietary fibre. Hand-pitted and gently dried to preserve their soft, chewy bite.'],
      '100% Sun-Dried Pitted Apricots (Khubani)',
      'Store sealed in a cool, dry place.',
      '8 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 743, 858, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1650, 1897, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3135, 3548, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6023, 6765, 6);
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
      'Dried Kiwi',
      'Emerald Green Slices · Tangy Tropical',
      'dried-fruits',
      'Vitamin C Rich',
      'Artisan Dehydrated Fruit Selection',
      'Gently dehydrated emerald kiwi rings',
      4.7,
      19,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Dried_kiwi_fruit_slices.jpg/960px-Dried_kiwi_fruit_slices.jpg'],
      'Vibrant emerald slices of dehydrated kiwi fruit with tiny crunchy black seeds and a refreshing sweet-tart zing.',
      ARRAY['Carefully sliced and slow-dried at low temperatures to preserve the jewel-green colour and bright tropical aroma.'],
      'Kiwi Fruit, Natural Cane Sugar',
      'Keep sealed in a cool, dry pantry.',
      '6 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 653, 754, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1450, 1667, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2755, 3118, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5293, 5945, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dried-prunes-aaloobukhaara';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dried-prunes-aaloobukhaara',
      'Dried Prunes (Aaloobukhaara)',
      'Succulent Pitted Plums · Gut Health',
      'dried-fruits',
      'Wellness Pick',
      'Heirloom Plum Orchards',
      'Tree-ripened sun-cured plums',
      4.8,
      21,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Rosales_-_Dried_Prunus_domestica_d.jpg/960px-Rosales_-_Dried_Prunus_domestica_d.jpg'],
      'Deep ruby-black pitted dried prunes (Aaloobukhaara) with rich plum sweetness and a soft, melt-in-the-mouth texture.',
      ARRAY['Renowned for digestive wellness and antioxidant richness. Enjoy straight from the pouch or stewed with warm Ceylon cinnamon.'],
      '100% Pitted Dried Prunes (Aaloobukhaara)',
      'Refrigerate after opening for best texture.',
      '8 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 698, 806, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1550, 1782, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2945, 3333, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5658, 6355, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'wet-dates-khajur';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'wet-dates-khajur',
      'Wet Dates (Khajur)',
      'Royal Medjool & Kimia · Soft & Caramelly',
      'dates',
      'Oasis Reserve',
      'Heritage Date Palm Oasis',
      'Tree-ripened soft honey dates',
      4.9,
      46,
      ARRAY['https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=900&q=80', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Dates005.jpg/960px-Dates005.jpg'],
      'Succulent, glossy wet dates (Khajur) with tender mahogany flesh and rich notes of wild honey and toffee.',
      ARRAY['Harvested fresh from the palm without glucose syrups or artificial preservatives. An instant natural energy booster.'],
      '100% Whole Soft Wet Dates (Khajur)',
      'Store in a cool pantry or refrigerate to preserve softness.',
      '9 Months',
      'Contains natural date pits.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 608, 702, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1350, 1552, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2565, 2903, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4928, 5535, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'dry-dates-chuara';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'dry-dates-chuara',
      'Dry Dates (Chuara)',
      'Sun-Dehydrated Whole Dates · Traditional Vitality',
      'dates',
      'Traditional',
      'Sun-Cured Desert Harvest',
      'Naturally sun-hardened caramel dates',
      4.8,
      25,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Dry_Dates_%28Debino%29.jpg/960px-Dry_Dates_%28Debino%29.jpg'],
      'Nutrient-dense sun-dried dates (Chuara) with a firm, chewy bite and concentrated mineral sweetness.',
      ARRAY['Traditionally prized for iron, calcium, and stamina. Ideal for simmering in warm spiced milk, homemade energy powders, or long-lasting pantry storage.'],
      '100% Sun-Dried Whole Dates (Chuara)',
      'Store in an airtight jar in a dry cupboard.',
      '12 Months',
      'Contains natural date pits.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 495, 572, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1100, 1265, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2090, 2365, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4015, 4510, 6);
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
      'Chia Seeds',
      'Raw Black Superfood Seeds · Omega-3 & Fibre',
      'seeds',
      'Superfood',
      'Cleaned Grade-A Botanical Harvest',
      '100% raw unroasted seeds',
      4.9,
      37,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg/960px-Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg'],
      'Pure black and mottled chia seeds rich in plant-based Omega-3s, complete protein, and soluble fibre.',
      ARRAY['Swells into a silky gel when soaked in coconut milk, water, or yoghurt. Perfect for chia puddings, smoothies, and overnight oats.'],
      '100% Raw Chia Seeds (Salvia hispanica)',
      'Keep sealed in a cool, dry cupboard.',
      '12 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 428, 494, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 950, 1093, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1805, 2043, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 3468, 3895, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'cucumber-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'cucumber-seeds',
      'Cucumber Seeds',
      'Hulled Magaz Kernels · Cooling & Nutrient Rich',
      'seeds',
      'Pure Kernels',
      'Artisan Hulled Seed Selection',
      'Raw hulled ivory seed kernels',
      4.7,
      16,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Cucumber_seeds.jpg/960px-Cucumber_seeds.jpg'],
      'Delicate, creamy ivory cucumber seed kernels packed with cooling minerals, plant protein, and healthy fats.',
      ARRAY['A classic addition to traditional thandai, sweets, smoothie bowls, and bakery toppings.'],
      '100% Hulled Cucumber Seed Kernels',
      'Store in an airtight container.',
      '9 Months',
      'Packed in a facility that handles nuts and seeds.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 518, 598, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1150, 1323, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2185, 2473, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4198, 4715, 6);
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
      'Flax Seeds',
      'Golden-Brown Alsi · Lightly Crisp & Nutty',
      'seeds',
      'Heart Healthy',
      'Single-Origin Botanical Harvest',
      'Cleaned raw whole flax seeds',
      4.8,
      28,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Linum_usitatissimum_qtl1.jpg/960px-Linum_usitatissimum_qtl1.jpg'],
      'Glossy golden-brown flax seeds (Alsi) loaded with lignans, dietary fibre, and essential alpha-linolenic acid (ALA).',
      ARRAY['Enjoy lightly dry-toasted for a nutty crunch over salads and curries, or freshly ground into morning smoothies and rotis.'],
      '100% Whole Flax Seeds (Linum usitatissimum)',
      'Store in a cool, dark pantry.',
      '12 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 293, 338, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 650, 747, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1235, 1398, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2373, 2665, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'musk-melon-seeds';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'musk-melon-seeds',
      'Musk Melon Seeds',
      'Sweet Cantaloupe Kernels · Protein Packed',
      'seeds',
      'Culinary Grade',
      'Sun-Cured Hulled Seed Reserve',
      'Raw hulled sweet melon kernels',
      4.8,
      20,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/EGUSI_UNSHELLED.JPG/960px-EGUSI_UNSHELLED.JPG'],
      'Plump, sweet musk melon seed kernels rich in magnesium, zinc, and plant-based protein.',
      ARRAY['Delicious lightly toasted with a pinch of sea salt, blended into rich gravies, or sprinkled on artisan breads.'],
      '100% Hulled Musk Melon Seeds',
      'Keep in an airtight container.',
      '9 Months',
      'Seed product.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 540, 624, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1200, 1380, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2280, 2580, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4380, 4920, 6);
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
      'Pumpkin Seeds',
      'AA-Grade Emerald Pepitas · Zinc & Magnesium',
      'seeds',
      'Best Seller',
      'Selected Non-GMO Harvest',
      'Raw hulled green pumpkin kernels',
      4.9,
      44,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Pepita_de_calabaza.jpg/960px-Pepita_de_calabaza.jpg', 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=900&q=80'],
      'Dark emerald AA-grade pumpkin seeds (Pepitas) with a crisp, nutty bite. Naturally rich in zinc, magnesium, and tryptophan.',
      ARRAY['Clean, hull-free green kernels ideal for daily immunity support, salad crunch, or homemade granola bars.'],
      '100% Raw Hulled Pumpkin Seeds',
      'Keep sealed in a cool, dry place.',
      '9 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 563, 650, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1250, 1438, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2375, 2688, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4563, 5125, 6);
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
      'Quinoa Seeds',
      'Pre-Washed White & Red Grain · Complete Protein',
      'seeds',
      'Complete Protein',
      'High-Altitude Ancient Grain Harvest',
      'Saponin-free triple-washed whole grain',
      4.8,
      23,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg/960px-Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg'],
      'Fluffy, nutty quinoa seeds containing all nine essential amino acids. A wholesome, low-GI alternative to rice.',
      ARRAY['Pre-washed to remove natural bitterness and cooks in just 15 minutes into light, nutrient-rich grains.'],
      '100% Whole Quinoa Seeds',
      'Store in a dry pantry container.',
      '12 Months',
      '100% gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 495, 572, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1100, 1265, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2090, 2365, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4015, 4510, 6);
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
      'Sunflower Seeds',
      'Hulled Bakery Grade Kernels · Vitamin E Rich',
      'seeds',
      'Raw & Pure',
      'Sun-Ripened Golden Fields',
      'Raw hulled sunflower kernels',
      4.8,
      27,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Sunflower_Seeds_Kaldari.jpg/960px-Sunflower_Seeds_Kaldari.jpg'],
      'Sweet, mild, and crunchy hulled sunflower seed kernels packed with Vitamin E, selenium, and healthy plant fats.',
      ARRAY['Ready to eat straight from the pouch or lightly toasted over breakfast bowls, soups, and multigrain loaves.'],
      '100% Hulled Sunflower Seed Kernels',
      'Store in a cool, dry place.',
      '9 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 338, 390, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 750, 862, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 1425, 1613, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 2738, 3075, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'fox-nuts-phool-makhana';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'fox-nuts-phool-makhana',
      'Fox Nuts (Phool Makhana)',
      'Jumbo Popped Lotus Seeds · Light & Crunchy',
      'seeds',
      'Low Calorie',
      'Traditional Pond-Harvested Lotus Seeds',
      'Hand-popped jumbo white pearls',
      4.9,
      33,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg/960px-Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg'],
      'Airy, snow-white popped lotus seeds (Phool Makhana). High in calcium and protein with virtually zero fat.',
      ARRAY['Roast in a spoonful of ghee or coconut oil with Ceylon black pepper and sea salt for the ultimate guilt-free evening crunch.'],
      '100% Popped Lotus Seeds (Phool Makhana)',
      'Keep in a tightly sealed container to maintain crispness.',
      '6 Months',
      'Naturally gluten-free and nut-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 608, 702, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1350, 1552, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2565, 2903, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4928, 5535, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'blueberries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'blueberries',
      'Blueberries',
      'Whole Sun-Dried Wild Berries · Antioxidant Superfruit',
      'berries',
      'Antioxidant Rich',
      'Wild Mountain Berry Reserve',
      'Gently dehydrated whole blueberries',
      4.9,
      31,
      ARRAY['https://upload.wikimedia.org/wikipedia/commons/1/15/Blueberries.jpg'],
      'Plump, aromatic dried blueberries bursting with deep berry sweetness and anthocyanin antioxidants.',
      ARRAY['Gently dried to lock in natural berry juices. Delicious in pancakes, muesli, yoghurt parfaits, or straight from the jar.'],
      'Whole Blueberries, Natural Fruit Juice Concentrate',
      'Store sealed in a cool, dark pantry.',
      '8 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 1013, 1170, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 2250, 2588, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 4275, 4838, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 8213, 9225, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'cranberries';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'cranberries',
      'Cranberries',
      'Ruby Red Whole Sliced · Sweet & Tangy',
      'berries',
      'Best Seller',
      'Harvest Berry Orchards',
      'Sun-cured ruby cranberries',
      4.8,
      35,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Dried-Cranberries.png/960px-Dried-Cranberries.png', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=80'],
      'Vibrant ruby-red dried cranberries with a bright, refreshing sweet-tart flavour profile.',
      ARRAY['Rich in proanthocyanidins and Vitamin C. A favourite addition to trail mixes, salads, and festive bakes.'],
      'Dried Cranberries, Apple Juice Concentrate, Sunflower Oil (<1%)',
      'Keep resealed in a cool pantry.',
      '9 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 698, 806, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1550, 1782, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2945, 3333, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5658, 6355, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'black-currant';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'black-currant',
      'Black Currant',
      'Tiny Seedless Tangy Jewels · Iron & Vitamin C',
      'berries',
      'Tangy & Sweet',
      'Cool-Climate Vineyard Harvest',
      'Shade-dried whole seedless currants',
      4.8,
      19,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Ribes_nigrum_a1.JPG/960px-Ribes_nigrum_a1.JPG'],
      'Intensely flavourful, tangy-sweet dried black currants packed with iron, potassium, and antioxidants.',
      ARRAY['Adds a burst of deep berry tang to artisan breads, ice creams, oat bowls, and festive fruit cakes.'],
      '100% Sun-Dried Seedless Black Currants',
      'Store in a cool, dry cupboard.',
      '8 Months',
      'Naturally gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 630, 728, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1400, 1610, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2660, 3010, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 5110, 5740, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'hazelnuts';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'hazelnuts',
      'Hazelnuts',
      'Blanched & Dry-Roasted Filberts · Buttery Crunch',
      'exotic-nuts',
      'Exotic Reserve',
      'Black Sea Orchard Kernels',
      'Dry-roasted skinless golden kernels',
      4.9,
      22,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg/960px-Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg'],
      'Crunchy, aromatic hazelnut kernels with a rich toasted praline flavour and creamy finish.',
      ARRAY['Slow-warmed to release their signature nutty perfume. Perfect alongside dark Ceylon chocolate or espresso.'],
      '100% Whole Hazelnut Kernels',
      'Keep sealed in an airtight jar.',
      '6 Months',
      'Contains tree nuts (hazelnuts).',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 1125, 1300, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 2500, 2875, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 4750, 5375, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 9125, 10250, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'macadamia-nuts';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'macadamia-nuts',
      'Macadamia Nuts',
      'Ivory Cream Whole Kernels · Melt-in-Mouth',
      'exotic-nuts',
      'Luxury Grade',
      'Subtropical Orchard Reserve',
      'Lightly dry-toasted creamy wholes',
      5,
      26,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Macadamia_nuts.jpg/960px-Macadamia_nuts.jpg'],
      'The world’s most buttery, velvety nut. Whole ivory macadamia kernels with a delicate crunch and rich creamy finish.',
      ARRAY['High in heart-healthy monounsaturated fats and keto-friendly nutrition. Hand-selected for whole style-0/style-1 kernels.'],
      '100% Whole Macadamia Nut Kernels',
      'Store in a cool, dry place or refrigerate.',
      '6 Months',
      'Contains tree nuts (macadamia).',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 1530, 1768, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 3400, 3910, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 6460, 7310, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 12410, 13940, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'pecan-nuts';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'pecan-nuts',
      'Pecan Nuts',
      'Mammoth Golden Halves · Naturally Buttery & Sweet',
      'exotic-nuts',
      'Exotic Reserve',
      'River-Valley Pecan Groves',
      'Raw mammoth halves',
      4.9,
      18,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Pecans.jpg/960px-Pecans.jpg'],
      'Rich, maple-sweet mammoth pecan halves with a tender, buttery crunch and golden-brown grooves.',
      ARRAY['Packed with more than 19 vitamins and minerals. Wonderful for snacking, caramelizing, or topping salads and pies.'],
      '100% Mammoth Pecan Halves',
      'Refrigerate in an airtight jar for extended freshness.',
      '6 Months',
      'Contains tree nuts (pecans).',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 1395, 1612, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 3100, 3565, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 5890, 6665, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 11315, 12710, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'berries-mix';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'berries-mix',
      'Berries Mix',
      'Blueberries, Cranberries, Black Currants & Cherries',
      'mixes',
      'Antioxidant Blend',
      'Ceylon Crunch Artisan Blend',
      'Sun-cured four-berry medley',
      4.9,
      30,
      ARRAY['https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=80'],
      'A vibrant jewel-toned medley of dried blueberries, ruby cranberries, tangy black currants, and sweet red berries.',
      ARRAY['Hand-blended in small batches for balanced sweetness and tartness in every spoonful.'],
      'Dried Blueberries, Dried Cranberries, Black Currants, Golden Raisins',
      'Keep sealed in a cool pantry.',
      '8 Months',
      'Gluten-free.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 833, 962, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1850, 2128, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3515, 3978, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6753, 7585, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'nut-mix';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'nut-mix',
      'Nut Mix',
      'Royal 5-Nut Symphony · Cashews, Almonds, Walnuts, Pista & Hazelnuts',
      'mixes',
      'Best Seller',
      'Colombo Small-Batch Roastery',
      'Lightly toasted & raw gourmet nut blend',
      5,
      52,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Mixed_nuts_small_white1.jpg/960px-Mixed_nuts_small_white1.jpg', 'https://images.unsplash.com/photo-1536591375315-1b83681498b3?auto=format&fit=crop&w=900&q=80'],
      'Our signature luxury nut blend combining jumbo Ceylon cashews, whole almonds, walnut halves, pistachio kernels, and roasted hazelnuts.',
      ARRAY['Zero peanuts or cheap fillers — strictly 100% premium tree nuts in balanced proportions.'],
      'Cashews (Kaju), Almonds (Badam), Walnuts (Akhrot), Pistachios (Pista), Hazelnuts',
      'Store in an airtight glass jar.',
      '6 Months',
      'Contains tree nuts.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 878, 1014, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1950, 2243, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3705, 4193, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 7118, 7995, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'seeds-mix';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'seeds-mix',
      'Seeds Mix',
      '5-in-1 Superseed Crunch · Pumpkin, Sunflower, Flax, Chia & Melon',
      'mixes',
      'Daily Superfood',
      'Artisan Botanical Studio',
      'Raw & lightly toasted multi-seed blend',
      4.8,
      28,
      ARRAY['https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=900&q=80'],
      'Powerhouse daily nutrition blending emerald pumpkin seeds, sunflower kernels, flax seeds, black chia, and musk melon seeds.',
      ARRAY['Sprinkle two tablespoons over your morning curd, porridge, salad, or smoothie for sustained plant protein and minerals.'],
      'Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Chia Seeds, Musk Melon Seeds',
      'Store in a cool, dry cupboard.',
      '9 Months',
      'Seed blend.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 518, 598, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1150, 1323, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 2185, 2473, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 4198, 4715, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'trail-mix';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'trail-mix',
      'Trail Mix',
      'Active Energy Blend · Nuts, Seeds, Berries & Dates',
      'mixes',
      'Energy Boost',
      'Colombo Small-Batch Roastery',
      'Balanced sweet & savoury adventure mix',
      4.9,
      40,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/960px-2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg'],
      'The ultimate on-the-go fuel combining roasted cashews, almonds, pumpkin seeds, ruby cranberries, golden raisins, and diced dates.',
      ARRAY['Crafted for hikers, gym-goers, and busy professionals seeking clean, sustained energy without refined sugar crashes.'],
      'Roasted Cashews, Almonds, Walnuts, Pumpkin Seeds, Sunflower Seeds, Cranberries, Golden Raisins',
      'Keep resealed in a cool, dry place.',
      '6 Months',
      'Contains tree nuts and seeds.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 743, 858, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1650, 1897, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3135, 3548, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6023, 6765, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'whole-spices';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'whole-spices',
      'Whole Spices (Ceylon Alba Cinnamon & Pepper)',
      'Single-Estate Ceylon Alba Quills, Black Pepper & Green Cardamom',
      'spices',
      'Ceylon Pure',
      'Mirissa & Matale Spice Estates, Sri Lanka',
      'Sun-cured whole estate spices',
      5,
      32,
      ARRAY['https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Cinnamomum_verum_spices.jpg/960px-Cinnamomum_verum_spices.jpg', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=80'],
      'Authentic Sri Lankan whole spices featuring hand-rolled Alba cinnamon quills, Matale black peppercorns, green cardamom pods, and whole cloves.',
      ARRAY['Harvested from heritage spice gardens in central and southern Sri Lanka with high essential oil content and intoxicating aroma.'],
      'True Ceylon Alba Cinnamon Quills, Whole Black Peppercorns, Green Cardamom, Whole Cloves',
      'Store in airtight glass jars away from light and moisture.',
      '18 Months',
      'Pure whole spices.',
      false
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '100g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '100g', 788, 910, 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '250g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '250g', 1750, 2012, 15);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '500g') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '500g', 3325, 3763, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = '1kg') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, '1kg', 6388, 7175, 6);
  END IF;
END $$;

DO $$
DECLARE
  v_prod_id uuid;
BEGIN
  -- Insert product if not exists
  SELECT id INTO v_prod_id FROM public.products WHERE slug = 'heritage-harvest-hamper';
  IF v_prod_id IS NULL THEN
    INSERT INTO public.products (
      slug, name, subtitle, category, badge, origin, roast_style, rating, review_count, images, description, extended_about, ingredients, storage, shelf_life, allergen_notice, is_featured
    ) VALUES (
      'heritage-harvest-hamper',
      'The Heritage Harvest Hamper',
      'Curated Luxury · Solid Pine Box',
      'gifts-hampers',
      'Gift Ready',
      'Handcrafted in Colombo with Sri Lankan Provisions',
      'Assorted cashews, almonds, dates, figs & Ceylon spices',
      5,
      39,
      ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80'],
      'An exquisite hand-built pine chest packed with Cashew (Kaju), Almonds (Badam), Wet Dates (Khajur), Dried Figs (Anjeer), and Whole Ceylon Spices.',
      ARRAY['Tied with deep forest green grosgrain ribbon and accompanied by a custom greeting card for weddings, birthdays, and corporate gifting.'],
      'Cashews (250g), Almonds (250g), Wet Dates (300g), Dried Figs (250g), Whole Spices (150g)',
      'Store items in cool pantry conditions.',
      '6 Months',
      'Contains tree nuts.',
      true
    ) RETURNING id INTO v_prod_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = 'Standard Gift Box') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, 'Standard Gift Box', 6500, 7200, 10);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_prod_id AND weight = 'Royal Pine Chest') THEN
    INSERT INTO public.product_variants (product_id, weight, price, original_price, stock)
    VALUES (v_prod_id, 'Royal Pine Chest', 12500, 13900, 4);
  END IF;
END $$;

