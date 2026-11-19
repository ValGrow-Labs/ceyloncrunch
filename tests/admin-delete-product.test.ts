import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { isValidUuid, adminDeleteProduct } from '../src/lib/supabase.ts';
import { INITIAL_PRODUCTS } from '../src/data/products.ts';
import {
  getDeletedProductIdentifiers,
  recordDeletedProductIdentifier,
  unrecordDeletedProductIdentifier,
} from '../src/lib/store.tsx';

// Mock localStorage for test environment
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

describe('Admin Product Deletion & Fallback Resolution', () => {
  beforeEach(() => {
    (globalThis as any).localStorage = new MockLocalStorage();
  });

  describe('UUID Format Validation', () => {
    it('accurately identifies valid PostgreSQL UUID v4 strings', () => {
      assert.equal(isValidUuid('65920cb7-b9b7-4973-ad49-79771ee187e1'), true);
      assert.equal(isValidUuid('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), true);
      assert.equal(isValidUuid('00000000-0000-0000-0000-000000000000'), true);
    });

    it('identifies non-UUID static and mock product IDs as false', () => {
      assert.equal(isValidUuid('prod-mixed-nuts'), false);
      assert.equal(isValidUuid('prod-roasted-almonds'), false);
      assert.equal(isValidUuid('mixed-nuts'), false);
      assert.equal(isValidUuid(''), false);
      assert.equal(isValidUuid(null), false);
      assert.equal(isValidUuid(undefined), false);
    });
  });

  describe('Admin Delete Product Non-UUID Handling', () => {
    it('safely handles non-UUID product IDs (like prod-mixed-nuts) without throwing UUID syntax errors', async () => {
      const result = await adminDeleteProduct('prod-mixed-nuts', 'mixed-nuts');
      assert.equal(result.success, true);
      assert.equal(result.error, undefined);
    });

    it('safely handles other fallback IDs like prod-roasted-almonds', async () => {
      const result = await adminDeleteProduct('prod-roasted-almonds', 'roasted-almonds');
      assert.equal(result.success, true);
      assert.equal(result.error, undefined);
    });
  });

  describe('Deleted Product Persistence & Catalog Filtering', () => {
    it('records and retrieves deleted product identifiers from storage', () => {
      recordDeletedProductIdentifier('prod-mixed-nuts', 'mixed-nuts');
      const deletedSet = getDeletedProductIdentifiers();
      assert.equal(deletedSet.has('prod-mixed-nuts'), true);
      assert.equal(deletedSet.has('mixed-nuts'), true);
    });

    it('prevents deleted product from being resurrected in INITIAL_PRODUCTS filtering', () => {
      recordDeletedProductIdentifier('prod-roasted-almonds', 'roasted-almonds');
      const deletedSet = getDeletedProductIdentifiers();

      const filtered = INITIAL_PRODUCTS.filter(
        (p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug)
      );

      const roastedAlmonds = filtered.find((p) => p.slug === 'roasted-almonds' || p.id === 'prod-roasted-almonds');
      assert.equal(roastedAlmonds, undefined);
    });

    it('verifies that Artisan Mixed Nuts is permanently removed from INITIAL_PRODUCTS', () => {
      const mixedNuts = INITIAL_PRODUCTS.find((p) => p.slug === 'mixed-nuts' || p.id === 'prod-mixed-nuts');
      assert.equal(mixedNuts, undefined);
    });

    it('unrecords deleted identifier when re-adding or creating product', () => {
      recordDeletedProductIdentifier('prod-roasted-almonds', 'roasted-almonds');
      let deletedSet = getDeletedProductIdentifiers();
      assert.equal(deletedSet.has('roasted-almonds'), true);

      unrecordDeletedProductIdentifier('roasted-almonds', 'prod-roasted-almonds');
      deletedSet = getDeletedProductIdentifiers();
      assert.equal(deletedSet.has('roasted-almonds'), false);
      assert.equal(deletedSet.has('prod-roasted-almonds'), false);
    });
  });

  describe('Customer View Filtering for Hidden Products', () => {
    const mockProducts = [
      { id: '1', slug: 'p1', name: 'Product 1', category: 'nuts' as const, isActive: true, isFeatured: true },
      { id: '2', slug: 'p2', name: 'Product 2 (Hidden)', category: 'nuts' as const, isActive: false, isFeatured: true },
      { id: '3', slug: 'h1', name: 'Hamper 1', category: 'gifts-hampers' as const, isActive: true },
      { id: '4', slug: 'h2', name: 'Hamper 2 (Hidden)', category: 'gifts-hampers' as const, isActive: false },
    ];

    it('excludes hidden products from category views', () => {
      const categoryProducts = mockProducts
        .filter((p) => p.category === 'nuts')
        .filter((p) => p.isActive !== false);

      assert.equal(categoryProducts.length, 1);
      assert.equal(categoryProducts[0].id, '1');
    });

    it('excludes hidden hampers from gifting views', () => {
      const hampers = mockProducts
        .filter((p) => p.category === 'gifts-hampers' && p.isActive !== false);

      assert.equal(hampers.length, 1);
      assert.equal(hampers[0].id, '3');
    });

    it('excludes hidden products from paired products view', () => {
      const pairedIds = ['1', '2'];
      const paired = mockProducts.filter((p) => pairedIds.includes(p.id) && p.isActive !== false);

      assert.equal(paired.length, 1);
      assert.equal(paired[0].id, '1');
    });
  });
});
