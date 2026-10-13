import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables
const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Normalize URL: Strip accidental '/rest/v1' or trailing slashes from dashboard copy-paste
export const supabaseUrl = rawUrl
  ? rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
  : undefined;

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().length > 0 &&
  supabaseAnonKey.trim().length > 0 &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize Supabase Client singleton (or null if unconfigured)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==========================================
// DATABASE TYPES
// ==========================================

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  category: string;
  badge?: string | null;
  origin: string;
  roast_style?: string | null;
  rating: number;
  review_count: number;
  images: string[];
  description: string;
  extended_about: string[];
  ingredients: string;
  storage: string;
  shelf_life: string;
  allergen_notice?: string | null;
  is_featured: boolean;
  created_at?: string;
  variants?: DbVariant[];
}

export interface DbVariant {
  id: string;
  product_id: string;
  weight: string;
  price: number;
  original_price?: number | null;
  stock: number;
}

export interface DbOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_street: string;
  shipping_city: string;
  shipping_district: string;
  shipping_postal?: string | null;
  landmark?: string | null;
  payment_method: 'cod' | 'bank' | 'card';
  payment_status: 'pending' | 'received' | 'verified';
  payment_slip_url?: string | null;
  order_notes?: string | null;
  gift_note?: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'delivered';
  waybill?: string | null;
  estimated_arrival?: string | null;
  created_at?: string;
}

export interface DbOrderItem {
  id?: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  variant_weight: string;
  price: number;
  quantity: number;
  image?: string | null;
}

export interface DbReview {
  id?: string;
  product_id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  verified: boolean;
  is_approved: boolean;
  created_at?: string;
}

export interface DbInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status?: 'unread' | 'in_progress' | 'resolved';
  created_at?: string;
}

// ==========================================
// SUPABASE SERVICE HELPERS
// ==========================================

/**
 * Fetch all products with their nested variants
 */
export async function getProductsFromSupabase(): Promise<DbProduct[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getProducts error:', error.message);
      return null;
    }
    return data as DbProduct[];
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
    return null;
  }
}

/**
 * Save a new order and its items in Supabase
 */
export async function saveOrderToSupabase(
  order: DbOrder,
  items: Omit<DbOrderItem, 'order_id'>[]
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error: orderError } = await supabase.from('orders').insert([order]);
    if (orderError) {
      console.error('Supabase saveOrder error:', orderError.message);
      return false;
    }

    if (items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) {
        console.error('Supabase saveOrderItems error:', itemsError.message);
      }
    }

    return true;
  } catch (err) {
    console.error('Supabase saveOrder exception:', err);
    return false;
  }
}

/**
 * Track an order by ID and phone number
 */
export async function getOrderFromSupabase(
  orderId: string,
  phone?: string
): Promise<{ order: DbOrder; items: DbOrderItem[] } | null> {
  if (!supabase) return null;
  try {
    let query = supabase.from('orders').select('*, items:order_items(*)').eq('id', orderId);
    if (phone) {
      query = query.ilike('customer_phone', `%${phone.trim()}%`);
    }
    const { data, error } = await query.single();
    if (error || !data) return null;

    const { items, ...order } = data;
    return { order: order as DbOrder, items: (items || []) as DbOrderItem[] };
  } catch {
    return null;
  }
}

/**
 * Submit customer review to Supabase
 */
export async function saveReviewToSupabase(review: DbReview): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('reviews').insert([review]);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Submit inquiry to Supabase
 */
export async function saveInquiryToSupabase(inquiry: DbInquiry): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('inquiries').insert([inquiry]);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Upload bank deposit receipt image to Supabase Storage ('payment-slips' bucket)
 */
export async function uploadPaymentSlip(
  orderId: string,
  file: File | Blob
): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const filePath = `slips/${orderId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-slips')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.warn('Supabase slip upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('payment-slips').getPublicUrl(filePath);
    return data.publicUrl || null;
  } catch (err) {
    console.warn('Payment slip upload exception:', err);
    return null;
  }
}
