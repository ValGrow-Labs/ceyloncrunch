import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Star,
  Gift,
  Truck,
  CreditCard,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

export const StreamlinedExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'variants' | 'checkout' | 'tracking'>('variants');
  const [selectedWeight, setSelectedWeight] = useState<'100g' | '250g' | '500g' | '1kg'>('250g');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [phoneInput, setPhoneInput] = useState<string>('077 123 4567');
  const [trackingStep, setTrackingStep] = useState<number>(3); // Dispatched

  const variantData = {
    '100g': { price: 'Rs. 850', stock: 64, badge: 'Pocket Snack' },
    '250g': { price: 'Rs. 1,850', stock: 42, badge: 'Popular Jar' },
    '500g': { price: 'Rs. 3,600', stock: 18, badge: 'Family Pouch' },
    '1kg': { price: 'Rs. 6,950', stock: 4, badge: 'Bulk Tin (Low)' },
  };

  const districtFees: Record<string, { fee: number; transit: string }> = {
    Colombo: { fee: 350, transit: 'Same-day / 24h delivery' },
    Gampaha: { fee: 400, transit: '24–48 Hours' },
    Kandy: { fee: 450, transit: '1–2 Business Days' },
    Galle: { fee: 450, transit: '1–2 Business Days' },
    Jaffna: { fee: 550, transit: '2–3 Business Days' },
  };

  const normalizePhone = (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '94' + clean.slice(1);
    else if (clean.length === 9) clean = '94' + clean;
    return clean || '94771234567';
  };

  return (
    <section id="experience" className="py-16 sm:py-24 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            Design & Storefront UX
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
            Artisanal Identity. <br />
            <span className="italic font-normal text-[#8B5E3C]">Frictionless</span> Shopping.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#202820]/80 leading-relaxed font-sans">
            We paired organic Ceylon typography (Cormorant Garamond) with an ultra-clean, 1-page mobile shopping experience — complete with real-time multi-variant weighting and automatic courier routing.
          </p>
        </div>

        {/* Interactive Storefront Sandbox */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-[0_12px_36px_rgba(31,61,43,0.05)]">
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#FAF6EF] mb-8">
            {[
              { id: 'variants', label: '01. Multi-Variant Weight Selector' },
              { id: 'checkout', label: '02. 1-Page Express Checkout' },
              { id: 'tracking', label: '03. Smart Tracking & Phone Normalizer' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-[#1F3D2B] text-white shadow-xs'
                    : 'bg-[#FAF6EF] text-[#202820] hover:bg-white border border-[#EADFD0]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: MULTI-VARIANT SELECTOR */}
          {activeTab === 'variants' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-square border border-[#EADFD0] bg-[#FAF6EF] relative shadow-sm">
                  <img
                    src="/products/nuts/cashews.jpg"
                    alt="Ceylon Jumbo Cashews"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1F3D2B] text-[#D9A441]">
                    {variantData[selectedWeight].badge}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 text-[#D9A441] mb-1">
                    <Star className="w-3.5 h-3.5 fill-[#D9A441]" />
                    <span className="text-xs font-bold text-[#1F3D2B]">4.9 / 5.0</span>
                    <span className="text-[11px] text-[#8B5E3C]">(142 verified orders)</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
                    Ceylon Jumbo Roasted Salted Cashews
                  </h3>
                  <p className="text-xs text-[#202820]/75 mt-1 leading-relaxed font-sans">
                    Slow-roasted in small batches with pure southern sea salt. Nitrogen-sealed for long-lasting crunch.
                  </p>
                </div>

                {/* Variant Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8B5E3C] uppercase tracking-wider">Select Pack Weight:</span>
                    <span className="text-[#2E7D4F] font-bold">
                      {variantData[selectedWeight].stock} units left in stock
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {(['100g', '250g', '500g', '1kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedWeight === w
                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-2xs scale-102'
                            : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                        }`}
                      >
                        <span className="block font-mono font-bold text-sm">{w}</span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            selectedWeight === w ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                          }`}
                        >
                          {variantData[w].price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Realtime Atomic Lock Info */}
                <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8B5E3C] block">
                      Active Variant Price
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#1F3D2B]">
                      {variantData[selectedWeight].price}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#2E7D4F] flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Atomic PostgreSQL Sync
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1-PAGE CHECKOUT */}
          {activeTab === 'checkout' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-7 space-y-4 font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                  <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    1-Page Express Checkout Simulator
                  </h4>
                  <span className="text-[10px] font-mono text-[#2E7D4F] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> All 25 Districts Supported
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Samantha Perera"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-[#202820]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Phone Number (Normalized)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="+94 77 123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-[#202820] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Delivery District (Matrix Tariff)
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-white text-[#202820] cursor-pointer"
                    >
                      {Object.keys(districtFees).map((d) => (
                        <option key={d} value={d}>
                          {d} (Rs. {districtFees[d].fee})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Address Line
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="45/2 Alfred House Gardens, Colombo 03"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-[#202820]"
                    />
                  </div>
                </div>

                {/* Gift Card Note */}
                <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] text-xs">
                  <span className="text-[10px] font-mono uppercase text-[#8B5E3C] block mb-1">
                    Personalized Gift Message:
                  </span>
                  <input
                    type="text"
                    readOnly
                    value="Wishing you a joyous festive season with authentic Ceylon snacks!"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#EADFD0] bg-white italic font-serif text-[#1F3D2B]"
                  />
                </div>
              </div>

              {/* Order Calculation */}
              <div className="lg:col-span-5 bg-[#FAF6EF] rounded-2xl p-6 border border-[#EADFD0] flex flex-col justify-between">
                <div className="space-y-3 text-xs">
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B] pb-2 border-b border-[#EADFD0]">
                    Order Summary
                  </h4>
                  <div className="flex items-center justify-between">
                    <span>Roasted Cashews (250g) x 2</span>
                    <span className="font-mono font-bold text-[#1F3D2B]">Rs. 3,700</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Courier Tariff ({selectedDistrict})</span>
                    <span className="font-mono font-bold text-[#1F3D2B]">
                      Rs. {districtFees[selectedDistrict]?.fee || 350}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8B5E3C] italic font-serif">
                    ETA: {districtFees[selectedDistrict]?.transit}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EADFD0] mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif font-bold text-sm text-[#1F3D2B]">Total LKR</span>
                    <span className="font-mono text-xl font-bold text-[#1F3D2B]">
                      Rs. {3700 + (districtFees[selectedDistrict]?.fee || 350)}
                    </span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-[#1F3D2B] text-white text-xs font-semibold flex items-center justify-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>PayHere / Bank Slip / COD Confirmation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART TRACKING & PHONE NORMALIZER */}
          {activeTab === 'tracking' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-200">
              {/* Phone Normalizer */}
              <div className="p-6 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-4">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-[#1F3D2B]" />
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                    Smart Phone Normalizer
                  </h4>
                </div>
                <p className="text-xs text-[#202820]/75 font-sans">
                  Tests client-side regex cleansing to prevent courier delivery failures across varied Sri Lankan mobile formats:
                </p>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-[#8B5E3C] uppercase">
                    Test Any Raw Phone Input:
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-white font-mono text-xs text-[#1F3D2B]"
                  />
                  <div className="p-3 rounded-xl bg-[#162C1F] text-white font-mono text-xs space-y-1">
                    <span className="text-[10px] text-[#D9A441] block">Standardized Courier Payload:</span>
                    <span className="font-bold text-sm">{normalizePhone(phoneInput)}</span>
                  </div>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div className="p-6 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#1F3D2B]" />
                    <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                      5-Stage Live Order Tracker
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#8B5E3C]">CC-842915</span>
                </div>

                <div className="space-y-2">
                  {[
                    { s: '01. Order Placed', desc: 'Received via 1-page checkout' },
                    { s: '02. Payment Verified', desc: 'PayHere IPN / Bank slip confirmed' },
                    { s: '03. Nitrogen Sealed', desc: 'Small-batch roastery packing' },
                    { s: '04. Courier Dispatched', desc: 'Waybill CLN-48291054-LK issued' },
                    { s: '05. Doorstep Delivered', desc: 'Confirmed by delivery agent' },
                  ].map((step, idx) => {
                    const isDone = idx <= trackingStep;
                    return (
                      <div
                        key={step.s}
                        onClick={() => setTrackingStep(idx)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          idx === trackingStep ? 'bg-white shadow-2xs font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDone ? 'bg-[#2E7D4F] text-white' : 'bg-[#EADFD0] text-[#6B6B6B]'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </span>
                          <span className="text-[#1F3D2B]">{step.s}</span>
                        </div>
                        <span className="text-[10px] text-[#8B5E3C]">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
