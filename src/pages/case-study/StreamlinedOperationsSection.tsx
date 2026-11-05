import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Boxes,
  Sliders,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  CreditCard,
  FileCheck,
  Wand2,
  Copy,
  TrendingUp,
} from 'lucide-react';

export const StreamlinedOperationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'cms' | 'ai'>('orders');

  // CMS state
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

  // AI assistant state
  const [selectedProduct, setSelectedProduct] = useState<'cashews' | 'mango' | 'hamper'>('cashews');
  const [aiMode, setAiMode] = useState<'tasting' | 'seo'>('tasting');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const aiOutputs = {
    cashews: {
      tasting:
        'Harvested at peak maturity from heirloom orchards in Kandy, our Jumbo Cashews are meticulously batch-roasted using indirect heat to unlock their buttery, golden crunch. Finished with unrefined sea salt harvested along the southern coast of Sri Lanka.',
      seo:
        'Buy Jumbo Roasted Salted Cashews Online Sri Lanka | Ceylon Crunch\nSlow-roasted Sri Lankan cashews with pure sea salt. Nitrogen-flushed for lasting crunch. Fast islandwide delivery across all 25 districts.',
    },
    mango: {
      tasting:
        'Sun-drenched Karthakolomban mangoes gently dried under controlled solar warmth to preserve natural fruit enzymes and deep, tangy sweetness. Free of sulfur, refined sugars, or artificial colors.',
      seo:
        'Pure Sun-Dried Mango Strips Sri Lanka | 100% Natural | Ceylon Crunch\nEthically harvested organic dried mango in Polonnaruwa. Available in 200g and 500g pouches with islandwide shipping.',
    },
    hamper: {
      tasting:
        'An opulent presentation of Sri Lanka’s finest agricultural treasures. Features our signature Jumbo Cashews, whole roasted almonds, organic sun-dried fruits, and ceremonial spiced chai packaged in handcrafted wooden weave boxes.',
      seo:
        'Luxury Corporate Gift Hampers Colombo | Ceylon Crunch Gifting\nHandcrafted gourmet Sri Lankan gift boxes filled with premium roasted nuts and dried fruits. Includes personalized greeting card.',
    },
  };

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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="operations" className="py-16 sm:py-24 bg-[#FBF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            Operations & AI Automation
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
            Merchant Autonomy. <br />
            <span className="italic font-normal text-[#8B5E3C]">Intelligent</span> Control.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#202820]/80 leading-relaxed font-sans">
            Store operators shouldn't need software developers to update banner announcements, modify prices, verify bank slips, or write product descriptions. We built a unified headless console powered by Gemini AI.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
          {[
            { id: 'orders', label: 'Orders & Payments', icon: ShoppingBag },
            { id: 'inventory', label: 'Variant Stock Sync', icon: Boxes },
            { id: 'cms', label: 'Visual Headless CMS', icon: Sliders },
            { id: 'ai', label: 'Gemini AI Assistant', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
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

        {/* Tab Content Container */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] shadow-[0_16px_40px_rgba(31,61,43,0.06)] p-6 sm:p-8 min-h-[460px]">
          {/* TAB 1: ORDERS & PAYMENTS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EADFD0]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                    Multi-Rail Order Queue & Settlement
                  </h3>
                  <p className="text-xs text-[#202820]/70 font-sans mt-0.5">
                    PayHere Card settlements, Bank transfer slip audits, and Cash on Delivery routing.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#1F3D2B] bg-[#FAF6EF] px-3 py-1.5 rounded-full border border-[#EADFD0]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EADFD0] text-[#8B5E3C] font-mono uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Items & Variant</th>
                      <th className="py-3 px-3">Payment Rail</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADFD0]/60 font-sans">
                    <tr className="hover:bg-[#FAF6EF]/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-semibold text-[#1F3D2B]">#CLN-84920-LK</td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#202820]">Niroshan Perera</div>
                        <div className="text-[10px] text-[#202820]/60 font-mono">+94 77 123 4567</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium">Cashews (500g) × 2</span>
                        <div className="text-[10px] text-[#202820]/60">Gampaha District</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CreditCard className="w-3 h-3" /> PayHere MD5
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1F3D2B]">Rs. 7,600</td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Paid & Ready
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#FAF6EF]/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-semibold text-[#1F3D2B]">#CLN-84921-LK</td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#202820]">Dilrukshi Silva</div>
                        <div className="text-[10px] text-[#202820]/60 font-mono">+94 71 884 9201</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium">Curated Gift Hamper × 1</span>
                        <div className="text-[10px] text-[#202820]/60">Colombo 07</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                          <FileCheck className="w-3 h-3" /> Bank Slip Uploaded
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1F3D2B]">Rs. 12,500</td>
                      <td className="py-3.5 px-3">
                        <button className="text-[11px] font-semibold text-[#8B5E3C] bg-[#8B5E3C]/10 hover:bg-[#8B5E3C]/20 px-2.5 py-1 rounded transition-colors cursor-pointer">
                          Verify Slip ↗
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-[#FAF6EF]/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-semibold text-[#1F3D2B]">#CLN-84922-LK</td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#202820]">Pradeep Jayawardena</div>
                        <div className="text-[10px] text-[#202820]/60 font-mono">+94 76 552 1190</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium">Sun-Dried Mango (200g) × 3</span>
                        <div className="text-[10px] text-[#202820]/60">Kandy City</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200">
                          Cash on Delivery
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1F3D2B]">Rs. 3,450</td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full">
                          Dispatched
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#EADFD0]">
                <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                  Interactive Multi-Variant Stock Controller
                </h3>
                <p className="text-xs text-[#202820]/70 font-sans mt-0.5">
                  Simulate stock updates to observe instantaneous threshold alerts and atomic PostgreSQL row locks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(stockLevels).map(([variant, count]) => {
                  const isLow = count < 10;
                  return (
                    <div
                      key={variant}
                      className={`p-5 rounded-2xl border transition-all ${
                        isLow
                          ? 'border-amber-300 bg-amber-50/50'
                          : 'border-[#EADFD0] bg-[#FAF6EF]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#1F3D2B]">{variant}</span>
                        {isLow && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-mono font-bold text-[#1F3D2B] my-2">{count}</div>
                      <p className="text-[11px] text-[#202820]/70 mb-4 font-sans">
                        Units currently reserved in active shopping carts and warehouse inventory.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockAdjust(variant, -1)}
                          className="flex-1 py-1.5 rounded-lg bg-white border border-[#EADFD0] text-xs font-mono font-bold text-[#202820] hover:bg-neutral-100 cursor-pointer"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleStockAdjust(variant, 5)}
                          className="flex-1 py-1.5 rounded-lg bg-[#1F3D2B] text-white text-xs font-mono font-bold hover:bg-[#162C1F] cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] flex items-center justify-between">
                <span className="text-xs text-[#202820]/80 font-sans">
                  <strong>Atomic Lock Safety:</strong> Every checkout request executes{' '}
                  <code className="text-[11px] font-mono text-[#8B5E3C] bg-white px-1.5 py-0.5 rounded border border-[#EADFD0]">
                    SELECT stock FROM product_variants FOR UPDATE
                  </code>
                  , preventing race conditions.
                </span>
                <span className="text-xs font-mono text-emerald-700 font-bold hidden sm:inline">
                  ✓ Protected
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL HEADLESS CMS */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#EADFD0]">
                <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                  Live Storefront Visual Headless CMS
                </h3>
                <p className="text-xs text-[#202820]/70 font-sans mt-0.5">
                  Store managers can update announcement banners, delivery tariffs, and promotions without code changes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#8B5E3C] uppercase tracking-wider mb-1 font-semibold">
                      Storewide Announcement Banner
                    </label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] text-xs font-sans text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8B5E3C] uppercase tracking-wider mb-1 font-semibold">
                      Base District Delivery Tariff (LKR)
                    </label>
                    <input
                      type="number"
                      value={deliveryTariff}
                      onChange={(e) => setDeliveryTariff(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] text-xs font-sans text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>

                  <button
                    onClick={handleSaveCMS}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] cursor-pointer transition-colors"
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5 text-[#D9A441]" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Published Live!' : 'Publish to Storefront'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block font-bold">
                    Live Client Storefront Preview
                  </span>
                  {/* Mock Storefront Ribbon */}
                  <div className="bg-[#1F3D2B] text-white text-[11px] font-sans text-center py-2 px-3 rounded-lg shadow-sm">
                    {announcementText}
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#EADFD0] text-xs space-y-1">
                    <div className="flex justify-between text-[#202820]">
                      <span>Colombo Standard Delivery:</span>
                      <span className="font-mono font-bold text-[#1F3D2B]">Rs. {deliveryTariff}</span>
                    </div>
                    <div className="flex justify-between text-[#202820]/70 text-[11px]">
                      <span>Free Shipping Threshold:</span>
                      <span className="font-mono">Rs. 5,000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI AI ASSISTANT */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#EADFD0]">
                <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                  Google Gemini 2.0 AI Culinary Copy Engine
                </h3>
                <p className="text-xs text-[#202820]/70 font-sans mt-0.5">
                  Generates artisanal tasting notes, culinary food pairings, and SEO metadata from raw ingredients.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#8B5E3C] uppercase tracking-wider mb-2 font-semibold">
                      Select Farm Product
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cashews', label: 'Cashews' },
                        { id: 'mango', label: 'Dried Mango' },
                        { id: 'hamper', label: 'Gift Hamper' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedProduct(item.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                            selectedProduct === item.id
                              ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                              : 'bg-white text-[#202820] border-[#EADFD0] hover:bg-[#FAF6EF]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8B5E3C] uppercase tracking-wider mb-2 font-semibold">
                      Generation Objective
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAiMode('tasting')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                          aiMode === 'tasting'
                            ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                            : 'bg-white text-[#202820] border-[#EADFD0] hover:bg-[#FAF6EF]'
                        }`}
                      >
                        Tasting Story
                      </button>
                      <button
                        onClick={() => setAiMode('seo')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                          aiMode === 'seo'
                            ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                            : 'bg-white text-[#202820] border-[#EADFD0] hover:bg-[#FAF6EF]'
                        }`}
                      >
                        SEO Meta
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] cursor-pointer transition-all"
                  >
                    <Wand2 className={`w-3.5 h-3.5 text-[#D9A441] ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Generating with Gemini...' : 'Generate Artisanal Copy'}</span>
                  </button>
                </div>

                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] font-bold">
                      Gemini 2.0 Synthesis Output
                    </span>
                    <button
                      onClick={() => handleCopy(aiOutputs[selectedProduct][aiMode])}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8B5E3C] hover:text-[#1F3D2B] cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-[#EADFD0] text-xs font-sans text-[#202820] leading-relaxed whitespace-pre-line">
                    {aiOutputs[selectedProduct][aiMode]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
