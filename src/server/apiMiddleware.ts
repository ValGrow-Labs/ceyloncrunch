import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'http';

export function createApiMiddleware(supabaseUrl?: string, serviceRoleKey?: string) {
  const adminClient = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

  return async function apiMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) {
    const url = req.url?.split('?')[0];

    if (!url?.startsWith('/api/')) {
      return next();
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
      return;
    }

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json');

      let body: any = {};
      try {
        if (rawBody) body = JSON.parse(rawBody);
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON body' }));
        return;
      }

      if (!adminClient) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: 'Database service role client not configured' }));
        return;
      }

      try {
        // 1. PLACE ORDER
        if (url === '/api/place-order') {
          const payload = body;
          const formattedAddress = [
            payload.shipping_street,
            payload.landmark ? `Landmark: ${payload.landmark}` : null,
            payload.shipping_postal ? `Postal: ${payload.shipping_postal}` : null,
          ]
            .filter(Boolean)
            .join(', ');

          const formattedCity = [payload.shipping_city, payload.shipping_district]
            .filter(Boolean)
            .join(', ');

          const orderItems = (payload.full_items && payload.full_items.length > 0)
            ? payload.full_items.map((i: any) => ({
                id: i.variantId || i.productId || i.id,
                name: i.productName || i.name || 'Product',
                price: Number(i.price || 0),
                variant: i.variantWeight || i.variant || 'Standard',
                quantity: Number(i.quantity || 1),
                image: i.image || null,
              }))
            : (payload.items || []).map((i: any) => ({
                id: i.variant_id || i.id,
                name: i.name || 'Product',
                price: Number(i.price || 0),
                variant: i.variant || 'Standard',
                quantity: Number(i.quantity || 1),
              }));

          const calculatedSubtotal =
            payload.subtotal ??
            orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
          const calculatedDelivery = payload.delivery_fee ?? 0;
          const calculatedTotal = payload.total ?? calculatedSubtotal + calculatedDelivery;

          const notes = [
            payload.order_notes ? `Notes: ${payload.order_notes}` : null,
            payload.gift_note ? `Gift Note: ${payload.gift_note}` : null,
          ]
            .filter(Boolean)
            .join(' | ') || null;

          // Database table 'orders' has NOT NULL constraint on customer_email
          const cleanEmail =
            (payload.customer_email && String(payload.customer_email).trim()) ||
            `customer-${String(payload.customer_phone || '').replace(/\D/g, '') || Date.now()}@ceyloncrunch.lk`;

          const { data, error } = await adminClient
            .from('orders')
            .insert({
              customer_name: payload.customer_name || 'Customer',
              customer_email: cleanEmail,
              customer_phone: payload.customer_phone || '+94 77 000 0000',
              shipping_address: formattedAddress || 'Colombo, Sri Lanka',
              city: formattedCity || 'Colombo',
              items: orderItems,
              subtotal: calculatedSubtotal,
              delivery: calculatedDelivery,
              total: calculatedTotal,
              status: 'pending',
              payment_method: payload.payment_method || 'cod',
              notes: notes,
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            console.error('[API /api/place-order] Insert error:', error.message);
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: error.message }));
            return;
          }

          // Automatically deduct stock for ordered items
          try {
            const { data: allProds } = await adminClient.from('products').select('*');
            if (allProds && Array.isArray(allProds)) {
              for (const item of orderItems) {
                const qty = Number(item.quantity || 1);
                if (qty <= 0) continue;
                const itemId = String(item.id || '');
                const itemVar = String(item.variant || '');

                const targetProd = allProds.find((p: any) =>
                  p.id === itemId ||
                  p.slug === itemId ||
                  (Array.isArray(p.variants) && p.variants.some((v: any) => {
                    const size = typeof v === 'string' ? v : v.size || v.weight || '';
                    return v.id === itemId || size === itemVar || (itemVar && size.toLowerCase().includes(itemVar.toLowerCase()));
                  }))
                );

                if (targetProd && Array.isArray(targetProd.variants)) {
                  let changed = false;
                  const newVariants = targetProd.variants.map((v: any) => {
                    const size = typeof v === 'string' ? v : v.size || v.weight || '';
                    const match = (typeof v === 'object' && (v.id === itemId || v.size === itemVar || v.weight === itemVar)) ||
                                  (size && itemVar && (size.toLowerCase() === itemVar.toLowerCase() || itemId.includes(size.toLowerCase())));
                    if (match) {
                      changed = true;
                      const cur = typeof v === 'object' && typeof v.stock === 'number' ? v.stock : 25;
                      const nextStock = Math.max(0, cur - qty);
                      return typeof v === 'string'
                        ? { size: v, price: targetProd.price || 0, stock: nextStock }
                        : { ...v, stock: nextStock };
                    }
                    return v;
                  });

                  if (changed) {
                    await adminClient
                      .from('products')
                      .update({ variants: newVariants, updated_at: new Date().toISOString() })
                      .eq('id', targetProd.id);
                  }
                }
              }
            }
          } catch (deductErr) {
            console.warn('[API /api/place-order] Stock deduction notice:', deductErr);
          }

          const waybill = `CLN-${Math.floor(10000000 + Math.random() * 90000000)}-LK`;
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              success: true,
              order_id: data.id,
              waybill,
              status: data.status || 'pending',
              subtotal: calculatedSubtotal,
              delivery_fee: calculatedDelivery,
              total: calculatedTotal,
            })
          );
          return;
        }

        // 2. UPDATE VARIANT STOCK (Used by Admin Inventory Tab)
        if (url === '/api/update-variant-stock') {
          const { productId, variantId, newStock } = body;
          if (newStock === undefined || isNaN(Number(newStock))) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing or invalid newStock' }));
            return;
          }

          const safeStock = Math.max(0, Math.round(Number(newStock)));

          let prodData: any = null;
          if (productId) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
            const query = isUuid
              ? adminClient.from('products').select('*').eq('id', productId)
              : adminClient.from('products').select('*').eq('slug', productId);
            const { data } = await query.maybeSingle();
            prodData = data;
          }

          if (!prodData) {
            const { data: allProds } = await adminClient.from('products').select('*');
            prodData = allProds?.find((p: any) => {
              if (productId && (p.id === productId || p.slug === productId)) return true;
              if (variantId && Array.isArray(p.variants)) {
                return p.variants.some((v: any) => {
                  const size = typeof v === 'string' ? v : v.size || v.weight || '';
                  return v.id === variantId || v.size === variantId || (size && variantId.toLowerCase().includes(size.toLowerCase()));
                });
              }
              return false;
            }) || null;
          }

          if (!prodData) {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Product not found' }));
            return;
          }

          let updatedVariants = Array.isArray(prodData.variants) ? [...prodData.variants] : [];
          let matched = false;

          updatedVariants = updatedVariants.map((v: any) => {
            const size = typeof v === 'string' ? v : v.size || v.weight || '';
            const isMatch =
              (typeof v === 'object' && (v.id === variantId || v.size === variantId || v.weight === variantId)) ||
              Boolean(size && variantId && (variantId.toLowerCase().includes(size.toLowerCase()) || size.toLowerCase().includes(variantId.toLowerCase())));

            if (isMatch) {
              matched = true;
              return typeof v === 'string'
                ? { size, price: prodData.price || 0, stock: safeStock }
                : { ...v, stock: safeStock };
            }
            return v;
          });

          if (!matched) {
            const weightName = variantId ? variantId.split('-').pop() || '250g' : '250g';
            updatedVariants.push({
              size: weightName,
              price: prodData.price || 1200,
              stock: safeStock,
            });
          }

          const { error: updateErr } = await adminClient
            .from('products')
            .update({
              variants: updatedVariants,
              updated_at: new Date().toISOString(),
            })
            .eq('id', prodData.id);

          if (updateErr) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: updateErr.message }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, stock: safeStock, productId: prodData.id }));
          return;
        }

        // 3. UPDATE VARIANT PRICE
        if (url === '/api/update-variant-price') {
          const { productId, variantId, newPrice } = body;
          if (!productId || newPrice === undefined) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing productId or newPrice' }));
            return;
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
          const query = isUuid
            ? adminClient.from('products').select('*').eq('id', productId)
            : adminClient.from('products').select('*').eq('slug', productId);

          let { data: prodData } = await query.maybeSingle();

          if (!prodData) {
            const { data: allProds } = await adminClient.from('products').select('*');
            prodData =
              allProds?.find(
                (p: any) =>
                  p.id === productId ||
                  p.slug === productId ||
                  (p.slug && variantId.toLowerCase().includes(p.slug.toLowerCase()))
              ) || null;
          }

          if (!prodData) {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Product not found' }));
            return;
          }

          let updatedVariants = Array.isArray(prodData.variants) ? [...prodData.variants] : [];
          let matched = false;

          updatedVariants = updatedVariants.map((v: any) => {
            const size = typeof v === 'string' ? v : v.size || v.weight || '';
            const isMatch =
              (typeof v === 'object' &&
                (v.id === variantId || v.size === variantId || v.weight === variantId)) ||
              Boolean(size && variantId.toLowerCase().includes(size.toLowerCase()));
            if (isMatch) {
              matched = true;
              return typeof v === 'string'
                ? { size, price: Number(newPrice) }
                : { ...v, price: Number(newPrice) };
            }
            return v;
          });

          if (!matched) {
            const weightName = variantId ? variantId.split('-').pop() || '250g' : '250g';
            updatedVariants.push({
              size: weightName,
              price: Number(newPrice),
              stock: 20,
            });
          }

          await adminClient
            .from('products')
            .update({
              price: Number(newPrice),
              variants: updatedVariants,
              updated_at: new Date().toISOString(),
            })
            .eq('id', prodData.id);

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 4. UPDATE PRODUCT DETAILS (Used by ProductsTab edit form)
        if (url === '/api/update-product-details') {
          const { productId, updates } = body;
          if (!productId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing productId' }));
            return;
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
          const query = isUuid
            ? adminClient.from('products').select('*').eq('id', productId)
            : adminClient.from('products').select('*').eq('slug', productId);

          let { data: prod } = await query.maybeSingle();
          if (!prod) {
            const { data: allProds } = await adminClient.from('products').select('*');
            prod = allProds?.find((p: any) => p.id === productId || p.slug === productId) || null;
          }

          if (!prod) {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Product not found' }));
            return;
          }

          const payload: Record<string, any> = {
            updated_at: new Date().toISOString(),
          };

          if (updates.name !== undefined) payload.name = String(updates.name).trim();
          if (updates.category !== undefined) payload.category = String(updates.category).trim();
          if (updates.badge !== undefined) payload.badge = updates.badge ? String(updates.badge).trim() : null;
          if (updates.badge_type !== undefined || updates.badgeType !== undefined) {
            payload.badge_type = updates.badge_type || updates.badgeType || null;
          }
          if (updates.rating !== undefined && !isNaN(Number(updates.rating))) payload.rating = Number(updates.rating);
          if (updates.reviews !== undefined && !isNaN(Number(updates.reviews))) payload.reviews = Number(updates.reviews);
          if (updates.nutrition_info !== undefined || updates.nutritionInfo !== undefined) {
            payload.nutrition_info = updates.nutrition_info || updates.nutritionInfo || null;
          }
          if (updates.description !== undefined) payload.description = String(updates.description).trim();
          if (updates.price !== undefined && !isNaN(Number(updates.price))) payload.price = Math.round(Number(updates.price));
          if (updates.active !== undefined) payload.active = Boolean(updates.active);

          // Correctly map image to image_url (never images array)
          if (updates.images && Array.isArray(updates.images) && updates.images.length > 0) {
            payload.image_url = updates.images[0];
          } else if (updates.image_url) {
            payload.image_url = String(updates.image_url).trim();
          }

          const { error: updErr } = await adminClient
            .from('products')
            .update(payload)
            .eq('id', prod.id);

          if (updErr) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: updErr.message }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 5. UPDATE PRODUCT IMAGE
        if (url === '/api/update-product-image') {
          const { productId, imageUrl } = body;
          if (!productId || !imageUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing productId or imageUrl' }));
            return;
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
          const updateQuery = isUuid
            ? adminClient
                .from('products')
                .update({ image_url: String(imageUrl).trim(), updated_at: new Date().toISOString() })
                .eq('id', productId)
            : adminClient
                .from('products')
                .update({ image_url: String(imageUrl).trim(), updated_at: new Date().toISOString() })
                .eq('slug', productId);

          await updateQuery;

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
        }

        // 6. UPDATE ORDER STATUS
        if (url === '/api/update-order-status') {
          const { orderId, status } = body;
          if (!orderId || !status) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing orderId or status' }));
            return;
          }

          await adminClient
            .from('orders')
            .update({
              status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 5. GET ORDER BY ID OR WAYBILL
        if (url === '/api/get-order') {
          const { orderId } = body;
          if (!orderId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing orderId' }));
            return;
          }

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
          let query = isUuid
            ? adminClient.from('orders').select('*').eq('id', orderId)
            : adminClient.from('orders').select('*').or(`waybill.eq.${orderId}`);

          let { data, error } = await query.maybeSingle();
          if (!data && !isUuid) {
            const { data: all } = await adminClient.from('orders').select('*').limit(30);
            data = all?.find((o: any) => o.id === orderId || o.waybill === orderId);
          }

          if (!data) {
            res.statusCode = 404;
            res.end(JSON.stringify({ success: false, error: 'Order not found' }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, order: data }));
          return;
        }

        // 6. GET SITE SETTINGS
        if (url === '/api/get-site-settings') {
          try {
            const { data, error } = await adminClient.from('site_settings').select('*');
            if (data && Array.isArray(data)) {
              const rawMap: Record<string, any> = {};
              for (const row of data) {
                if (row.key) rawMap[row.key] = row.value;
              }

              const flatSettings = {
                store_name: rawMap.branding?.site_name || 'Ceylon Crunch',
                tagline: rawMap.branding?.tagline || 'Healthy Crunch for Every Home',
                logo_url: rawMap.branding?.logo_url || '/logo.png',
                announcement_banner: rawMap.announcement_bar?.message || 'Free island-wide delivery on orders over Rs. 3,000 · Small-Batch Freshness Guaranteed',
                announcement_active: rawMap.announcement_bar?.enabled ?? true,
                free_delivery_threshold: rawMap.delivery?.free_threshold ?? rawMap.store?.free_delivery_threshold ?? 3000,
                standard_delivery_fee: rawMap.delivery?.zones?.[0]?.fee ?? rawMap.store?.delivery_fee ?? 300,
                courier_partner: rawMap.delivery?.courier_partner || rawMap.store?.courier_partner || 'Ceylon Express Tracked Courier',
                delivery_estimate: rawMap.delivery?.estimate || rawMap.delivery?.estimated_dispatch || '1-2 Business Days (Island-wide)',
                primary_color: rawMap.theme?.primary_color || rawMap.theme?.green || '#1F3D2B',
                gold_color: rawMap.theme?.gold_color || rawMap.theme?.gold || '#C5A059',
                hero_title: rawMap.hero?.headline || rawMap.hero?.title || 'Pure Ceylon Harvest. Handcrafted in Small Batches.',
                hero_subtitle: rawMap.hero?.subtext || rawMap.hero?.subtitle || 'Single-origin cashews, sun-dried exotic fruits, and organic roastery snacks delivered direct to your door.',
                hero_cta_text: rawMap.hero?.primary_cta || rawMap.hero?.cta_text || 'Explore Collection',
                hero_banner_url: rawMap.hero?.bg_image || rawMap.hero?.banner_url || '/hero-banner.png',
                featured_title: rawMap.bestsellers_section?.headline || rawMap.bestsellers_section?.title || 'Curated Harvest Collection',
                featured_subtitle: rawMap.bestsellers_section?.subtext || rawMap.bestsellers_section?.subtitle || 'Freshly roasted whole-grade cashews and artisanal sun-dried fruits.',
                footer_about: rawMap.footer?.about || rawMap.footer?.tagline || 'Ceylon Crunch is dedicated to the preservation of heritage roastery craft, ethical farmer partnerships, and clean wholesome snacking across Sri Lanka.',
                roastery_address: rawMap.store?.address || rawMap.footer?.address || 'No. 42/1, Alfred House Gardens, Colombo 03, Sri Lanka',
                operating_hours: rawMap.store?.hours || 'Monday - Saturday: 8:00 AM - 7:00 PM',
                seo_title: rawMap.seo?.title || 'Ceylon Crunch | Artisan Cashew & Organic Dried Fruits Sri Lanka',
                seo_description: rawMap.seo?.description || 'Order premium artisanal cashew snacks, roasted cashews, and organic dried fruits in Sri Lanka. Islandwide tracked courier delivery.',
                seo_keywords: rawMap.seo?.keywords || 'ceylon cashews, roasted cashews colombo, dried fruits sri lanka, healthy snacks sri lanka',
                bank_name: rawMap.payments?.bank_transfer?.bank_name || 'Commercial Bank / Sampath Bank',
                bank_account_name: rawMap.payments?.bank_transfer?.account_name || 'Ceylon Crunch (Pvt) Ltd',
                bank_account_number: rawMap.payments?.bank_transfer?.account_number || '1000 2489 8210',
                bank_branch: rawMap.payments?.bank_transfer?.branch || 'Kollupitiya (Colombo 03)',
                bank_details: rawMap.payments?.bank_transfer?.instructions || `${rawMap.payments?.bank_transfer?.bank_name || 'Commercial Bank'} · Acc: ${rawMap.payments?.bank_transfer?.account_number || '1000 2489 8210'} · ${rawMap.payments?.bank_transfer?.account_name || 'Ceylon Crunch (Pvt) Ltd'}`,
                payhere_merchant_id: rawMap.payments?.payhere?.merchant_id || '1228491',
                payhere_mode: rawMap.payments?.payhere?.sandbox === false ? 'live' : 'sandbox',
                payhere_enabled: rawMap.payments?.payhere?.enabled ?? true,
                payhere_secret: rawMap.payments?.payhere?.secret || '',
                cod_enabled: rawMap.payments?.cod?.enabled ?? true,
                bank_transfer_enabled: rawMap.payments?.bank_transfer?.enabled ?? true,
                contact_email: rawMap.footer?.contact_email || 'hello@ceyloncrunch.lk',
                contact_phone: rawMap.store?.phone || '+94 77 944 3867',
                raw: rawMap,
              };

              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, settings: flatSettings, raw: rawMap }));
              return;
            }
          } catch (err: any) {
            console.warn('[API /api/get-site-settings] Error:', err.message);
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, settings: null }));
          return;
        }

        // 7. UPDATE SITE SETTINGS
        if (url === '/api/update-site-settings') {
          const payload = body || {};
          const now = new Date().toISOString();
          try {
            if (payload.key && payload.value) {
              await adminClient.from('site_settings').upsert({
                key: payload.key,
                value: payload.value,
                updated_at: now,
              });
            } else {
              const updates: Array<{ key: string; value: any; updated_at: string }> = [];

              // Branding
              if (payload.store_name !== undefined || payload.tagline !== undefined || payload.logo_url !== undefined) {
                const { data: bRow } = await adminClient.from('site_settings').select('value').eq('key', 'branding').maybeSingle();
                const currentBranding = bRow?.value || {};
                updates.push({
                  key: 'branding',
                  value: {
                    ...currentBranding,
                    ...(payload.store_name !== undefined ? { site_name: payload.store_name } : {}),
                    ...(payload.tagline !== undefined ? { tagline: payload.tagline } : {}),
                    ...(payload.logo_url !== undefined ? { logo_url: payload.logo_url } : {}),
                  },
                  updated_at: now,
                });
              }

              // Announcement Bar
              if (payload.announcement_banner !== undefined || payload.announcement_active !== undefined) {
                const { data: aRow } = await adminClient.from('site_settings').select('value').eq('key', 'announcement_bar').maybeSingle();
                const currentAnnounce = aRow?.value || {};
                updates.push({
                  key: 'announcement_bar',
                  value: {
                    ...currentAnnounce,
                    ...(payload.announcement_banner !== undefined ? { message: payload.announcement_banner } : {}),
                    ...(payload.announcement_active !== undefined ? { enabled: Boolean(payload.announcement_active) } : {}),
                  },
                  updated_at: now,
                });
              }

              // Delivery & Store settings
              if (
                payload.free_delivery_threshold !== undefined ||
                payload.standard_delivery_fee !== undefined ||
                payload.courier_partner !== undefined ||
                payload.delivery_estimate !== undefined
              ) {
                const { data: dRow } = await adminClient.from('site_settings').select('value').eq('key', 'delivery').maybeSingle();
                const currentDelivery = dRow?.value || {};
                updates.push({
                  key: 'delivery',
                  value: {
                    ...currentDelivery,
                    ...(payload.free_delivery_threshold !== undefined ? { free_threshold: Number(payload.free_delivery_threshold) } : {}),
                    ...(payload.courier_partner !== undefined ? { courier_partner: payload.courier_partner } : {}),
                    ...(payload.delivery_estimate !== undefined ? { estimate: payload.delivery_estimate, estimated_dispatch: payload.delivery_estimate } : {}),
                    ...(payload.standard_delivery_fee !== undefined
                      ? {
                          zones: [
                            {
                              name: 'All Island',
                              fee: Number(payload.standard_delivery_fee),
                              days: payload.delivery_estimate || '1-2',
                            },
                          ],
                        }
                      : {}),
                  },
                  updated_at: now,
                });

                const { data: sRow } = await adminClient.from('site_settings').select('value').eq('key', 'store').maybeSingle();
                const currentStore = sRow?.value || {};
                updates.push({
                  key: 'store',
                  value: {
                    ...currentStore,
                    ...(payload.free_delivery_threshold !== undefined ? { free_delivery_threshold: Number(payload.free_delivery_threshold) } : {}),
                    ...(payload.standard_delivery_fee !== undefined ? { delivery_fee: Number(payload.standard_delivery_fee) } : {}),
                    ...(payload.roastery_address !== undefined ? { address: payload.roastery_address } : {}),
                    ...(payload.operating_hours !== undefined ? { hours: payload.operating_hours } : {}),
                    ...(payload.contact_phone !== undefined ? { phone: payload.contact_phone } : {}),
                  },
                  updated_at: now,
                });
              }

              // Theme Colors
              if (payload.primary_color !== undefined || payload.gold_color !== undefined) {
                const { data: tRow } = await adminClient.from('site_settings').select('value').eq('key', 'theme').maybeSingle();
                const currentTheme = tRow?.value || {};
                updates.push({
                  key: 'theme',
                  value: {
                    ...currentTheme,
                    ...(payload.primary_color !== undefined ? { green: payload.primary_color, primary_color: payload.primary_color } : {}),
                    ...(payload.gold_color !== undefined ? { gold: payload.gold_color, gold_color: payload.gold_color } : {}),
                  },
                  updated_at: now,
                });
              }

              // Hero Banner
              if (
                payload.hero_title !== undefined ||
                payload.hero_subtitle !== undefined ||
                payload.hero_cta_text !== undefined ||
                payload.hero_banner_url !== undefined
              ) {
                const { data: hRow } = await adminClient.from('site_settings').select('value').eq('key', 'hero').maybeSingle();
                const currentHero = hRow?.value || {};
                updates.push({
                  key: 'hero',
                  value: {
                    ...currentHero,
                    ...(payload.hero_title !== undefined ? { headline: payload.hero_title, title: payload.hero_title } : {}),
                    ...(payload.hero_subtitle !== undefined ? { subtext: payload.hero_subtitle, subtitle: payload.hero_subtitle } : {}),
                    ...(payload.hero_cta_text !== undefined ? { primary_cta: payload.hero_cta_text, cta_text: payload.hero_cta_text } : {}),
                    ...(payload.hero_banner_url !== undefined ? { bg_image: payload.hero_banner_url, banner_url: payload.hero_banner_url } : {}),
                  },
                  updated_at: now,
                });
              }

              // Homepage Bestsellers / Featured Section
              if (payload.featured_title !== undefined || payload.featured_subtitle !== undefined) {
                const { data: bsRow } = await adminClient.from('site_settings').select('value').eq('key', 'bestsellers_section').maybeSingle();
                const currentBs = bsRow?.value || {};
                updates.push({
                  key: 'bestsellers_section',
                  value: {
                    ...currentBs,
                    ...(payload.featured_title !== undefined ? { headline: payload.featured_title, title: payload.featured_title } : {}),
                    ...(payload.featured_subtitle !== undefined ? { subtext: payload.featured_subtitle, subtitle: payload.featured_subtitle } : {}),
                  },
                  updated_at: now,
                });
              }

              // Footer & Store Address
              if (payload.contact_email !== undefined || payload.footer_about !== undefined || payload.roastery_address !== undefined) {
                const { data: fRow } = await adminClient.from('site_settings').select('value').eq('key', 'footer').maybeSingle();
                const currentFooter = fRow?.value || {};
                updates.push({
                  key: 'footer',
                  value: {
                    ...currentFooter,
                    ...(payload.contact_email !== undefined ? { contact_email: payload.contact_email } : {}),
                    ...(payload.footer_about !== undefined ? { about: payload.footer_about, tagline: payload.footer_about } : {}),
                    ...(payload.roastery_address !== undefined ? { address: payload.roastery_address } : {}),
                  },
                  updated_at: now,
                });
              }

              // SEO & Metadata
              if (payload.seo_title !== undefined || payload.seo_description !== undefined || payload.seo_keywords !== undefined) {
                const { data: seoRow } = await adminClient.from('site_settings').select('value').eq('key', 'seo').maybeSingle();
                const currentSeo = seoRow?.value || {};
                updates.push({
                  key: 'seo',
                  value: {
                    ...currentSeo,
                    ...(payload.seo_title !== undefined ? { title: payload.seo_title } : {}),
                    ...(payload.seo_description !== undefined ? { description: payload.seo_description } : {}),
                    ...(payload.seo_keywords !== undefined ? { keywords: payload.seo_keywords } : {}),
                  },
                  updated_at: now,
                });
              }

              // Payments: Bank Transfer, PayHere, COD
              if (
                payload.bank_details !== undefined ||
                payload.bank_name !== undefined ||
                payload.bank_account_name !== undefined ||
                payload.bank_account_number !== undefined ||
                payload.bank_branch !== undefined ||
                payload.bank_transfer_enabled !== undefined ||
                payload.payhere_merchant_id !== undefined ||
                payload.payhere_mode !== undefined ||
                payload.payhere_enabled !== undefined ||
                payload.payhere_secret !== undefined ||
                payload.cod_enabled !== undefined
              ) {
                const { data: pRow } = await adminClient.from('site_settings').select('value').eq('key', 'payments').maybeSingle();
                const currentPayments = pRow?.value || {};
                const currentBank = currentPayments.bank_transfer || {};
                const currentPayhere = currentPayments.payhere || {};
                const currentCod = currentPayments.cod || {};

                updates.push({
                  key: 'payments',
                  value: {
                    ...currentPayments,
                    bank_transfer: {
                      ...currentBank,
                      ...(payload.bank_name !== undefined ? { bank_name: payload.bank_name } : {}),
                      ...(payload.bank_account_name !== undefined ? { account_name: payload.bank_account_name } : {}),
                      ...(payload.bank_account_number !== undefined ? { account_number: payload.bank_account_number } : {}),
                      ...(payload.bank_branch !== undefined ? { branch: payload.bank_branch } : {}),
                      ...(payload.bank_details !== undefined ? { instructions: payload.bank_details } : {}),
                      ...(payload.bank_transfer_enabled !== undefined ? { enabled: Boolean(payload.bank_transfer_enabled) } : {}),
                    },
                    payhere: {
                      ...currentPayhere,
                      ...(payload.payhere_merchant_id !== undefined ? { merchant_id: payload.payhere_merchant_id } : {}),
                      ...(payload.payhere_mode !== undefined ? { sandbox: payload.payhere_mode === 'sandbox' } : {}),
                      ...(payload.payhere_enabled !== undefined ? { enabled: Boolean(payload.payhere_enabled) } : {}),
                      ...(payload.payhere_secret !== undefined ? { secret: payload.payhere_secret } : {}),
                    },
                    cod: {
                      ...currentCod,
                      ...(payload.cod_enabled !== undefined ? { enabled: Boolean(payload.cod_enabled) } : {}),
                    },
                  },
                  updated_at: now,
                });
              }

              for (const u of updates) {
                await adminClient.from('site_settings').upsert(u);
              }
            }
          } catch (err: any) {
            console.warn('[API /api/update-site-settings] Error:', err.message);
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 8. SEED DATABASE
        if (url === '/api/seed-database') {
          const products = body?.products || [];
          if (!Array.isArray(products) || products.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'No products provided' }));
            return;
          }

          let inserted = 0;
          for (const p of products) {
            const { error } = await adminClient.from('products').upsert(p, { onConflict: 'slug' });
            if (!error) inserted++;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, inserted, total: products.length }));
          return;
        }

        // 9. DELETE PRODUCT
        if (url === '/api/delete-product') {
          const { productId, slug } = body;
          if (!productId && !slug) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing productId or slug' }));
            return;
          }

          const isUuid = Boolean(productId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId));

          if (isUuid) {
            const { error: delErr } = await adminClient
              .from('products')
              .delete()
              .eq('id', productId);

            if (delErr) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: delErr.message }));
              return;
            }
          } else {
            const targetSlug = slug || (productId ? String(productId).replace(/^prod-/, '') : null);
            if (targetSlug) {
              const { error: delErr } = await adminClient
                .from('products')
                .delete()
                .or(`slug.eq.${targetSlug},slug.eq.${productId}`);

              if (delErr) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: delErr.message }));
                return;
              }
            }
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 10. CREATE PRODUCT
        if (url === '/api/create-product') {
          const payload = body;
          if (!payload.name || !payload.category) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Missing required product fields (name, category)' }));
            return;
          }

          const slug =
            payload.slug ||
            (payload.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') +
              '-' +
              Math.floor(100 + Math.random() * 900));

          const primaryPrice = Math.round(Number(payload.price) || 1200);
          const primaryStock = Math.max(0, Math.round(Number(payload.stock) || 50));
          const primaryWeight = payload.weight || '250g';

          const formattedVariants = (Array.isArray(payload.variants) && payload.variants.length > 0)
            ? payload.variants.map((v: any, idx: number) => ({
                size: v.size || v.weight || `Pack ${idx + 1}`,
                price: Number(v.price) || primaryPrice,
                original_price: v.original_price ? Number(v.original_price) : null,
                stock: typeof v.stock === 'number' ? v.stock : primaryStock,
              }))
            : [
                {
                  size: primaryWeight,
                  price: primaryPrice,
                  original_price: payload.original_price ? Math.round(Number(payload.original_price)) : null,
                  stock: primaryStock,
                },
              ];

          const imageUrl =
            (payload.images && Array.isArray(payload.images) && payload.images.length > 0)
              ? payload.images[0]
              : payload.image_url || '/img/product-1.jpg';

          // Strictly use only existing columns in public.products table
          const newProductRow: Record<string, any> = {
            slug,
            name: String(payload.name).trim(),
            category: String(payload.category).trim(),
            price: primaryPrice,
            variants: formattedVariants,
            badge: payload.badge ? String(payload.badge).trim() : null,
            badge_type: payload.badge_type || payload.badgeType || null,
            rating: Number(payload.rating) || 5.0,
            reviews: Number(payload.reviews ?? payload.review_count ?? 0),
            image_url: imageUrl,
            description: payload.description ? String(payload.description).trim() : `${payload.name} artisan provisions.`,
            nutrition_info: payload.nutrition_info || payload.nutritionInfo || null,
            active: payload.active !== undefined ? Boolean(payload.active) : true,
          };

          const { data, error } = await adminClient
            .from('products')
            .insert(newProductRow)
            .select('*')
            .single();

          if (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: error.message }));
            return;
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, product: data }));
          return;
        }

        // Unknown endpoint
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: 'API route not found' }));
      } catch (err: any) {
        console.error(`[API ${url}] Exception:`, err);
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
      }
    });
  };
}
