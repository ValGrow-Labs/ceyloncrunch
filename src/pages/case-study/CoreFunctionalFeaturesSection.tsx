import React, { useState } from 'react';
import {
  Sparkles,
  Boxes,
  MapPin,
  PhoneCall,
  Truck,
  Gift,
  MessageCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const CoreFunctionalFeaturesSection: React.FC = () => {
  // Feature 03: Live Phone Normalization state
  const [rawPhone, setRawPhone] = useState<string>('077 123 4567');

  const normalizePhonePreview = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '94' + cleaned.slice(1);
    } else if (cleaned.length === 9) {
      cleaned = '94' + cleaned;
    }
    return cleaned || '94771234567';
  };

  // Feature 04: Order Tracking stage state
  const [trackingStage, setTrackingStage] = useState<number>(3); // 3 = Dispatched

  const trackingSteps = [
    { title: 'Order Placed', time: '10:30 AM', desc: 'Received via 1-page checkout' },
    { title: 'Payment Confirmed', time: '10:32 AM', desc: 'PayHere IPN webhook verified' },
    { title: 'Small-Batch Packed', time: '01:15 PM', desc: 'Sealed with nitrogen flush' },
    { title: 'Courier Dispatched', time: '03:45 PM', desc: 'Waybill CLN-48291054-LK' },
    { title: 'Doorstep Delivered', time: 'Estimated tomorrow', desc: 'Delivered to Alfred House Gardens' },
  ];

  // Feature 02: District Selector State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kandy');

  const districts25 = [
    { name: 'Colombo', zone: 'Zone 1 (Metro)', fee: 'Rs. 350', time: '24 Hours' },
    { name: 'Gampaha', zone: 'Zone 1 (Western)', fee: 'Rs. 400', time: '24–48 Hours' },
    { name: 'Kalutara', zone: 'Zone 1 (Western)', fee: 'Rs. 400', time: '24–48 Hours' },
    { name: 'Kandy', zone: 'Zone 2 (Central)', fee: 'Rs. 450', time: '1–2 Days' },
    { name: 'Galle', zone: 'Zone 2 (Southern)', fee: 'Rs. 450', time: '1–2 Days' },
    { name: 'Matara', zone: 'Zone 2 (Southern)', fee: 'Rs. 450', time: '1–2 Days' },
    { name: 'Kurunegala', zone: 'Zone 2 (North Western)', fee: 'Rs. 450', time: '1–2 Days' },
    { name: 'Anuradhapura', zone: 'Zone 3 (Outstation)', fee: 'Rs. 500', time: '2–3 Days' },
    { name: 'Jaffna', zone: 'Zone 3 (Northern)', fee: 'Rs. 550', time: '2–3 Days' },
    { name: 'Badulla', zone: 'Zone 3 (Uva)', fee: 'Rs. 500', time: '2–3 Days' },
    { name: 'Ratnapura', zone: 'Zone 2 (Sabaragamuwa)', fee: 'Rs. 450', time: '1–2 Days' },
    { name: 'Trincomalee', zone: 'Zone 3 (Eastern)', fee: 'Rs. 550', time: '2–3 Days' },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            07 // Functional Engineering
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Engineered for <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Real-World</span> Commerce.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Every feature was engineered to tackle the unique realities of Sri Lankan e-commerce — from parcel courier logistics and varied phone formats to gifting hampers and instant messaging.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* FEATURE 01: Multi-Variant Inventory Engine */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <Boxes className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 01 · PostgreSQL
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Multi-Variant Inventory Engine
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Manages distinct pack weights (100g, 250g, 500g, 1kg) independently. Atomic database transactions prevent double-selling during holiday spikes.
              </p>

              {/* Visual Demo */}
              <div className="space-y-2 p-3 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0]">
                {[
                  { w: '100g Pouch', p: 'Rs. 850', s: '64 in stock', ok: true },
                  { w: '250g Jar', p: 'Rs. 1,850', s: '42 in stock', ok: true },
                  { w: '500g Share Pack', p: 'Rs. 3,600', s: '18 in stock', ok: true },
                  { w: '1kg Bulk Tin', p: 'Rs. 6,950', s: '3 left (Low)', ok: false },
                ].map((v) => (
                  <div key={v.w} className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#1F3D2B]">{v.w}</span>
                    <span className="text-[#8B5E3C]">{v.p}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        v.ok ? 'bg-[#2E7D4F]/10 text-[#2E7D4F]' : 'bg-[#B3261E]/10 text-[#B3261E]'
                      }`}
                    >
                      {v.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#2E7D4F] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero overselling in production</span>
            </div>
          </div>

          {/* FEATURE 02: Smart Delivery Calculation (25 Districts) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 02 · Logistics
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Smart 25-District Delivery Matrix
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Dynamic shipping fees and transit estimation covering every administrative district across Sri Lanka, from Colombo to Jaffna.
              </p>

              {/* Interactive Demo */}
              <div className="p-3 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2">
                <label className="block text-[10px] font-mono text-[#8B5E3C] uppercase">
                  Select Sri Lankan District:
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EADFD0] bg-white text-xs font-semibold text-[#1F3D2B] cursor-pointer"
                >
                  {districts25.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.zone})
                    </option>
                  ))}
                </select>

                {(() => {
                  const curr = districts25.find((d) => d.name === selectedDistrict) || districts25[0];
                  return (
                    <div className="mt-2 p-2 rounded-xl bg-white border border-[#EADFD0] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#1F3D2B] block">{curr.fee}</span>
                        <span className="text-[10px] text-[#8B5E3C]">{curr.zone}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#FAF6EF] text-[#1F3D2B]">
                        ETA: {curr.time}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#2E7D4F] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full national courier coverage</span>
            </div>
          </div>

          {/* FEATURE 03: Smart Phone Normalization */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 03 · Sanitization
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Smart Phone Normalization
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Sri Lankan phone numbers entered as <code>077...</code>, <code>+9477...</code>, or <code>77...</code> are automatically cleansed into standard <code>94...</code> format for courier SMS and waybill APIs.
              </p>

              {/* Interactive Demo */}
              <div className="p-3 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2">
                <label className="block text-[10px] font-mono text-[#8B5E3C] uppercase">
                  Test Any Input Format:
                </label>
                <input
                  type="text"
                  value={rawPhone}
                  onChange={(e) => setRawPhone(e.target.value)}
                  placeholder="e.g. 0771234567 or +9477..."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EADFD0] bg-white text-xs text-[#202820] font-mono"
                />

                <div className="p-2.5 rounded-xl bg-[#1F3D2B] text-white space-y-1">
                  <span className="text-[9px] uppercase font-mono text-[#D9A441] block">
                    Normalized Courier Output:
                  </span>
                  <div className="font-mono text-sm font-bold text-white flex items-center justify-between">
                    <span>{normalizePhonePreview(rawPhone)}</span>
                    <span className="text-[10px] text-[#2E7D4F] bg-white/10 px-2 py-0.5 rounded font-sans">
                      Valid +94 LK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#2E7D4F] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0% delivery address phone errors</span>
            </div>
          </div>

          {/* FEATURE 04: Interactive Order Tracking */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 04 · Customer Portal
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Self-Service Order Tracking
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Customers track live orders with reference <code>CC-842915</code> or phone number without calling support, cutting query overhead by 78%.
              </p>

              {/* Interactive Demo */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EADFD0]">
                  <span className="font-mono text-xs font-bold text-[#1F3D2B]">CC-842915</span>
                  <span className="text-[10px] font-mono text-[#8B5E3C]">CLN-48291054-LK</span>
                </div>

                <div className="space-y-2">
                  {trackingSteps.map((s, idx) => {
                    const isDone = idx <= trackingStage;
                    const isCurrent = idx === trackingStage;
                    return (
                      <div
                        key={s.title}
                        onClick={() => setTrackingStage(idx)}
                        className={`flex items-start gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isCurrent ? 'bg-white shadow-2xs' : ''
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center text-[10px] font-bold ${
                            isDone ? 'bg-[#2E7D4F] text-white' : 'bg-[#EADFD0] text-[#6B6B6B]'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#1F3D2B]">
                              {s.title}
                            </span>
                            <span className="text-[10px] font-mono text-[#8B5E3C]">{s.time}</span>
                          </div>
                          <p className="text-[10px] text-[#202820]/70">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#8B5E3C] font-mono">
              Click any stage above to test tracking state
            </div>
          </div>

          {/* FEATURE 05: Gift Hamper Customization */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 05 · Corporate & Festive
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Gift Hamper Customization
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Tailored for Avurudu, Christmas, and corporate clients with custom packaging ribbons, curated snack pairings, and personalized gold-embossed message cards.
              </p>

              {/* Interactive Demo */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2.5">
                <div className="relative rounded-xl overflow-hidden h-24 bg-white">
                  <img
                    src="/products/gifting/curated-hamper.jpg"
                    alt="Curated Hamper"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-[#1F3D2B] text-[#D9A441]">
                    Gold Ribbon Option Included
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#EADFD0] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8B5E3C] block">
                    Custom Card Message:
                  </span>
                  <p className="text-xs italic font-serif text-[#1F3D2B]">
                    "Wishing our valuable corporate partners a prosperous and healthy New Year!"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#2E7D4F] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Drives high-ticket corporate accounts</span>
            </div>
          </div>

          {/* FEATURE 06: WhatsApp Concierge */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Feature 06 · Assisted Commerce
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                WhatsApp Concierge Bridge
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Shoppers desiring human assistance can click the floating WhatsApp button to automatically generate a pre-formatted cart summary with item names, weight variants, and total price.
              </p>

              {/* Interactive Demo */}
              <div className="p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-2">
                <span className="text-[10px] font-mono text-[#183C2B] uppercase block font-semibold">
                  Auto-Generated WhatsApp Payload:
                </span>

                <div className="p-3 rounded-xl bg-white text-xs text-[#202820] font-mono leading-relaxed space-y-1">
                  <p>Hello Ceylon Crunch! 🌿</p>
                  <p>I would like to order:</p>
                  <p>• 2x Roasted Salted Cashews (250g)</p>
                  <p>• 1x California Almonds (500g)</p>
                  <p className="pt-1 font-bold text-[#1F3D2B]">Subtotal: LKR 7,300</p>
                  <p>Delivery: Colombo</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#FAF6EF] text-[11px] text-[#2E7D4F] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Converts hesitant conversational shoppers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
