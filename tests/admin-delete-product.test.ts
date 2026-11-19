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
      recordDeletedProductIdentifier('prod-mixed-nuts', 'mixed-nuts');
      const deletedSet = getDeletedProductIdentifiers();

      const filtered = INITIAL_PRODUCTS.filter(
        (p) => !deletedSet.has(p.id) && !deletedSet.has(p.slug)
      );

      const mixedNuts = filtered.find((p) => p.slug === 'mixed-nuts' || p.id === 'prod-mixed-nuts');
      assert.equal(mixedNuts, undefined);
    });

    it('unrecords deleted identifier when re-adding or creating product', () => {
      recordDeletedProductIdentifier('prod-mixed-nuts', 'mixed-nuts');
      let deletedSet = getDeletedProductIdentifiers();
      assert.equal(deletedSet.has('mixed-nuts'), true);

      unrecordDeletedProductIdentifier('mixed-nuts', 'prod-mixed-nuts');
      deletedSet = getDeletedProductIdentifiers();
      assert.equal(deletedSet.has('mixed-nuts'), false);
      assert.equal(deletedSet.has('prod-mixed-nuts'), false);
    });
  });
});
