import React from 'react';
import { Sparkles, TrendingUp, Clock, CheckCircle2, ShieldCheck, Zap, Award, ArrowUpRight } from 'lucide-react';
import { MetricItem } from './types';

export const BusinessImpactSection: React.FC = () => {
  const metrics: MetricItem[] = [
    {
      label: 'Order Processing Duration',
      before: '12–15 min / order',
      after: '< 30 seconds',
      change: '96% reduction',
      description:
        'Orders transition automatically from 1-page checkout to courier waybill dispatch without manual WhatsApp or Instagram messaging.',
      highlight: true,
    },
    {
      label: 'Multi-Variant Stock Accuracy',
      before: 'Frequent stockouts & overselling',
      after: '100% Real-Time Sync',
      change: 'Zero double-selling',
      description:
        'Atomic PostgreSQL locks ensure pack sizes (100g to 1kg) deduct synchronously across simultaneous checkout attempts.',
      highlight: true,
    },
    {
      label: 'Mobile Storefront Conversion',
      before: 'Baseline Social DMs',
      after: '+42% Reported Growth',
      change: '+42% increase',
      description:
        'Frictionless mobile navigation, persistent cart drawer, and automated phone number formatting drove higher completion rates.',
      highlight: true,
    },
    {
      label: 'Payment Slip Reconciliation',
      before: 'Hours spent chasing bank slips',
      after: 'Instant Admin Verification',
      change: 'Real-time review',
      description:
        'Uploaded slips populate directly inside the admin console with one-click verification and automated customer SMS/email notifications.',
    },
    {
      label: 'Google Lighthouse Mobile Benchmark',
      before: 'Legacy unoptimized load',
      after: '95+ Mobile Score',
      change: 'Sub-second speed',
      description:
        'React 19 + Vite + Tailwind v4 architecture with zero third-party script bloat guarantees lightning-fast load times on 3G/4G cellular networks.',
    },
    {
      label: 'Corporate Gift Hamper Workflow',
      before: 'Fragmented manual spreadsheets',
      after: 'Integrated B2B Portal',
      change: 'High-ticket automated pipeline',
      description:
        'Dedicated corporate gifting flow with custom messaging and bulk inquiries unlocked high-margin seasonal corporate accounts.',
    },
  ];

  return (
    <section id="impact" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            13 // Measurable Impact
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            From Manual Operations <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">to a Connected</span> Commerce System.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            By eliminating manual order chasing, solving multi-variant inventory drift, and engineering localized payment rails, ValGrow Labs delivered immediate efficiency gains and top-line growth.
          </p>
        </div>

        {/* 6 Metric Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                m.highlight
                  ? 'bg-white border-[#1F3D2B]/30 shadow-md ring-1 ring-[#1F3D2B]/5'
                  : 'bg-white border-[#EADFD0] shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF] mb-4">
                  <span className="font-serif text-sm font-bold text-[#1F3D2B]">
                    {m.label}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#2E7D4F]/10 text-[#2E7D4F]">
                    {m.change}
                  </span>
                </div>

                {/* Before vs After Comparison Meter */}
                <div className="space-y-3 mb-5">
                  <div className="p-3 rounded-xl bg-[#B3261E]/5 border border-[#B3261E]/15 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#B3261E] font-bold">
                      Before ValGrow:
                    </span>
                    <span className="font-sans font-semibold text-[#202820]">{m.before}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#2E7D4F]/10 border border-[#2E7D4F]/25 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#2E7D4F] font-bold">
                      Engineered Outcome:
                    </span>
                    <span className="font-serif text-base font-bold text-[#1F3D2B]">{m.after}</span>
                  </div>
                </div>

                <p className="text-xs text-[#202820]/75 leading-relaxed font-sans">
                  {m.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#FAF6EF] flex items-center gap-1.5 text-[11px] font-medium text-[#2E7D4F]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified operational result</span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Reported Footnote Callout */}
        <div className="p-5 rounded-2xl bg-white border border-[#EADFD0] text-center max-w-2xl mx-auto">
          <p className="text-xs text-[#8B5E3C] font-mono leading-relaxed">
            * Note: Metrics reflect internal client operational benchmarks and analytics tracked during post-launch operations across 2026.
          </p>
        </div>
      </div>
    </section>
  );
};
