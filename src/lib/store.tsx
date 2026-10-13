import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, Product, ProductVariant, Review } from '../data/products';
import {
  isSupabaseConfigured,
  getProductsFromSupabase,
  saveOrderToSupabase,
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
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
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
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'waybill' | 'timeline' | 'estimatedArrival' | 'status'>) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  uploadOrderSlip: (orderId: string, slipDataUrl: string) => void;
  lookupOrder: (orderNumber: string, phone: string) => Order | undefined;

  // Reviews
  reviews: Record<string, Review[]>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;

  // Contact Inquiries
  inquiries: ContactInquiry[];
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  hideToast: () => void;

  // Admin Session
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

// Initial Seed Orders
const SEED_ORDERS: Order[] = [
  {
    id: 'CC-000123',
    createdAt: '18 Oct 2024, 09:30 AM',
    customer: {
      name: 'Dilshan Perera',
      phone: '+94 77 123 4567',
      email: 'dilshan.perera@example.com',
    },
    shippingAddress: {
      street: 'No. 42/1, Alfred House Gardens, Level 4',
      landmark: 'Sky Villa',
      city: 'Colombo 03',
      district: 'Colombo',
      postalCode: '00300',
    },
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    items: [
      {
        productId: 'prod-cashews-jumbo',
        variantId: 'cashew-250g',
        productName: 'Jumbo Roasted Cashews',
        variantWeight: '250g Glass Jar',
        price: 1250,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1536591375315-1b83681498b3?auto=format&fit=crop&w=900&q=80',
        slug: 'jumbo-roasted-cashews',
      },
      {
        productId: 'prod-dates-medjool',
        variantId: 'dates-500g',
        productName: 'Royal Medjool Dates',
        variantWeight: '500g Heirloom Box',
        price: 1650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=900&q=80',
        slug: 'royal-medjool-dates',
      },
      {
        productId: 'prod-almonds-california',
        variantId: 'almonds-200g',
        productName: 'Californian Whole Almonds',
        variantWeight: '200g Eco-Pouch',
        price: 900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80',
        slug: 'californian-whole-almonds',
      },
    ],
    subtotal: 3800,
    deliveryFee: 450,
    total: 4250,
    status: 'dispatched',
    waybill: 'CLN-8829410-LK',
    estimatedArrival: 'Tomorrow by 4:00 PM',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        timestamp: '18 Oct, 09:30 AM',
        description: 'Web checkout verified & tokenized',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        timestamp: '18 Oct, 10:15 AM',
        description: 'Payment verified (COD batch allocation)',
        completed: true,
      },
      {
        status: 'packed',
        title: 'Small-Batch Packed',
        timestamp: '18 Oct, 02:40 PM',
        description: 'Hand-sealed with natural aroma foil at Colombo',
        completed: true,
      },
      {
        status: 'dispatched',
        title: 'Dispatched & In Transit',
        timestamp: '19 Oct, 08:15 AM',
        description: 'Handed over to Pronto Express van. En route to Western Province delivery hub.',
        location: 'Alfred House Gardens Sector, Colombo 03',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        timestamp: 'Estimated Tomorrow by 4:00 PM',
        description: 'Recipient signature required at doorstep',
        completed: false,
      },
    ],
  },
  {
    id: 'CC-000124',
    createdAt: '19 Oct 2024, 11:20 AM',
    customer: {
      name: 'Anoma Wickramasinghe',
      phone: '+94 71 888 2345',
      email: 'anoma.w@gmail.com',
    },
    shippingAddress: {
      street: '15/2 Rajagiriya Road',
      city: 'Rajagiriya',
      district: 'Colombo',
      postalCode: '10107',
    },
    paymentMethod: 'bank',
    paymentStatus: 'pending',
    items: [
      {
        productId: 'prod-heritage-hamper',
        variantId: 'hamper-box',
        productName: 'The Heritage Harvest Hamper',
        variantWeight: 'Standard Gift Box',
        price: 6500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        slug: 'heritage-harvest-hamper',
      },
    ],
    subtotal: 6500,
    deliveryFee: 0, // Free delivery >= 5000
    total: 6500,
    status: 'confirmed',
    waybill: 'CLN-9912044-LK',
    estimatedArrival: 'In 2 days',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        timestamp: '19 Oct, 11:20 AM',
        description: 'Order registered via website checkout',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        timestamp: '19 Oct, 11:45 AM',
        description: 'Direct bank transfer reference matched',
        completed: true,
      },
      {
        status: 'packed',
        title: 'Small-Batch Packed',
        timestamp: 'Pending queue',
        description: 'Bespoke pine hamper being assembled',
        completed: false,
      },
      {
        status: 'dispatched',
        title: 'Dispatched & In Transit',
        timestamp: 'Scheduled tomorrow morning',
        description: 'Awaiting courier collection',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        timestamp: 'Estimated in 2 days',
        description: 'Doorstep handoff',
        completed: false,
      },
    ],
  },
  {
    id: 'CC-000120',
    createdAt: '15 Oct 2024, 02:15 PM',
    customer: {
      name: 'Kavinda Jayawardena',
      phone: '+94 76 999 1122',
      email: 'kavinda.j@yahoo.com',
    },
    shippingAddress: {
      street: '78 Peradeniya Road',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000',
    },
    paymentMethod: 'cod',
    paymentStatus: 'received',
    items: [
      {
        productId: 'prod-pistachios-roasted',
        variantId: 'pistachio-250g',
        productName: 'Roasted Pistachios',
        variantWeight: '250g Pack',
        price: 2800,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=900&q=80',
        slug: 'roasted-pistachios',
      },
    ],
    subtotal: 5600,
    deliveryFee: 0,
    total: 5600,
    status: 'delivered',
    waybill: 'CLN-7734120-LK',
    estimatedArrival: 'Delivered on 17 Oct',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        timestamp: '15 Oct, 02:15 PM',
        description: 'Web order verified',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        timestamp: '15 Oct, 03:00 PM',
        description: 'Payment approved',
        completed: true,
      },
      {
        status: 'packed',
        title: 'Small-Batch Packed',
        timestamp: '15 Oct, 06:10 PM',
        description: 'Vacuum sealed for tropical freshness',
        completed: true,
      },
      {
        status: 'dispatched',
        title: 'Dispatched & In Transit',
        timestamp: '16 Oct, 08:30 AM',
        description: 'Dispatched via Pronto Outstation Express',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        timestamp: '17 Oct, 03:45 PM',
        description: 'Delivered and signed by recipient in Kandy',
        location: 'Kandy Central Hub',
        completed: true,
      },
    ],
  },
];

// Seed Inquiries
const SEED_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Ruwan Senanayake',
    email: 'ruwan.s@gmail.com',
    phone: '+94 77 345 6789',
    subject: 'Corporate Hamper Order (50 Boxes)',
    message: 'We are looking to order 50 bespoke corporate gift boxes for our end-of-year gala in December. Please send a quotation and branding options.',
    createdAt: '17 Oct 2024, 10:15 AM',
  },
];

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
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_products_v3');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

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
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // Reviews
  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Inquiries
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_inquiries');
      return saved ? JSON.parse(saved) : SEED_INQUIRIES;
    } catch {
      return SEED_INQUIRIES;
    }
  });

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Admin session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ceylon_crunch_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Live load from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    getProductsFromSupabase().then((dbProducts) => {
      if (isMounted && dbProducts && dbProducts.length > 0) {
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
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ceylon_crunch_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

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
  const updateProductStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v)),
        };
      })
    );
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

  // Create Order with stock validation & decrement
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'waybill' | 'timeline' | 'estimatedArrival' | 'status'>) => {
    // 1. Verify stock for all items
    for (const item of orderData.items) {
      const prod = products.find((p) => p.id === item.productId);
      const variant = prod?.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return { success: false, error: `Product variant ${item.variantWeight} no longer exists.` };
      }
      if (variant.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.productName} (${item.variantWeight}). Only ${variant.stock} available.`,
        };
      }
    }

    // 2. Decrement stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderData.items.find((i) => i.productId === p.id);
        if (!item) return p;
        return {
          ...p,
          variants: p.variants.map((v) => {
            const matchedItem = orderData.items.find((i) => i.variantId === v.id);
            if (!matchedItem) return v;
            return { ...v, stock: Math.max(0, v.stock - matchedItem.quantity) };
          }),
        };
      })
    );

    // 3. Generate sequential order number CC-000125
    const existingNums = orders
      .map((o) => {
        const match = o.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 100;
      })
      .filter((n) => !isNaN(n));
    const nextNum = (Math.max(120, ...existingNums) + 1).toString().padStart(6, '0');
    const orderId = `CC-${nextNum}`;

    // 4. Generate unique waybill
    const waybillRandom = Math.floor(10000000 + Math.random() * 90000000);
    const waybill = `CLN-${waybillRandom}-LK`;

    // 5. Construct timeline
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: formattedDate,
      status: 'placed',
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

    // Asynchronously sync to Supabase if configured
    if (isSupabaseConfigured) {
      saveOrderToSupabase(
        {
          id: newOrder.id,
          customer_name: newOrder.customer.name,
          customer_phone: newOrder.customer.phone,
          customer_email: newOrder.customer.email,
          shipping_street: newOrder.shippingAddress.street,
          shipping_city: newOrder.shippingAddress.city,
          shipping_district: newOrder.shippingAddress.district,
          shipping_postal: newOrder.shippingAddress.postalCode,
          landmark: newOrder.shippingAddress.landmark,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          payment_slip_url: newOrder.paymentSlipUrl,
          order_notes: newOrder.orderNotes,
          gift_note: newOrder.giftNote,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          total: newOrder.total,
          status: newOrder.status,
          waybill: newOrder.waybill,
          estimated_arrival: newOrder.estimatedArrival,
        },
        newOrder.items.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          variant_weight: item.variantWeight,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))
      ).catch((err) => console.warn('Supabase order sync error:', err));
    }

    return { success: true, order: newOrder };
  };

  // Update order status (Admin / System)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
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
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, paymentStatus } : order))
    );
  };

  const uploadOrderSlip = (orderId: string, slipDataUrl: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentSlipUrl: slipDataUrl, paymentStatus: 'pending' } : order
      )
    );
    showToast('Payment slip uploaded successfully! Roasters notified.');
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

  // Admin login
  // Demo password: crunch-admin
  const loginAdmin = (password: string) => {
    if (password === 'crunch-admin') {
      setIsAdmin(true);
      try {
        localStorage.setItem('ceylon_crunch_admin_session', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('ceylon_crunch_admin_session');
    } catch {}
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        updateProductStock,
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
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        uploadOrderSlip,
        lookupOrder,
        reviews,
        addReview,
        inquiries,
        addInquiry,
        toast,
        showToast,
        hideToast,
        isAdmin,
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
