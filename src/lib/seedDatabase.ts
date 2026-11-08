import { supabase } from './supabase';
import { INITIAL_PRODUCTS } from '../data/products';

/**
 * Seeds Supabase with all existing initial products and variants from products.ts.
 * Can be safely called from the Admin dashboard.
 */
export async function seedProductsToSupabase(): Promise<{
  success: boolean;
  inserted: number;
  message: string;
}> {
  if (!supabase) {
    return {
      success: false,
      inserted: 0,
      message: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    };
  }

  try {
    let insertedCount = 0;

    for (const product of INITIAL_PRODUCTS) {
      // 1. Check if product already exists by slug
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .maybeSingle();

      let productId = existing?.id;

      if (!productId) {
        // 2. Insert product record
        const { data: insertedProduct, error: prodError } = await supabase
          .from('products')
          .insert([
            {
              slug: product.slug,
              name: product.name,
              subtitle: product.subtitle,
              category: product.category,
              badge: product.badge,
              origin: product.origin,
              roast_style: product.roastStyle,
              rating: product.rating,
              review_count: product.reviewCount,
              images: product.images,
              description: product.description,
              extended_about: product.extendedAbout,
              ingredients: product.ingredients,
              storage: product.storage,
              shelf_life: product.shelfLife,
              allergen_notice: product.allergenNotice,
              is_featured: product.isFeatured || false,
            },
          ])
          .select('id')
          .single();

        if (prodError || !insertedProduct) {
          console.error(`Failed to seed product ${product.name}:`, prodError?.message);
          continue;
        }

        productId = insertedProduct.id;
        insertedCount++;
      }

      // 3. Insert or update variants
      for (const variant of product.variants) {
        const { data: existingVariant } = await supabase
          .from('product_variants')
          .select('id')
          .eq('product_id', productId)
          .eq('weight', variant.weight)
          .maybeSingle();

        if (!existingVariant) {
          await supabase.from('product_variants').insert([
            {
              product_id: productId,
              weight: variant.weight,
              price: variant.price,
              original_price: variant.originalPrice,
              stock: variant.stock,
            },
          ]);
        }
      }
    }

    return {
      success: true,
      inserted: insertedCount,
      message: `Successfully seeded/verified ${INITIAL_PRODUCTS.length} products in Supabase.`,
    };
  } catch (err: any) {
    return {
      success: false,
      inserted: 0,
      message: `Seeding error: ${err?.message || 'Unknown error occurred'}`,
    };
  }
}
