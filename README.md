# Ceylon Crunch — Artisan Provisions (`valgrow-labs-ceyloncrunch`)

> *"From Nature To Your Doorstep — Sourced from authentic growers. Honest food for moments that matter."*

## 1. Project Overview

My project, **Ceylon Crunch**, is a full-stack e-commerce website developed for selling Sri Lankan nuts and healthy snacks. I used **Next.js 16** and **React 19** for the frontend and application framework, **JavaScript** for programming logic, and **CSS** for styling. I integrated **Supabase** for **PostgreSQL** database management, **admin authentication**, and **image storage**. I used **PayHere** as the online payment gateway and implemented **cash on delivery** and **bank transfer** options. The project includes a **customer shopping interface**, an **admin dashboard**, **product and order management**, **order tracking**, and **website configuration** features.

---

## 2. Project Directory Structure

```text
└── valgrow-labs-ceyloncrunch/
    ├── md
    ├── index.html
    ├── jsconfig.json
    ├── middleware.js
    ├── next.config.js
    ├── package.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.js
    │   ├── (store)/
    │   │   ├── layout.jsx
    │   │   ├── page.jsx
    │   │   ├── about/
    │   │   │   └── page.jsx
    │   │   ├── checkout/
    │   │   │   └── page.jsx
    │   │   ├── order/
    │   │   │   ├── cancel/
    │   │   │   │   └── page.jsx
    │   │   │   └── success/
    │   │   │       └── page.jsx
    │   │   ├── privacy-policy/
    │   │   │   └── page.jsx
    │   │   ├── refund-policy/
    │   │   │   └── page.jsx
    │   │   ├── shop/
    │   │   │   ├── page.jsx
    │   │   │   └── [slug]/
    │   │   │       └── page.jsx
    │   │   ├── terms-and-conditions/
    │   │   │   └── page.jsx
    │   │   └── track/
    │   │       └── page.jsx
    │   ├── admin/
    │   │   ├── layout.jsx
    │   │   ├── page.jsx
    │   │   ├── login/
    │   │   │   └── page.jsx
    │   │   ├── newsletter/
    │   │   │   ├── NewsletterClient.jsx
    │   │   │   └── page.jsx
    │   │   ├── orders/
    │   │   │   ├── AdminOrdersClient.jsx
    │   │   │   ├── page.jsx
    │   │   │   └── [id]/
    │   │   │       ├── OrderDetailClient.jsx
    │   │   │       └── page.jsx
    │   │   ├── products/
    │   │   │   ├── AdminProductsClient.jsx
    │   │   │   ├── page.jsx
    │   │   │   ├── [id]/
    │   │   │   │   └── page.jsx
    │   │   │   └── new/
    │   │   │       └── page.jsx
    │   │   ├── settings/
    │   │   │   ├── page.jsx
    │   │   │   ├── announcement/
    │   │   │   │   ├── AnnouncementClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── branding/
    │   │   │   │   ├── BrandingClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── delivery/
    │   │   │   │   ├── DeliveryClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── footer/
    │   │   │   │   ├── FooterClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── hero/
    │   │   │   │   ├── HeroClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── homepage/
    │   │   │   │   ├── HomepageClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── navigation/
    │   │   │   │   ├── NavigationClient.jsx
    │   │   │   │   └── page.jsx
    │   │   │   ├── payments/
    │   │   │   │   ├── page.jsx
    │   │   │   │   └── PaymentsClient.jsx
    │   │   │   ├── seo/
    │   │   │   │   ├── page.jsx
    │   │   │   │   └── SEOClient.jsx
    │   │   │   ├── store/
    │   │   │   │   ├── page.jsx
    │   │   │   │   └── StoreClient.jsx
    │   │   │   └── theme/
    │   │   │       ├── page.jsx
    │   │   │       └── ThemeClient.jsx
    │   │   └── team/
    │   │       ├── page.jsx
    │   │       └── TeamClient.jsx
    │   ├── api/
    │   │   ├── admin/
    │   │   │   ├── orders/
    │   │   │   │   └── route.js
    │   │   │   ├── products/
    │   │   │   │   └── route.js
    │   │   │   └── stats/
    │   │   │       └── route.js
    │   │   ├── newsletter/
    │   │   │   └── route.js
    │   │   ├── orders/
    │   │   │   ├── route.js
    │   │   │   ├── [id]/
    │   │   │   │   └── route.js
    │   │   │   ├── track/
    │   │   │   │   └── route.js
    │   │   │   └── webhook/
    │   │   │       └── route.js
    │   │   ├── products/
    │   │   │   ├── route.js
    │   │   │   ├── [slug]/
    │   │   │   │   └── route.js
    │   │   │   └── generate/
    │   │   │       └── route.js
    │   │   ├── settings/
    │   │   │   └── route.js
    │   │   ├── team/
    │   │   │   ├── route.js
    │   │   │   ├── reset-password/
    │   │   │   │   └── route.js
    │   │   │   └── set-password/
    │   │   │       └── route.js
    │   │   └── upload/
    │   │       └── route.js
    │   └── auth/
    │       ├── accept-invite/
    │       │   └── page.jsx
    │       ├── callback/
    │       │   └── route.js
    │       └── reset-password/
    │           └── page.jsx
    ├── components/
    │   ├── admin/
    │   │   ├── AdminDate.jsx
    │   │   ├── AdminSidebar.jsx
    │   │   ├── AdminTopBar.jsx
    │   │   ├── ImageUploader.jsx
    │   │   ├── PageHeader.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── SaveButton.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── useSettingsSave.js
    │   └── storefront/
    │       ├── AnnouncementBar.jsx
    │       ├── CartDrawer.jsx
    │       ├── CheckoutClient.jsx
    │       ├── Footer.jsx
    │       ├── Icons.jsx
    │       ├── Navbar.jsx
    │       ├── NewsletterForm.jsx
    │       ├── ProductCard.jsx
    │       ├── ProductDetailClient.jsx
    │       ├── ShopClient.jsx
    │       ├── Stars.jsx
    │       ├── Toast.jsx
    │       └── WhatsAppFab.jsx
    ├── contexts/
    │   ├── CartContext.jsx
    │   └── SettingsContext.jsx
    ├── lib/
    │   ├── payhere.js
    │   ├── settings.js
    │   ├── supabase-server.js
    │   ├── supabase.js
    │   └── variants.js
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    ├── src/
    │   └── main.jsx
    └── supabase/
        ├── migrate-2026-updates.sql
        ├── schema.sql
        └── seed.sql
```

---

## 3. Architecture & Module Breakdown

- **`app/(store)/` — Customer Storefront:** Home (`page.jsx`), Shop Catalog (`shop/page.jsx`), Dynamic Product Detail (`shop/[slug]/page.jsx`), Checkout (`checkout/page.jsx`), Order Confirmation & Cancellation (`order/success/page.jsx`, `order/cancel/page.jsx`), Real-Time Order Tracking (`track/page.jsx`), About Us (`about/page.jsx`), and Legal Policies (`privacy-policy`, `refund-policy`, `terms-and-conditions`).
- **`app/admin/` — Store Administration Dashboard:** Protected by `middleware.js` and Supabase Auth (`admin/login/page.jsx`). Includes Order Management (`admin/orders`), Product & Variant CRUD (`admin/products`), Newsletter Management (`admin/newsletter`), Team Access (`admin/team`), and modular Website Configuration (`admin/settings/*`: `announcement`, `branding`, `delivery`, `footer`, `hero`, `homepage`, `navigation`, `payments`, `seo`, `store`, `theme`).
- **`app/api/` — Backend Route Handlers:** RESTful Next.js route handlers for orders, PayHere webhook verification (`api/orders/webhook/route.js`), order tracking (`api/orders/track/route.js`), product catalog & AI generation (`api/products/generate/route.js`), Supabase Storage file uploads (`api/upload/route.js`), team invites, and site settings (`api/settings/route.js`).
- **`lib/` & `supabase/` — Data & Gateway Layer:**
  - `lib/payhere.js`: MD5 checkout hash generation and PayHere webhook signature verification.
  - `lib/supabase.js` & `lib/supabase-server.js`: Browser and service-role Supabase clients for PostgreSQL, Auth, and Storage.
  - `supabase/schema.sql`, `supabase/seed.sql`, `supabase/migrate-2026-updates.sql`: PostgreSQL tables (`products`, `orders`, `site_settings`, `newsletter_subscribers`).

---

## 4. Credits

- **Brand:** Ceylon Crunch (`ceyloncrunch.lk`) — Colombo, Sri Lanka (`+94 77 944 3867` · `ceyloncrunch26@gmail.com`)
- **Designed & Developed by:** **ValGrow Labs**
