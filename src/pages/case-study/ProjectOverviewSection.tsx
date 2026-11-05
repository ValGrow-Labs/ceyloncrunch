import React from 'react';
import { Layers, RefreshCw, CreditCard, LayoutDashboard, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProjectOverviewSection: React.FC = () => {
  const highlights = [
    {
      number: '01',
      title: 'Custom E-Commerce Engineering',
      desc: 'Ground-up React 19 and TypeScript architecture with sub-second page transitions, tailored specifically for mobile shoppers across Sri Lanka.',
      icon: Layers,
    },
    {
      number: '02',
      title: 'Real-Time Inventory Management',
      desc: 'Atomic multi-variant tracking (100g, 250g, 500g, 1kg) synchronized instantly through Supabase PostgreSQL to prevent double-selling.',
      icon: RefreshCw,
    },
    {
      number: '03',
      title: 'Localized Payment & Logistics',
      desc: 'Full coverage of Sri Lanka’s 25 districts, automated phone normalization (+94), PayHere gateway integration, bank slip verification, and COD rails.',
      icon: CreditCard,
    },
    {
      number: '04',
      title: 'Intelligent Merchant Dashboard',
      desc: 'A headless visual CMS and live operations console enabling store managers to update hero banners, prices, and tariffs without coding.',
      icon: LayoutDashboard,
    },
  ];

  return (
    <section id="overview" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-96 h-96 rounded-full bg-[#1F3D2B]/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            01 // Project Overview
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            A Digital Experience <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Built Around</span> Quality.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans font-normal tracking-[-0.01em]">
            Ceylon Crunch is a premier Sri Lankan food brand offering slow-roasted nuts, dried fruits, premium dates, whole spices, seeds, and curated corporate gift hampers. ValGrow Labs engineered a complete digital commerce platform to bring its authentic products to a wider audience through a premium, seamless online shopping experience.
          </p>
        </div>

        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Visual Composition (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#EADFD0] shadow-[0_16px_40px_rgba(31,61,43,0.08)] bg-white aspect-[4/5] group">
              <img
                src="/products/nuts/almonds.jpg"
                alt="Artisanal Ceylon Almonds and Harvest Spread"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#162C1F]/90 via-[#162C1F]/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D9A441] text-[#162C1F] text-[10px] font-mono font-bold uppercase tracking-[0.15em]">
                  Ethical Sourcing
                </div>
                <h3 className="font-serif text-2xl font-bold text-white leading-snug">
                  Direct from Authentic Growers
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-sans font-light">
                  Every product is harvested at peak maturity, sustainably processed, and sealed for freshness.
                </p>
              </div>
            </div>

            {/* Brand Quote Pullout Card */}
            <div className="p-7 rounded-3xl bg-white border border-[#EADFD0] shadow-sm relative overflow-hidden">
              <span className="font-serif text-5xl text-[#D9A441]/30 absolute -top-1 left-4 select-none leading-none">“</span>
              <p className="font-serif italic text-base sm:text-lg text-[#1F3D2B] leading-relaxed relative z-10 pt-2 font-normal">
                Honest food for moments that matter. We sought to replace generic mass-market snacking with authentic, natural Ceylon harvests.
              </p>
              <div className="mt-4 pt-3 border-t border-[#FAF6EF] flex items-center justify-between text-xs font-mono text-[#8B5E3C]">
                <span className="font-semibold uppercase tracking-[0.18em] text-[10px]">Ceylon Crunch Ethos</span>
                <span className="text-[11px]">Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Project Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.number}
                    className="p-6 rounded-2xl bg-white border border-[#EADFD0] hover:border-[#1F3D2B]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-[#8B5E3C] tracking-wider">
                          {item.number}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] group-hover:bg-[#1F3D2B] text-[#1F3D2B] group-hover:text-[#D9A441] flex items-center justify-center transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1F3D2B] mb-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#202820]/75 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#FAF6EF] flex items-center gap-1.5 text-[11px] font-medium text-[#2E7D4F]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Fully Implemented</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic Value Proposition Banner */}
            <div className="p-6 rounded-2xl bg-[#1F3D2B] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D9A441]">
                  Full-Lifecycle Partnership
                </span>
                <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                  From Brand Positioning to Live Cloud Deployments
                </h4>
                <p className="text-xs text-white/80 mt-1 max-w-md">
                  ValGrow Labs acted as the complete product, design, and engineering team to establish Ceylon Crunch as Sri Lanka's leading artisanal snack brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
