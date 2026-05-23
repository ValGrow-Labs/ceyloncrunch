-- ============================================================
-- CEYLON CRUNCH — SEED DATA
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ── SITE SETTINGS ────────────────────────────────────────────

insert into site_settings (key, value) values

('branding', '{
  "site_name": "Ceylon Crunch",
  "tagline": "Healthy Crunch for Every Home",
  "logo_url": "/img/logo.png",
  "favicon_url": "/img/logo.png",
  "established": "2026"
}'),

('theme', '{
  "green": "#1E5631",
  "green_dark": "#163d23",
  "green_light": "#2a7043",
  "brown": "#7B3F00",
  "gold": "#C9A84C",
  "gold_light": "#dbc078",
  "cream": "#FAF6EF",
  "cream_dark": "#F0E8D8",
  "ink": "#1a1a1a",
  "ink_soft": "#3d3d3d",
  "muted": "#888888",
  "border": "#e5ddd0"
}'),

('hero', '{
  "eyebrow": "Ceylon Crunch — Established 2026",
  "headline": "In a world that rushes,",
  "headline_italic": "we take it slow.",
  "subtext": "Sourced from authentic growers. Honest food for moments that matter.",
  "primary_cta": "Shop the Collection",
  "primary_cta_link": "/shop",
  "secondary_cta": "Our Story",
  "secondary_cta_link": "/about",
  "bg_image": "/img/hero-bg.jpg",
  "bg_opacity": 0.52
}'),

('features', '[
  {"icon": "leaf",  "title": "Naturally Grown", "text": "Crops that follow the seasons, not the market."},
  {"icon": "pin",   "title": "Authentic Sources", "text": "Sourced directly from independent growers — no brokers, no commodity chains."},
  {"icon": "box",   "title": "Small-Batch",     "text": "Packed in measured quantities to preserve freshness and character."},
  {"icon": "truck", "title": "Island-Wide Delivery", "text": "Available across Sri Lanka. Reliable, tracked dispatch."}
]'),

('bestsellers_section', '{
  "eyebrow": "Trusted Favourites",
  "headline": "Chosen for Character",
  "subtext": "Each batch is selected for its individual quality — never rushed, never mixed, never hidden behind flavors or polish.",
  "count": 4
}'),

('categories_section', '{
  "eyebrow": "Browse by Type",
  "headline": "Find Your Crunch",
  "items": [
    {"name": "Roasted Nuts",      "img": "/img/product-1.jpg"},
    {"name": "Raw Nuts",          "img": "/img/product-4.jpg"},
    {"name": "Mixed Trails",      "img": "/img/product-3.jpg"},
    {"name": "Specialty Snacks",  "img": "/img/product-5.jpg"}
  ]
}'),

('about_strip', '{
  "eyebrow": "About Us",
  "headline": "Food That Earns Its Place at the Table",
  "body": "Across Sri Lanka, there are still growers who know when a nut is ready without checking a calendar. Still harvests that follow seasons and not demand. We built this brand for them. And for you.",
  "cta_label": "Read Our Story",
  "cta_link": "/about",
  "image_url": "/img/product-12.jpg",
  "stats": [
    {"value": "10K+", "label": "Homes Reached"},
    {"value": "100%", "label": "Naturally Grown"},
    {"value": "Est.", "label": "2026"}
  ]
}'),

('newsletter_section', '{
  "eyebrow": "Stay Connected",
  "headline": "For Moments That Matter",
  "body": "Harvest updates, new batches, and quiet notes from the land. No noise — only what is worth your time.",
  "button_label": "Subscribe"
}'),

('footer', '{
  "tagline": "Healthy Crunch for Every Home.\nFrom the land. Handled with care. Shared with intention.",
  "contact_email": "ceyloncrunch26@gmail.com",
  "contact_phone": "+94 77 944 3867",
  "address": "Colombo, Sri Lanka",
  "copyright": "© 2026 Ceylon Crunch. All rights reserved.",
  "sub_tagline": "Handled with Care",
  "social": {
    "instagram": "",
    "facebook": "",
    "whatsapp": "+94779443867",
    "tiktok": ""
  }
}'),

('nav_links', '[
  {"label": "Home",        "href": "/"},
  {"label": "Shop",        "href": "/shop"},
  {"label": "Our Story",   "href": "/about"},
  {"label": "Track Order", "href": "/track"}
]'),

('store', '{
  "currency": "LKR",
  "currency_symbol": "LKR",
  "free_delivery_threshold": 0,
  "delivery_fee": 350,
  "min_order": 0,
  "tax_rate": 0
}'),

('payments', '{
  "payhere": {
    "enabled": true,
    "label": "Pay Online",
    "description": "Credit/Debit card, Internet Banking via PayHere",
    "merchant_id": "",
    "secret": "",
    "sandbox": true
  },
  "cod": {
    "enabled": true,
    "label": "Cash on Delivery",
    "description": "Pay cash when your order arrives",
    "extra_fee": 0
  },
  "bank_transfer": {
    "enabled": true,
    "label": "Bank Transfer",
    "description": "Transfer to our bank account and upload the slip",
    "bank_name": "Bank of Ceylon",
    "account_name": "Ceylon Crunch (Pvt) Ltd",
    "account_number": "",
    "branch": "Colombo",
    "instructions": "Please transfer the exact order amount and WhatsApp the slip to +94 XX XXX XXXX. Orders are processed after payment confirmation."
  }
}'),

('delivery', '{
  "zones": [
    {"name": "Colombo & Suburbs",  "fee": 300,  "days": "1–2"},
    {"name": "Other Provinces",    "fee": 450,  "days": "2–4"},
    {"name": "Remote Areas",       "fee": 600,  "days": "3–5"}
  ],
  "free_threshold": 0,
  "free_threshold_enabled": false,
  "cod_extra_fee": 0,
  "estimated_dispatch": "1 business day"
}'),

('announcement_bar', '{
  "enabled": false,
  "message": "Island-wide delivery available across Sri Lanka.",
  "bg_color": "#1E5631",
  "text_color": "#ffffff",
  "link": "",
  "link_label": ""
}'),

('about_page', '{
  "hero_eyebrow": "The Ceylon Crunch Story",
  "hero_headline": "Some things should still",
  "hero_headline_italic": "feel earned.",
  "hero_subtext": "A brand built for growers who follow seasons and not demand — and for people who believe food should be honest before it is impressive.",
  "quote": "Long before machines, discounts, and mass packing, nuts were handled slowly — grown by familiar hands, dried under open skies, traded with pride, and shared with respect.",
  "sections": [
    {"icon": "leaf",  "title": "Our Story",    "text": "Grown by seasons, not demand. We source from independent growers who follow natural seasons and not just market demand. Because we believe a good product should be simple, real, and naturally grown."},
    {"icon": "pin",   "title": "Our Farmers",  "text": "Locally and internationally, there are still growers who know when a harvest is ready without looking at the calendar. They are still growing crops that follow the seasons, not the market, and people who believe food should be honest before it is impressive."},
    {"icon": "box",   "title": "Our Promise",  "text": "Not crafted for just anywhere. It is crafted for moments that truly matter — at the end of a long day, around a shared table, in quiet gratitude. Cultivated from the land."}
  ],
  "cta_headline": "From the Land. Handled with Care. Shared with intention.",
  "cta_subtext": "",
  "cta_label": "Shop the Collection"
}'),

('seo', '{
  "title": "Ceylon Crunch | Healthy Crunch for Every Home",
  "description": "Ceylon Crunch — Premium Sri Lankan nuts and healthy snacks. Sourced with patience, shared with intention.",
  "og_image": "/img/hero-bg.jpg",
  "keywords": "Sri Lankan nuts, healthy snacks, cashews, almonds, Ceylon, roasted nuts"
}')

on conflict (key) do update set value = excluded.value;

-- ── PRODUCTS ─────────────────────────────────────────────────

insert into products (name, slug, category, price, variants, badge, badge_type, rating, reviews, image_url, description, nutrition_info, active) values

('Roasted Cashews', 'roasted-cashews', 'Roasted Nuts', 1200,
 '["250g","500g","1kg"]', 'Bestseller', 'green', 4.8, 142,
 '/img/product-1.jpg',
 'Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat, drawing out the deep nuttiness while preserving the natural sweetness of the kernel. Chosen for character, not quantity.',
 '{"serving":"30g","calories":"180 kcal","fat":"14g","protein":"6g","carbs":"9g","fibre":"2g","sodium":"5mg"}',
 true),

('Honey Glazed Almonds', 'honey-glazed-almonds', 'Specialty Snacks', 1450,
 '["250g","500g"]', 'New', 'gold', 4.7, 89,
 '/img/product-2.jpg',
 'Raw almonds coated in pure wildflower honey and slow-roasted until the glaze caramelises into a glossy, crackling shell. A treat that earns its place at any table.',
 '{"serving":"30g","calories":"165 kcal","fat":"11g","protein":"5g","carbs":"14g","fibre":"2g","sodium":"3mg"}',
 true),

('Ceylon Trail Mix', 'ceylon-trail-mix', 'Mixed Trails', 980,
 '["300g","600g","1kg"]', 'Popular', 'green', 4.6, 203,
 '/img/product-3.jpg',
 'A thoughtfully assembled blend of roasted nuts, sun-dried fruits, and seeds — each element selected for its individual integrity. No fillers. No compromise. A trail mix that actually means something.',
 '{"serving":"40g","calories":"195 kcal","fat":"13g","protein":"5g","carbs":"17g","fibre":"3g","sodium":"8mg"}',
 true),

('Raw Macadamia Nuts', 'raw-macadamia-nuts', 'Raw Nuts', 2200,
 '["200g","400g"]', 'Premium', 'brown', 4.9, 67,
 '/img/product-4.jpg',
 'Whole and unprocessed, our macadamias arrive to you as the land intended — creamy, rich, and remarkably satisfying. Sourced from small plots where the harvest follows the season, not the deadline.',
 '{"serving":"30g","calories":"210 kcal","fat":"21g","protein":"2g","carbs":"4g","fibre":"2g","sodium":"1mg"}',
 true),

('Spicy Masala Peanuts', 'spicy-masala-peanuts', 'Specialty Snacks', 650,
 '["300g","600g"]', 'Hot Pick', 'red', 4.5, 318,
 '/img/product-5.jpg',
 'A recipe born from Sri Lankan kitchen tradition. Peanuts tossed in a dry masala blend and slow-roasted until the spice sets into every surface. Honest heat, no shortcuts.',
 '{"serving":"30g","calories":"160 kcal","fat":"12g","protein":"7g","carbs":"9g","fibre":"2g","sodium":"120mg"}',
 true),

('Walnut Halves', 'walnut-halves', 'Raw Nuts', 1800,
 '["250g","500g","1kg"]', null, null, 4.7, 95,
 '/img/product-6.jpg',
 'Hand-selected walnut halves, dried under open air until the bitterness mellows and the natural oils concentrate into a deep, full flavour. Kept whole because the kernel is too good to break.',
 '{"serving":"30g","calories":"196 kcal","fat":"19g","protein":"5g","carbs":"4g","fibre":"2g","sodium":"1mg"}',
 true),

('Toasted Coconut Chips', 'toasted-coconut-chips', 'Specialty Snacks', 750,
 '["200g","400g"]', 'Local Fav', 'gold', 4.6, 178,
 '/img/product-7.jpg',
 'Thin slices of fresh coconut, dried slowly and toasted until light and crisp. A local favourite — familiar to anyone who grew up near the coast. Simple. Irreplaceable.',
 '{"serving":"30g","calories":"185 kcal","fat":"17g","protein":"2g","carbs":"9g","fibre":"4g","sodium":"10mg"}',
 true),

('Pistachio Kernels', 'pistachio-kernels', 'Raw Nuts', 2600,
 '["200g","400g"]', 'Premium', 'brown', 4.8, 54,
 '/img/product-8.jpg',
 'Shell-free pistachio kernels at their most vivid — green, tender, with a flavour that is both rich and delicate. Sourced selectively, packed with care, and priced honestly.',
 '{"serving":"30g","calories":"171 kcal","fat":"13g","protein":"6g","carbs":"9g","fibre":"3g","sodium":"1mg"}',
 true),

('Dark Choc Almonds', 'dark-choc-almonds', 'Specialty Snacks', 1650,
 '["200g","400g"]', 'New', 'gold', 4.7, 72,
 '/img/product-9.jpg',
 'Premium almonds enrobed in 72% dark chocolate — a pairing of restraint and richness. Made in small batches to ensure the chocolate sets properly around every almond.',
 '{"serving":"30g","calories":"175 kcal","fat":"12g","protein":"4g","carbs":"15g","fibre":"3g","sodium":"5mg"}',
 true),

('Nut Energy Bites', 'nut-energy-bites', 'Mixed Trails', 890,
 '["250g","500g"]', null, null, 4.5, 131,
 '/img/product-10.jpg',
 'Rolled from dates, mixed nuts, and seeds — no sugar added, no binders, nothing artificial. A bite that keeps its promise of energy without inflation.',
 '{"serving":"40g","calories":"170 kcal","fat":"9g","protein":"4g","carbs":"22g","fibre":"3g","sodium":"5mg"}',
 true),

('Salted Pistachios', 'salted-pistachios', 'Roasted Nuts', 2400,
 '["250g","500g"]', null, null, 4.7, 108,
 '/img/product-11.jpg',
 'Roasted in-shell pistachios finished with a light sea salt cure. Cracking one open is part of the ritual. Slowing down is built into the experience.',
 '{"serving":"30g","calories":"171 kcal","fat":"13g","protein":"6g","carbs":"9g","fibre":"3g","sodium":"85mg"}',
 true),

('Superfood Nut Mix', 'superfood-nut-mix', 'Mixed Trails', 1350,
 '["300g","600g","1kg"]', 'Bestseller', 'green', 4.9, 189,
 '/img/product-12.jpg',
 'Walnuts, almonds, goji berries, pumpkin seeds and macadamia — each chosen for nutritional density and flavour. A mix built for people who take what they eat seriously.',
 '{"serving":"40g","calories":"210 kcal","fat":"15g","protein":"7g","carbs":"14g","fibre":"4g","sodium":"5mg"}',
 true)

on conflict (slug) do nothing;
