import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseWeightInGrams, sortVariantsByWeight, ProductVariant } from '../src/data/products.ts';

describe('Weight Variant Synchronization & Sorting', () => {
  describe('Weight Parsing to Grams', () => {
    it('correctly parses standard gram strings', () => {
      assert.equal(parseWeightInGrams('100g'), 100);
      assert.equal(parseWeightInGrams('250g'), 250);
      assert.equal(parseWeightInGrams('500g'), 500);
      assert.equal(parseWeightInGrams('50g'), 50);
      assert.equal(parseWeightInGrams('250 g'), 250);
      assert.equal(parseWeightInGrams('500 grams'), 500);
    });

    it('correctly parses kilogram strings into grams', () => {
      assert.equal(parseWeightInGrams('1kg'), 1000);
      assert.equal(parseWeightInGrams('1KG'), 1000);
      assert.equal(parseWeightInGrams('1 kg'), 1000);
      assert.equal(parseWeightInGrams('1.5kg'), 1500);
      assert.equal(parseWeightInGrams('2kg'), 2000);
    });

    it('correctly extracts weight from descriptive pack names', () => {
      assert.equal(parseWeightInGrams('400g Keepsake Box'), 400);
      assert.equal(parseWeightInGrams('800g Family Feast Box'), 800);
    });
  });

  describe('Automatic Weight Sorting (100g → 250g → 500g → 1kg)', () => {
    it('sorts jumbled variants in strictly ascending weight order', () => {
      const jumbled: ProductVariant[] = [
        { id: 'v-500', weight: '500g', price: 2250, stock: 15 },
        { id: 'v-1k', weight: '1kg', price: 4300, stock: 10 },
        { id: 'v-100', weight: '100g', price: 550, stock: 25 },
        { id: 'v-250', weight: '250g', price: 1200, stock: 20 },
      ];

      const sorted = sortVariantsByWeight(jumbled);

      assert.deepEqual(
        sorted.map((v) => v.weight),
        ['100g', '250g', '500g', '1kg']
      );
      assert.deepEqual(
        sorted.map((v) => v.price),
        [550, 1200, 2250, 4300]
      );
    });

    it('correctly re-sorts when an existing variant weight is modified', () => {
      let variants: ProductVariant[] = [
        { id: 'v-100', weight: '100g', price: 550, stock: 25 },
        { id: 'v-250', weight: '250g', price: 1200, stock: 20 },
        { id: 'v-500', weight: '500g', price: 2250, stock: 15 },
      ];

      // Admin updates v-250 weight to 750g
      variants = variants.map((v) => (v.id === 'v-250' ? { ...v, weight: '750g' } : v));
      const reSorted = sortVariantsByWeight(variants);

      assert.deepEqual(
        reSorted.map((v) => v.weight),
        ['100g', '500g', '750g']
      );
      assert.equal(reSorted[2].id, 'v-250');
    });

    it('correctly sorts when a new 50g variant is added', () => {
      const initial: ProductVariant[] = [
        { id: 'v-100', weight: '100g', price: 550, stock: 25 },
        { id: 'v-250', weight: '250g', price: 1200, stock: 20 },
        { id: 'v-1k', weight: '1kg', price: 4300, stock: 10 },
      ];

      const added = [
        ...initial,
        { id: 'v-50', weight: '50g', price: 300, stock: 30 },
      ];

      const sorted = sortVariantsByWeight(added);
      assert.deepEqual(
        sorted.map((v) => v.weight),
        ['50g', '100g', '250g', '1kg']
      );
    });
  });

  describe('Mobile Menu Search Bar Verification', () => {
    it('verifies search bar is placed directly below Customer Account in Header.tsx', () => {
      const headerCode = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

      const accountIndex = headerCode.indexOf('Customer Account Quick Card');
      const searchIndex = headerCode.indexOf('Mobile Menu Search Bar');
      const menuLinksIndex = headerCode.indexOf('Menu Links');

      assert.ok(accountIndex > 0, 'Customer Account Quick Card must exist');
      assert.ok(searchIndex > 0, 'Mobile Menu Search Bar must exist');
      assert.ok(menuLinksIndex > 0, 'Menu Links must exist');

      // Search bar must be after Customer Account and before Menu Links
      assert.ok(
        searchIndex > accountIndex,
        'Search bar must be positioned below Customer Account'
      );
      assert.ok(
        searchIndex < menuLinksIndex,
        'Search bar must be positioned above category menu links'
      );

      // Verifies search functionality
      assert.ok(headerCode.includes('handleMobileSearchSubmit'), 'Must have submit handler');
      assert.ok(headerCode.includes('mobileSearchQuery'), 'Must have query state');
      assert.ok(headerCode.includes('navigate(`/shop?q='), 'Must navigate to /shop with query');
    });
  });
});

