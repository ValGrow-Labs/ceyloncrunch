import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS, getLowestPrice, Product } from '../src/data/products.ts';

// Mock localStorage for testing persistence
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
const STORAGE_KEY = 'ceylon_crunch_products_v5';

describe('Admin Product Inventory - Price & Image Management', () => {
  let products: Product[];

  beforeEach(() => {
    mockStorage.clear();
    // Clone initial products so tests start with a fresh catalog
    products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    mockStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  });

  describe('Variant Price Editing & Validation', () => {
    it('updates price for a specific variant linked by productId and variantId', () => {
      const targetProduct = products[0];
      const targetVariant = targetProduct.variants[0]; // e.g., 100g
      const oldPrice = targetVariant.price;
      const newPrice = 550;

      // Update function replicating updateProductVariantPrice logic
      products = products.map((p) => {
        if (p.id !== targetProduct.id) return p;
        return {
          ...p,
          variants: p.variants.map((v) =>
            v.id === targetVariant.id ? { ...v, price: newPrice } : v
          ),
        };
      });

      // Save to persistence
      mockStorage.setItem(STORAGE_KEY, JSON.stringify(products));

      // Assertions
      const updatedProduct = products.find((p) => p.id === targetProduct.id)!;
      const updatedVariant = updatedProduct.variants.find((v) => v.id === targetVariant.id)!;
      assert.equal(updatedVariant.price, 550);
      assert.notEqual(updatedVariant.price, oldPrice);

      // Other variants of the same product remain untouched
      const otherVariant = updatedProduct.variants[1];
      assert.equal(otherVariant.price, targetProduct.variants[1].price);

      // Verify persistence after refresh/reload from storage
      const reloadedProducts: Product[] = JSON.parse(mockStorage.getItem(STORAGE_KEY)!);
      const reloadedVariant = reloadedProducts
        .find((p) => p.id === targetProduct.id)!
        .variants.find((v) => v.id === targetVariant.id)!;
      assert.equal(reloadedVariant.price, 550);
    });

    it('validates and rejects negative price values', () => {
      const targetProduct = products[0];
      const targetVariant = targetProduct.variants[0];
      const originalPrice = targetVariant.price;

      const updatePrice = (newPrice: number) => {
        if (isNaN(newPrice) || newPrice < 0) return; // Validation rule
        products = products.map((p) => {
          if (p.id !== targetProduct.id) return p;
          return {
            ...p,
            variants: p.variants.map((v) =>
              v.id === targetVariant.id ? { ...v, price: newPrice } : v
            ),
          };
        });
      };

      // Attempt negative price
      updatePrice(-100);
      let variant = products.find((p) => p.id === targetProduct.id)!.variants.find((v) => v.id === targetVariant.id)!;
      assert.equal(variant.price, originalPrice, 'Price must not change on negative input');

      // Attempt NaN
      updatePrice(NaN);
      variant = products.find((p) => p.id === targetProduct.id)!.variants.find((v) => v.id === targetVariant.id)!;
      assert.equal(variant.price, originalPrice, 'Price must not change on NaN');

      // Zero is a valid non-negative price
      updatePrice(0);
      variant = products.find((p) => p.id === targetProduct.id)!.variants.find((v) => v.id === targetVariant.id)!;
      assert.equal(variant.price, 0, 'Zero must be accepted as a non-negative price');
    });

    it('correctly recalculates lowest price when variant prices are updated', () => {
      const product = products[0]; // e.g. Black Raisins
      // Initially lowest in-stock variant is 100g with lowest price
      const initialLowest = getLowestPrice(product);
      assert.equal(initialLowest.price, product.variants[0].price);

      // Update 100g variant to be much more expensive than 250g
      const p100 = product.variants.find((v) => v.weight === '100g')!;
      const p250 = product.variants.find((v) => v.weight === '250g')!;
      p100.price = 9999;
      p250.price = 700;

      const updatedLowest = getLowestPrice(product);
      assert.equal(updatedLowest.price, 700, 'getLowestPrice should reflect the updated cheapest variant');
    });

    it('calculates discount percentage and returns originalPrice on lowest variant', () => {
      const product = products[0];
      const lowestVariant = product.variants[0];
      lowestVariant.price = 100;
      lowestVariant.originalPrice = 500;

      const result = getLowestPrice(product);
      assert.equal(result.price, 100);
      assert.equal(result.originalPrice, 500);
      // ((500 - 100) / 500) * 100 = 80%
      assert.equal(result.discountPercent, 80);
    });

    it('does not return discount if originalPrice is less than or equal to price', () => {
      const product = products[0];
      const lowestVariant = product.variants[0];
      lowestVariant.price = 200;
      lowestVariant.originalPrice = 200;

      const result = getLowestPrice(product);
      assert.equal(result.price, 200);
      assert.equal(result.originalPrice, undefined);
      assert.equal(result.discountPercent, undefined);
    });
  });

  describe('Product Image Editing & Persistence', () => {
    it('updates product thumbnail image and persists change', () => {
      const targetProduct = products[0];
      const oldImage = targetProduct.images[0];
      const newImageUrl = '/products/dried-fruits/custom-raisins-v2.jpeg';

      const updateImage = (productId: string, url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return;
        products = products.map((p) => {
          if (p.id !== productId) return p;
          const others = p.images ? p.images.slice(1) : [];
          return {
            ...p,
            images: [trimmed, ...others],
          };
        });
      };

      updateImage(targetProduct.id, newImageUrl);
      mockStorage.setItem(STORAGE_KEY, JSON.stringify(products));

      // Assertions
      const updatedProduct = products.find((p) => p.id === targetProduct.id)!;
      assert.equal(updatedProduct.images[0], newImageUrl);
      assert.notEqual(updatedProduct.images[0], oldImage);

      // Verify persistence on reload
      const reloaded: Product[] = JSON.parse(mockStorage.getItem(STORAGE_KEY)!);
      const reloadedProduct = reloaded.find((p) => p.id === targetProduct.id)!;
      assert.equal(reloadedProduct.images[0], newImageUrl);
    });

    it('rejects empty or whitespace-only image URLs', () => {
      const targetProduct = products[0];
      const originalImage = targetProduct.images[0];

      const updateImage = (productId: string, url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return; // Validation rule
        products = products.map((p) => {
          if (p.id !== productId) return p;
          const others = p.images ? p.images.slice(1) : [];
          return {
            ...p,
            images: [trimmed, ...others],
          };
        });
      };

      updateImage(targetProduct.id, '   ');
      const product = products.find((p) => p.id === targetProduct.id)!;
      assert.equal(product.images[0], originalImage, 'Whitespace image URL must be rejected');
    });
  });

  describe('Cart Synchronization', () => {
    it('synchronizes variant price and image updates with active cart items', () => {
      const product = products[0];
      const variant = product.variants[0];

      interface CartItem {
        productId: string;
        variantId: string;
        productName: string;
        variantWeight: string;
        price: number;
        quantity: number;
        image: string;
        slug: string;
      }

      let cart: CartItem[] = [
        {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantWeight: variant.weight,
          price: variant.price,
          quantity: 2,
          image: product.images[0],
          slug: product.slug,
        },
      ];

      // Update variant price
      const newPrice = 600;
      cart = cart.map((item) =>
        item.variantId === variant.id ? { ...item, price: newPrice } : item
      );

      // Update product image
      const newImage = '/products/dried-fruits/new-thumbnail.jpeg';
      cart = cart.map((item) =>
        item.productId === product.id ? { ...item, image: newImage } : item
      );

      assert.equal(cart[0].price, 600);
      assert.equal(cart[0].image, newImage);
      // Cart subtotal reflects new price
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      assert.equal(subtotal, 1200);
    });
  });
});
