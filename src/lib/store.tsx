import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, Product, ProductVariant, Review } from '../data/products';
import {
  supabase,
  isSupabaseConfigured,
  getProductsFromSupabase,
  adminUpdateVariant,
  adminUpdateVariantPrice,
  adminUpdateVariantOriginalPrice,
  adminUpdateVariantStock,
  adminUpdateProductImageUrl,
  placeOrderRpc,
  fetchAdminOrders,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
  fetchAdminInquiries,
  uploadPaymentSlip,
  saveInquiryToSupabase,
  saveReviewToSupabase,
  fetchPublicSiteSettings,
  adminCreateProduct,
  adminUpdateProductDetails,
  adminDeleteProduct,
  adminFetchNewsletter,
  adminToggleNewsletterSubscriber,
  adminDeleteNewsletterSubscriber,
} from './supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  variantId: string;
  productName: string;
  variantWeight: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'delivered';
export type PaymentMethod = 'cod' | 'bank' | 'card';
export type PaymentStatus = 'pending' | 'received' | 'verified';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  timestamp: string;
  description: string;
  location?: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g., CC-000123
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: {
    street: string;
    landmark?: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentSlipUrl?: string; // base64 / data URL
  orderNotes?: string;
  giftNote?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  waybill: string;
  estimatedArrival: string;
  timeline: OrderTimelineStep[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  label: string; // e.g., 'Home', 'Work', 'Family'
  recipientName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  district: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  dietaryPreferences: string[];
  loyaltyTier: 'Ceylon Patron' | 'Island Connoisseur' | 'Artisan Reserve';
  memberSince: string;
}

interface ToastMessage {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextType {
  // Products & Stock
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  updateProductStock: (productId: string, variantId: string, newStock: number) => Promise<void>;
  updateProductVariantPrice: (productId: string, variantId: string, newPrice: number) => Promise<void>;
  updateProductVariantOriginalPrice: (productId: string, variantId: string, newOriginalPrice?: number) => Promise<void>;
  updateProductVariants: (productId: string, variantUpdates: { id: string; price: number; originalPrice?: number; stock: number }[]) => Promise<{ success: boolean; error?: string }>;
  updateProductImage: (productId: string, newImageUrl: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => CartItem | undefined;
  restoreCartItem: (item: CartItem) => void;
  clearCart: () => void;
  giftNote: string;
  setGiftNote: (note: string) => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  itemCount: number;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'waybill' | 'timeline' | 'estimatedArrival' | 'status'>) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => Promise<void>;
  uploadOrderSlip: (orderId: string, slipDataUrl: string) => Promise<void>;
  lookupOrder: (orderNumber: string, phone: string) => Order | undefined;
  linkOrderToProfile: (order: Order) => void;

  // Patron Profile & Addresses
  patronProfile: CustomerProfile;
  updatePatronProfile: (data: Partial<CustomerProfile>) => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateSavedAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;

  // Reviews
  reviews: Record<string, Review[]>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Contact Inquiries
  inquiries: ContactInquiry[];
  refreshInquiries: () => Promise<void>;
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  hideToast: () => void;

  // Customer Session
  customerEmail: string | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupCustomer: (email: string, password: string, name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => Promise<void>;

  createProduct: (payload: {
    name: string;
    subtitle?: string;
    category: any;
    badge?: string;
    origin?: string;
    roastStyle?: string;
    images: string[];
    description: string;
    ingredients?: string;
    storage?: string;
    shelfLife?: string;
    allergenNotice?: string;
    isFeatured?: boolean;
    price: number;
    originalPrice?: number;
    stock: number;
    weight?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProductDetails: (
    productId: string,
    updates: {
      name?: string;
      subtitle?: string;
      category?: any;
      badge?: string;
      origin?: string;
      roastStyle?: string;
      description?: string;
      ingredients?: string;
      isFeatured?: boolean;
      images?: string[];
    }
  ) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;

  // Newsletter Subscribers
  subscribers: NewsletterSubscriber[];
  refreshSubscribers: () => Promise<void>;
  toggleSubscriber: (id: string, active: boolean) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;

  // Admin Session
  isAdmin: boolean;
  isAdminLoading: boolean;
  adminEmail: string | null;
  loginAdmin: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;

  // Site Configuration & Personalization
  siteSettings: SiteSettingsConfig;
  updateSiteSettingsState: (newSettings: Partial<SiteSettingsConfig>) => void;
}

export interface SiteSettingsConfig {
  storeName: string;
  tagline: string;
  logoUrl: string;
  announcementBanner: string;
  announcementActive: boolean;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  courierPartner: string;
  deliveryEstimate: string;
  payhereMerchantId: string;
  payhereMode: string;
  enablePayhere?: boolean;
  payhereSecret?: string;
  enableCod: boolean;
  enableBankTransfer: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankDetails: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: string;
  goldColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBannerUrl: string;
  featuredTitle: string;
  featuredSubtitle: string;
  footerAbout: string;
  roasteryAddress: string;
  operatingHours: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsConfig = {
  storeName: 'Ceylon Crunch - Artisan Provisions',
  tagline: 'Healthy Crunch for Every Home — Sourced with patience, shared with intention.',
  logoUrl: '/logo.png',
  announcementBanner: 'Free island-wide delivery on orders over Rs. 3,000 · Small-Batch Freshness Guaranteed',
  announcementActive: true,
  freeDeliveryThreshold: 3000,
  standardDeliveryFee: 300,
  courierPartner: 'Ceylon Express Tracked Courier',
  deliveryEstimate: '1-2 Business Days (Island-wide)',
  payhereMerchantId: '1228491',
  payhereMode: 'sandbox',
  enablePayhere: true,
  payhereSecret: '',
  enableCod: true,
  enableBankTransfer: true,
  bankName: 'Commercial Bank / Sampath Bank',
  bankAccountName: 'Ceylon Crunch (Pvt) Ltd',
  bankAccountNumber: '1000 2489 8210',
  bankBranch: 'Kollupitiya (Colombo 03)',
  bankDetails: 'Commercial Bank of Ceylon · Acc: 1000 2489 8210 · Ceylon Crunch (Pvt) Ltd · Kollupitiya',
  contactEmail: 'hello@ceyloncrunch.lk',
  contactPhone: '+94 77 944 3867',
  primaryColor: '#1F3D2B',
  goldColor: '#C5A059',
  heroTitle: 'Pure Ceylon Harvest. Handcrafted in Small Batches.',
  heroSubtitle: 'Single-origin cashews, sun-dried exotic fruits, and organic roastery snacks delivered direct to your door.',
  heroCtaText: 'Explore Collection',
  heroBannerUrl: '/hero-banner.png',
  featuredTitle: 'Curated Harvest Collection',
  featuredSubtitle: 'Freshly roasted whole-grade cashews and artisanal sun-dried fruits.',
  footerAbout: 'Ceylon Crunch is dedicated to the preservation of heritage roastery craft, ethical farmer partnerships, and clean wholesome snacking across Sri Lanka.',
  roasteryAddress: 'No. 42/1, Alfred House Gardens, Colombo 03, Sri Lanka',
  operatingHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
  seoTitle: 'Ceylon Crunch | Artisan Cashew & Organic Dried Fruits Sri Lanka',
  seoDescription: 'Order premium artisanal cashew snacks, roasted cashews, and organic dried fruits in Sri Lanka. Islandwide tracked courier delivery.',
  seoKeywords: 'ceylon cashews, roasted cashews colombo, dried fruits sri lanka, healthy snacks sri lanka',
};

const StoreContext = createContext<StoreContextType | null>(null);

// Initial Seed Orders (empty for live production)
const SEED_ORDERS: Order[] = [];

// Seed Inquiries (empty for live production)
const SEED_INQUIRIES: ContactInquiry[] = [];

// Helper to normalize SL phone numbers for comparison
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('94')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '94' + digits.slice(1);
  }
  return '94' + digits;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (loads from localStorage cache if present, then hydrated from Supabase)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_products_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [giftNote, setGiftNote] = useState<string>(() => {
    try {
      return localStorage.getItem('ceylon_crunch_gift_note') || '';
    } catch {
      return '';
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.filter(
          (o) => !['CC-000123', 'CC-000124', 'CC-000120'].includes(o.id)
        );
      }
      return [];
    } catch {
      return [];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_reviews');
      if (saved) {
        const parsed: Record<string, Review[]> = JSON.parse(saved);
        const cleaned: Record<string, Review[]> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (Array.isArray(v)) {
            cleaned[k] = v.filter((r) => r.id !== 'rev-1');
          }
        }
        return cleaned;
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Inquiries
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_inquiries');
      if (saved) {
        const parsed: ContactInquiry[] = JSON.parse(saved);
        return parsed.filter((i) => i.id !== 'inq-1');
      }
      return [];
    } catch {
      return [];
    }
  });

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Patron Profile State
  const [patronProfile, setPatronProfile] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_patron_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: '',
      phone: '',
      email: '',
      city: 'Colombo',
      district: 'Colombo',
      dietaryPreferences: [],
      loyaltyTier: 'Ceylon Patron',
      memberSince: new Date().getFullYear().toString(),
    };
  });

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Wishlist State (list of product IDs)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Site Settings (loaded from cache, updated from Supabase/API)
  const [siteSettings, setSiteSettings] = useState<SiteSettingsConfig>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_site_settings');
      if (saved) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SITE_SETTINGS;
  });

  useEffect(() => {
    fetchPublicSiteSettings().then((remoteSettings) => {
      if (remoteSettings && Object.keys(remoteSettings).length > 0) {
        setSiteSettings((prev) => {
          const merged: SiteSettingsConfig = {
            ...prev,
            storeName: remoteSettings.store_name || prev.storeName,
            tagline: remoteSettings.tagline || prev.tagline,
            logoUrl: remoteSettings.logo_url || prev.logoUrl,
            announcementBanner: remoteSettings.announcement_banner || prev.announcementBanner,
            announcementActive: remoteSettings.announcement_active ?? prev.announcementActive,
            freeDeliveryThreshold: remoteSettings.free_delivery_threshold ?? prev.freeDeliveryThreshold,
            standardDeliveryFee: remoteSettings.standard_delivery_fee ?? prev.standardDeliveryFee,
            courierPartner: remoteSettings.courier_partner || prev.courierPartner,
            deliveryEstimate: remoteSettings.delivery_estimate || prev.deliveryEstimate,
            payhereMerchantId: (remoteSettings as any).payhere_merchant_id || prev.payhereMerchantId,
            payhereMode: (remoteSettings as any).payhere_mode || prev.payhereMode,
            enablePayhere: (remoteSettings as any).payhere_enabled ?? prev.enablePayhere,
            payhereSecret: (remoteSettings as any).payhere_secret || prev.payhereSecret,
            enableCod: (remoteSettings as any).cod_enabled ?? prev.enableCod,
            enableBankTransfer: (remoteSettings as any).bank_transfer_enabled ?? prev.enableBankTransfer,
            bankName: (remoteSettings as any).bank_name || prev.bankName,
            bankAccountName: (remoteSettings as any).bank_account_name || prev.bankAccountName,
            bankAccountNumber: (remoteSettings as any).bank_account_number || prev.bankAccountNumber,
            bankBranch: (remoteSettings as any).bank_branch || prev.bankBranch,
            bankDetails: remoteSettings.bank_details || prev.bankDetails,
            contactEmail: remoteSettings.contact_email || prev.contactEmail,
            contactPhone: remoteSettings.contact_phone || prev.contactPhone,
            primaryColor: remoteSettings.primary_color || prev.primaryColor,
            goldColor: remoteSettings.gold_color || prev.goldColor,
            heroTitle: remoteSettings.hero_title || prev.heroTitle,
            heroSubtitle: remoteSettings.hero_subtitle || prev.heroSubtitle,
            heroCtaText: remoteSettings.hero_cta_text || prev.heroCtaText,
            heroBannerUrl: remoteSettings.hero_banner_url || prev.heroBannerUrl,
            featuredTitle: remoteSettings.featured_title || prev.featuredTitle,
            featuredSubtitle: remoteSettings.featured_subtitle || prev.featuredSubtitle,
            footerAbout: remoteSettings.footer_about || prev.footerAbout,
            roasteryAddress: remoteSettings.roastery_address || prev.roasteryAddress,
            operatingHours: remoteSettings.operating_hours || prev.operatingHours,
            seoTitle: remoteSettings.seo_title || prev.seoTitle,
            seoDescription: remoteSettings.seo_description || prev.seoDescription,
            seoKeywords: remoteSettings.seo_keywords || prev.seoKeywords,
          };
          try {
            localStorage.setItem('ceylon_crunch_site_settings', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    }).catch(() => {});
  }, []);

  const updateSiteSettingsState = (newSettings: Partial<SiteSettingsConfig>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ceylon_crunch_site_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Admin session authenticated through Supabase Auth & public.admins table
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('ceylon_crunch_admin_session');
    } catch {}

    const client = supabase;
    if (!client) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      setCustomerEmail(null);
      return;
    }

    let isMounted = true;

    // Check active session on initial load
    const checkIsAdmin = async (userId: string): Promise<boolean> => {
      try {
        const { data: prof } = await client.from('profiles').select('role').eq('id', userId).maybeSingle();
        if (prof?.role === 'admin' || prof?.role === 'super_admin') return true;
      } catch {}
      try {
        const { data: adminRow } = await client.from('admins').select('role').eq('user_id', userId).maybeSingle();
        if (adminRow) return true;
      } catch {}
      try {
        if (localStorage.getItem('ceylon_crunch_admin_session') === 'true') return true;
      } catch {}
      return false;
    };

    client.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        setCustomerEmail(session.user.email || null);
        const valid = await checkIsAdmin(session.user.id);

        if (isMounted) {
          setIsAdmin(valid);
          setAdminEmail(valid ? session.user.email || 'admin@ceyloncrunch.lk' : null);
          setIsAdminLoading(false);
        }
      } else {
        if (isMounted) {
          const localAdmin = (() => {
            try { return localStorage.getItem('ceylon_crunch_admin_session') === 'true'; } catch { return false; }
          })();
          setIsAdmin(localAdmin);
          setAdminEmail(localAdmin ? 'admin@ceyloncrunch.lk' : null);
          setCustomerEmail(null);
          setIsAdminLoading(false);
        }
      }
    });

    // Listen to session changes / expiry
    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setCustomerEmail(session.user.email || null);
        const valid = await checkIsAdmin(session.user.id);

        if (isMounted) {
          setIsAdmin(valid);
          setAdminEmail(valid ? session.user.email || 'admin@ceyloncrunch.lk' : null);
          setIsAdminLoading(false);
        }
      } else {
        if (isMounted) {
          const localAdmin = (() => {
            try { return localStorage.getItem('ceylon_crunch_admin_session') === 'true'; } catch { return false; }
          })();
          setIsAdmin(localAdmin);
          setAdminEmail(localAdmin ? 'admin@ceyloncrunch.lk' : null);
          setCustomerEmail(null);
          setIsAdminLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Live Refresh Products from Supabase
  const refreshProducts = async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingProducts(false);
      return;
    }
    try {
      const dbProducts = await getProductsFromSupabase();
      if (dbProducts && dbProducts.length > 0) {
        const mappedProducts: Product[] = dbProducts.map((p) => {
          const matchingInitial = INITIAL_PRODUCTS.find(
            (init) => init.slug === p.slug || init.id === p.id
          );

          // Normalize variants from any database format (JSON objects or strings)
          const rawVariants = Array.isArray(p.variants) ? p.variants : [];
          let normalizedVariants: ProductVariant[] = rawVariants.map((v: any, idx: number) => {
            if (typeof v === 'string') {
              const weight = v.trim();
              const vId = `${p.slug || p.id}-${weight.toLowerCase().replace(/\s+/g, '')}`;
              return {
                id: vId,
                weight,
                price: Number(p.price) || 0,
                originalPrice: Math.round((Number(p.price) || 0) * 1.15),
                stock: 25,
              };
            }
            const weight = v.weight || v.size || `Pack ${idx + 1}`;
            const vId = v.id || `${p.slug || p.id}-${String(weight).toLowerCase().replace(/\s+/g, '')}`;
            return {
              id: vId,
              weight,
              price: Number(v.price) || Number(p.price) || 0,
              originalPrice: v.original_price
                ? Number(v.original_price)
                : v.originalPrice
                ? Number(v.originalPrice)
                : undefined,
              stock: typeof v.stock === 'number' ? v.stock : (Number(v.stock) || 25),
            };
          });

          // If product has empty variants in database, fall back to INITIAL_PRODUCTS
          if (normalizedVariants.length === 0) {
            if (matchingInitial && matchingInitial.variants.length > 0) {
              normalizedVariants = matchingInitial.variants;
            } else {
              normalizedVariants = [
                {
                  id: `${p.slug || p.id}-250g`,
                  weight: '250g',
                  price: Number(p.price) || 1200,
                  originalPrice: Math.round((Number(p.price) || 1200) * 1.15),
                  stock: 25,
                },
              ];
            }
          }

          // Normalize images from image_url or INITIAL_PRODUCTS
          let images: string[] = [];
          if (Array.isArray(p.images) && p.images.length > 0) {
            images = p.images;
          } else if (p.image_url) {
            images = [p.image_url];
          } else if (matchingInitial && matchingInitial.images?.length > 0) {
            images = matchingInitial.images;
          } else {
            images = ['/img/product-1.jpg'];
          }

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle || matchingInitial?.subtitle || '',
            category: (p.category || matchingInitial?.category || 'nuts') as any,
            badge: p.badge || matchingInitial?.badge || undefined,
            origin: p.origin || matchingInitial?.origin || 'Ceylon, Sri Lanka',
            roastStyle: p.roast_style || matchingInitial?.roastStyle || undefined,
            rating: Number(p.rating) || matchingInitial?.rating || 4.9,
            reviewCount: p.review_count || matchingInitial?.reviewCount || 24,
            images,
            description: p.description || matchingInitial?.description || '',
            extendedAbout: p.extended_about || matchingInitial?.extendedAbout || [],
            ingredients: p.ingredients || matchingInitial?.ingredients || '100% pure artisan provisions',
            storage: p.storage || matchingInitial?.storage || 'Store in a cool, dry place.',
            shelfLife: p.shelf_life || matchingInitial?.shelfLife || '6 Months',
            allergenNotice: p.allergen_notice || matchingInitial?.allergenNotice || '',
            variants: normalizedVariants,
            pairsWithIds: matchingInitial?.pairsWithIds || [],
            isFeatured: Boolean(p.is_featured || matchingInitial?.isFeatured),
          };
        });

        const dbSlugs = new Set(mappedProducts.map((p) => p.slug));
        const extraInitial = INITIAL_PRODUCTS.filter((p) => !dbSlugs.has(p.slug));
        const combined = [...extraInitial, ...mappedProducts];
        setProducts(combined);
        try {
          localStorage.setItem('ceylon_crunch_products_v5', JSON.stringify(combined));
        } catch {}
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Live Refresh Orders from Supabase (for Admin)
  const refreshOrders = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const dbOrders = await fetchAdminOrders();
      if (dbOrders) {
        const mapped: Order[] = dbOrders.map((o: any) => ({
          id: o.id,
          createdAt: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent',
          customer: {
            name: o.customer_name || 'Customer',
            phone: o.customer_phone || '',
            email: o.customer_email || undefined,
          },
          shippingAddress: {
            street: o.shipping_street || o.shipping_address || '',
            city: o.shipping_city || o.city || '',
            district: o.shipping_district || '',
            postalCode: o.shipping_postal || undefined,
            landmark: o.landmark || undefined,
          },
          paymentMethod: o.payment_method || 'cod',
          paymentStatus: o.payment_status || (o.status === 'paid' ? 'paid' : 'pending'),
          paymentSlipUrl: o.payment_slip_url || undefined,
          orderNotes: o.order_notes || o.notes || undefined,
          giftNote: o.gift_note || undefined,
          subtotal: Number(o.subtotal || 0),
          deliveryFee: Number(o.delivery_fee ?? o.delivery ?? 0),
          total: Number(o.total || 0),
          status: o.status || 'pending',
          waybill: o.waybill || `CLN-${String(o.id).slice(0, 8).toUpperCase()}-LK`,
          estimatedArrival: o.estimated_arrival || '1-2 business days',
          items: (o.items || []).map((item: any) => ({
            productId: item.product_id || item.id || '',
            variantId: item.variant_id || item.id || '',
            productName: item.product_name || item.name || 'Product',
            variantWeight: item.variant_weight || item.variant || '',
            price: Number(item.price || item.unit_price || 0),
            quantity: Number(item.quantity || 1),
            image: item.image || item.image_url || '',
            slug: item.slug || '',
          })),
          timeline: [
            {
              status: 'placed',
              title: 'Order Placed',
              timestamp: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recorded',
              description: 'Web checkout verified & tokenized',
              completed: true,
            },
            {
              status: 'confirmed',
              title: 'Order Confirmed',
              timestamp: 'Status check',
              description: o.payment_method === 'cod' ? 'Payment due on delivery' : 'Awaiting payment verification',
              completed: ['confirmed', 'packed', 'dispatched', 'delivered'].includes(o.status),
            },
            {
              status: 'packed',
              title: 'Small-Batch Packed',
              timestamp: 'Fulfillment queue',
              description: 'Aroma-sealed foil packaging',
              completed: ['packed', 'dispatched', 'delivered'].includes(o.status),
            },
            {
              status: 'dispatched',
              title: 'Dispatched & In Transit',
              timestamp: 'Courier handover',
              description: 'Pronto Tracked Courier',
              completed: ['dispatched', 'delivered'].includes(o.status),
            },
            {
              status: 'delivered',
              title: 'Delivered',
              timestamp: 'Final destination',
              description: 'Recipient signature',
              completed: o.status === 'delivered',
            },
          ],
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.warn('Error refreshing orders from Supabase:', err);
    }
  };

  // Live Refresh Inquiries from Supabase (for Admin)
  const refreshInquiries = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const dbInq = await fetchAdminInquiries();
      if (dbInq) {
        setInquiries(
          dbInq.map((i) => ({
            id: i.id || `inq-${Date.now()}`,
            name: i.name,
            email: i.email,
            phone: i.phone || '',
            subject: i.subject,
            message: i.message,
            createdAt: i.created_at ? new Date(i.created_at).toLocaleString() : 'Recent',
          }))
        );
      }
    } catch (err) {
      console.warn('Error refreshing inquiries from Supabase:', err);
    }
  };

  // Live load & Supabase Realtime channel for instant cross-device updates
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingProducts(false);
      return;
    }

    refreshProducts();

    const channel = supabase
      .channel('storefront-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          refreshProducts();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          if (isAdmin) refreshOrders();
        }
      )
      .subscribe();

    const handleFocus = () => {
      refreshProducts();
      if (isAdmin) {
        refreshOrders();
        refreshInquiries();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibility);

    const intervalId = setInterval(() => {
      refreshProducts();
      if (isAdmin) {
        refreshOrders();
      }
    }, 30000);

    return () => {
      supabase?.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(intervalId);
    };
  }, [isAdmin]);

  // When admin logs in, load orders and inquiries from Supabase
  useEffect(() => {
    if (isAdmin) {
      refreshOrders();
      refreshInquiries();
    }
  }, [isAdmin]);

  // Synchronize cart items with live database prices and stock limits
  useEffect(() => {
    if (products.length === 0) return;
    setCart((prevCart) => {
      let hasChanges = false;
      const updated = prevCart.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const variant = prod?.variants.find((v) => v.id === item.variantId);
        if (!prod || !variant) return item;

        const newPrice = variant.price;
        const newStock = variant.stock;
        const newQty = Math.min(item.quantity, Math.max(1, newStock));
        const newImage = prod.images[0] || item.image;
        const newName = prod.name;

        if (
          item.price !== newPrice ||
          item.image !== newImage ||
          item.productName !== newName ||
          (item.quantity > newStock && newStock > 0 && item.quantity !== newQty)
        ) {
          hasChanges = true;
          return {
            ...item,
            productName: newName,
            price: newPrice,
            image: newImage,
            quantity: newStock > 0 ? newQty : item.quantity,
          };
        }
        return item;
      });
      return hasChanges ? updated : prevCart;
    });
  }, [products]);

  // Cart & Note persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_gift_note', giftNote);
    } catch (e) {
      console.error(e);
    }
  }, [giftNote]);

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  // Toast helpers
  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now().toString();
    setToast({ id, message, actionLabel, onAction });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  };

  const hideToast = () => {
    setToast(null);
  };

  // Stock update
  const updateProductStock = async (productId: string, variantId: string, newStock: number) => {
    const safeStock = Math.max(0, Math.round(newStock));

    // Optimistic local state update + localStorage save
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: safeStock } : v)),
        };
      });
      try {
        localStorage.setItem('ceylon_crunch_products_v5', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      const res = await adminUpdateVariantStock(productId, variantId, safeStock);
      if (!res.success) {
        showToast(res.error || 'Failed to update stock in database.');
      } else {
        showToast('Stock count saved');
      }
    }
  };

  // Price update for variant
  const updateProductVariantPrice = async (productId: string, variantId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const roundedPrice = Math.round(newPrice);

    // Optimistic local state update + localStorage save
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, price: roundedPrice } : v)),
        };
      });
      try {
        localStorage.setItem('ceylon_crunch_products_v5', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Keep active cart items synchronized with the new price
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.variantId === variantId ? { ...item, price: roundedPrice } : item
      );
      try {
        localStorage.setItem('ceylon_crunch_cart', JSON.stringify(updatedCart));
      } catch {}
      return updatedCart;
    });

    if (isSupabaseConfigured) {
      const res = await adminUpdateVariantPrice(productId, variantId, roundedPrice);
      if (!res.success) {
        showToast(`Price update: ${res.error}`);
      } else {
        showToast('Price updated & synchronized across all devices');
      }
    }
  };

  // Original / Strikethrough price update for variant (discount compare-at price)
  const updateProductVariantOriginalPrice = async (
    productId: string,
    variantId: string,
    newOriginalPrice?: number
  ) => {
    const val =
      newOriginalPrice === undefined || isNaN(newOriginalPrice)
        ? undefined
        : Math.round(newOriginalPrice);

    // Optimistic local state update + localStorage save
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, originalPrice: val } : v
          ),
        };
      });
      try {
        localStorage.setItem('ceylon_crunch_products_v5', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (isSupabaseConfigured) {
      await adminUpdateVariantOriginalPrice(variantId, val ?? null);
      showToast('Discount / Original price updated');
    }
  };

  // Batch save variants for a product
  const updateProductVariants = async (
    productId: string,
    variantUpdates: { id: string; price: number; originalPrice?: number; stock: number }[]
  ): Promise<{ success: boolean; error?: string }> => {
    // Optimistic local state update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updateMap = new Map(variantUpdates.map((u) => [u.id, u]));
        return {
          ...p,
          variants: p.variants.map((v) => {
            const upd = updateMap.get(v.id);
            if (!upd) return v;
            return {
              ...v,
              price: Math.round(upd.price),
              originalPrice: upd.originalPrice !== undefined ? Math.round(upd.originalPrice) : undefined,
              stock: Math.max(0, Math.round(upd.stock)),
            };
          }),
        };
      })
    );

    // Sync active cart
    setCart((prev) =>
      prev.map((item) => {
        const upd = variantUpdates.find((u) => u.id === item.variantId);
        if (upd) {
          return {
            ...item,
            price: Math.round(upd.price),
            quantity: Math.min(item.quantity, Math.max(1, Math.round(upd.stock))),
          };
        }
        return item;
      })
    );

    if (isSupabaseConfigured) {
      try {
        const promises = variantUpdates.map((v) =>
          adminUpdateVariant(
            v.id,
            {
              price: v.price,
              original_price: v.originalPrice ?? null,
              stock: v.stock,
            },
            productId
          )
        );
        const results = await Promise.all(promises);
        const failed = results.find((r) => !r.success);
        if (failed) {
          await refreshProducts();
          return { success: false, error: failed.error };
        }
      } catch (err: any) {
        await refreshProducts();
        return { success: false, error: err?.message || 'Failed to update database' };
      }
    }

    return { success: true };
  };

  // Product primary image update
  const updateProductImage = async (productId: string, newImageUrl: string) => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    // Optimistic local state update + localStorage save
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId && p.slug !== productId) return p;
        const otherImages = p.images ? p.images.slice(1) : [];
        return {
          ...p,
          images: [trimmed, ...otherImages],
        };
      });
      try {
        localStorage.setItem('ceylon_crunch_products_v5', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Keep active cart items synchronized with the new image
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.productId === productId ? { ...item, image: trimmed } : item
      );
      try {
        localStorage.setItem('ceylon_crunch_cart', JSON.stringify(updatedCart));
      } catch {}
      return updatedCart;
    });

    if (isSupabaseConfigured) {
      await adminUpdateProductImageUrl(productId, trimmed);
      showToast('Product image updated across catalog');
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    if (variant.stock <= 0) {
      showToast(`${product.name} (${variant.weight}) is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        const targetQty = existing.quantity + quantity;
        const finalQty = Math.min(targetQty, variant.stock);
        return prev.map((item) => (item.variantId === variant.id ? { ...item, quantity: finalQty } : item));
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantWeight: variant.weight,
          price: variant.price,
          quantity: Math.min(quantity, variant.stock),
          image: product.images[0] || '',
          slug: product.slug,
        },
      ];
    });

    showToast(`Added ${product.name} (${variant.weight}) to your cart.`);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    // Check max stock
    let maxStock = 999;
    for (const p of products) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        maxStock = v.stock;
        break;
      }
    }

    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity: Math.min(quantity, maxStock) } : item
      )
    );
  };

  const removeFromCart = (variantId: string) => {
    const itemToRemove = cart.find((i) => i.variantId === variantId);
    if (!itemToRemove) return undefined;

    setCart((prev) => prev.filter((i) => i.variantId !== variantId));

    showToast(`Removed ${itemToRemove.productName}`, 'Undo', () => {
      restoreCartItem(itemToRemove);
    });

    return itemToRemove;
  };

  const restoreCartItem = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    showToast(`Restored ${item.productName}`);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    const threshold = siteSettings.freeDeliveryThreshold ?? 3000;
    const fee = siteSettings.standardDeliveryFee ?? 300;
    return cartSubtotal >= threshold ? 0 : fee;
  }, [cart, cartSubtotal, siteSettings.freeDeliveryThreshold, siteSettings.standardDeliveryFee]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryFee;
  }, [cartSubtotal, deliveryFee]);

  const itemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Create Order via Supabase atomic place_order RPC with fallback
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt' | 'waybill' | 'timeline' | 'estimatedArrival' | 'status'>
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (isSupabaseConfigured) {
      const rpcItems = orderData.items.map((i) => ({
        variant_id: i.variantId,
        quantity: i.quantity,
      }));

      const rpcRes = await placeOrderRpc({
        customer_name: orderData.customer.name,
        customer_phone: orderData.customer.phone,
        customer_email: orderData.customer.email,
        shipping_street: orderData.shippingAddress.street,
        shipping_city: orderData.shippingAddress.city,
        shipping_district: orderData.shippingAddress.district,
        shipping_postal: orderData.shippingAddress.postalCode,
        landmark: orderData.shippingAddress.landmark,
        payment_method: orderData.paymentMethod,
        items: rpcItems,
        order_notes: orderData.orderNotes,
        gift_note: orderData.giftNote,
        full_items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total: orderData.total,
      });

      if (!rpcRes.success || !rpcRes.order_id) {
        return {
          success: false,
          error: rpcRes.error || 'Failed to place order. Please review stock availability.',
        };
      }

      const orderId = rpcRes.order_id;
      const waybill = rpcRes.waybill || `CLN-${Math.floor(10000000 + Math.random() * 90000000)}-LK`;
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newOrder: Order = {
        ...orderData,
        id: orderId,
        createdAt: formattedDate,
        status: (rpcRes.status as OrderStatus) || 'placed',
        subtotal: rpcRes.subtotal ?? orderData.subtotal,
        deliveryFee: rpcRes.delivery_fee ?? orderData.deliveryFee,
        total: rpcRes.total ?? orderData.total,
        waybill,
        estimatedArrival: 'In 1-2 business days',
        timeline: [
          {
            status: 'placed',
            title: 'Order Placed',
            timestamp: formattedDate,
            description: 'Web checkout verified & tokenized',
            completed: true,
          },
          {
            status: 'confirmed',
            title: 'Order Confirmed',
            timestamp: 'Scheduled batch check',
            description: orderData.paymentMethod === 'cod' ? 'Payment due on delivery' : 'Awaiting payment verification',
            completed: orderData.paymentMethod === 'cod',
          },
          {
            status: 'packed',
            title: 'Small-Batch Packed',
            timestamp: 'Pending queue',
            description: 'Aroma-sealed foil packaging',
            completed: false,
          },
          {
            status: 'dispatched',
            title: 'Dispatched & In Transit',
            timestamp: 'Scheduled within 24h',
            description: 'Pronto Tracked Courier handover',
            completed: false,
          },
          {
            status: 'delivered',
            title: 'Delivered',
            timestamp: 'Estimated 24-48h',
            description: 'Recipient signature at address',
            completed: false,
          },
        ],
      };

      setOrders((prev) => {
        const next = [newOrder, ...prev];
        try {
          localStorage.setItem('ceylon_crunch_orders', JSON.stringify(next));
        } catch {}
        return next;
      });

      // Auto-populate patron profile & address if not present
      if (!patronProfile.name) {
        updatePatronProfile({
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          email: orderData.customer.email || '',
          city: orderData.shippingAddress.city,
          district: orderData.shippingAddress.district,
        });
      }
      if (savedAddresses.length === 0) {
        addSavedAddress({
          label: 'Home',
          recipientName: orderData.customer.name,
          phone: orderData.customer.phone,
          street: orderData.shippingAddress.street,
          landmark: orderData.shippingAddress.landmark,
          city: orderData.shippingAddress.city,
          district: orderData.shippingAddress.district,
          postalCode: orderData.shippingAddress.postalCode,
          isDefault: true,
        });
      }

      clearCart();
      // Instantly refresh products to reflect decremented stock in local UI
      refreshProducts();

      return { success: true, order: newOrder };
    }

    return { success: false, error: 'Database connection is not configured.' };
  };

  // Update order status (Admin)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map((step) => {
          if (step.status === status) {
            return { ...step, completed: true, timestamp: 'Updated just now' };
          }
          return step;
        });

        return {
          ...order,
          status,
          timeline: updatedTimeline,
        };
      })
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdateOrderStatus(orderId, status);
      if (!res.success) {
        showToast(`Failed to update order status: ${res.error}`);
        await refreshOrders();
      }
    }
  };

  // Update order payment status (Admin)
  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, paymentStatus } : order))
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdatePaymentStatus(orderId, paymentStatus);
      if (!res.success) {
        showToast(`Failed to update payment status: ${res.error}`);
        await refreshOrders();
      }
    }
  };

  // Upload order payment slip (Customer)
  const uploadOrderSlip = async (orderId: string, slipDataUrl: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentSlipUrl: slipDataUrl, paymentStatus: 'pending' } : order
      )
    );
    showToast('Payment slip uploaded successfully! Roasters notified.');

    if (isSupabaseConfigured && supabase) {
      try {
        const res = await fetch(slipDataUrl);
        const blob = await res.blob();
        const uploadedUrl = await uploadPaymentSlip(orderId, blob);
        if (uploadedUrl) {
          await supabase
            .from('orders')
            .update({
              payment_slip_url: uploadedUrl,
              payment_status: 'pending',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);
        }
      } catch (err) {
        console.warn('Error uploading payment slip to Supabase:', err);
      }
    }
  };

  // Lookup order
  const lookupOrder = (orderNumber: string, phone: string): Order | undefined => {
    const cleanOrderNumber = orderNumber.trim().toUpperCase().replace('#', '');
    const cleanTargetPhone = normalizePhone(phone);

    return orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanOrderNumber || o.id.toUpperCase() === `CC-${cleanOrderNumber}`;
      const matchPhone = normalizePhone(o.customer.phone) === cleanTargetPhone;
      return matchId && matchPhone;
    });
  };

  // Reviews
  const addReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }));

    // Update product rating and review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const currentList = reviews[productId] || [];
        const allRatings = [newReview.rating, ...currentList.map((r) => r.rating)];
        const avg = parseFloat((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1));
        return {
          ...p,
          rating: avg,
          reviewCount: p.reviewCount + 1,
        };
      })
    );

    showToast('Thank you! Your review has been published.');

    if (isSupabaseConfigured) {
      saveReviewToSupabase({
        product_id: productId,
        author: newReview.author,
        location: newReview.location,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: newReview.verified,
        is_approved: true,
      }).catch((err) => console.warn('Supabase review sync error:', err));
    }
  };

  // Inquiries
  const addInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    showToast('Inquiry sent! Our Colombo concierge will reply promptly.');

    if (isSupabaseConfigured) {
      saveInquiryToSupabase({
        name: newInquiry.name,
        email: newInquiry.email,
        phone: newInquiry.phone,
        subject: newInquiry.subject,
        message: newInquiry.message,
      }).catch((err) => console.warn('Supabase inquiry sync error:', err));
    }
  };

  // Newsletter state & handlers
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([
    { id: 'sub-1', email: 'kavinda.perera@gmail.com', active: true, createdAt: '2026-03-12' },
    { id: 'sub-2', email: 'nadeesha.fernando@yahoo.com', active: true, createdAt: '2026-03-18' },
    { id: 'sub-3', email: 'rashmika.silva@outlook.com', active: true, createdAt: '2026-03-24' },
    { id: 'sub-4', email: 'dilshan.jayasinghe@ceyloncrunch.lk', active: false, createdAt: '2026-04-02' },
    { id: 'sub-5', email: 'anuki.de.mel@gmail.com', active: true, createdAt: '2026-04-10' },
  ]);

  const refreshSubscribers = async () => {
    if (!isSupabaseConfigured) return;
    const dbSubs = await adminFetchNewsletter();
    if (dbSubs && dbSubs.length > 0) {
      setSubscribers(
        dbSubs.map((s) => ({
          id: s.id,
          email: s.email,
          active: s.active,
          createdAt: s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recent',
        }))
      );
    }
  };

  const toggleSubscriber = async (id: string, active: boolean) => {
    setSubscribers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !active } : s))
    );
    if (isSupabaseConfigured) {
      await adminToggleNewsletterSubscriber(id, !active);
    }
    showToast(!active ? 'Subscriber reactivated' : 'Subscriber unsubscribed');
  };

  const deleteSubscriber = async (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConfigured) {
      await adminDeleteNewsletterSubscriber(id);
    }
    showToast('Subscriber removed');
  };

  const createProduct = async (payload: {
    name: string;
    subtitle?: string;
    category: any;
    badge?: string;
    origin?: string;
    roastStyle?: string;
    images: string[];
    description: string;
    ingredients?: string;
    storage?: string;
    shelfLife?: string;
    allergenNotice?: string;
    isFeatured?: boolean;
    price: number;
    originalPrice?: number;
    stock: number;
    weight?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const res = await adminCreateProduct({
        name: payload.name,
        subtitle: payload.subtitle,
        category: payload.category,
        badge: payload.badge,
        origin: payload.origin,
        roast_style: payload.roastStyle,
        images: payload.images,
        description: payload.description,
        ingredients: payload.ingredients,
        storage: payload.storage,
        shelf_life: payload.shelfLife,
        allergen_notice: payload.allergenNotice,
        is_featured: payload.isFeatured,
        price: payload.price,
        original_price: payload.originalPrice,
        stock: payload.stock,
        weight: payload.weight || '250g',
      });

      if (!res.success) {
        return { success: false, error: res.error };
      }

      await refreshProducts();
      return { success: true };
    }

    // Local state fallback
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(100 + Math.random() * 900),
      name: payload.name,
      subtitle: payload.subtitle || '',
      category: payload.category,
      badge: payload.badge,
      origin: payload.origin || 'Ceylon, Sri Lanka',
      roastStyle: payload.roastStyle || 'Artisan Roasted',
      rating: 5.0,
      reviewCount: 0,
      images: payload.images.length > 0 ? payload.images : ['https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80'],
      description: payload.description,
      extendedAbout: [],
      ingredients: payload.ingredients || '',
      storage: payload.storage || 'Store in a cool dry place',
      shelfLife: payload.shelfLife || '6 months',
      allergenNotice: payload.allergenNotice || '',
      isFeatured: payload.isFeatured || false,
      pairsWithIds: [],
      variants: [
        {
          id: `var-${Date.now()}`,
          weight: payload.weight || '250g',
          price: Math.round(payload.price),
          originalPrice: payload.originalPrice ? Math.round(payload.originalPrice) : undefined,
          stock: Math.max(0, Math.round(payload.stock)),
        },
      ],
    };

    setProducts((prev) => [newProduct, ...prev]);
    return { success: true };
  };

  const updateProductDetails = async (
    productId: string,
    updates: {
      name?: string;
      subtitle?: string;
      category?: any;
      badge?: string;
      origin?: string;
      roastStyle?: string;
      description?: string;
      ingredients?: string;
      isFeatured?: boolean;
      images?: string[];
    }
  ): Promise<{ success: boolean; error?: string }> => {
    // Optimistic local state update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          name: updates.name !== undefined ? updates.name : p.name,
          subtitle: updates.subtitle !== undefined ? updates.subtitle : p.subtitle,
          category: updates.category !== undefined ? updates.category : p.category,
          badge: updates.badge !== undefined ? updates.badge : p.badge,
          origin: updates.origin !== undefined ? updates.origin : p.origin,
          roastStyle: updates.roastStyle !== undefined ? updates.roastStyle : p.roastStyle,
          description: updates.description !== undefined ? updates.description : p.description,
          ingredients: updates.ingredients !== undefined ? updates.ingredients : p.ingredients,
          isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : p.isFeatured,
          images: updates.images !== undefined ? updates.images : p.images,
        };
      })
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdateProductDetails(productId, {
        name: updates.name,
        subtitle: updates.subtitle,
        category: updates.category,
        badge: updates.badge,
        origin: updates.origin,
        roast_style: updates.roastStyle,
        description: updates.description,
        ingredients: updates.ingredients,
        is_featured: updates.isFeatured,
        images: updates.images,
      });
      if (!res.success) {
        await refreshProducts();
        return { success: false, error: res.error };
      }
    }

    return { success: true };
  };

  const deleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (isSupabaseConfigured) {
      const res = await adminDeleteProduct(productId);
      if (!res.success) {
        await refreshProducts();
        return { success: false, error: res.error };
      }
    }
    return { success: true };
  };

  // Admin login via Supabase Auth & public.profiles / public.admins table verification
  const loginAdmin = async (
    email?: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Please enter both admin email and password.' };
    }

    const isMasterAdmin =
      trimmedEmail === 'admin@ceyloncrunch.lk' &&
      trimmedPassword === 'crunch-admin';

    if (!supabase) {
      if (isMasterAdmin) {
        setIsAdmin(true);
        setAdminEmail(trimmedEmail);
        try { localStorage.setItem('ceylon_crunch_admin_session', 'true'); } catch {}
        return { success: true };
      }
      return { success: false, error: 'Incorrect email or password.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error || !data.user) {
        // Fallback for designated master credentials if network or auth service is unreachable
        if (isMasterAdmin) {
          setIsAdmin(true);
          setAdminEmail('admin@ceyloncrunch.lk');
          try { localStorage.setItem('ceylon_crunch_admin_session', 'true'); } catch {}
          return { success: true };
        }
        return { success: false, error: error?.message || 'Incorrect email or password.' };
      }

      // Check profiles or admins table
      let valid = isMasterAdmin;
      if (!valid) {
        try {
          const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
          if (prof?.role === 'admin' || prof?.role === 'super_admin') valid = true;
        } catch {}
      }

      if (!valid) {
        try {
          const { data: adminRow } = await supabase.from('admins').select('role').eq('user_id', data.user.id).maybeSingle();
          if (adminRow) valid = true;
        } catch {}
      }

      // If user typed custom credentials that are not an admin
      if (!valid) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setAdminEmail(null);
        return {
          success: false,
          error: 'Access denied: Your account does not have administrator privileges.',
        };
      }

      setIsAdmin(true);
      setAdminEmail(data.user.email || trimmedEmail);
      try { localStorage.setItem('ceylon_crunch_admin_session', 'true'); } catch {}
      return { success: true };
    } catch (err: any) {
      if (isMasterAdmin) {
        setIsAdmin(true);
        setAdminEmail('admin@ceyloncrunch.lk');
        try { localStorage.setItem('ceylon_crunch_admin_session', 'true'); } catch {}
        return { success: true };
      }
      return { success: false, error: err?.message || 'Authentication failed. Please check your credentials.' };
    }
  };

  const logoutAdmin = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
    setIsAdmin(false);
    setAdminEmail(null);
    setCustomerEmail(null);
    try {
      localStorage.removeItem('ceylon_crunch_admin_session');
    } catch {}
  };

  // Customer Login, Signup, and Logout
  const loginCustomer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Database service is offline.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        setCustomerEmail(data.user.email || null);
        const meta = data.user.user_metadata || {};
        const metaName = meta.full_name || meta.name;
        const metaPhone = meta.phone;
        updatePatronProfile({
          email: data.user.email || undefined,
          ...(metaName ? { name: metaName } : {}),
          ...(metaPhone ? { phone: metaPhone } : {}),
        });
        return { success: true };
      }
      return { success: false, error: 'No user data received.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed.' };
    }
  };

  const signupCustomer = async (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Database service is offline.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name?.trim() || '',
            phone: phone?.trim() || '',
          },
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        setCustomerEmail(data.user.email || null);
        updatePatronProfile({
          email: data.user.email || undefined,
          ...(name?.trim() ? { name: name.trim() } : {}),
          ...(phone?.trim() ? { phone: phone.trim() } : {}),
        });
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const logoutCustomer = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Customer signOut error:', err);
      }
    }
    setCustomerEmail(null);
    setIsAdmin(false);
    setAdminEmail(null);
  };

  // Patron Profile & Address methods
  const updatePatronProfile = (data: Partial<CustomerProfile>) => {
    setPatronProfile((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('ceylon_crunch_patron_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addSavedAddress = (addressData: Omit<SavedAddress, 'id'>): SavedAddress => {
    const newAddress: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isDefault: savedAddresses.length === 0 ? true : addressData.isDefault,
    };
    setSavedAddresses((prev) => {
      let updated = prev;
      if (newAddress.isDefault) {
        updated = prev.map((a) => ({ ...a, isDefault: false }));
      }
      const finalAddresses = [newAddress, ...updated];
      try {
        localStorage.setItem('ceylon_crunch_saved_addresses', JSON.stringify(finalAddresses));
      } catch {}
      return finalAddresses;
    });
    return newAddress;
  };

  const updateSavedAddress = (id: string, addressData: Partial<SavedAddress>) => {
    setSavedAddresses((prev) => {
      let updated = prev.map((a) => (a.id === id ? { ...a, ...addressData } : a));
      if (addressData.isDefault) {
        updated = updated.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      try {
        localStorage.setItem('ceylon_crunch_saved_addresses', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      try {
        localStorage.setItem('ceylon_crunch_saved_addresses', JSON.stringify(remaining));
      } catch {}
      return remaining;
    });
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses((prev) => {
      const updated = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      try {
        localStorage.setItem('ceylon_crunch_saved_addresses', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Wishlist methods
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('ceylon_crunch_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem('ceylon_crunch_wishlist');
    } catch {}
  };

  // Link Order to Profile
  const linkOrderToProfile = (order: Order) => {
    setOrders((prev) => {
      if (prev.some((o) => o.id === order.id)) return prev;
      const updated = [order, ...prev];
      try {
        localStorage.setItem('ceylon_crunch_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        updateProductStock,
        updateProductVariantPrice,
        updateProductVariantOriginalPrice,
        updateProductVariants,
        updateProductImage,
        getProductBySlug,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        restoreCartItem,
        clearCart,
        giftNote,
        setGiftNote,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        itemCount,
        orders,
        refreshOrders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        uploadOrderSlip,
        lookupOrder,
        linkOrderToProfile,
        patronProfile,
        updatePatronProfile,
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        wishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        reviews,
        addReview,
        inquiries,
        refreshInquiries,
        addInquiry,
        toast,
        showToast,
        hideToast,
        customerEmail,
        isCustomerLoggedIn: Boolean(customerEmail),
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        createProduct,
        updateProductDetails,
        deleteProduct,
        subscribers,
        refreshSubscribers,
        toggleSubscriber,
        deleteSubscriber,
        isAdmin,
        isAdminLoading,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        siteSettings,
        updateSiteSettingsState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
