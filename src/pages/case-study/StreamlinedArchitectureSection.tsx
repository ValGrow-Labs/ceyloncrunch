import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  Database,
  CreditCard,
  Truck,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Code2,
  LucideIcon,
} from 'lucide-react';

interface ArchTier {
  id: string;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  specs: string[];
  payload: string;
}

export const StreamlinedArchitectureSection: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);

  const tiers: ArchTier[] = [
    {
      id: 'storefront',
      name: 'Client Storefront',
      subtitle: 'React 19 + TypeScript + Vite 8.3',
      icon: Smartphone,
      specs: [
        'Sub-second page hydration on mobile 3G/4G networks',
        'Zod-validated 1-page checkout with live subtotal sync',
        'Automatic Sri Lankan phone normalization (+94 LK)',
      ],
      payload: 'GET /api/products?variant=cashew-250g -> 200 OK (14ms)',
    },
    {
      id: 'database',
      name: 'Data & Security Tier',
      subtitle: 'Supabase PostgreSQL & Row Level Security',
      icon: Database,
      specs: [
        'Atomic database transactions preventing variant overselling',
        'Row Level Security (RLS) guaranteeing patron privacy',
        'Realtime WebSockets pushing live stock updates to active carts',
      ],
      payload: 'SELECT * FROM product_variants WHERE stock > 0 [RLS Verified]',
    },
    {
      id: 'payments',
      name: 'Multi-Rail Transactions',
      subtitle: 'PayHere MD5 + Encrypted Slip Storage',
      icon: CreditCard,
      specs: [
        'Server-side MD5 signature hashing preventing client tampering',
        'Asynchronous IPN webhook listener with 200 OK acknowledgment',
        'Private cloud storage bucket for customer bank deposit slips',
      ],
      payload: 'UPPERCASE(MD5(merchant_id + order_id + amount + LKR + secret))',
    },
    {
      id: 'logistics',
      name: '25-District Logistics',
      subtitle: 'Automated Waybills & Tariff Engine',
      icon: Truck,
      specs: [
        'Dynamic shipping fees covering all 25 Sri Lankan districts',
        'Sequential courier waybill generation (CLN-XXXXXXXX-LK)',
        'Self-service package tracking portal (5-step delivery timeline)',
      ],
      payload: '{ waybill: "CLN-48291054-LK", district: "Colombo", fee: 350 }',
    },
    {
      id: 'admin',
      name: 'Merchant Operations & AI',
      subtitle: 'Headless CMS & Gemini 2.0 API',
      icon: LayoutDashboard,
      specs: [
        'Visual site settings for announcement ribbons and hero banners',
        'One-click stock adjustments with low-stock threshold alerts',
        'Google Gemini 2.0 API generating tasting notes & SEO copy',
      ],
      payload: 'gemini-2.0-flash: "Harvested at peak maturity in Kandy..."',
    },
  ];

  const current = tiers[activeTier];

  return (
    <section id="architecture" className="py-16 sm:py-24 bg-[#FBF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            Full-Stack Systems
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
            Connected Architecture. <br />
            <span className="italic font-normal text-[#8B5E3C]">Zero Disjointed</span> Tools.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#202820]/80 leading-relaxed font-sans">
            Instead of fragile third-party plugins, ValGrow Labs engineered a cohesive, single-source-of-truth architecture that bridges customer storefronts, PostgreSQL inventory, and domestic logistics.
          </p>
        </div>

        {/* 5-Tier Connected Pipeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-[0_12px_36px_rgba(31,61,43,0.05)]">
          {/* Horizontal Flow Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {tiers.map((tier, idx) => {
              const isSelected = activeTier === idx;
              const Icon = tier.icon;
              return (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm scale-102'
                      : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                      }`}
                    >
                      Tier 0{idx + 1}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold leading-tight">{tier.name}</h4>
                    <span
                      className={`text-[10px] block mt-1 line-clamp-1 ${
                        isSelected ? 'text-white/70' : 'text-[#202820]/60'
                      }`}
                    >
                      {tier.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Tier Inspector */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-8 border border-[#EADFD0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C] block mb-1">
                  System Layer 0{activeTier + 1} · Architectural Spec
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#1F3D2B]">{current.name}</h4>
                <p className="font-mono text-xs text-[#8B5E3C] mt-0.5">{current.subtitle}</p>
              </div>

              <ul className="space-y-2 font-sans text-xs sm:text-sm text-[#202820]/85">
                {current.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-[#162C1F] rounded-2xl p-5 text-white font-mono text-[11px] space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#D9A441] uppercase tracking-wider pb-2 border-b border-white/10 font-sans">
                <span>Protocol Verification</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <pre className="text-white/90 whitespace-pre-wrap leading-relaxed">
                {current.payload}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
