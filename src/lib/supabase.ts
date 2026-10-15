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

export interface PlaceOrderItemPayload {
  variant_id: string;
  quantity: number;
}

export interface PlaceOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_street: string;
  shipping_city: string;
  shipping_district: string;
  shipping_postal?: string | null;
  landmark?: string | null;
  payment_method: 'cod' | 'bank' | 'card';
  items: PlaceOrderItemPayload[];
  order_notes?: string | null;
  gift_note?: string | null;
  idempotency_key?: string | null;
}

export interface PlaceOrderResult {
  success: boolean;
  order_id?: string;
  access_token?: string;
  waybill?: string;
  subtotal?: number;
  delivery_fee?: number;
  total?: number;
  status?: string;
  is_duplicate?: boolean;
  error?: string;
}

export interface TrackOrderResult {
  found: boolean;
  order?: {
    id: string;
    status: string;
    payment_method: string;
    payment_status: string;
    payment_slip_url?: string | null;
    subtotal: number;
    delivery_fee: number;
    total: number;
    waybill?: string;
    estimated_arrival?: string;
    shipping_city: string;
    shipping_district: string;
    created_at: string;
    items: Array<{
      product_name: string;
      variant_weight: string;
      price: number;
      quantity: number;
      image?: string | null;
    }>;
  };
  error?: string;
}

export interface DbSiteSettings {
  id: string;
  store_name: string;
  announcement_banner: string;
  free_delivery_threshold: number;
  standard_delivery_fee: number;
  bank_details: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  updated_at?: string;
}

export interface DbOrderWithItems extends DbOrder {
  items: DbOrderItem[];
}

/**
 * Fetch all products with their nested variants from Supabase
 */
export async function getProductsFromSupabase(): Promise<DbProduct[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

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
 * Admin: Update variant price directly in Supabase product_variants table
 */
export async function adminUpdateVariantPrice(
  variantId: string,
  newPrice: number
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  if (isNaN(newPrice) || newPrice < 0) {
    return { success: false, error: 'Price must be a non-negative number.' };
  }

  const rounded = Math.round(newPrice);
  try {
    const { error } = await supabase
      .from('product_variants')
      .update({ price: rounded, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update price.' };
  }
}

/**
 * Admin: Update variant stock directly in Supabase product_variants table
 */
export async function adminUpdateVariantStock(
  variantId: string,
  newStock: number
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  const safeStock = Math.max(0, Math.round(newStock));

  try {
    const { error } = await supabase
      .from('product_variants')
      .update({ stock: safeStock, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update stock.' };
  }
}

/**
 * Admin: Upload product image to Supabase Storage and update database image URL
 */
export async function adminUploadProductImage(
  productId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `products/${productId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;
    if (!publicUrl) {
      return { success: false, error: 'Failed to retrieve public image URL.' };
    }

    // Update in product_images table and products.images array
    await supabase.from('product_images').insert([
      {
        product_id: productId,
        url: publicUrl,
        is_primary: true,
        display_order: 0,
      },
    ]);

    // Update primary image in products table
    const { data: currentProd } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    const otherImages = currentProd?.images ? currentProd.images.slice(1) : [];
    await supabase
      .from('products')
      .update({
        images: [publicUrl, ...otherImages],
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Image upload failed.' };
  }
}

/**
 * Admin: Update primary image path / URL directly
 */
export async function adminUpdateProductImageUrl(
  productId: string,
  newImageUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  const trimmed = newImageUrl.trim();
  if (!trimmed) return { success: false, error: 'Image URL cannot be empty.' };

  try {
    const { data: currentProd } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    const otherImages = currentProd?.images ? currentProd.images.slice(1) : [];
    const { error } = await supabase
      .from('products')
      .update({
        images: [trimmed, ...otherImages],
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update image URL.' };
  }
}

/**
 * Place order via SECURITY DEFINER RPC (Atomic stock decrement and server-side pricing)
 */
export async function placeOrderRpc(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResult> {
  if (!supabase) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { data, error } = await supabase.rpc('place_order', {
      p_customer_name: payload.customer_name,
      p_customer_phone: payload.customer_phone,
      p_shipping_street: payload.shipping_street,
      p_shipping_city: payload.shipping_city,
      p_shipping_district: payload.shipping_district,
      p_payment_method: payload.payment_method,
      p_items: payload.items,
      p_customer_email: payload.customer_email || null,
      p_shipping_postal: payload.shipping_postal || null,
      p_landmark: payload.landmark || null,
      p_order_notes: payload.order_notes || null,
      p_gift_note: payload.gift_note || null,
      p_idempotency_key: payload.idempotency_key || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data as PlaceOrderResult;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Order placement failed.' };
  }
}

/**
 * Track an order via SECURITY DEFINER RPC
 */
export async function trackOrderRpc(
  orderId: string,
  phone: string
): Promise<TrackOrderResult> {
  if (!supabase) {
    return { found: false, error: 'Database is not connected.' };
  }

  try {
    const { data, error } = await supabase.rpc('track_order', {
      p_order_id: orderId,
      p_phone: phone,
    });

    if (error) {
      return { found: false, error: error.message };
    }

    return data as TrackOrderResult;
  } catch (err: any) {
    return { found: false, error: err?.message || 'Tracking failed.' };
  }
}

/**
 * Admin: Fetch all orders with order items
 */
export async function fetchAdminOrders(): Promise<DbOrderWithItems[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch admin orders error:', error.message);
      return null;
    }
    return data as DbOrderWithItems[];
  } catch (err) {
    console.warn('Fetch admin orders exception:', err);
    return null;
  }
}

/**
 * Admin: Update order fulfillment status in Supabase
 */
export async function adminUpdateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Status update failed.' };
  }
}

/**
 * Admin: Update payment status in Supabase
 */
export async function adminUpdatePaymentStatus(
  orderId: string,
  paymentStatus: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Payment status update failed.' };
  }
}

/**
 * Fetch public site settings (banner, delivery fees, bank info)
 */
export async function fetchPublicSiteSettings(): Promise<DbSiteSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('public_site_settings')
      .select('*')
      .single();

    if (error || !data) return null;
    return data as DbSiteSettings;
  } catch {
    return null;
  }
}

/**
 * Admin: Update site configuration in Supabase
 */
export async function adminUpdateSiteSettings(
  settings: Partial<DbSiteSettings>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const { error } = await supabase
      .from('site_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', 'default');

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update settings.' };
  }
}

/**
 * Admin: Fetch inquiries from Supabase
 */
export async function fetchAdminInquiries(): Promise<DbInquiry[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data as DbInquiry[];
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
    return data?.publicUrl || null;
  } catch (err) {
    console.warn('Payment slip upload exception:', err);
    return null;
  }
}

