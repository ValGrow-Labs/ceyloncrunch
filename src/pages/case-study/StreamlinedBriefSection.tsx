import React, { useState } from 'react';
import {
  Sparkles,
  AlertOctagon,
  MessageSquareWarning,
  Boxes,
  CreditCard,
  LockKeyhole,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const StreamlinedBriefSection: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<number>(0);

  const challenges = [
    {
      num: '01',
      title: 'Fragmented Ordering',
      subtitle: 'Manual WhatsApp & Instagram DMs',
      problem:
        'Customer orders were scattered across social media chats. Staff spent up to 15 minutes per customer verifying stock, manually calculating courier rates, and cross-checking bank slips.',
      solution:
        'Built a centralized mobile-first storefront with an integrated 1-page checkout and automated courier tariff calculation.',
      metric: 'Order time cut from 15 min to < 30s',
      icon: MessageSquareWarning,
    },
    {
      num: '02',
      title: 'Multi-Variant Stock Drift',
      subtitle: '100g, 250g, 500g & 1kg Pack Sizes',
      problem:
        'Artisanal nuts are sold in multiple weight configurations. Without automated inventory synchronization, popular items were frequently double-sold during holiday surges.',
      solution:
        'Engineered atomic database transactions in Supabase PostgreSQL, locking variant inventory instantly upon checkout confirmation.',
      metric: '100% real-time stock sync with zero overselling',
      icon: Boxes,
    },
    {
      num: '03',
      title: 'Payment Reconciliation',
      subtitle: 'Absence of Domestic Payment Rails',
      problem:
        'Sri Lankan shoppers require flexible local payments: PayHere cards, direct bank transfer with deposit slips, and Cash on Delivery. Manual verification caused dispatch delays.',
      solution:
        'Integrated PayHere with cryptographic MD5 hash signatures, encrypted bank receipt cloud storage, and automated status shifts.',
      metric: 'Automated 100% of payment reconciliation',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'Zero Store Autonomy',
      subtitle: 'Developer Bottleneck for Daily Retail Changes',
      problem:
        'Store managers were blocked whenever seasonal promotions, delivery fee adjustments, product prices, or announcement banners needed updates.',
      solution:
        'Architected a visual Headless CMS inside the admin dashboard, allowing the team to edit announcements, prices, and tariffs without code.',
      metric: 'Full operational independence for store staff',
      icon: LockKeyhole,
    },
    {
      num: '05',
      title: 'Cellular Network Latency',
      subtitle: 'Sluggish Mobile 3G/4G Load Times',
      problem:
        'Over 75% of Sri Lankan consumers browse on smartphones on variable cellular networks. Slow third-party templates led to high cart abandonment.',
      solution:
        'Crafted a lean React 19 + Vite bundle styled with CSS-first Tailwind v4 tokens, achieving instantaneous sub-second page hydration.',
      metric: '95+ Google Lighthouse mobile benchmark',
      icon: Zap,
    },
  ];

  const current = challenges[selectedChallenge];

  return (
    <section id="overview" className="py-16 sm:py-24 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The Brief Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              The Brief & Context
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
              Honest Produce. <br />
              <span className="italic font-normal text-[#8B5E3C]">Digital-First</span> Commerce.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-[#202820]/80 font-sans leading-relaxed">
            <p>
              Ceylon Crunch is an artisanal Sri Lankan snack brand offering slow-roasted nuts, organic sun-dried fruits, premium dates, and curated corporate gift hampers. While their product quality was world-class, their sales operations were hindered by manual messaging workflows.
            </p>
            <p className="text-xs sm:text-sm text-[#8B5E3C] font-serif italic">
              ValGrow Labs was commissioned to design and build an integrated D2C commerce platform — eliminating operational friction, automating multi-variant inventory, and localizing Sri Lankan payment and courier logistics.
            </p>
          </div>
        </div>

        {/* The 5 Operational Challenges Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-[0_12px_36px_rgba(31,61,43,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#FAF6EF] mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C] block">
                The Operational Bottlenecks
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F3D2B] mt-0.5">
                5 Challenges Solved by ValGrow Labs
              </h3>
            </div>
            <span className="text-xs font-mono text-[#2E7D4F] bg-[#2E7D4F]/10 px-3 py-1 rounded-full font-semibold">
              Before vs. After Transformation
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Challenge Pills */}
            <div className="lg:col-span-5 space-y-2.5">
              {challenges.map((c, idx) => {
                const isSelected = selectedChallenge === idx;
                const Icon = c.icon;
                return (
                  <button
                    key={c.num}
                    onClick={() => setSelectedChallenge(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm translate-x-1'
                        : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                        }`}
                      >
                        {c.num}
                      </span>
                      <div>
                        <h4 className="font-serif text-sm font-bold leading-tight">{c.title}</h4>
                        <span
                          className={`text-[11px] block mt-0.5 line-clamp-1 ${
                            isSelected ? 'text-white/70' : 'text-[#202820]/60'
                          }`}
                        >
                          {c.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#D9A441] translate-x-0.5' : 'text-[#EADFD0]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right: Challenge Solution Inspector */}
            <div className="lg:col-span-7 bg-[#FAF6EF] rounded-2xl p-6 sm:p-8 border border-[#EADFD0] space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C] block mb-1">
                  Challenge {current.num} Deep Dive
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                  {current.title}
                </h4>
                <p className="font-serif italic text-xs text-[#8B5E3C] mt-0.5">
                  {current.subtitle}
                </p>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white border border-[#B3261E]/20 text-[#202820]/90">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B3261E] block mb-1">
                    The Pain Point Before:
                  </span>
                  {current.problem}
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#2E7D4F]/30 text-[#202820]/90">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E7D4F] block mb-1">
                    The ValGrow Labs Solution:
                  </span>
                  {current.solution}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EADFD0] flex items-center gap-2 text-xs font-semibold text-[#1F3D2B]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0" />
                <span>Result: {current.metric}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
