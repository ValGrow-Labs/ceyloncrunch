import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Truck,
  Phone,
  Mail,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  Store,
  CreditCard,
  Loader2,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchPublicSiteSettings,
  adminUpdateSiteSettings,
} from '../../lib/supabase';

interface SettingsTabProps {
  showToast: (msg: string) => void;
  onSeedDatabase: () => Promise<void>;
  isSeeding: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  showToast,
  onSeedDatabase,
  isSeeding,
}) => {
  const [storeName, setStoreName] = useState('Ceylon Crunch - Artisan Provisions');
  const [announcementBanner, setAnnouncementBanner] = useState(
    'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed'
  );
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(5000);
  const [standardDeliveryFee, setStandardDeliveryFee] = useState(450);

  // Bank Transfer Credentials
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState('1000482910');
  const [accountName, setAccountName] = useState('Ceylon Crunch (Pvt) Ltd');
  const [branchName, setBranchName] = useState('Colombo Main');

  // Contact Info
  const [contactEmail, setContactEmail] = useState('ceyloncrunch26@gmail.com');
  const [contactPhone, setContactPhone] = useState('+94 77 944 3867');
  const [whatsappNumber, setWhatsappNumber] = useState('+94779443867');

  // Store status
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchPublicSiteSettings().then((res) => {
      if (res) {
        if (res.store_name) setStoreName(res.store_name);
        if (res.announcement_banner) setAnnouncementBanner(res.announcement_banner);
        if (res.free_delivery_threshold !== undefined) setFreeDeliveryThreshold(res.free_delivery_threshold);
        if (res.standard_delivery_fee !== undefined) setStandardDeliveryFee(res.standard_delivery_fee);
        if (res.contact_email) setContactEmail(res.contact_email);
        if (res.contact_phone) setContactPhone(res.contact_phone);
        if (res.whatsapp_number) setWhatsappNumber(res.whatsapp_number);
        if (res.bank_details) {
          // Parse bank details if structured
          const parts = res.bank_details.split('·').map((s) => s.trim());
          if (parts[0]) setBankName(parts[0]);
          if (parts[1]) setAccountNumber(parts[1].replace('Acc:', '').trim());
          if (parts[2]) setAccountName(parts[2]);
        }
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const combinedBank = `${bankName} · Acc: ${accountNumber} · ${accountName} · Branch: ${branchName}`;

    const res = await adminUpdateSiteSettings({
      store_name: storeName,
      announcement_banner: announcementBanner,
      free_delivery_threshold: freeDeliveryThreshold,
      standard_delivery_fee: standardDeliveryFee,
      bank_details: combinedBank,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      whatsapp_number: whatsappNumber,
    });

    setIsSaving(false);
    if (res.success) {
      showToast('Store settings saved permanently to Supabase!');
    } else {
      showToast(`Saved locally: ${res.error || 'Notice'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Store Settings & Configuration</h2>
          <p className="text-xs text-gray-500">
            Configure delivery rates, bank account transfers, and customer contacts
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Store Profile */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>Store Profile & Operations</span>
          </h3>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Store Legal Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Store Currency</label>
            <input
              type="text"
              disabled
              value="LKR — Sri Lankan Rupee (Rs.)"
              className="w-full h-10 px-3 bg-gray-100 rounded-xl border border-gray-200 text-xs text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block">Accepting Customer Orders</span>
              <span className="text-gray-400 text-[11px]">Toggle store maintenance mode</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                showToast(`Store is now ${!isStoreOpen ? 'Open for orders' : 'Closed for maintenance'}`);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isStoreOpen
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              {isStoreOpen ? 'Active (Open)' : 'Paused (Maintenance)'}
            </button>
          </div>
        </div>

        {/* Islandwide Delivery Rates */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-700" />
            <span>Islandwide Delivery Rates</span>
          </h3>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Standard Islandwide Delivery Fee (LKR)
            </label>
            <input
              type="number"
              min="0"
              value={standardDeliveryFee}
              onChange={(e) => setStandardDeliveryFee(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Free Delivery Order Threshold (LKR)
            </label>
            <input
              type="number"
              min="0"
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Orders equal to or above this amount receive 100% free delivery.
            </p>
          </div>
        </div>

        {/* Bank Transfer Credentials */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Bank Deposit Transfer Information (Displayed on Checkout)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Beneficiary Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Branch Name</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Database & Catalog Seeder Tool */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Supabase Catalog Seeder & Sync
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Populate or sync initial 30+ artisan provisions and pack variants directly into PostgreSQL.
              </p>
            </div>
          </div>
          <button
            onClick={onSeedDatabase}
            disabled={isSeeding}
            className="h-9 px-4 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            <span>{isSeeding ? 'Seeding Catalog...' : 'Run Catalog Seeder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
