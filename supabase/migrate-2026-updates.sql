-- ============================================================
-- CEYLON CRUNCH — 2026 CONTENT + VARIANT-PRICING MIGRATION
-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query)
-- Safe to run multiple times (uses jsonb_set / upsert semantics).
-- ============================================================

-- ── BRANDING (Established 2026) ─────────────────────────────
update site_settings
set value = value
  || jsonb_build_object('established', '2026')
where key = 'branding';

-- ── HERO (new headline + subtext + eyebrow) ─────────────────
update site_settings
set value = jsonb_build_object(
  'eyebrow',          'Ceylon Crunch — Established 2026',
  'headline',         'In a world that rushes,',
  'headline_italic',  'we take it slow.',
  'subtext',          'Sourced from authentic growers. Honest food for moments that matter.',
  'primary_cta',      'Shop the Collection',
  'primary_cta_link', '/shop',
  'secondary_cta',    'Our Story',
  'secondary_cta_link','/about',
  'bg_image',         coalesce(value->>'bg_image', '/img/hero-bg.jpg'),
  'bg_opacity',       coalesce(value->'bg_opacity', '0.52'::jsonb)
)
where key = 'hero';

-- ── FEATURES (drop Single-Origin / Rooted in Lanka, change delivery copy) ──
update site_settings
set value = '[
  {"icon":"leaf",  "title":"Naturally Grown",     "text":"Crops that follow the seasons, not the market."},
  {"icon":"pin",   "title":"Authentic Sources",   "text":"Sourced directly from independent growers — no brokers, no commodity chains."},
  {"icon":"box",   "title":"Small-Batch",         "text":"Packed in measured quantities to preserve freshness and character."},
  {"icon":"truck", "title":"Island-Wide Delivery","text":"Available across Sri Lanka. Reliable, tracked dispatch."}
]'::jsonb
where key = 'features';

-- ── ABOUT STRIP STATS (no single-origin, year 2026) ─────────
update site_settings
set value = jsonb_set(
  value,
  '{stats}',
  '[{"value":"10K+","label":"Homes Reached"},
    {"value":"100%","label":"Naturally Grown"},
    {"value":"Est.","label":"2026"}]'::jsonb
)
where key = 'about_strip';

-- ── ABOUT PAGE (new story / farmers / promise + one-line CTA) ──
update site_settings
set value = value || jsonb_build_object(
  'sections', '[
    {"icon":"leaf", "title":"Our Story",   "text":"Grown by seasons, not demand. We source from independent growers who follow natural seasons and not just market demand. Because we believe a good product should be simple, real, and naturally grown."},
    {"icon":"pin",  "title":"Our Farmers", "text":"Locally and internationally, there are still growers who know when a harvest is ready without looking at the calendar. They are still growing crops that follow the seasons, not the market, and people who believe food should be honest before it is impressive."},
    {"icon":"box",  "title":"Our Promise", "text":"Not crafted for just anywhere. It is crafted for moments that truly matter — at the end of a long day, around a shared table, in quiet gratitude. Cultivated from the land."}
  ]'::jsonb,
  'cta_headline', 'From the Land. Handled with Care. Shared with intention.',
  'cta_subtext',  ''
)
where key = 'about_page';

-- ── FOOTER (new contact, copyright, sub-tagline, WhatsApp number) ──
update site_settings
set value = value || jsonb_build_object(
  'contact_email', 'ceyloncrunch26@gmail.com',
  'contact_phone', '+94 77 944 3867',
  'copyright',     '© 2026 Ceylon Crunch. All rights reserved.',
  'sub_tagline',   'Handled with Care',
  'social',        coalesce(value->'social', '{}'::jsonb)
                     || jsonb_build_object('whatsapp', '+94779443867')
)
where key = 'footer';

-- ── STORE (no free delivery threshold) ──────────────────────
update site_settings
set value = value || jsonb_build_object(
  'free_delivery_threshold', 0,
  'delivery_fee', coalesce((value->>'delivery_fee')::int, 350)
)
where key = 'store';

-- ── DELIVERY (disable free threshold) ───────────────────────
update site_settings
set value = value || jsonb_build_object(
  'free_threshold', 0,
  'free_threshold_enabled', false
)
where key = 'delivery';

-- ── ANNOUNCEMENT BAR (remove free-delivery copy) ────────────
update site_settings
set value = jsonb_set(value, '{message}', '"Island-wide delivery available across Sri Lanka."'::jsonb)
where key = 'announcement_bar';

-- ============================================================
-- PRODUCT VARIANTS — convert every product to 100g / 250g / 500g / 1KG
-- with tiered pricing derived from the existing base price (treated as 250g).
--   100g  ~= base * 0.42  (small pack, slight premium per g)
--   250g  =  base
--   500g  ~= base * 1.85  (small bulk discount)
--   1KG   ~= base * 3.50  (bigger bulk discount)
-- Round each tier to nearest 10 LKR.
-- ============================================================
update products
set variants = jsonb_build_array(
  jsonb_build_object('size', '100g', 'price', (round((price * 0.42) / 10.0) * 10)::int),
  jsonb_build_object('size', '250g', 'price', price),
  jsonb_build_object('size', '500g', 'price', (round((price * 1.85) / 10.0) * 10)::int),
  jsonb_build_object('size', '1KG',  'price', (round((price * 3.50) / 10.0) * 10)::int)
);

-- Done. Refresh the site (Ctrl+R) — all updates are live.
