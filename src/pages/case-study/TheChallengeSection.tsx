import React, { useState } from 'react';
import { MessageSquareWarning, Boxes, CreditCard, LockKeyhole, Zap, ArrowRight, CheckCircle2, AlertOctagon } from 'lucide-react';
import { ChallengeItem } from './types';

export const TheChallengeSection: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<string>('c1');

  const challenges: ChallengeItem[] = [
    {
      id: 'c1',
      number: '01',
      title: 'Fragmented Ordering Channels',
      subtitle: 'Manual DMs & Spreadsheet Bottlenecks',
      problem:
        'Orders were scattered across WhatsApp messages and Instagram direct messages. Customer service staff spent up to 15 minutes per customer confirming item availability, calculating courier rates by hand, and tracking down bank deposit receipts.',
      solution:
        'Engineered a centralized, self-service storefront with an integrated 1-page checkout, dynamic courier calculation, and direct order ID assignment.',
      impact: 'Order placement duration collapsed from 15 minutes to under 30 seconds.',
      tags: ['Operations', 'Friction', 'Order Loss'],
    },
    {
      id: 'c2',
      number: '02',
      title: 'Multi-Variant Inventory Complexity',
      subtitle: 'Stock Mismatches Across 100g to 1kg Pack Sizes',
      problem:
        'Artisanal nuts and dried fruits are sold in multiple weight configurations (100g, 250g, 500g, and 1kg). Without automated inventory sync, high-demand items like Jumbo Cashews were frequently oversold during holidays, causing embarrassing cancellations.',
      solution:
        'Implemented atomic multi-variant database records in Supabase PostgreSQL with real-time stock deductions on checkout confirmation and low-stock alerts.',
      impact: 'Achieved 100% inventory accuracy with zero overselling incidents.',
      tags: ['PostgreSQL', 'Concurrency', 'Variant Sync'],
    },
    {
      id: 'c3',
      number: '03',
      title: 'Sri Lankan Payment Friction',
      subtitle: 'Absence of Multi-Rail Domestic Payment Options',
      problem:
        'Sri Lankan consumers demand diverse payment methods: credit/debit cards via PayHere, direct bank transfers with deposit slips, and Cash on Delivery (COD). Without automated reconciliation, verifying bank slips was slow and error-prone.',
      solution:
        'Built a multi-rail payment engine featuring automated PayHere MD5 signature hashing, direct receipt uploads to secure cloud storage, and automated status transitions.',
      impact: 'Automated 100% of payment tracking and enabled instantaneous verification.',
      tags: ['PayHere', 'Bank Transfer', 'COD Verification'],
    },
    {
      id: 'c4',
      number: '04',
      title: 'Limited Store Autonomy',
      subtitle: 'Developer Dependency for Daily Retail Changes',
      problem:
        'Non-technical store operators were completely blocked whenever seasonal promotions, delivery fee adjustments, product price tweaks, or announcement bar updates were needed — requiring direct code commits and redeployments.',
      solution:
        'Designed a visual Headless CMS inside the Admin Dashboard, enabling store managers to toggle announcements, modify delivery fees, and update hero banners in real time.',
      impact: 'Enabled complete operational autonomy without writing a single line of code.',
      tags: ['Headless CMS', 'Merchant Dashboard', 'No-Code'],
    },
    {
      id: 'c5',
      number: '05',
      title: 'Mobile Cellular Network Latency',
      subtitle: 'Slow 3G/4G Performance Driving Cart Abandonment',
      problem:
        'Over 75% of Sri Lankan shoppers browse on mobile devices via varying cellular networks. Heavy boilerplate templates and uncompressed assets caused sluggish load times and high drop-offs on product pages.',
      solution:
        'Architected a lean React 19 + Vite bundle styled with CSS-first Tailwind v4, utilizing responsive WebP imagery, route lazy loading, and sub-second asset hydration.',
      impact: 'Attained a 95+ Google Lighthouse mobile score with instantaneous page transitions.',
      tags: ['Vite 8', 'React 19', 'Lighthouse 95+'],
    },
  ];

  const current = challenges.find((c) => c.id === activeChallenge) || challenges[0];

  return (
    <section id="challenges" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <AlertOctagon className="w-3.5 h-3.5 text-[#8B5E3C]" />
            02 // Operational Friction
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Before the Experience, <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">There Was</span> a Problem.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            To craft a solution that delivered measurable business growth, ValGrow Labs conducted deep operational audits across customer journeys, packaging logistics, and payment settlement workflows.
          </p>
        </div>

        {/* 5 Distinct Challenge Cards Grid & Interactive Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge Selector Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {challenges.map((item) => {
              const isSelected = item.id === activeChallenge;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveChallenge(item.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-[0_8px_24px_rgba(31,61,43,0.18)] translate-x-1'
                      : 'bg-white text-[#202820] border-[#EADFD0] hover:border-[#1F3D2B]/30 hover:bg-[#FAF6EF]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-base font-bold ${
                        isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                      }`}
                    >
                      {item.number}
                    </span>
                    <div>
                      <h4
                        className={`font-serif text-base font-bold leading-tight ${
                          isSelected ? 'text-white' : 'text-[#1F3D2B]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isSelected ? 'text-white/70' : 'text-[#202820]/60'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[#D9A441] translate-x-1' : 'text-[#EADFD0]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Challenge Editorial Showcase (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#EADFD0] p-6 sm:p-10 shadow-[0_12px_36px_rgba(31,61,43,0.06)] relative overflow-hidden">
              {/* Top Accent & Tag Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#FAF6EF]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-[#8B5E3C]">
                    CHALLENGE {current.number}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#FAF6EF] text-[#1F3D2B] border border-[#EADFD0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mt-6 space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
                  {current.title}
                </h3>
                <p className="font-serif italic text-sm text-[#8B5E3C]">
                  {current.subtitle}
                </p>
              </div>

              {/* The Problem Narrative */}
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-[#B3261E]/5 border border-[#B3261E]/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B3261E] block mb-1">
                    The Pain Point Before ValGrow Labs
                  </span>
                  <p className="text-xs sm:text-sm text-[#202820]/85 leading-relaxed font-sans">
                    {current.problem}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#2E7D4F]/5 border border-[#2E7D4F]/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                    The Engineered Solution
                  </span>
                  <p className="text-xs sm:text-sm text-[#202820]/85 leading-relaxed font-sans">
                    {current.solution}
                  </p>
                </div>
              </div>

              {/* Measurable Impact Banner */}
              <div className="mt-8 pt-6 border-t border-[#FAF6EF] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block">
                    Verified Outcome
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#1F3D2B]">
                    {current.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
