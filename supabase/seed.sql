-- Initial Seed Data for Ceylon Crunch
INSERT INTO site_settings (key, value) VALUES
('store', '{"name": "Ceylon Crunch", "email": "ceyloncrunch26@gmail.com", "phone": "+94 77 944 3867", "location": "Colombo, Sri Lanka"}'::jsonb),
('delivery', '{"freeThreshold": 5000, "standardFee": 450}'::jsonb),
('payments', '{"payhere": true, "cod": true, "bankTransfer": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
