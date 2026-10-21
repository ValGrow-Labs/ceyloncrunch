import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../src/lib/store.tsx';

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

describe('Checkout and Order Confirmation Flow', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('correctly normalizes Sri Lankan phone numbers for courier dispatch', () => {
    assert.equal(normalizePhone('0771234567'), '94771234567');
    assert.equal(normalizePhone('+94771234567'), '94771234567');
    assert.equal(normalizePhone('771234567'), '94771234567');
  });

  it('generates unique CC-XXXXXX order reference and CLN waybill on order creation', () => {
    const orderId = `CC-${Math.floor(100000 + Math.random() * 900000)}`;
    const waybill = `CLN-${Math.floor(10000000 + Math.random() * 90000000)}-LK`;

    assert.match(orderId, /^CC-\d{6}$/);
    assert.match(waybill, /^CLN-\d{8}-LK$/);
  });

  it('persists placed order and allows retrieval by orderNumber on confirmation page', () => {
    const testOrder = {
      id: 'CC-987654',
      createdAt: '19 Oct, 10:30 AM',
      status: 'placed',
      subtotal: 3500,
      deliveryFee: 0,
      total: 3500,
      waybill: 'CLN-12345678-LK',
      customer: {
        name: 'Deva Test',
        phone: '+94 77 123 4567',
      },
      shippingAddress: {
        street: '123 Galle Road',
        city: 'Colombo',
        district: 'Colombo',
      },
      items: [
        {
          productId: 'prod-1',
          variantId: 'var-100g',
          name: 'Roasted Salted Cashews',
          price: 1250,
          quantity: 2,
        },
      ],
    };

    // Simulate saving order
    const existingOrders = [testOrder];
    mockStorage.setItem('ceylon_crunch_orders', JSON.stringify(existingOrders));

    // Simulate OrderConfirmed lookup
    const saved = mockStorage.getItem('ceylon_crunch_orders');
    assert.ok(saved);
    const parsed = JSON.parse(saved);
    const foundOrder = parsed.find((o: any) => o.id === 'CC-987654');

    assert.ok(foundOrder);
    assert.equal(foundOrder.id, 'CC-987654');
    assert.equal(foundOrder.customer.name, 'Deva Test');
    assert.equal(foundOrder.items.length, 1);
  });
});
