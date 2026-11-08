import React from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Boxes,
  Zap,
  ShoppingBag,
  CreditCard,
  Sliders,
  Bot,
  Database,
  Smartphone,
  Truck,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorialCaseStudyViewProps {
  onOpenContact?: () => void;
}

export const EditorialCaseStudyView: React.FC<EditorialCaseStudyViewProps> = ({ onOpenContact }) => {
  const benchmarks = [
    {
      metric: '< 30s',
      label: 'Order Processing Time',
      sub: 'Down from 12–15 minutes per order over manual WhatsApp DMs.',
      highlight: true,
    },
    {
      metric: '100%',
      label: 'Variant Stock Accuracy',
      sub: 'Atomic PostgreSQL locks across the 100g to 1kg sizes.',
      highlight: true,
    },
    {
      metric: '+42%',
      label: 'Mobile Storefront Conversion',
      sub: 'Frictionless 1 page checkout with automatic Sri Lankan phone number formatting.',
      highlight: true,
    },
    {
      metric: '95+',
      label: 'Google Lighthouse Score',
      sub: 'Instantaneous sub second load times on 3G/4G cellular networks.',
      highlight: false,
    },
  ];

  const pillars = [
    {
      number: '01',
      title: 'Sensory Storefront & 1-Page Checkout',
      subtitle: 'React 19 · TypeScript · Vite · Tailwind v4',
      icon: ShoppingBag,
      description:
        'A high performance, mobile first shopping experience for the domestic shopper on cellular data. Multi-variant pack selectors (100g, 250g, 500g, 1kg), automatic phone normalisation (+94 LK) and 25 district delivery tariff calculations.',
      specs: [
        'Sub-second page hydration on mobile 3G/4G networks',
        'Zod-validated 1-page checkout with real time subtotal sync',
        '25-District courier matrix with automated waybill generation',
      ],
    },
    {
      number: '02',
      title: 'Resilient Infrastructure & Security',
      subtitle: 'Supabase PostgreSQL · PayHere MD5 · Cloud Storage',
      icon: Database,
      description:
        'A battle hardened backend architecture to prevent inventory race conditions and secure the transaction across the card, bank slip and cash on delivery rails.',
      specs: [
        'Atomic database locks (SELECT FOR UPDATE) preventing double selling',
        'Server side MD5 signature hashing securing PayHere card gateways',
        'Encrypted private storage bucket for bank transfer slip verification',
      ],
    },
    {
      number: '03',
      title: 'Merchant Autonomy & Gemini 2.0 AI',
      subtitle: 'Visual Headless CMS · Google Gemini 2.0 API',
      icon: Sliders,
      description:
        'Full operational independence for store staff. Non technical operators can adjust prices, manage inventory thresholds, update the announcement banners and generate the culinary tasting stories with one click.',
      specs: [
        'Code free visual CMS for announcement ribbons & delivery tariffs',
        'Interactive variant inventory controller with low stock alerts',
        'Gemini 2.0 AI generating artisanal tasting stories, pairings & SEO copy',
      ],
    },
  ];

  const techStack = [
    { name: 'React 19', tag: 'UI Library' },
    { name: 'TypeScript', tag: 'Type Safety' },
    { name: 'Vite 8', tag: 'Lightning Bundler' },
    { name: 'Tailwind v4', tag: 'Design System' },
    { name: 'Supabase PostgreSQL', tag: 'Atomic DB & RLS' },
    { name: 'PayHere MD5', tag: 'Payment Gateway' },
    { name: 'Gemini 2.0 Flash', tag: 'Artisanal Copy AI' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 py-6 sm:py-8">
      {/* 01. THE BRIEF: PROBLEM VS TRANSFORMATION */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Section Eyebrow & Title */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.15em]">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              The Executive Brief
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-[-0.03em] leading-[1.12]">
              From Manual Chats to <br className="hidden sm:inline" />
              <span className="text-[#8B5E3C]">Autonomous</span> Commerce.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#202820] leading-relaxed font-sans font-normal">
              Ceylon Crunch had some of the best artisanal farm produce around but the manual social media coordination was a complete operational bottleneck during the peak seasons.
            </p>
          </div>

          {/* Before & After Comparison Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* The Operational Bottlenecks (Before) */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF6EF] border border-[#EADFD0] space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-base uppercase tracking-wider text-[#8B5E3C] font-extrabold font-sans">
                  The Bottlenecks (Before)
                </span>
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500" />
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-[17px] text-[#202820] font-sans leading-relaxed">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-rose-600 font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✕</span>
                  <span><strong className="font-bold text-[#1F3D2B]">15 min / order:</strong> Staff manually quoted the prices, calculated shipping and checked the bank slips via Instagram and WhatsApp DMs.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-rose-600 font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✕</span>
                  <span><strong className="font-bold text-[#1F3D2B]">Variant stock drift:</strong> 100g, 250g, 500g and 1kg pack sizes all tend to be oversold during the holiday surge.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-rose-600 font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✕</span>
                  <span><strong className="font-bold text-[#1F3D2B]">Zero autonomy.</strong> All that was required was price adjustments and banner updates which would have required developer intervention.</span>
                </li>
              </ul>
            </div>

            {/* The Engineered Transformation (After) */}
            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-[#1F3D2B]/20 shadow-[0_10px_30px_rgba(31,61,43,0.06)] space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-base uppercase tracking-wider text-[#2E7D4F] font-extrabold font-sans">
                  The Solution (Engineered)
                </span>
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
              </div>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-[17px] text-[#202820] font-sans leading-relaxed">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-[#2E7D4F] font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✓</span>
                  <span><strong className="font-bold text-[#1F3D2B]">&lt;30s checkout:</strong> Single page checkout with automatic Sri Lankan phone number normalisation and 25 district courier fee calculation.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-[#2E7D4F] font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✓</span>
                  <span><strong className="font-bold text-[#1F3D2B]">Atomic variant locks:</strong> PostgreSQL transactions ensure real time stock sync with zero chance of double selling.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-[#2E7D4F] font-extrabold text-base sm:text-lg leading-none mt-1 shrink-0">✓</span>
                  <span><strong className="font-bold text-[#1F3D2B]">Full merchant autonomy:</strong> Visual headless CMS for banners & tariffs, plus Gemini 2.0 AI for tasting notes and SEO.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 02. THREE CORE ENGINEERING PILLARS */}
      <section id="pillars" className="bg-[#FAF6EF] py-8 sm:py-14 border-t border-b border-[#EADFD0]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.15em] mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              Engineering Blueprint
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-[-0.03em] leading-[1.12]">
              Three Pillars of <br className="hidden sm:inline" />
              <span className="text-[#8B5E3C]">Digital Excellence</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#EADFD0] shadow-[0_8px_24px_rgba(31,61,43,0.04)] flex flex-col justify-between"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-sm sm:text-base font-sans font-bold text-[#8B5E3C]">
                        {pillar.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#1F3D2B] leading-snug">
                        {pillar.title}
                      </h3>
                      <span className="text-xs sm:text-base font-sans text-[#7A4B28] font-bold block mt-1 tracking-tight">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base lg:text-lg text-[#202820] leading-relaxed font-sans mt-2.5 sm:mt-3.5">
                      {pillar.description}
                    </p>
                  </div>

                  <ul className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#EADFD0] space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm lg:text-base text-[#202820] font-medium font-sans">
                    {pillar.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-2.5">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E7D4F] shrink-0 mt-0.5" />
                        <span className="leading-snug">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03. MEASURABLE BUSINESS IMPACT */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.15em] mb-2 sm:mb-3">
            <Sparkles className="w-4 h-4 text-[#D9A441]" />
            Business Impact
          </div>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-[-0.03em] leading-[1.12]">
            Measurable Growth. <br className="hidden sm:inline" />
            <span className="text-[#8B5E3C]">Proven</span> Production Metrics.
          </h2>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {benchmarks.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl border ${
                item.highlight
                  ? 'bg-white border-[#1F3D2B]/20 shadow-[0_10px_30px_rgba(31,61,43,0.06)]'
                  : 'bg-white/80 border-[#EADFD0]'
              }`}
            >
              <div className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F3D2B] tracking-tight mb-1 sm:mb-2">
                {item.metric}
              </div>
              <div className="font-sans font-bold text-xs sm:text-base lg:text-lg text-[#1F3D2B] mb-1 sm:mb-2 leading-tight">
                {item.label}
              </div>
              <p className="text-[11px] sm:text-sm lg:text-base text-[#202820] font-sans font-normal leading-relaxed">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Stack Strip */}
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#FAF6EF] border border-[#EADFD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <span className="text-xs sm:text-base font-sans uppercase tracking-wider text-[#7A4B28] font-extrabold block mb-0.5 sm:mb-1">
              Production Technology Stack
            </span>
            <span className="text-sm sm:text-lg text-[#202820] font-sans font-medium">
              Clean architecture with absolutely zero third party plugin bloat.
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-white border border-[#EADFD0] text-xs sm:text-base font-sans text-[#1F3D2B] shadow-2xs"
              >
                <strong className="font-bold">{tech.name}</strong>{' '}
                <span className="text-xs sm:text-sm text-[#7A4B28] font-semibold">({tech.tag})</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 04. CLIENT TESTIMONIAL & MINIMAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1F3D2B] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 sm:space-y-6 relative z-10">
            <span className="text-xs sm:text-sm font-sans uppercase tracking-widest text-[#D9A441] font-bold">
              Client Reflection
            </span>
            <blockquote className="font-sans text-lg sm:text-2xl lg:text-3xl text-[#FAF6EF] font-medium leading-relaxed">
              "ValGrow Labs fully understood our artisanal approach. We didn't just get an online shop, we got the complete operational backbone which in turn allowed us to focus entirely on the harvesting and delivery of our genuine Sri Lankan flavours."
            </blockquote>
            <div className="flex items-center gap-3 pt-1 sm:pt-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF6EF] text-[#1F3D2B] flex items-center justify-center font-sans font-bold text-base sm:text-lg shrink-0">
                CC
              </div>
              <div>
                <div className="font-sans font-bold text-sm sm:text-base lg:text-lg text-white">Ceylon Crunch Leadership</div>
                <div className="text-xs sm:text-sm text-[#FAF6EF]/90 font-sans mt-0.5">Colombo, Sri Lanka</div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Inquiry Banner */}
        <div id="contact" className="mt-4 sm:mt-6 p-3.5 sm:py-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl bg-white border border-[#EADFD0] shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3.5 sm:gap-4 lg:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 sm:gap-3.5 text-center sm:text-left min-w-0 flex-1">
            <img
              src="/valgrow-logo.png"
              alt="ValGrow Labs Logo"
              className="h-7 sm:h-8 w-auto object-contain shrink-0 hidden sm:block"
            />
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-sans text-base sm:text-lg lg:text-xl font-bold text-[#1F3D2B] leading-snug">
                Ready to build your next digital platform?
              </h3>
              <p className="text-xs sm:text-sm text-[#202820]/90 font-sans font-medium leading-relaxed">
                ValGrow Labs work with exciting brands to build out scalable, high-converting digital products.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href="mailto:contact@valgrowlabs.com?subject=Project Inquiry — D2C Platform"
              className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#1F3D2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#162C1F] shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 group whitespace-nowrap shrink-0"
            >
              <span>Start a Project Inquiry</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <Link
              to="/store"
              className="w-full sm:w-auto justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#FAF6EF] text-[#1F3D2B] text-xs sm:text-sm font-semibold hover:bg-white border border-[#EADFD0] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Interactive Store Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
