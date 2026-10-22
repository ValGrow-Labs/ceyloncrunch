import React, { useState } from 'react';
import {
  Banknote,
  Building2,
  CreditCard,
  Check,
} from 'lucide-react';

interface PaymentSettings {
  cod: {
    enabled: boolean;
    label: string;
    description: string;
    extra_fee: number | string;
  };
  bank_transfer: {
    enabled: boolean;
    label: string;
    description: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    branch: string;
    instructions: string;
  };
  payhere: {
    enabled: boolean;
    label: string;
    description: string;
    merchant_id: string;
    secret: string;
    sandbox: boolean;
  };
}

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  cod: {
    enabled: true,
    label: 'Cash on Delivery',
    description: 'Pay cash when your order arrives',
    extra_fee: 0,
  },
  bank_transfer: {
    enabled: true,
    label: 'Bank Transfer',
    description: 'Transfer to our bank account and upload the slip',
    bank_name: 'Bank of Ceylon',
    account_name: 'Ceylon Crunch (Pvt) Ltd',
    account_number: '0000000000',
    branch: 'Colombo',
    instructions:
      'Please transfer the exact order amount and WhatsApp the slip to +94 XX XXX XXXX. Orders are processed after payment confirmation.',
  },
  payhere: {
    enabled: true,
    label: 'Pay Online',
    description: 'Credit/Debit card, Internet Banking via PayHere',
    merchant_id: '',
    secret: '',
    sandbox: true,
  },
};

interface PaymentsTabProps {
  showToast: (msg: string) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_payment_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PAYMENT_SETTINGS;
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem('ceylon_crunch_payment_settings', JSON.stringify(settings));
    } catch {}

    // Also attempt backend settings route if available
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'payments', value: settings }),
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsSaving(false);
      showToast('Payment methods saved successfully!');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
          Payment Methods
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
          Enable or disable payment options and configure credentials
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* CARD 1: Cash on Delivery */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
          {/* Header with Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="text-xl" role="img" aria-label="Cash">💵</span>
              <h2 className="font-bold text-stone-900 text-base">Cash on Delivery</h2>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  cod: { ...settings.cod, enabled: !settings.cod.enabled },
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                settings.cod.enabled ? 'bg-[#1E4E35]' : 'bg-stone-200'
              }`}
              aria-label="Toggle Cash on Delivery"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.cod.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4">
            {/* Display Label */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Display Label
              </label>
              <input
                type="text"
                value={settings.cod.label}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, label: e.target.value },
                  })
                }
                placeholder="Cash on Delivery"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Description (shown to customer) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Description (shown to customer)
              </label>
              <input
                type="text"
                value={settings.cod.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, description: e.target.value },
                  })
                }
                placeholder="Pay cash when your order arrives"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Extra Fee */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Extra Fee (LKR, 0 = none)
              </label>
              <input
                type="number"
                value={settings.cod.extra_fee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cod: { ...settings.cod, extra_fee: e.target.value },
                  })
                }
                placeholder="0"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Bank Transfer */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
          {/* Header with Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="text-xl" role="img" aria-label="Bank">🏦</span>
              <h2 className="font-bold text-stone-900 text-base">Bank Transfer</h2>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  bank_transfer: {
                    ...settings.bank_transfer,
                    enabled: !settings.bank_transfer.enabled,
                  },
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                settings.bank_transfer.enabled ? 'bg-[#1E4E35]' : 'bg-stone-200'
              }`}
              aria-label="Toggle Bank Transfer"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.bank_transfer.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4">
            {/* Display Label */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Display Label
              </label>
              <input
                type="text"
                value={settings.bank_transfer.label}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bank_transfer: { ...settings.bank_transfer, label: e.target.value },
                  })
                }
                placeholder="Bank Transfer"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={settings.bank_transfer.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bank_transfer: {
                      ...settings.bank_transfer,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Transfer to our bank account and upload the slip"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Bank Name & Account Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={settings.bank_transfer.bank_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_transfer: {
                        ...settings.bank_transfer,
                        bank_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Bank of Ceylon"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  value={settings.bank_transfer.account_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_transfer: {
                        ...settings.bank_transfer,
                        account_name: e.target.value,
                      },
                    })
                  }
                  placeholder="Ceylon Crunch (Pvt) Ltd"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>
            </div>

            {/* Account Number & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings.bank_transfer.account_number}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_transfer: {
                        ...settings.bank_transfer,
                        account_number: e.target.value,
                      },
                    })
                  }
                  placeholder="0000000000"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Branch
                </label>
                <input
                  type="text"
                  value={settings.bank_transfer.branch}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_transfer: {
                        ...settings.bank_transfer,
                        branch: e.target.value,
                      },
                    })
                  }
                  placeholder="Colombo"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>
            </div>

            {/* Customer Instructions */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Customer Instructions
              </label>
              <textarea
                rows={3}
                value={settings.bank_transfer.instructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bank_transfer: {
                      ...settings.bank_transfer,
                      instructions: e.target.value,
                    },
                  })
                }
                placeholder="Please transfer the exact order amount and WhatsApp the slip to +94 XX XXX XXXX. Orders are processed after payment confirmation."
                className="w-full p-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: PayHere (Online Payment) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
          {/* Header with Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="text-xl" role="img" aria-label="Card">💳</span>
              <h2 className="font-bold text-stone-900 text-base">PayHere (Online Payment)</h2>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  payhere: {
                    ...settings.payhere,
                    enabled: !settings.payhere.enabled,
                  },
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                settings.payhere.enabled ? 'bg-[#1E4E35]' : 'bg-stone-200'
              }`}
              aria-label="Toggle PayHere"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.payhere.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4">
            {/* Display Label */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Display Label
              </label>
              <input
                type="text"
                value={settings.payhere.label}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payhere: { ...settings.payhere, label: e.target.value },
                  })
                }
                placeholder="Pay Online"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={settings.payhere.description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payhere: { ...settings.payhere, description: e.target.value },
                  })
                }
                placeholder="Credit/Debit card, Internet Banking via PayHere"
                className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
              />
            </div>

            {/* Merchant ID & Secret Key */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={settings.payhere.merchant_id}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payhere: {
                        ...settings.payhere,
                        merchant_id: e.target.value,
                      },
                    })
                  }
                  placeholder="PayHere Merchant ID"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={settings.payhere.secret}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payhere: {
                        ...settings.payhere,
                        secret: e.target.value,
                      },
                    })
                  }
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>
            </div>

            {/* Sandbox Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-normal text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={settings.payhere.sandbox}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payhere: {
                        ...settings.payhere,
                        sandbox: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-[#1E4E35] accent-[#1E4E35] focus:ring-[#1E4E35] cursor-pointer"
                />
                <span>Use Sandbox Mode (for testing — disable in production)</span>
              </label>
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-2.5 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
