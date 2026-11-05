import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Sliders,
  Users,
  TrendingUp,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
} from 'lucide-react';

export const AdminDashboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'cms' | 'team'>(
    'analytics'
  );

  // CMS demonstration state
  const [announcementText, setAnnouncementText] = useState<string>(
    'Free islandwide delivery on all artisanal orders over Rs. 5,000'
  );
  const [deliveryTariff, setDeliveryTariff] = useState<string>('350');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Inventory demo state
  const [stockLevels, setStockLevels] = useState<{ [key: string]: number }>({
    'Cashew 100g': 64,
    'Cashew 250g': 42,
    'Cashew 500g': 18,
    'Cashew 1kg': 3,
  });

  const handleStockAdjust = (name: string, delta: number) => {
    setStockLevels((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const handleSaveCMS = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section id="admin" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            11 // Merchant Console
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Giving the Business <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Control</span> Back.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Store operators shouldn't have to call software developers to change a product price, update a banner, or verify a payment slip. ValGrow Labs built a headless command console that puts full autonomy into the hands of the merchant.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
          {[
            { id: 'analytics', label: 'Analytics Dashboard', icon: TrendingUp },
            { id: 'orders', label: 'Order Management', icon: ShoppingBag },
            { id: 'inventory', label: 'Variant Inventory', icon: Boxes },
            { id: 'cms', label: 'Visual Headless CMS', icon: Sliders },
            { id: 'team', label: 'Team RBAC Access', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F3D2B] text-white shadow-sm'
                    : 'bg-white text-[#202820] border border-[#EADFD0] hover:bg-[#FAF6EF]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Realistic Dashboard Mockup Container */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] shadow-[0_20px_50px_rgba(31,61,43,0.06)] p-6 sm:p-10 min-h-[500px]">
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Revenue (LKR)',
                    value: 'Rs. 1,420,500',
                    change: '+38% vs last month',
                    positive: true,
                  },
                  {
                    label: 'Orders Fulfilled',
                    value: '342 Orders',
                    change: '+42% growth',
                    positive: true,
                  },
                  {
                    label: 'Average Order Value',
                    value: 'Rs. 4,153',
                    change: '+16% via Hampers',
                    positive: true,
                  },
                  {
                    label: 'Patron Retention Rate',
                    value: '68%',
                    change: 'Repeat snackers',
                    positive: true,
                  },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0]">
                    <span className="text-[11px] font-mono text-[#8B5E3C] uppercase block mb-1">
                      {kpi.label}
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#1F3D2B] block">
                      {kpi.value}
                    </span>
                    <span className="text-[11px] font-medium text-[#2E7D4F] mt-1 block">
                      {kpi.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Volume Chart Mockup */}
              <div className="p-6 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                    Monthly Sales & Volume Trajectory (2026)
                  </h4>
                  <span className="text-xs font-mono text-[#8B5E3C]">Demonstration Data</span>
                </div>
                <div className="h-44 flex items-end gap-3 pt-6 border-b border-[#EADFD0]">
                  {[35, 48, 62, 78, 65, 88, 92, 110, 125, 140, 155, 180].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div
                        className="w-full bg-[#1F3D2B] group-hover:bg-[#D9A441] rounded-t-md transition-colors"
                        style={{ height: `${h}px` }}
                      />
                      <span className="text-[9px] font-mono text-[#8B5E3C]">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Live Orders Dispatch Console
                </h4>
                <span className="text-xs font-mono text-[#2E7D4F] bg-[#2E7D4F]/10 px-3 py-1 rounded-full">
                  14 Pending Orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#EADFD0] text-[#8B5E3C] font-mono uppercase text-[10px]">
                      <th className="py-3 px-2">Order ID</th>
                      <th className="py-3 px-2">Customer</th>
                      <th className="py-3 px-2">District</th>
                      <th className="py-3 px-2">Items</th>
                      <th className="py-3 px-2">Total</th>
                      <th className="py-3 px-2">Payment</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF6EF]">
                    {[
                      {
                        id: 'CC-842915',
                        name: 'Samantha Perera',
                        district: 'Colombo',
                        items: 'Cashews (250g) x 2',
                        total: 'Rs. 4,050',
                        method: 'PayHere (Card)',
                        payStatus: 'Verified',
                        orderStatus: 'Dispatched',
                      },
                      {
                        id: 'CC-842914',
                        name: 'Nalinda Jayawardena',
                        district: 'Kandy',
                        items: 'Gift Hamper (1.2kg)',
                        total: 'Rs. 8,950',
                        method: 'Bank Slip',
                        payStatus: 'Verified',
                        orderStatus: 'Packed',
                      },
                      {
                        id: 'CC-842913',
                        name: 'Dilini Fernando',
                        district: 'Galle',
                        items: 'Dried Mango (200g) x 3',
                        total: 'Rs. 4,050',
                        method: 'Cash on Delivery',
                        payStatus: 'Pending (COD)',
                        orderStatus: 'Confirmed',
                      },
                      {
                        id: 'CC-842912',
                        name: 'Rohan de Silva',
                        district: 'Jaffna',
                        items: 'Mixed Nuts (500g)',
                        total: 'Rs. 3,950',
                        method: 'PayHere (Card)',
                        payStatus: 'Verified',
                        orderStatus: 'Delivered',
                      },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF6EF]/60">
                        <td className="py-3 px-2 font-mono font-bold text-[#1F3D2B]">{row.id}</td>
                        <td className="py-3 px-2 font-medium text-[#202820]">{row.name}</td>
                        <td className="py-3 px-2 text-[#8B5E3C]">{row.district}</td>
                        <td className="py-3 px-2 text-[#202820]/80">{row.items}</td>
                        <td className="py-3 px-2 font-mono font-bold text-[#1F3D2B]">{row.total}</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EADFD0] text-[10px] font-mono text-[#1F3D2B]">
                            {row.method}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.orderStatus === 'Delivered'
                                ? 'bg-[#2E7D4F]/10 text-[#2E7D4F]'
                                : row.orderStatus === 'Dispatched'
                                ? 'bg-[#1F3D2B] text-[#D9A441]'
                                : 'bg-[#D9A441]/10 text-[#8B5E3C]'
                            }`}
                          >
                            {row.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="px-2.5 py-1 rounded-md bg-[#FAF6EF] hover:bg-[#1F3D2B] hover:text-white transition-colors text-[10px] font-medium text-[#1F3D2B]">
                            Print Waybill
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY CONTROLLER */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    Multi-Variant Stock Adjuster
                  </h4>
                  <p className="text-xs text-[#8B5E3C]">
                    Simulate real-time stock deductions and low-stock warning triggers:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stockLevels).map(([variant, count]) => {
                  const isLow = count < 10;
                  return (
                    <div
                      key={variant}
                      className={`p-5 rounded-2xl border transition-all ${
                        isLow
                          ? 'bg-[#B3261E]/5 border-[#B3261E]/30'
                          : 'bg-[#FAF6EF] border-[#EADFD0]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-sm font-bold text-[#1F3D2B]">
                          {variant}
                        </span>
                        {isLow ? (
                          <span className="text-[10px] font-bold text-[#B3261E] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#2E7D4F]">Healthy</span>
                        )}
                      </div>

                      <div className="my-3 text-center">
                        <span className="font-mono text-3xl font-bold text-[#1F3D2B]">
                          {count}
                        </span>
                        <span className="block text-[10px] text-[#8B5E3C] uppercase font-mono mt-0.5">
                          Units in Warehouse
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#EADFD0]/60">
                        <button
                          onClick={() => handleStockAdjust(variant, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EADFD0] text-sm font-bold text-[#1F3D2B] hover:bg-[#EADFD0] transition-colors"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleStockAdjust(variant, 5)}
                          className="px-3 py-1 rounded-lg bg-white border border-[#EADFD0] text-xs font-bold text-[#1F3D2B] hover:bg-[#EADFD0] transition-colors"
                        >
                          +5 Stock
                        </button>
                        <button
                          onClick={() => handleStockAdjust(variant, 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EADFD0] text-sm font-bold text-[#1F3D2B] hover:bg-[#EADFD0] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL HEADLESS CMS */}
          {activeTab === 'cms' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    Visual Headless Site Settings (No-Code CMS)
                  </h4>
                  <p className="text-xs text-[#8B5E3C]">
                    Changes here immediately update the customer-facing storefront via Supabase real-time sync.
                  </p>
                </div>

                <button
                  onClick={handleSaveCMS}
                  className="px-4 py-2 rounded-xl bg-[#1F3D2B] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#162C1F] transition-all cursor-pointer shadow-sm"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-[#D9A441]" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Settings Saved Live!' : 'Publish Changes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 font-sans">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
                      Storefront Announcement Ribbon Text
                    </label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
                      Standard Western Province Courier Tariff (LKR)
                    </label>
                    <input
                      type="text"
                      value={deliveryTariff}
                      onChange={(e) => setDeliveryTariff(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] font-mono"
                    />
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-3">
                  <span className="text-[10px] font-mono text-[#8B5E3C] uppercase block">
                    Customer Storefront Preview:
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#1F3D2B] text-[#D9A441] text-xs font-medium text-center shadow-xs">
                    {announcementText}
                  </div>
                  <div className="text-[11px] text-[#202820]/75 font-sans">
                    Delivery tariff active: <strong className="font-mono text-[#1F3D2B]">Rs. {deliveryTariff}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEAM RBAC */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    Role-Based Access Control (RBAC)
                  </h4>
                  <p className="text-xs text-[#8B5E3C]">
                    Manage store personnel permissions mapped to Supabase Authentication.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    role: 'Admin (Owner)',
                    desc: 'Full financial authority, billing, team member invites, and live database migrations.',
                    permissions: ['View Financial Revenue', 'Refund Orders', 'Edit Theme & CMS', 'Manage Team'],
                  },
                  {
                    role: 'Store Manager',
                    desc: 'Manage day-to-day order processing, product catalogs, prices, and inventory stocks.',
                    permissions: ['Edit Product Prices', 'Update Stock Levels', 'Dispatch Orders', 'Verify Bank Slips'],
                  },
                  {
                    role: 'Operations Staff',
                    desc: 'Warehouse fulfillment, package packing, waybill printing, and customer tracking queries.',
                    permissions: ['Print Waybills', 'Mark Orders as Packed', 'View Customer Addresses', 'Read Only Catalog'],
                  },
                ].map((item) => (
                  <div key={item.role} className="p-6 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] flex flex-col justify-between">
                    <div>
                      <span className="font-serif text-base font-bold text-[#1F3D2B] block mb-1">
                        {item.role}
                      </span>
                      <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                        {item.desc}
                      </p>
                      <ul className="space-y-1.5">
                        {item.permissions.map((p) => (
                          <li key={p} className="text-[11px] text-[#1F3D2B] flex items-center gap-1.5 font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
