import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Production default Supabase fallback credentials
export const DEFAULT_SUPABASE_URL = 'https://qffmgeuolylznbvkhegn.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZm1nZXVvbHlsem5idmtoZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4OTM3NjIsImV4cCI6MjEwNzQ2OTc2Mn0.uUM5WypotpetJaLLPQyqmBT1laZeEeCDTyXExMSgYLs';

// Safe credential resolver across Vite browser runtime, Vite define, and Node
const resolveEnv = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return String((import.meta as any).env[key]).trim();
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return String(process.env[key]).trim();
    }
  } catch {}
  return fallback;
};

// Retrieve credentials from environment variables (falls back to production defaults)
const rawUrl = resolveEnv('VITE_SUPABASE_URL', DEFAULT_SUPABASE_URL);
const supabaseAnonKey = resolveEnv('VITE_SUPABASE_ANON_KEY', DEFAULT_SUPABASE_ANON_KEY);

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
  is_active?: boolean;
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
  user_id?: string | null;
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
  user_id?: string | null;
}

export interface DbCustomerAddress {
  id: string;
  user_id?: string;
  label: string;
  recipient_name: string;
  phone: string;
  street: string;
  landmark?: string | null;
  city: string;
  district: string;
  postal_code?: string | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbCustomerProfile {
  user_id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  dietary_preferences?: string[] | null;
  loyalty_tier?: string | null;
  created_at?: string;
  updated_at?: string;
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
 * By default includes all products so that the admin can manage visibility
 */
export async function getProductsFromSupabase(includeInactive = true): Promise<DbProduct[] | null> {
  if (!supabase) return null;
  try {
    let query = supabase
      .from('products')
      .select('*, variants:product_variants(*)')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Checks if a string conforms to the standard UUID v4/generic format
 */
export function isValidUuid(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id.trim());
}

/**
 * Resolves a product ID (which may be a database UUID or a local/fallback ID like 'prod-mixed-nuts')
 * to its corresponding PostgreSQL UUID in Supabase, looking up by slug if necessary.
 */
export async function resolveProductUuid(productId: string, slug?: string, name?: string): Promise<string | null> {
  if (!supabase) return null;
  const trimmed = productId ? productId.trim() : '';
  if (isValidUuid(trimmed)) {
    return trimmed;
  }
  const candidateSlugs = [
    slug,
    trimmed,
    trimmed.startsWith('prod-') ? trimmed.replace(/^prod-/, '') : null,
  ].filter(Boolean) as string[];

  if (candidateSlugs.length > 0) {
    try {
      const { data } = await supabase
        .from('products')
        .select('id')
        .in('slug', candidateSlugs)
        .limit(1)
        .maybeSingle();
      if (data?.id) return data.id;
    } catch {}
  }

  if (name && name.trim()) {
    try {
      const { data } = await supabase
        .from('products')
        .select('id')
        .ilike('name', name.trim())
        .limit(1)
        .maybeSingle();
      if (data?.id) return data.id;
    } catch {}
  }

  return null;
}

/**
 * Optimizes and converts an image File into a persistent Data URL (JPEG/WebP)
 * Resizes down to a max dimension (e.g. 1000px) and quality 0.82 to keep payload lightweight (~40-80KB)
 * Works in both browser runtime and Node.js test environments.
 */
export async function fileToOptimizedDataUrl(
  file: File | Blob,
  maxDimension = 1000,
  quality = 0.82
): Promise<string> {
  const mimeType = file.type || 'image/jpeg';

  // Node.js environment (e.g. unit tests or server)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (typeof (file as any).arrayBuffer === 'function') {
      const buffer = Buffer.from(await (file as any).arrayBuffer());
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    }
  }

  // Browser environment with HTML5 Canvas optimization
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        if (!rawDataUrl) {
          resolve('');
          return;
        }

        try {
          const img = new window.Image();
          img.onload = () => {
            try {
              let width = img.width;
              let height = img.height;

              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                } else {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(rawDataUrl);
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);

              try {
                const webp = canvas.toDataURL('image/webp', quality);
                if (webp.startsWith('data:image/webp')) {
                  resolve(webp);
                  return;
                }
              } catch {}

              resolve(canvas.toDataURL('image/jpeg', quality));
            } catch {
              resolve(rawDataUrl);
            }
          };
          img.onerror = () => resolve(rawDataUrl);
          img.src = rawDataUrl;
        } catch {
          resolve(rawDataUrl);
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    } catch {
      resolve('');
    }
  });
}

/**
 * Admin: Update variant price directly in Supabase product_variants table
 */
export async function adminUpdateVariantPrice(
  variantId: string,
  newPrice: number
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  if (!isValidUuid(variantId)) {
    // Static mock variant; local state update is sufficient
    return { success: true };
  }
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
 * Admin: Update variant original / compare-at price in Supabase product_variants table
 */
export async function adminUpdateVariantOriginalPrice(
  variantId: string,
  newOriginalPrice: number | null
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  if (!isValidUuid(variantId)) {
    // Static mock variant; local state update is sufficient
    return { success: true };
  }
  try {
    const val = newOriginalPrice === null || isNaN(newOriginalPrice) ? null : Math.round(newOriginalPrice);
    const { error } = await supabase
      .from('product_variants')
      .update({ original_price: val, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update original price.' };
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
  if (!isValidUuid(variantId)) {
    // Static mock variant; local state update is sufficient
    return { success: true };
  }
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
 * Admin: Update all fields of a variant at once (price, original_price, stock)
 */
export async function adminUpdateVariant(
  variantId: string,
  updates: {
    price?: number;
    original_price?: number | null;
    stock?: number;
    weight?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  if (!isValidUuid(variantId)) {
    // Static mock variant; local state update is sufficient
    return { success: true };
  }

  const payload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.price !== undefined) {
    if (isNaN(updates.price) || updates.price < 0) {
      return { success: false, error: 'Price must be a non-negative number.' };
    }
    payload.price = Math.round(updates.price);
  }
  if (updates.original_price !== undefined) {
    payload.original_price =
      updates.original_price === null || isNaN(updates.original_price)
        ? null
        : Math.round(updates.original_price);
  }
  if (updates.stock !== undefined) {
    payload.stock = Math.max(0, Math.round(updates.stock));
  }
  if (updates.weight !== undefined) {
    const trimmed = updates.weight.trim();
    if (trimmed) payload.weight = trimmed;
  }

  try {
    const { error } = await supabase
      .from('product_variants')
      .update(payload)
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update variant.' };
  }
}

/**
 * Admin: Update variant weight directly in Supabase product_variants table
 */
export async function adminUpdateVariantWeight(
  variantId: string,
  newWeight: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  if (!isValidUuid(variantId)) {
    // Static mock variant; local state update is sufficient
    return { success: true };
  }
  const trimmed = newWeight.trim();
  if (!trimmed) {
    return { success: false, error: 'Variant weight cannot be empty.' };
  }

  try {
    const { error } = await supabase
      .from('product_variants')
      .update({ weight: trimmed, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update variant weight.' };
  }
}

/**
 * Admin: Synchronize product variants (save weight, price, original_price, stock, and add/remove variants)
 */
export async function adminSyncProductVariants(
  productId: string,
  variants: Array<{
    id?: string;
    weight: string;
    price: number;
    original_price?: number | null;
    stock?: number;
  }>,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const targetUuid = await resolveProductUuid(productId, slug);
    if (!targetUuid) {
      // Product only exists locally, not in Supabase
      return { success: true };
    }

    // 1. Fetch current variants for this product
    const { data: existingRows, error: fetchErr } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', targetUuid);

    if (fetchErr) {
      return { success: false, error: fetchErr.message };
    }

    const existingIds = new Set((existingRows || []).map((r) => r.id));
    const incomingValidWithId = variants.filter(
      (v) => v.id && !v.id.startsWith('temp-') && existingIds.has(v.id)
    );
    const incomingIds = new Set(incomingValidWithId.map((v) => v.id!));

    // Delete variants that were removed
    const toDelete = (existingRows || []).filter((r) => !incomingIds.has(r.id)).map((r) => r.id);
    if (toDelete.length > 0) {
      await supabase.from('product_variants').delete().in('id', toDelete);
    }

    // Update existing and insert new
    for (const v of variants) {
      const trimmedWeight = v.weight.trim();
      if (!trimmedWeight) continue;

      if (v.id && !v.id.startsWith('temp-') && existingIds.has(v.id)) {
        await supabase
          .from('product_variants')
          .update({
            weight: trimmedWeight,
            price: Math.round(v.price),
            original_price: v.original_price ? Math.round(v.original_price) : null,
            stock: v.stock !== undefined ? Math.max(0, Math.round(v.stock)) : 50,
            updated_at: new Date().toISOString(),
          })
          .eq('id', v.id);
      } else {
        await supabase
          .from('product_variants')
          .insert([
            {
              product_id: targetUuid,
              weight: trimmedWeight,
              price: Math.round(v.price),
              original_price: v.original_price ? Math.round(v.original_price) : null,
              stock: v.stock !== undefined ? Math.max(0, Math.round(v.stock)) : 50,
            },
          ]);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to sync product variants.' };
  }
}

/**
 * Admin: Upload product image to Supabase Storage and update database image URL.
 * Automatically falls back to a persistent optimized data URL if Supabase Storage is offline or RLS blocks direct client upload.
 */
export async function adminUploadProductImage(
  productId: string,
  file: File,
  slug?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    let publicUrl: string | null = null;
    const targetUuid = await resolveProductUuid(productId, slug);
    const safePrefix = targetUuid || (productId ? productId.replace(/[^a-zA-Z0-9_-]/g, '') : 'prod');
    const fileExt = file.name ? (file.name.split('.').pop() || 'jpg') : 'jpg';
    const filePath = `products/${safePrefix}_${Date.now()}.${fileExt}`;

    // 1. Try uploading to Supabase Storage if connected
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true, contentType: file.type || 'image/jpeg' });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          if (publicData?.publicUrl) {
            publicUrl = publicData.publicUrl;
          }
        } else {
          console.warn('Supabase storage upload returned notice, falling back to persistent data URL:', uploadError.message);
        }
      } catch (storageErr) {
        console.warn('Supabase storage exception, falling back to persistent data URL:', storageErr);
      }
    }

    // 2. Fallback to optimized permanent Base64 Data URL if storage was unavailable or failed
    if (!publicUrl) {
      publicUrl = await fileToOptimizedDataUrl(file);
    }

    if (!publicUrl) {
      return { success: false, error: 'Failed to process image file.' };
    }

    // 3. Update in database if targetUuid is known
    if (supabase && targetUuid) {
      try {
        await supabase.from('product_images').insert([
          {
            product_id: targetUuid,
            url: publicUrl,
            is_primary: true,
            display_order: 0,
          },
        ]);
      } catch {}

      try {
        const { data: currentProd } = await supabase
          .from('products')
          .select('images')
          .eq('id', targetUuid)
          .single();

        const otherImages = (currentProd?.images || []).filter(
          (img: string) => img && !img.startsWith('blob:') && img !== publicUrl
        );

        await supabase
          .from('products')
          .update({
            images: [publicUrl, ...otherImages],
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUuid);
      } catch (dbErr) {
        console.warn('Database image URL sync notice:', dbErr);
      }
    }

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
  newImageUrl: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  const trimmed = newImageUrl.trim();
  if (!trimmed) return { success: false, error: 'Image URL cannot be empty.' };

  try {
    const targetUuid = await resolveProductUuid(productId, slug);
    if (!targetUuid) {
      return { success: true };
    }

    const { data: currentProd } = await supabase
      .from('products')
      .select('images')
      .eq('id', targetUuid)
      .single();

    const otherImages = currentProd?.images ? currentProd.images.slice(1) : [];
    const { error } = await supabase
      .from('products')
      .update({
        images: [trimmed, ...otherImages],
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUuid);

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
    const rpcParams: Record<string, any> = {
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
      p_user_id: payload.user_id || null,
    };

    let { data, error } = await supabase.rpc('place_order', rpcParams);

    // If ambiguous or parameter overload resolution fails (PGRST203), retry without p_user_id
    if (error && (error.code === 'PGRST203' || error.message?.includes('best candidate function'))) {
      const { p_user_id, ...paramsWithoutUserId } = rpcParams;
      const retry = await supabase.rpc('place_order', paramsWithoutUserId);
      if (!retry.error) {
        data = retry.data;
        error = null;
      } else {
        error = retry.error;
      }
    }

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

/**
 * Admin: Create a new product with default variant in Supabase
 */
export async function adminCreateProduct(payload: {
  name: string;
  subtitle?: string;
  category: string;
  badge?: string;
  origin?: string;
  roast_style?: string;
  images: string[];
  description: string;
  ingredients?: string;
  storage?: string;
  shelf_life?: string;
  allergen_notice?: string;
  is_featured?: boolean;
  price: number;
  original_price?: number | null;
  stock: number;
  weight?: string;
  variants?: Array<{
    weight: string;
    price: number;
    original_price?: number | null;
    stock?: number;
  }>;
}): Promise<{ success: boolean; product?: DbProduct; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const slug = payload.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const { data: insertedProduct, error: prodErr } = await supabase
      .from('products')
      .insert([
        {
          slug,
          name: payload.name.trim(),
          subtitle: payload.subtitle?.trim() || null,
          category: payload.category,
          badge: payload.badge?.trim() || null,
          origin: payload.origin?.trim() || 'Ceylon, Sri Lanka',
          roast_style: payload.roast_style?.trim() || 'Artisan Roasted',
          rating: 5.0,
          review_count: 0,
          images: payload.images && payload.images.length > 0
            ? payload.images.filter((img) => img && img.trim() && img !== '/img/product-1.jpg' && !img.includes('photo-1549488344'))
            : [],
          description: payload.description.trim(),
          extended_about: [],
          ingredients: payload.ingredients?.trim() || '100% pure artisan harvested',
          storage: payload.storage?.trim() || 'Store in a cool, dry place away from direct sunlight.',
          shelf_life: payload.shelf_life?.trim() || '6 months from seal date',
          allergen_notice: payload.allergen_notice?.trim() || null,
          is_featured: payload.is_featured || false,
        },
      ])
      .select('*')
      .single();

    if (prodErr || !insertedProduct) {
      return { success: false, error: prodErr?.message || 'Failed to insert product.' };
    }

    // Insert variants
    if (payload.variants && payload.variants.length > 0) {
      const rowsToInsert = payload.variants
        .filter((v) => v.weight && v.weight.trim())
        .map((v) => ({
          product_id: insertedProduct.id,
          weight: v.weight.trim(),
          price: Math.round(v.price || payload.price),
          original_price: v.original_price ? Math.round(v.original_price) : null,
          stock: v.stock !== undefined ? Math.max(0, Math.round(v.stock)) : Math.max(0, Math.round(payload.stock)),
        }));

      const { data: insertedVariants, error: varErr } = await supabase
        .from('product_variants')
        .insert(rowsToInsert)
        .select('*');

      if (varErr) {
        console.warn('Variant insertion notice:', varErr.message);
      }

      return {
        success: true,
        product: {
          ...insertedProduct,
          variants: insertedVariants || [],
        },
      };
    }

    const variantWeight = payload.weight || '250g';
    const { data: insertedVariant, error: varErr } = await supabase
      .from('product_variants')
      .insert([
        {
          product_id: insertedProduct.id,
          weight: variantWeight,
          price: Math.round(payload.price),
          original_price: payload.original_price ? Math.round(payload.original_price) : null,
          stock: Math.max(0, Math.round(payload.stock)),
        },
      ])
      .select('*')
      .single();

    if (varErr) {
      console.warn('Variant insertion notice:', varErr.message);
    }

    return {
      success: true,
      product: {
        ...insertedProduct,
        variants: insertedVariant ? [insertedVariant] : [],
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Product creation failed.' };
  }
}

/**
 * Admin: Update product details in Supabase
 */
export async function adminUpdateProductDetails(
  productId: string,
  updates: {
    name?: string;
    subtitle?: string;
    category?: string;
    badge?: string;
    origin?: string;
    roast_style?: string;
    description?: string;
    ingredients?: string;
    is_featured?: boolean;
    images?: string[];
    is_active?: boolean;
  },
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const targetUuid = await resolveProductUuid(productId, slug);
    if (!targetUuid) {
      return { success: true };
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle.trim() || null;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.badge !== undefined) payload.badge = updates.badge.trim() || null;
    if (updates.origin !== undefined) payload.origin = updates.origin.trim();
    if (updates.roast_style !== undefined) payload.roast_style = updates.roast_style.trim() || null;
    if (updates.description !== undefined) payload.description = updates.description.trim();
    if (updates.ingredients !== undefined) payload.ingredients = updates.ingredients.trim();
    if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;
    if (updates.images !== undefined) {
      payload.images = updates.images.filter(
        (img) => img && img.trim() && img !== '/img/product-1.jpg' && !img.includes('photo-1549488344')
      );
    }
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', targetUuid);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update product details.' };
  }
}

/**
 * Admin: Toggle product active / hidden visibility in Supabase
 */
export async function adminToggleProductActive(
  productId: string,
  isActive: boolean,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const targetUuid = await resolveProductUuid(productId, slug);
    if (!targetUuid) {
      return { success: true };
    }

    const { error } = await supabase
      .from('products')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', targetUuid);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to toggle product visibility.' };
  }
}

/**
 * Admin: Delete a product from Supabase
 */
export async function adminDeleteProduct(
  productId: string,
  slug?: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database is not connected.' };
  try {
    const targetUuid = await resolveProductUuid(productId, slug, name);
    if (!targetUuid) {
      // Product was a static/mock fallback and never existed in Supabase.
      // Deleting it from the database succeeds cleanly.
      return { success: true };
    }

    // Check if any orders reference this product to preserve customer order history
    try {
      const { data: referencingOrders } = await supabase
        .from('order_items')
        .select('id')
        .eq('product_id', targetUuid)
        .limit(1);

      if (referencingOrders && referencingOrders.length > 0) {
        // Soft-delete: Mark as inactive and DELETED to preserve customer order history
        const { error: softErr } = await supabase
          .from('products')
          .update({
            is_active: false,
            badge: 'DELETED',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUuid);

        if (softErr) {
          return { success: false, error: softErr.message };
        }
        return { success: true };
      }
    } catch {
      // If order_items check fails or table structure differs, proceed with hard-delete with soft fallback
    }

    // Hard-delete associated relations first to avoid foreign key violations
    try {
      await supabase.from('product_images').delete().eq('product_id', targetUuid);
    } catch {}
    try {
      await supabase.from('customer_wishlist').delete().eq('product_id', targetUuid);
    } catch {}
    try {
      await supabase.from('reviews').delete().eq('product_id', targetUuid);
    } catch {}
    try {
      await supabase.from('product_variants').delete().eq('product_id', targetUuid);
    } catch {}

    const { error } = await supabase.from('products').delete().eq('id', targetUuid);
    if (error) {
      // Fallback: If hard delete fails due to any historical constraints, safely soft delete
      const { error: fallbackSoftErr } = await supabase
        .from('products')
        .update({
          is_active: false,
          badge: 'DELETED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetUuid);

      if (!fallbackSoftErr) {
        return { success: true };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product.' };
  }
}

/**
 * Admin: Fetch newsletter subscribers
 */
export async function adminFetchNewsletter(): Promise<Array<{ id: string; email: string; active: boolean; created_at: string }> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Newsletter fetch notice:', error.message);
      return null;
    }
    return data || [];
  } catch {
    return null;
  }
}

/**
 * Admin: Toggle subscriber status
 */
export async function adminToggleNewsletterSubscriber(
  id: string,
  active: boolean
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('newsletter')
      .update({ active })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Admin: Delete newsletter subscriber
 */
export async function adminDeleteNewsletterSubscriber(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('newsletter').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Admin: Upload banner/hero image to Supabase Storage with persistent data URL fallback
 */
export async function adminUploadBannerImage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    let publicUrl: string | null = null;
    const fileExt = file.name ? (file.name.split('.').pop() || 'jpg') : 'jpg';
    const filePath = `banners/banner_${Date.now()}.${fileExt}`;

    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true, contentType: file.type || 'image/jpeg' });

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          publicUrl = publicData?.publicUrl || null;
        }
      } catch {}
    }

    if (!publicUrl) {
      publicUrl = await fileToOptimizedDataUrl(file);
    }

    if (!publicUrl) {
      return { success: false, error: 'Failed to process banner image.' };
    }

    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Banner upload failed.' };
  }
}

// ==========================================
// AUTHENTICATED CUSTOMER DATA SERVICE HELPERS
// ==========================================

/**
 * Customer: Fetch orders belonging exclusively to the authenticated customer
 */
export async function fetchCustomerOrders(userId?: string): Promise<DbOrderWithItems[] | null> {
  if (!supabase) return null;
  try {
    let effectiveUid = userId;
    if (!effectiveUid) {
      const { data: { user } } = await supabase.auth.getUser();
      effectiveUid = user?.id;
    }
    if (!effectiveUid) return null;

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', effectiveUid)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch customer orders error:', error.message);
      return null;
    }
    return data as DbOrderWithItems[];
  } catch (err) {
    console.warn('Fetch customer orders exception:', err);
    return null;
  }
}

/**
 * Customer: Fetch saved addresses belonging exclusively to the authenticated customer
 */
export async function fetchCustomerAddresses(userId?: string): Promise<DbCustomerAddress[] | null> {
  if (!supabase) return null;
  try {
    let effectiveUid = userId;
    if (!effectiveUid) {
      const { data: { user } } = await supabase.auth.getUser();
      effectiveUid = user?.id;
    }
    if (!effectiveUid) return null;

    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('user_id', effectiveUid)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch customer addresses error:', error.message);
      return null;
    }
    return data as DbCustomerAddress[];
  } catch (err) {
    console.warn('Fetch customer addresses exception:', err);
    return null;
  }
}

/**
 * Customer: Add a new saved address in Supabase
 */
export async function saveCustomerAddress(
  address: Omit<DbCustomerAddress, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: DbCustomerAddress; error?: string }> {
  if (!supabase) return { success: false, error: 'Database offline' };
  try {
    let uid = address.user_id;
    if (!uid) {
      const { data: { user } } = await supabase.auth.getUser();
      uid = user?.id;
    }
    if (!uid) return { success: false, error: 'User authentication required' };

    // If marked default, unset default on other addresses for this user
    if (address.is_default) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('user_id', uid);
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .insert([{ ...address, user_id: uid }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as DbCustomerAddress };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save address' };
  }
}

/**
 * Customer: Update an existing saved address in Supabase
 */
export async function updateCustomerAddress(
  id: string,
  updates: Partial<DbCustomerAddress>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database offline' };
  try {
    if (updates.is_default) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('customer_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
    }

    const { error } = await supabase
      .from('customer_addresses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update address' };
  }
}

/**
 * Customer: Delete a saved address in Supabase
 */
export async function deleteCustomerAddress(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database offline' };
  try {
    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete address' };
  }
}

/**
 * Customer: Fetch wishlist product IDs belonging exclusively to the authenticated customer
 */
export async function fetchCustomerWishlist(userId?: string): Promise<string[] | null> {
  if (!supabase) return null;
  try {
    let effectiveUid = userId;
    if (!effectiveUid) {
      const { data: { user } } = await supabase.auth.getUser();
      effectiveUid = user?.id;
    }
    if (!effectiveUid) return null;

    const { data, error } = await supabase
      .from('customer_wishlist')
      .select('product_id')
      .eq('user_id', effectiveUid);

    if (error) {
      console.warn('Fetch wishlist error:', error.message);
      return null;
    }
    return (data || []).map((row: any) => row.product_id);
  } catch (err) {
    console.warn('Fetch wishlist exception:', err);
    return null;
  }
}

/**
 * Customer: Add item to wishlist in Supabase (safe check avoids conflict RLS issues)
 */
export async function addCustomerWishlistItem(productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const targetUuid = await resolveProductUuid(productId);
    if (!targetUuid) return false;

    // Verify if already present
    const { data: existing } = await supabase
      .from('customer_wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', targetUuid)
      .maybeSingle();

    if (existing) return true;

    const { error } = await supabase
      .from('customer_wishlist')
      .insert([{ user_id: user.id, product_id: targetUuid }]);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Customer: Remove item from wishlist in Supabase
 */
export async function removeCustomerWishlistItem(productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const targetUuid = await resolveProductUuid(productId);
    if (!targetUuid) return true;

    const { error } = await supabase
      .from('customer_wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', targetUuid);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Customer: Link a guest order to the authenticated customer account in Supabase
 */
export async function linkCustomerOrderRpc(
  orderId: string,
  phone: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database offline' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Authentication required' };

    // 1. Try backend RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('link_customer_order', {
      p_order_id: orderId.trim(),
      p_phone: phone.trim(),
    });

    if (!rpcError && rpcData?.success) {
      return { success: true };
    }

    // 2. Direct secure fallback if order verified via trackOrderRpc
    const trackRes = await trackOrderRpc(orderId.trim(), phone.trim());
    if (!trackRes.found || !trackRes.order) {
      return { success: false, error: 'No matching order found for this Order ID and phone number.' };
    }

    const { error: updErr } = await supabase
      .from('orders')
      .update({ user_id: user.id, updated_at: new Date().toISOString() })
      .eq('id', trackRes.order.id);

    return { success: !updErr };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to link order' };
  }
}

/**
 * Customer: Fetch customer profile from Supabase
 */
export async function fetchCustomerProfile(): Promise<DbCustomerProfile | null> {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data as DbCustomerProfile;
  } catch {
    return null;
  }
}

/**
 * Customer: Upsert customer profile in Supabase
 */
export async function upsertCustomerProfile(
  profile: Partial<DbCustomerProfile>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase
      .from('customer_profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    return !error;
  } catch {
    return false;
  }
}

