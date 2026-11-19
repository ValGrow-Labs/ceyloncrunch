import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { placeOrderRpc } from '../src/lib/supabase.ts';

describe('Place Order RPC Function Overload Handling', () => {
  it('safely handles guest order payload (without user_id) without PGRST203 ambiguous candidate error', async () => {
    // Call placeOrderRpc with invalid/dummy variant to check parameter resolution without creating real orders
    const res = await placeOrderRpc({
      customer_name: 'Test Customer',
      customer_phone: '0771234567',
      shipping_street: '123 Galle Rd',
      shipping_city: 'Colombo',
      shipping_district: 'Colombo',
      payment_method: 'cod',
      items: [
        { variant_id: '00000000-0000-0000-0000-000000000000', quantity: 1 }
      ],
      user_id: undefined, // Guest checkout
    });

    // The call should NOT fail with PGRST203 "Could not choose the best candidate function"
    if (!res.success && res.error) {
      assert.equal(res.error.includes('best candidate function'), false);
      assert.equal(res.error.includes('PGRST203'), false);
    }
  });

  it('safely handles authenticated customer order payload (with user_id)', async () => {
    const res = await placeOrderRpc({
      customer_name: 'Test Customer',
      customer_phone: '0771234567',
      shipping_street: '123 Galle Rd',
      shipping_city: 'Colombo',
      shipping_district: 'Colombo',
      payment_method: 'cod',
      items: [
        { variant_id: '00000000-0000-0000-0000-000000000000', quantity: 1 }
      ],
      user_id: '11111111-1111-1111-1111-111111111111',
    });

    if (!res.success && res.error) {
      assert.equal(res.error.includes('best candidate function'), false);
      assert.equal(res.error.includes('PGRST203'), false);
    }
  });
});
