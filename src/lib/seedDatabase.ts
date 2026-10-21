import { supabase, adminSupabase } from './supabase';
import { INITIAL_PRODUCTS } from '../data/products';

/**
 * Seeds Supabase with all existing initial products from products.ts.
 * Can be safely called from the Admin dashboard.
 */
export async function seedProductsToSupabase(): Promise<{
  success: boolean;
  inserted: number;
  message: string;
}> {
  const client = adminSupabase || supabase;
  if (!client) {
    return {
      success: false,
      inserted: 0,
      message: 'Supabase is not configured. Please verify your connection credentials.',
    };
  }

  try {
    const formattedProducts = INITIAL_PRODUCTS.map((product) => {
      const primaryVariant = product.variants?.[0];
      const lowestPrice = primaryVariant ? primaryVariant.price : 900;
      const formattedVariants = product.variants.map((v) => ({
        size: v.weight,
        price: v.price,
        original_price: v.originalPrice,
        stock: v.stock,
      }));

      return {
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: lowestPrice,
        variants: formattedVariants,
        image_url: product.images?.[0] || '/img/product-1.jpg',
        description: product.description,
        badge: product.badge || null,
        active: true,
      };
    });

    // 1. Try server endpoint first (has admin service role privileges bypassing RLS)
    try {
      const res = await fetch('/api/seed-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: formattedProducts }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return {
            success: true,
            inserted: json.inserted,
            message: `Successfully synchronized ${json.inserted} of ${INITIAL_PRODUCTS.length} products to Supabase.`,
          };
        }
      }
    } catch {}

    // 2. Fallback to direct client
    let syncedCount = 0;
    for (const row of formattedProducts) {
      const { error } = await client
        .from('products')
        .upsert(row, { onConflict: 'slug' });

      if (!error) {
        syncedCount++;
      } else {
        console.warn(`Failed to sync product ${row.name}:`, error.message);
      }
    }

    return {
      success: true,
      inserted: syncedCount,
      message: `Successfully synchronized ${syncedCount} of ${INITIAL_PRODUCTS.length} products to Supabase.`,
    };
  } catch (err: any) {
    return {
      success: false,
      inserted: 0,
      message: err?.message || 'Database sync encountered an unexpected error.',
    };
  }
}
