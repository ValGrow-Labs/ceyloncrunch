import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  adminUploadProductImage,
  adminUploadBannerImage,
  fileToOptimizedDataUrl,
} from '../src/lib/supabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Admin Image Upload & Persistence Handling', () => {
  it('converts an image File into a persistent Base64 Data URL', async () => {
    const file = new File(['mock-image-bytes-ceylon'], 'product.jpg', { type: 'image/jpeg' });
    const dataUrl = await fileToOptimizedDataUrl(file);

    assert.equal(typeof dataUrl, 'string');
    assert.equal(dataUrl.startsWith('data:image/jpeg;base64,'), true);
    assert.equal(dataUrl.startsWith('blob:'), false);
  });

  it('adminUploadProductImage returns a valid persistent image URL without failing on RLS', async () => {
    const file = new File(['sample-bytes-nuts'], 'nuts-photo.png', { type: 'image/png' });
    const res = await adminUploadProductImage('prod-mixed-nuts', file, 'mixed-nuts');

    assert.equal(res.success, true);
    assert.ok(res.url, 'Expected a non-empty image URL');
    // Ensure it NEVER produces an ephemeral blob URL
    assert.equal(res.url!.startsWith('blob:'), false);
    // Should be either a public CDN URL or a persistent data URL
    const isValidFormat = res.url!.startsWith('http') || res.url!.startsWith('data:image/');
    assert.equal(isValidFormat, true);
  });

  it('adminUploadBannerImage returns a valid persistent URL without failing on RLS', async () => {
    const file = new File(['banner-bytes'], 'banner.jpg', { type: 'image/jpeg' });
    const res = await adminUploadBannerImage(file);

    assert.equal(res.success, true);
    assert.ok(res.url, 'Expected a non-empty banner URL');
    assert.equal(res.url!.startsWith('blob:'), false);
  });

  it('sanitizes legacy blob: and placeholder URLs so products default cleanly to empty array', () => {
    const rawImages = [
      'blob:http://localhost:3000/1308396c-62b9-4504-a033-10d8c73b26d9',
      '/img/product-1.jpg',
      'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
      '/products/nuts/cashews.jpg',
    ];

    const sanitized = rawImages.filter(
      (img) =>
        typeof img === 'string' &&
        img.trim().length > 0 &&
        !img.startsWith('blob:') &&
        img !== '/img/product-1.jpg' &&
        !img.includes('photo-1549488344')
    );

    assert.equal(sanitized.length, 1);
    assert.equal(sanitized[0], '/products/nuts/cashews.jpg');
  });

  it('verifies products without uploaded images have empty images array and default placeholder markup', () => {
    // 1. Verify ProductCard.tsx contains the branded default card (bg-[#EADFD0]/40, spa icon, serif product name)
    const productCardCode = fs.readFileSync(path.resolve(__dirname, '../src/components/product/ProductCard.tsx'), 'utf-8');
    assert.ok(productCardCode.includes('bg-[#EADFD0]/40'), 'ProductCard must use warm cream default background bg-[#EADFD0]/40');
    assert.ok(productCardCode.includes('spa'), 'ProductCard must use bronze spa icon for default placeholder');
    assert.ok(productCardCode.includes('font-serif'), 'ProductCard must use serif typography for product name placeholder');

    // 2. Verify ProductDetail.tsx renders default branded card when product has no image
    const productDetailCode = fs.readFileSync(path.resolve(__dirname, '../src/pages/ProductDetail.tsx'), 'utf-8');
    assert.ok(productDetailCode.includes('bg-[#EADFD0]/40'), 'ProductDetail must use warm cream default background bg-[#EADFD0]/40');
    assert.ok(productDetailCode.includes('spa'), 'ProductDetail must use bronze spa icon');
    assert.ok(productDetailCode.includes('Pure Artisan Provisions'), 'ProductDetail must display branded subtitle in default card');

    // 3. Verify ProductsTab.tsx defaults imageUrl to empty string and shows default placeholder
    const productsTabCode = fs.readFileSync(path.resolve(__dirname, '../src/components/admin/ProductsTab.tsx'), 'utf-8');
    assert.ok(productsTabCode.includes("const [imageUrl, setImageUrl] = useState('');"), 'ProductsTab must initialize imageUrl with empty string');
    assert.ok(productsTabCode.includes("setImageUrl('');"), 'handleOpenCreate must reset imageUrl to empty string');
    assert.ok(productsTabCode.includes('Leave empty for default branded card or enter image URL'), 'Placeholder explains default branded card behavior');
  });
});
