import React, { createContext, useContext, useReducer, useState, useEffect, useRef } from 'react';

// ─── FONT LOADER ────────────────────────────────────────────────────────────
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --green: #1E5631;
        --green-dark: #163d23;
        --green-light: #2a7043;
        --brown: #7B3F00;
        --gold: #C9A84C;
        --gold-light: #dbc078;
        --cream: #FAF6EF;
        --cream-dark: #F0E8D8;
        --ink: #1a1a1a;
        --ink-soft: #3d3d3d;
        --muted: #888;
        --border: #e5ddd0;
        --white: #fff;
        --shadow: 0 4px 24px rgba(0,0,0,0.09);
        --shadow-lg: 0 12px 48px rgba(0,0,0,0.15);
        --radius: 16px;
        --radius-sm: 10px;
      }

      html { scroll-behavior: smooth; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); line-height: 1.6; }
      h1,h2,h3,h4 { font-family: 'Playfair Display', serif; line-height: 1.25; }
      img { display: block; max-width: 100%; }
      button { cursor: pointer; border: none; background: none; font-family: inherit; }
      input { font-family: inherit; }
      a { text-decoration: none; color: inherit; }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: var(--cream); }
      ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }

      /* Keyframes */
      @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
      @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.18);} }
      @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(20px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }

      .animate-fadeUp   { animation: fadeUp 0.7s ease both; }
      .animate-fadeUp-2 { animation: fadeUp 0.7s 0.15s ease both; }
      .animate-fadeUp-3 { animation: fadeUp 0.7s 0.3s ease both; }
      .animate-fadeUp-4 { animation: fadeUp 0.7s 0.45s ease both; }

      .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      .card-hover:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--green); color: #fff; border-radius: 50px;
        padding: 13px 28px; font-size: 15px; font-weight: 600; letter-spacing: 0.02em;
        transition: background 0.2s, transform 0.15s;
      }
      .btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); }

      .btn-outline {
        display: inline-flex; align-items: center; gap: 6px;
        background: transparent; color: var(--green); border: 2px solid var(--green); border-radius: 50px;
        padding: 11px 26px; font-size: 15px; font-weight: 600;
        transition: background 0.2s, color 0.2s, transform 0.15s;
      }
      .btn-outline:hover { background: var(--green); color: #fff; transform: translateY(-1px); }

      .btn-brown {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--brown); color: #fff; border-radius: 50px;
        padding: 13px 28px; font-size: 15px; font-weight: 600;
        transition: background 0.2s, transform 0.15s;
      }
      .btn-brown:hover { background: #5e3000; transform: translateY(-1px); }

      .badge {
        display: inline-block; font-size: 11px; font-weight: 600;
        padding: 3px 11px; border-radius: 50px; letter-spacing: 0.04em; text-transform: uppercase;
      }
      .badge-green  { background: var(--green);  color: #fff; }
      .badge-gold   { background: var(--gold);   color: #fff; }
      .badge-brown  { background: var(--brown);  color: #fff; }
      .badge-red    { background: #c0392b;        color: #fff; }

      .qty-btn {
        width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border);
        display: inline-flex; align-items: center; justify-content: center; font-size: 18px;
        font-weight: 500; color: var(--ink); transition: border-color 0.2s, background 0.2s;
        background: #fff;
      }
      .qty-btn:hover { border-color: var(--green); color: var(--green); background: #f0f7f2; }

      .pill-btn {
        padding: 6px 16px; border-radius: 50px; border: 1.5px solid var(--border);
        font-size: 13px; font-weight: 500; color: var(--ink-soft); background: #fff;
        transition: all 0.2s; cursor: pointer;
      }
      .pill-btn.active, .pill-btn:hover { border-color: var(--green); color: var(--green); background: #f0f7f2; }

      .grain::after {
        content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px 200px;
      }

      .hide-mobile { }
      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .mobile-stack { flex-direction: column !important; }
      }

      /* Drawer overlay */
      .drawer-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45);
        z-index: 999; animation: fadeIn 0.25s ease;
      }
      .cart-drawer {
        position: fixed; top: 0; right: 0; height: 100vh; width: 420px; max-width: 95vw;
        background: var(--cream); z-index: 1000; display: flex; flex-direction: column;
        animation: slideIn 0.32s cubic-bezier(0.22,1,0.36,1);
        box-shadow: -8px 0 40px rgba(0,0,0,0.18);
      }

      /* Tab styles */
      .tab-bar { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
      .tab-btn { padding: 12px 20px; font-size: 15px; font-weight: 500; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
      .tab-btn.active { color: var(--green); border-bottom-color: var(--green); font-weight: 600; }

      /* Toast */
      .toast-pill {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: var(--green); color: #fff; padding: 13px 28px; border-radius: 50px;
        font-weight: 600; font-size: 15px; z-index: 2000; white-space: nowrap;
        animation: toastIn 0.35s ease both; box-shadow: 0 8px 32px rgba(30,86,49,0.35);
      }

      /* Sticky navbar */
      .navbar {
        position: sticky; top: 0; z-index: 900; background: rgba(250,246,239,0.95);
        backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
        padding: 12px 48px; min-height: 100px; display: flex; align-items: center; justify-content: space-between;
      }

      /* Search input */
      .search-input {
        width: 100%; padding: 12px 18px; border: 1.5px solid var(--border); border-radius: 12px;
        font-size: 15px; background: #fff; outline: none; transition: border-color 0.2s;
      }
      .search-input:focus { border-color: var(--green); }

      /* Select */
      .sort-select {
        padding: 11px 16px; border: 1.5px solid var(--border); border-radius: 12px;
        font-size: 14px; background: #fff; color: var(--ink); outline: none; cursor: pointer;
      }

      /* Review avatar */
      .review-avatar {
        width: 44px; height: 44px; border-radius: 50%; background: var(--green);
        color: #fff; font-weight: 700; font-size: 16px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }

      /* Nutrition table */
      .nutrition-table { width: 100%; border-collapse: collapse; }
      .nutrition-table td { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
      .nutrition-table td:last-child { text-align: right; font-weight: 500; }

      /* Footer */
      .footer { background: #111; color: #aaa; padding: 64px 48px 32px; }

      /* Category card */
      .cat-card { border-radius: var(--radius); overflow: hidden; position: relative; cursor: pointer; }
      .cat-card img { width: 100%; height: 260px; object-fit: cover; transition: transform 0.45s ease; }
      .cat-card:hover img { transform: scale(1.06); }

      /* Product grid — 2 cols on mobile */
      .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 28px; }

      /* Product detail — 2-col layout */
      .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-bottom: 72px; }

      /* Shop / detail page wrapper */
      .page-pad { padding: 64px 48px 80px; }

      @media (max-width: 640px) {
        .navbar { padding: 12px 20px; min-height: 80px; height: auto; }
        .footer { padding: 48px 20px 24px; }

        /* 2-col product grid on mobile */
        .prod-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }

        /* Product card: smaller image + tighter text */
        .prod-card-img { height: 150px !important; }
        .prod-card-body { padding: 12px 12px 14px !important; gap: 7px !important; }
        .prod-card-title { font-size: 14px !important; }
        .prod-card-price { font-size: 16px !important; }
        .prod-card-add { padding: 7px 10px !important; font-size: 11px !important; }
        .prod-card-pill { padding: 4px 10px !important; font-size: 11px !important; }

        /* Product detail: stack to 1-col */
        .detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 40px !important; }
        .detail-img { height: 280px !important; }

        /* Page padding */
        .page-pad { padding: 24px 16px 60px !important; }

        /* About strip */
        .about-strip-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        .about-strip-img { display: none !important; }

        /* Footer */
        .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        .footer-grid > div:last-child { text-align: left !important; }
      }
    `}</style>
  );
}

// ─── PRODUCT DATA ────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, slug: 'roasted-cashews', name: 'Roasted Cashews', category: 'Roasted Nuts', price: 1200, variants: ['250g', '500g', '1kg'], badge: 'Bestseller', badgeType: 'green', rating: 4.8, reviews: 142, image: '/img/product-1.jpg', description: 'Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat, drawing out the deep nuttiness while preserving the natural sweetness of the kernel. Chosen for character, not quantity.' },
  { id: 2, slug: 'honey-glazed-almonds', name: 'Honey Glazed Almonds', category: 'Specialty Snacks', price: 1450, variants: ['250g', '500g'], badge: 'New', badgeType: 'gold', rating: 4.7, reviews: 89, image: '/img/product-2.jpg', description: 'Raw almonds coated in pure wildflower honey and slow-roasted until the glaze caramelises into a glossy, crackling shell. A treat that earns its place at any table.' },
  { id: 3, slug: 'ceylon-trail-mix', name: 'Ceylon Trail Mix', category: 'Mixed Trails', price: 980, variants: ['300g', '600g', '1kg'], badge: 'Popular', badgeType: 'green', rating: 4.6, reviews: 203, image: '/img/product-3.jpg', description: 'A thoughtfully assembled blend of roasted nuts, sun-dried fruits, and seeds — each element selected for its individual integrity. No fillers. No compromise. A trail mix that actually means something.' },
  { id: 4, slug: 'raw-macadamia-nuts', name: 'Raw Macadamia Nuts', category: 'Raw Nuts', price: 2200, variants: ['200g', '400g'], badge: 'Premium', badgeType: 'brown', rating: 4.9, reviews: 67, image: '/img/product-4.jpg', description: 'Whole and unprocessed, our macadamias arrive to you as the land intended — creamy, rich, and remarkably satisfying. Sourced from small plots where the harvest follows the season, not the deadline.' },
  { id: 5, slug: 'spicy-masala-peanuts', name: 'Spicy Masala Peanuts', category: 'Specialty Snacks', price: 650, variants: ['300g', '600g'], badge: 'Hot Pick', badgeType: 'red', rating: 4.5, reviews: 318, image: '/img/product-5.jpg', description: 'A recipe born from Sri Lankan kitchen tradition. Peanuts tossed in a dry masala blend and slow-roasted until the spice sets into every surface. Honest heat, no shortcuts.' },
  { id: 6, slug: 'walnut-halves', name: 'Walnut Halves', category: 'Raw Nuts', price: 1800, variants: ['250g', '500g', '1kg'], badge: null, badgeType: null, rating: 4.7, reviews: 95, image: '/img/product-6.jpg', description: 'Hand-selected walnut halves, dried under open air until the bitterness mellows and the natural oils concentrate into a deep, full flavour. Kept whole because the kernel is too good to break.' },
  { id: 7, slug: 'toasted-coconut-chips', name: 'Toasted Coconut Chips', category: 'Specialty Snacks', price: 750, variants: ['200g', '400g'], badge: 'Local Fav', badgeType: 'gold', rating: 4.6, reviews: 178, image: '/img/product-7.jpg', description: 'Thin slices of fresh coconut, dried slowly and toasted until light and crisp. A local favourite — familiar to anyone who grew up near the coast. Simple. Irreplaceable.' },
  { id: 8, slug: 'pistachio-kernels', name: 'Pistachio Kernels', category: 'Raw Nuts', price: 2600, variants: ['200g', '400g'], badge: 'Premium', badgeType: 'brown', rating: 4.8, reviews: 54, image: '/img/product-8.jpg', description: 'Shell-free pistachio kernels at their most vivid — green, tender, with a flavour that is both rich and delicate. Sourced selectively, packed with care, and priced honestly.' },
  { id: 9, slug: 'dark-choc-almonds', name: 'Dark Choc Almonds', category: 'Specialty Snacks', price: 1650, variants: ['200g', '400g'], badge: 'New', badgeType: 'gold', rating: 4.7, reviews: 72, image: '/img/product-9.jpg', description: 'Premium almonds enrobed in 72% dark chocolate — a pairing of restraint and richness. Made in small batches to ensure the chocolate sets properly around every almond.' },
  { id: 10, slug: 'nut-energy-bites', name: 'Nut Energy Bites', category: 'Mixed Trails', price: 890, variants: ['250g', '500g'], badge: null, badgeType: null, rating: 4.5, reviews: 131, image: '/img/product-10.jpg', description: 'Rolled from dates, mixed nuts, and seeds — no sugar added, no binders, nothing artificial. A bite that keeps its promise of energy without inflation.' },
  { id: 11, slug: 'salted-pistachios', name: 'Salted Pistachios', category: 'Roasted Nuts', price: 2400, variants: ['250g', '500g'], badge: null, badgeType: null, rating: 4.7, reviews: 108, image: '/img/product-11.jpg', description: 'Roasted in-shell pistachios finished with a light sea salt cure. Cracking one open is part of the ritual. Slowing down is built into the experience.' },
  { id: 12, slug: 'superfood-nut-mix', name: 'Superfood Nut Mix', category: 'Mixed Trails', price: 1350, variants: ['300g', '600g', '1kg'], badge: 'Bestseller', badgeType: 'green', rating: 4.9, reviews: 189, image: '/img/product-12.jpg', description: 'Walnuts, almonds, goji berries, pumpkin seeds and macadamia — each chosen for nutritional density and flavour. A mix built for people who take what they eat seriously.' },
];

// ─── CART CONTEXT ────────────────────────────────────────────────────────────
const CartCtx = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.id}-${action.item.variant}`;
      const existing = state.find(i => `${i.id}-${i.variant}` === key);
      if (existing) return state.map(i => `${i.id}-${i.variant}` === key ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE': return state.filter(i => `${i.id}-${i.variant}` !== action.key);
    case 'UPDATE_QTY': return state.map(i => `${i.id}-${i.variant}` === action.key ? { ...i, qty: Math.max(1, action.qty) } : i);
    case 'CLEAR': return [];
    default: return state;
  }
}

function CartProvider({ children }) {
  const init = () => { try { return JSON.parse(localStorage.getItem('cc_cart')) || []; } catch { return []; } };
  const [cart, dispatch] = useReducer(cartReducer, [], init);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => { try { localStorage.setItem('cc_cart', JSON.stringify(cart)); } catch { } }, [cart]);
  const addToCart = (item) => { dispatch({ type: 'ADD', item }); setDrawerOpen(true); showToast(`${item.name} added`); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  return (
    <CartCtx.Provider value={{ cart, dispatch, drawerOpen, setDrawerOpen, toast, addToCart, showToast }}>
      {children}
    </CartCtx.Provider>
  );
}
const useCart = () => useContext(CartCtx);

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 14 14">
              <polygon points="7,1 8.8,5.5 13.6,5.9 10,9 11.1,13.8 7,11.1 2.9,13.8 4,9 0.4,5.9 5.2,5.5" fill="#e5ddd0" />
            </svg>
            <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: `${fill * 100}%` }}>
              <svg width={size} height={size} viewBox="0 0 14 14">
                <polygon points="7,1 8.8,5.5 13.6,5.9 10,9 11.1,13.8 7,11.1 2.9,13.8 4,9 0.4,5.9 5.2,5.1" fill="var(--gold)" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast() {
  const { toast } = useCart();
  if (!toast) return null;
  return <div className="toast-pill">{toast}</div>;
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, setPage, setDetailId }) {
  const { addToCart } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  return (
    <div className="card-hover" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="prod-card-img" style={{ position: 'relative', overflow: 'hidden', height: 220, cursor: 'pointer', flexShrink: 0 }}
        onClick={() => { setDetailId(product.id); setPage('product'); window.scrollTo(0, 0); }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        {product.badge && (
          <span className={`badge badge-${product.badgeType}`} style={{ position: 'absolute', top: 10, left: 10 }}>{product.badge}</span>
        )}
        <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(250,246,239,0.92)', fontSize: 10, padding: '2px 8px', borderRadius: 50, fontWeight: 600, color: 'var(--muted)', backdropFilter: 'blur(4px)' }}>{product.category}</span>
      </div>
      <div className="prod-card-body" style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 className="prod-card-title" style={{ cursor: 'pointer', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, lineHeight: 1.3, transition: 'color 0.2s' }}
          onClick={() => { setDetailId(product.id); setPage('product'); window.scrollTo(0, 0); }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{product.rating}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {product.variants.map(v => (
            <button key={v} className={`pill-btn prod-card-pill ${variant === v ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
          <span className="prod-card-price" style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>
            LKR {product.price.toLocaleString()}
          </span>
          <button className="btn-primary prod-card-add" style={{ padding: '9px 18px', fontSize: 13 }}
            onClick={() => addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, variant })}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── INLINE SVG ICONS ─────────────────────────────────────────────────────────
const IconLeaf = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 C6 18 9 14 12 6 C15 14 18 18 22 22" /><path d="M12 6 C12 6 17 10 19 16" /></svg>;
const IconPin = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>;
const IconBox = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" /><rect x="1" y="4" width="22" height="4" rx="1" /><line x1="10" y1="12" x2="14" y2="12" /></svg>;
const IconTruck = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
const IconCheck = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const IconFlag = ({ size = 18, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>;
const IconCart = ({ size = 22, color = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ setPage }) {
  const { cart, dispatch, drawerOpen, setDrawerOpen } = useCart();
  const [ordered, setOrdered] = useState(false);
  if (!drawerOpen) return null;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal >= 3000 ? 0 : 300;
  const total = subtotal + delivery;
  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => { dispatch({ type: 'CLEAR' }); setOrdered(false); setDrawerOpen(false); }, 2200);
  };
  return (
    <>
      <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20 }}>Your Cart {cart.length > 0 && <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'DM Sans,sans-serif', fontWeight: 400 }}>({cart.length} item{cart.length > 1 ? 's' : ''})</span>}</h3>
          <button onClick={() => setDrawerOpen(false)} style={{ fontSize: 24, color: 'var(--muted)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>×</button>
        </div>
        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>Your cart is empty.</p>
              <p style={{ fontSize: 14 }}>Good things take time.</p>
              <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => { setDrawerOpen(false); setPage('products'); }}>Browse Products</button>
            </div>
          ) : cart.map(item => {
            const key = `${item.id}-${item.variant}`;
            return (
              <div key={key} style={{ display: 'flex', gap: 14, alignItems: 'center', background: '#fff', borderRadius: 14, padding: 12 }}>
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{item.variant}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>LKR {(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty - 1 })}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key, qty: item.qty + 1 })}>+</button>
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE', key })} style={{ fontSize: 11, color: 'var(--muted)', padding: '2px 8px', borderRadius: 20, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--cream)' }}>
            {ordered ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>
                  <svg width={40} height={40} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="var(--green)" /><polyline points="12,20 18,26 28,14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 600 }}>Order Placed!</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Thank you for choosing Ceylon Crunch.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
                  <span>Subtotal</span><span style={{ color: 'var(--ink)' }}>LKR {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
                  <span>Delivery</span>
                  <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--ink)' }}>
                    {delivery === 0 ? 'Free' : `LKR ${delivery.toLocaleString()}`}
                  </span>
                </div>
                {delivery > 0 && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, padding: '8px 12px', background: '#fff', borderRadius: 8 }}>Add LKR {(3000 - subtotal).toLocaleString()} more for free delivery</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, fontFamily: 'Playfair Display,serif', marginBottom: 16 }}>
                  <span>Total</span><span style={{ color: 'var(--green)' }}>LKR {total.toLocaleString()}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px 28px', fontSize: 16 }} onClick={handleOrder}>
                  Place Order
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const { cart, setDrawerOpen } = useCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const links = [['home', 'Home'], ['products', 'Shop'], ['about', 'Our Story']];
  return (
    <nav className="navbar">
      <img src="/img/logo.png" alt="Ceylon Crunch" height="150" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onClick={() => { setPage('home'); window.scrollTo(0, 0); }} />
      <div className="hide-mobile" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {links.map(([key, label]) => (
          <button key={key} onClick={() => { setPage(key); window.scrollTo(0, 0); }}
            style={{ fontSize: 15, fontWeight: page === key ? 600 : 400, color: page === key ? 'var(--green)' : 'var(--ink-soft)', background: 'none', borderBottom: page === key ? '2px solid var(--green)' : '2px solid transparent', paddingBottom: 2, transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>
      <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative', padding: 8 }}>
        <IconCart color="var(--ink)" />
        {count > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 0.4s ease' }}>{count}</span>
        )}
      </button>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage, setDetailId }) {
  const bestsellers = PRODUCTS.filter(p => p.badge === 'Bestseller' || [1, 2, 3, 4].includes(p.id)).slice(0, 4);
  const cats = [
    { name: 'Roasted Nuts', img: '/img/product-1.jpg' },
    { name: 'Raw Nuts', img: '/img/product-4.jpg' },
    { name: 'Mixed Trails', img: '/img/product-3.jpg' },
    { name: 'Specialty Snacks', img: '/img/product-5.jpg' },
  ];
  const features = [
    { icon: <IconLeaf color="#fff" size={22} />, title: 'Single-Origin', text: 'Sourced from named Sri Lankan farms, not commodity chains.' },
    { icon: <IconPin color="#fff" size={22} />, title: 'Rooted in Lanka', text: 'Every product carries the patience of the land it came from.' },
    { icon: <IconBox color="#fff" size={22} />, title: 'Small-Batch', text: 'Packed in measured quantities to preserve freshness and character.' },
    { icon: <IconTruck color="#fff" size={22} />, title: 'Island Delivery', text: 'Free island-wide delivery on orders above LKR 3,000.' },
  ];
  return (
    <main>
      {/* HERO */}
      <section className="grain" style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 60%, #e0d4c0 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.52 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '80px 48px', textAlign: 'center' }}>
          <p className="animate-fadeUp" style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--green-light)', fontWeight: 700, marginBottom: 20 }}>Ceylon Crunch — Est. 2020</p>
          <h1 className="animate-fadeUp-2" style={{ fontSize: 'clamp(38px,6vw,72px)', fontWeight: 700, lineHeight: 1.12, color: 'var(--green)', marginBottom: 28 }}>
            In a world that rushes everything,<br />
            <em style={{ color: 'var(--brown)', fontStyle: 'italic' }}>we chose to wait.</em>
          </h1>
          <p className="animate-fadeUp-3" style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px', fontWeight: 400 }}>
            Sourced from Sri Lankan growers who know when a nut is ready without checking a calendar. Honest food for moments that matter.
          </p>
          <div className="animate-fadeUp-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => { setPage('products'); window.scrollTo(0, 0); }}>Shop the Collection</button>
            <button className="btn-outline" onClick={() => { setPage('about'); window.scrollTo(0, 0); }}>Our Story</button>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section style={{ background: 'var(--green)', padding: '56px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 40 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.6 }}>{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 12 }}>Trusted Favourites</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--green-dark)' }}>Chosen for Character</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>Each batch is selected for its individual quality — never rushed, never mixed, never hidden behind flavors or polish.</p>
        </div>
        <div className="prod-grid">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setDetailId={setDetailId} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn-outline" onClick={() => { setPage('products'); window.scrollTo(0, 0); }}>View All Products</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '0 48px 88px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 12 }}>Browse by Type</p>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, color: 'var(--green-dark)' }}>Find Your Crunch</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
          {cats.map(c => (
            <div key={c.name} className="cat-card" onClick={() => { setPage('products'); window.scrollTo(0, 0); }}>
              <img src={c.img} alt={c.name} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 22px' }}>
                <h3 style={{ color: '#fff', fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 600 }}>{c.name}</h3>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, display: 'block' }}>Explore collection</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: 'var(--cream-dark)', padding: '88px 48px' }}>
        <div className="about-strip-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 16 }}>About Us</p>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 22, lineHeight: 1.2 }}>Food That Earns Its Place at the Table</h2>
            <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: 32, fontWeight: 300 }}>
              Across Sri Lanka, there are still growers who know when a nut is ready without checking a calendar. Still harvests that follow seasons and not demand. We built this brand for them. And for you.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 36 }}>
              {[['10K+', 'Homes Reached'], ['100%', 'Single-Origin'], ['Est.', '2020']].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 32, fontWeight: 700, color: 'var(--green)' }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn-brown" onClick={() => { setPage('about'); window.scrollTo(0, 0); }}>Read Our Story</button>
          </div>
          <div className="about-strip-img" style={{ borderRadius: 24, overflow: 'hidden', height: 420, position: 'relative' }}>
            <img src="/img/product-12.jpg" alt="Ceylon Crunch origin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,86,49,0.15) 0%, transparent 60%)' }} />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: 'var(--green-dark)', padding: '80px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 16 }}>Stay Connected</p>
        <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>For Moments That Matter</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7, fontWeight: 300 }}>
          Harvest updates, new batches, and quiet notes from the land. No noise — only what is worth your time.
        </p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input type="email" placeholder="Your email address" className="search-input" style={{ flex: 1, minWidth: 240, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 50 }} />
          <button className="btn-primary" style={{ background: 'var(--gold)', flexShrink: 0 }}>Subscribe</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'start', marginBottom: 48 }}>
            <div>
              <img src="/img/logo.png" alt="Ceylon Crunch" height="100" style={{ marginBottom: 20 }} />
              <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 280 }}>Healthy Crunch for Every Home.<br />From the land. Handled with care. Shared with intention.</p>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              <div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 16, fontWeight: 600 }}>Navigation</div>
                {[['home', 'Home'], ['products', 'Shop'], ['about', 'Our Story']].map(([k, l]) => (
                  <div key={k} style={{ marginBottom: 10 }}><a href="#" onClick={e => { e.preventDefault(); }} style={{ fontSize: 14 }}>{l}</a></div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 16, fontWeight: 600 }}>Contact</div>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}>hello@ceyloncrunch.lk<br />Colombo, Sri Lanka</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13 }}>© 2020–2026 Ceylon Crunch. All rights reserved.</span>
            <span style={{ fontSize: 13, color: '#555' }}>Crafted with patience. Packed with care.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────────────────
function ShopPage({ setPage, setDetailId }) {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const cats = ['All', 'Roasted Nuts', 'Raw Nuts', 'Mixed Trails', 'Specialty Snacks'];
  let prods = PRODUCTS
    .filter(p => cat === 'All' || p.category === cat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'low') prods = [...prods].sort((a, b) => a.price - b.price);
  if (sort === 'high') prods = [...prods].sort((a, b) => b.price - a.price);
  if (sort === 'rated') prods = [...prods].sort((a, b) => b.rating - a.rating);
  return (
    <main className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brown)', fontWeight: 600, marginBottom: 10 }}>The Collection</p>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--green-dark)' }}>Every Product, Every Batch</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12, maxWidth: 500, fontWeight: 300, lineHeight: 1.7 }}>Chosen for character, not quantity. Nothing is here by accident.</p>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {cats.map(c => <button key={c} className={`pill-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        <input className="search-input" style={{ flex: 1, minWidth: 200 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Default Order</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rated">Top Rated</option>
        </select>
      </div>
      {prods.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, color: 'var(--ink)', marginBottom: 12 }}>Nothing found here</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Try a different search or browse all products.</p>
          <button className="btn-outline" onClick={() => { setSearch(''); setCat('All'); }}>Clear Filters</button>
        </div>
      ) : (
        <div className="prod-grid">
          {prods.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setDetailId={setDetailId} />)}
        </div>
      )}
    </main>
  );
}

// ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────
function ProductDetailPage({ productId, setPage, setDetailId }) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const { addToCart, showToast } = useCart();
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const highlights = [
    { icon: <IconLeaf color="var(--green)" size={16} />, text: '100% Natural, No Additives' },
    { icon: <IconFlag color="var(--green)" size={16} />, text: 'Single-Origin Sri Lanka' },
    { icon: <IconBox color="var(--green)" size={16} />, text: 'Small-Batch Packed' },
    { icon: <IconCheck color="var(--green)" size={16} />, text: 'Quality Verified Each Batch' },
  ];
  const reviews = [
    { name: 'Nimal Perera', init: 'NP', rating: 5, text: 'Absolutely outstanding cashews. You can taste the difference — no artificial coating, just honest roasting. Will not go back to supermarket nuts.' },
    { name: 'Amara Silva', init: 'AS', rating: 5, text: 'The honey glazed almonds are extraordinary. Restrained sweetness, real honey, no chemical after-taste. Ordered three times already.' },
    { name: 'Dinesh R.', init: 'DR', rating: 4, text: 'Quality is evident the moment you open the pack. A little pricier but you understand why immediately. Worth every rupee.' },
  ];
  return (
    <main className="page-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--muted)', marginBottom: 36, alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', color: 'var(--green)' }} onClick={() => setPage('home')}>Home</span>
        <span>/</span>
        <span style={{ cursor: 'pointer', color: 'var(--green)' }} onClick={() => setPage('products')}>Shop</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      {/* 2-col layout */}
      <div className="detail-grid">
        <div className="detail-img" style={{ borderRadius: 20, overflow: 'hidden', height: 520, position: 'relative' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {product.badge && <span className={`badge badge-${product.badgeType}`} style={{ position: 'absolute', top: 20, left: 20, fontSize: 12, padding: '5px 14px' }}>{product.badge}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{product.category}</span>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: 'var(--green-dark)', marginTop: 8, lineHeight: 1.2 }}>{product.name}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars rating={product.rating} size={16} />
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 32, fontWeight: 700, color: 'var(--green)' }}>LKR {product.price.toLocaleString()}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Select Weight</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.variants.map(v => (
                <button key={v} className={`pill-btn ${variant === v ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }}
              onClick={() => { for (let i = 0; i < qty; i++) addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, variant }); }}>
              Add to Cart
            </button>
            <button className="btn-brown" style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }}
              onClick={() => { for (let i = 0; i < qty; i++) addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, variant }); showToast('Proceeding to checkout...'); }}>
              Buy Now
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px', background: 'var(--cream-dark)', borderRadius: 16 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                {h.icon}<span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ marginBottom: 64 }}>
        <div className="tab-bar">
          {['description', 'nutrition', 'reviews'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === 'description' && (
          <p style={{ fontSize: 16, lineHeight: 1.9, color: 'var(--ink-soft)', maxWidth: 680, fontWeight: 300 }}>{product.description}</p>
        )}
        {tab === 'nutrition' && (
          <table className="nutrition-table" style={{ maxWidth: 420 }}>
            <tbody>
              {[['Serving Size', '30g'], ['Calories', '180 kcal'], ['Total Fat', '14g'], ['Protein', '6g'], ['Carbohydrates', '9g'], ['Fibre', '2g'], ['Sodium', '5mg']].map(([k, v]) => (
                <tr key={k}><td style={{ color: 'var(--muted)' }}>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 24, background: '#fff', borderRadius: 16 }}>
                <div className="review-avatar">{r.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{r.name}</div>
                  <div style={{ marginBottom: 10 }}><Stars rating={r.rating} size={13} /></div>
                  <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 28 }}>From the Same Category</h2>
          <div className="prod-grid" style={{ gap: 24 }}>
            {related.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setDetailId={setDetailId} />)}
          </div>
        </div>
      )}
    </main>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
  const sections = [
    { icon: <IconLeaf color="var(--green)" size={24} />, title: 'How It Started', text: 'Long before machines, discounts, and mass packing, nuts in Sri Lanka were handled slowly — grown by familiar hands, dried under open skies, traded with pride, and shared with respect. That world quietly faded. But it never truly disappeared. We built Ceylon Crunch to find it again.' },
    { icon: <IconPin color="var(--green)" size={24} />, title: 'Our Farmers', text: 'Across the island, there are still growers who know when a nut is ready without checking a calendar. Still harvests that follow seasons and not demand. Still people who believe food should be honest before it is impressive. We work with them directly — no brokers, no commodity chains.' },
    { icon: <IconBox color="var(--green)" size={24} />, title: 'Our Process', text: 'We source only what we are proud to put our name on. Never rushed, never mixed, never hidden behind flavors or polish. Each batch is chosen for its character, not its quantity. Each pack carries the patience of the land it came from.' },
    { icon: <IconCheck color="var(--green)" size={24} />, title: 'Our Promise', text: 'This is not a snack for everywhere. It is for moments that matter — after a long day, at a shared table, in quiet gratitude. We believe some things should still feel earned. From the land. Handled with care. Shared with intention.' },
  ];
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)', padding: '120px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)', fontWeight: 600, marginBottom: 20 }}>The Ceylon Crunch Story</p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
            Some things should still<br /><em>feel earned.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300 }}>
            A brand built for growers who follow seasons and not demand — and for people who believe food should be honest before it is impressive.
          </p>
        </div>
      </section>

      {/* Brand story intro */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '88px 48px 48px', textAlign: 'center' }}>
        <blockquote style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--green-dark)', lineHeight: 1.75, borderLeft: '4px solid var(--gold)', paddingLeft: 32, textAlign: 'left' }}>
          "Long before machines, discounts, and mass packing, nuts were handled slowly — grown by familiar hands, dried under open skies, traded with pride, and shared with respect."
        </blockquote>
      </section>

      {/* Sections */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(460px,1fr))', gap: 40 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: 40, background: '#fff', borderRadius: 24, boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 52, height: 52, background: 'var(--cream-dark)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 14 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, fontWeight: 300 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ background: 'var(--cream-dark)', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 20 }}>From the Land. Handled with Care.</h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.75, fontWeight: 300 }}>Shared with intention. Every pack we send carries the patience of the land it came from.</p>
        <button className="btn-primary" onClick={() => { setPage('products'); window.scrollTo(0, 0); }}>Shop the Collection</button>
      </section>
    </main>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [detailId, setDetailId] = useState(null);
  return (
    <CartProvider>
      <FontLoader />
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && <HomePage setPage={setPage} setDetailId={setDetailId} />}
      {page === 'products' && <ShopPage setPage={setPage} setDetailId={setDetailId} />}
      {page === 'product' && <ProductDetailPage productId={detailId} setPage={setPage} setDetailId={setDetailId} />}
      {page === 'about' && <AboutPage setPage={setPage} />}
      <CartDrawer setPage={setPage} />
      <Toast />
    </CartProvider>
  );
}

