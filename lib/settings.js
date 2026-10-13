import { getSupabaseAdmin } from './supabase-server';

export const DEFAULT_SETTINGS = {
  store: {
    name: 'Ceylon Crunch',
    tagline: 'From Nature To Your Doorstep',
    email: 'ceyloncrunch26@gmail.com',
    phone: '+94 77 944 3867',
    address: 'Colombo, Sri Lanka',
  },
  announcement: {
    enabled: true,
    text: 'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed',
  },
  delivery: {
    freeThreshold: 5000,
    standardFee: 450,
    estimatedDays: '1-3 Business Days Across Sri Lanka',
  },
  payments: {
    payhereEnabled: true,
    codEnabled: true,
    bankTransferEnabled: true,
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'Ceylon Crunch (Pvt) Ltd',
    accountNumber: '1000482910',
    branch: 'Colombo 03',
  },
};

export async function getSiteSettings() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error || !data) return DEFAULT_SETTINGS;
    return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), { ...DEFAULT_SETTINGS });
  } catch {
    return DEFAULT_SETTINGS;
  }
}
