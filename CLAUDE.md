# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ceylon Crunch is a full-stack e-commerce site for a Sri Lankan nuts and healthy snacks brand. Built on Next.js (App Router) with Supabase as the database, Supabase Auth for admin authentication, and PayHere for Sri Lankan payments. Designed & Developed by ValGrow Labs.

## Tech Stack

- **Next.js 16** (App Router) + React 19
- **Supabase** — database (PostgreSQL), auth, storage
- **PayHere** — Sri Lankan payment gateway (sandbox + production)
- **No CSS frameworks** — inline styles + CSS custom properties

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Production build
npm run start     # Run production build
npm run lint      # Next.js ESLint
```

## Architecture

### Route Groups
- `app/(store)/` — public storefront (home, shop, product detail, about, track, checkout, order result)
- `app/admin/` — protected admin dashboard (middleware redirects unauthenticated users to `/admin/login`)
- `app/api/` — API routes (products, orders, newsletter, settings, upload, team, webhook)
- `app/auth/` — Supabase Auth flows (`callback`, `accept-invite`, `reset-password`)
- `contexts/` — React client contexts: `CartContext` (cart state + drawer) and `SettingsContext` (site_settings hydrated client-side)

### Database (Supabase)
Run `supabase/schema.sql` then `supabase/seed.sql` in the Supabase SQL editor to set up the database.

Tables: `products`, `orders`, `order_items`, `newsletter`, `profiles`, `site_settings`

- `products.variants` — jsonb array: `["250g","500g","1kg"]`
- `orders.items` — jsonb snapshot of cart at order time
- `orders.payment_method` — `cod` | `bank_transfer` | `payhere`
- `orders.status` — `pending` | `paid` | `shipped` | `delivered` | `cancelled`
- `profiles.role` — `admin` | `super_admin` (auto-created on Supabase Auth signup)
- `site_settings` — key/jsonb table: every customizable piece of content lives here

### Site Settings Keys
All frontend content is driven by `site_settings`. Keys: `branding`, `theme`, `hero`, `features`, `bestsellers_section`, `categories_section`, `about_strip`, `newsletter_section`, `footer`, `nav_links`, `store`, `payments`, `delivery`, `announcement_bar`, `about_page`, `seo`

### Supabase Clients
- `lib/supabase.js` — browser client (`createClient()`)
- `lib/supabase-server.js` — server client with cookie handling (`createClient()` and `createAdminClient()` using service role key)
- `lib/settings.js` — `getAllSettings()` and `getSetting(key)` server helpers
- `lib/payhere.js` — `buildPayHerePayload()` and `generatePayHereHash()`

### Admin Auth
Supabase Auth (email + password). Middleware in `middleware.js` protects all `/admin/*` routes. Profiles table extends `auth.users` with `role` and `active` fields. Super admins can invite, deactivate, and change roles of other admins via `/admin/team`.

### Payment Flow
`POST /api/orders` → creates order → if `payhere`, calls `buildPayHerePayload()` → returns `paymentUrl` + `paymentData` for client-side form POST to PayHere. Webhook at `/api/orders/webhook` handles PayHere's notification. COD and bank transfer orders go straight to success page.

### Admin Settings System
All settings editors in `app/admin/settings/` use the `useSettingsSave(key, initial)` hook from `components/admin/useSettingsSave.js`. It manages state, calls `PATCH /api/settings`, and handles saving/saved/error states.

### Image Uploads
`POST /api/upload` proxies uploads to Supabase Storage bucket `ceyloncrunch`. The `ImageUploader` component handles file selection, upload, and URL display.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYHERE_MERCHANT_ID=
PAYHERE_SECRET=
PAYHERE_BASE_URL=https://sandbox.payhere.lk
NEXT_PUBLIC_APP_URL=https://ceyloncrunch.lk
```

## Color Palette (CSS custom properties in `app/globals.css`)

Editable live from `/admin/settings/theme`:
- `--green: #1E5631` / `--green-dark: #163d23` / `--green-light: #2a7043`
- `--brown: #7B3F00` / `--gold: #C9A84C` / `--gold-light: #dbc078`
- `--cream: #FAF6EF` / `--cream-dark: #F0E8D8`
- `--ink: #1a1a1a` / `--ink-soft: #3d3d3d` / `--muted: #888` / `--border: #e5ddd0`

## Reusable CSS Classes

`btn-primary`, `btn-outline`, `btn-brown`, `badge`, `badge-{green,gold,brown,red}`, `qty-btn`, `pill-btn`, `card-hover`, `toast-pill`, `animate-fadeUp{,-2,-3,-4}`, `prod-grid`, `detail-grid`, `page-pad`, `hero-section`, `hero-content`, `navbar`, `cart-drawer`, `footer`, `skeleton`, `spinner`, `payment-card`

## Admin Settings Pages

| Path | Controls |
|------|----------|
| `/admin/settings/branding` | Logo, site name, tagline |
| `/admin/settings/theme` | All CSS color variables |
| `/admin/settings/hero` | Homepage hero content |
| `/admin/settings/homepage` | All homepage sections |
| `/admin/settings/navigation` | Navbar links |
| `/admin/settings/footer` | Footer content + social links |
| `/admin/settings/payments` | PayHere, COD, Bank Transfer |
| `/admin/settings/delivery` | Fees, zones, free threshold |
| `/admin/settings/store` | Currency, tax, min order |
| `/admin/settings/announcement` | Top announcement bar |
| `/admin/settings/seo` | Meta title, description, OG image |

## Supabase Storage Setup

Create a public bucket called `ceyloncrunch` in Supabase Storage before using image uploads.
