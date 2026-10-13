-- 2026 Migration: Add bank slip verification and waybill tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_slip_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS waybill TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders ((customer_phone));
