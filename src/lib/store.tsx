import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, Product, ProductVariant, Review } from '../data/products';
import {
  supabase,
  isSupabaseConfigured,
  getProductsFromSupabase,
  adminUpdateVariantPrice,
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
} from './supabase';

export interface CartItem {
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

  // Admin Session
  isAdmin: boolean;
  isAdminLoading: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
}

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
  // Purge any stale legacy localStorage product caches so Supabase remains single source of truth
  try {
    localStorage.removeItem('ceylon_crunch_products_v5');
    localStorage.removeItem('ceylon_crunch_products_v4');
    localStorage.removeItem('ceylon_crunch_products_v3');
    localStorage.removeItem('ceylon_crunch_products_v2');
    localStorage.removeItem('ceylon_crunch_products');
  } catch {}

  // Products state (initial skeleton from INITIAL_PRODUCTS, immediately hydrated from Supabase)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
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

  // Admin session authenticated through Supabase Auth & public.admins table
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('ceylon_crunch_admin_session');
    } catch {}

    const client = supabase;
    if (!client) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    let isMounted = true;

    // Check active session on initial load
    client.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        const { data: adminRow } = await client
          .from('admins')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (isMounted) {
          const valid = !!adminRow;
          setIsAdmin(valid);
          setAdminEmail(valid ? session.user.email || null : null);
          setIsAdminLoading(false);
        }
      } else {
        if (isMounted) {
          setIsAdmin(false);
          setAdminEmail(null);
          setIsAdminLoading(false);
        }
      }
    });

    // Listen to session changes / expiry
    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const { data: adminRow } = await client
          .from('admins')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (isMounted) {
          const valid = !!adminRow;
          setIsAdmin(valid);
          setAdminEmail(valid ? session.user.email || null : null);
          setIsAdminLoading(false);
        }
      } else {
        if (isMounted) {
          setIsAdmin(false);
          setAdminEmail(null);
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
        const mappedProducts: Product[] = dbProducts.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle || '',
          category: p.category as any,
          badge: p.badge || undefined,
          origin: p.origin,
          roastStyle: p.roast_style || undefined,
          rating: Number(p.rating),
          reviewCount: p.review_count,
          images: p.images || [],
          description: p.description,
          extendedAbout: p.extended_about || [],
          ingredients: p.ingredients,
          storage: p.storage,
          shelfLife: p.shelf_life,
          allergenNotice: p.allergen_notice || '',
          variants: (p.variants || []).map((v) => ({
            id: v.id,
            weight: v.weight,
            price: Number(v.price),
            originalPrice: v.original_price ? Number(v.original_price) : undefined,
            stock: v.stock,
          })),
          pairsWithIds: [],
          isFeatured: p.is_featured,
        }));
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Live Refresh Orders from Supabase (for Admin)
  const refreshOrders = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const dbOrders = await fetchAdminOrders();
      if (dbOrders) {
        const mapped: Order[] = dbOrders.map((o) => ({
          id: o.id,
          createdAt: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent',
          customer: {
            name: o.customer_name,
            phone: o.customer_phone,
            email: o.customer_email || undefined,
          },
          shippingAddress: {
            street: o.shipping_street,
            city: o.shipping_city,
            district: o.shipping_district,
            postalCode: o.shipping_postal || undefined,
            landmark: o.landmark || undefined,
          },
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          paymentSlipUrl: o.payment_slip_url || undefined,
          orderNotes: o.order_notes || undefined,
          giftNote: o.gift_note || undefined,
          subtotal: Number(o.subtotal),
          deliveryFee: Number(o.delivery_fee),
          total: Number(o.total),
          status: o.status,
          waybill: o.waybill || '',
          estimatedArrival: o.estimated_arrival || '1-2 business days',
          items: (o.items || []).map((item) => ({
            productId: item.product_id || '',
            variantId: '',
            productName: item.product_name,
            variantWeight: item.variant_weight,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image || '',
            slug: '',
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
        { event: '*', schema: 'public', table: 'product_variants' },
        () => {
          refreshProducts();
        }
      )
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

    // Optimistic local state update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: safeStock } : v)),
        };
      })
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdateVariantStock(variantId, safeStock);
      if (!res.success) {
        showToast(`Stock update failed: ${res.error}`);
        await refreshProducts();
      } else {
        showToast('Stock count saved to database');
      }
    }
  };

  // Price update for variant
  const updateProductVariantPrice = async (productId: string, variantId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const roundedPrice = Math.round(newPrice);

    // Optimistic local state update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, price: roundedPrice } : v)),
        };
      })
    );

    // Keep active cart items synchronized with the new price
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, price: roundedPrice } : item
      )
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdateVariantPrice(variantId, roundedPrice);
      if (!res.success) {
        showToast(`Price update failed: ${res.error}`);
        await refreshProducts();
      } else {
        showToast('Price updated & synchronized across all devices');
      }
    }
  };

  // Product primary image update
  const updateProductImage = async (productId: string, newImageUrl: string) => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    // Optimistic local state update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const otherImages = p.images ? p.images.slice(1) : [];
        return {
          ...p,
          images: [trimmed, ...otherImages],
        };
      })
    );

    // Keep active cart items synchronized with the new image
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, image: trimmed } : item
      )
    );

    if (isSupabaseConfigured) {
      const res = await adminUpdateProductImageUrl(productId, trimmed);
      if (!res.success) {
        showToast(`Image update failed: ${res.error}`);
        await refreshProducts();
      } else {
        showToast('Product image updated across catalog');
      }
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
    return cartSubtotal >= 5000 ? 0 : 450;
  }, [cart, cartSubtotal]);

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

      setOrders((prev) => [newOrder, ...prev]);
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

  // Admin login via Supabase Auth & public.admins table verification
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Database connection is not configured.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error || !data.user) {
        return { success: false, error: error?.message || 'Authentication failed' };
      }

      // Check that this user exists in public.admins
      const { data: adminRow, error: adminErr } = await supabase
        .from('admins')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminErr || !adminRow) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setAdminEmail(null);
        return {
          success: false,
          error: 'Access denied: Your account does not have administrator privileges.',
        };
      }

      setIsAdmin(true);
      setAdminEmail(data.user.email || null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unexpected login error' };
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
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        updateProductStock,
        updateProductVariantPrice,
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
        reviews,
        addReview,
        inquiries,
        refreshInquiries,
        addInquiry,
        toast,
        showToast,
        hideToast,
        isAdmin,
        isAdminLoading,
        adminEmail,
        loginAdmin,
        logoutAdmin,
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
