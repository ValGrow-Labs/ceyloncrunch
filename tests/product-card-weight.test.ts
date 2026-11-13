import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS, getLowestPrice } from '../src/data/products';
import fs from 'node:fs';
import path from 'node:path';

describe('Product Card Weight Display Verification', () => {
  it('getLowestPrice returns the weight corresponding to the lowest priced variant', () => {
    const almonds = INITIAL_PRODUCTS.find((p) => p.slug === 'roasted-almonds')!;
    const lowest = getLowestPrice(almonds);
    assert.strictEqual(lowest.weight, '100g');
    assert.strictEqual(lowest.price, 650);
  });

  it('ProductCard component renders weight with price and variant size indicator', () => {
    const cardPath = path.resolve('src/components/product/ProductCard.tsx');
    const content = fs.readFileSync(cardPath, 'utf-8');

    assert.ok(
      content.includes('displayWeight'),
      'ProductCard must determine and display the product weight'
    );
    assert.ok(
      content.includes('/ {displayWeight}') || content.includes('/ {weight}'),
      'ProductCard must show weight with price'
    );
    assert.ok(
      content.includes('{product.variants.length} sizes'),
      'ProductCard should indicate available variant sizes when multiple exist'
    );
  });
});

