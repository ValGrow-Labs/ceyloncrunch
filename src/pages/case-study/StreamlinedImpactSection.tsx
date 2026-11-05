import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Boxes,
  Send,
  ExternalLink,
  ShieldCheck,
  Award,
  ArrowUpRight,
} from 'lucide-react';

export const StreamlinedImpactSection: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(['D2C E-Commerce']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const services = [
    'D2C E-Commerce',
    'Custom Headless CMS',
    'Full-Stack Web Applications',
    'UI/UX Design Systems',
    'Payment & API Integrations',
    'AI-Powered Business Operations',
  ];

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  const benchmarks = [
    {
      metric: '< 30s',
      label: 'Order Processing Duration',
      sub: 'Down from 15 minutes per customer on social media DMs.',
      highlight: true,
    },
    {
      metric: '100%',
      label: 'Variant Stock Accuracy',
      sub: 'Atomic database locks prevent overselling across 100g to 1kg sizes.',
      highlight: true,
    },
    {
      metric: '+42%',
      label: 'Mobile Storefront Conversion',
      sub: 'One-page checkout and automated courier tariff calculation.',
      highlight: true,
    },
    {
      metric: 'Instant',
      label: 'Payment Slip Reconciliation',
      sub: 'Uploaded slips populate in admin with 1-click customer notification.',
      highlight: false,
    },
    {
      metric: '95+',
      label: 'Google Lighthouse Performance',
      sub: 'Sub-second speed on mobile 3G/4G cellular networks.',
      highlight: false,
    },
    {
      metric: 'Automated',
      label: 'B2B Gifting & Hamper Pipeline',
      sub: 'Seamless high-ticket corporate hamper inquiries and customized boxes.',
      highlight: false,
    },
  ];

  const techStack = [
    { name: 'React 19', role: 'Concurrent UI Library' },
    { name: 'TypeScript', role: 'Type Safety & Contracts' },
    { name: 'Vite 8', role: 'Lightning Bundler' },
    { name: 'Tailwind CSS v4', role: 'CSS-first Design System' },
    { name: 'Supabase PostgreSQL', role: 'Database & Row-Level Security' },
    { name: 'PayHere MD5', role: 'Payment Gateway Security' },
    { name: 'Google Gemini 2.0', role: 'Artisanal Copy & SEO Engine' },
  ];

  return (
    <section id="impact" className="py-16 sm:py-24 bg-[#FAF6EF] border-t border-[#EADFD0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 01. BUSINESS IMPACT BENCHMARKS */}
        <div>
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              Measurable Business Impact
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
              Tangible Results. <br />
              <span className="italic font-normal text-[#8B5E3C]">Unlocking</span> Real Growth.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#202820]/80 leading-relaxed font-sans">
              Replacing manual WhatsApp coordination with an automated digital commerce platform produced immediate, measurable improvements across operational efficiency and customer conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benchmarks.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all ${
                  item.highlight
                    ? 'bg-white border-[#1F3D2B]/20 shadow-[0_10px_30px_rgba(31,61,43,0.06)]'
                    : 'bg-white/70 border-[#EADFD0]'
                }`}
              >
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B] mb-2 tracking-tight">
                  {item.metric}
                </div>
                <div className="font-sans font-semibold text-sm text-[#202820] mb-1">
                  {item.label}
                </div>
                <p className="text-xs text-[#202820]/70 font-sans leading-relaxed">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 02. TECHNOLOGY STACK PILLS */}
        <div className="p-8 rounded-3xl bg-white border border-[#EADFD0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] font-bold block mb-1">
                Engineering Stack
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
                Engineered for Speed, Reliability & Longevity
              </h3>
            </div>
            <span className="text-xs font-mono text-[#1F3D2B]/70 bg-[#FAF6EF] px-3 py-1 rounded-full border border-[#EADFD0]">
              Zero Technical Debt
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="px-3.5 py-2 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] flex items-center gap-2"
              >
                <span className="font-mono text-xs font-bold text-[#1F3D2B]">{tech.name}</span>
                <span className="text-[10px] text-[#8B5E3C] font-sans font-medium">({tech.role})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 03. CLIENT TESTIMONIAL & SHOWCASE */}
        <div className="bg-[#1F3D2B] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9A441] font-semibold">
              Client Reflection
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl text-[#FAF6EF] italic font-normal leading-snug">
              "ValGrow Labs took the time to understand our craft. We didn't just get an online store; we got an entire operational backbone that freed our team to focus on harvesting and delivering authentic Sri Lankan flavours."
            </blockquote>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#FAF6EF] text-[#1F3D2B] flex items-center justify-center font-serif font-bold text-lg">
                CC
              </div>
              <div>
                <div className="font-sans font-semibold text-sm text-white">Ceylon Crunch Leadership</div>
                <div className="text-xs text-[#FAF6EF]/70 font-sans">Colombo, Sri Lanka</div>
              </div>
            </div>
          </div>
        </div>

        {/* 04. CONTACT SECTION */}
        <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              Partner with ValGrow Labs
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.05]">
              Have a Vision? <br />
              <span className="italic font-normal text-[#8B5E3C]">Let's Build</span> It.
            </h2>
            <p className="text-sm text-[#202820]/80 leading-relaxed font-sans">
              From ambitious ideas to intelligent digital products, ValGrow Labs helps businesses turn possibilities into working, high-converting platforms.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono text-[#8B5E3C]">
              <div className="flex items-center gap-2">
                <img
                  src="/valgrow-logo.png"
                  alt="ValGrow Labs Logo"
                  className="h-4 w-auto object-contain"
                />
                <span>Agency: ValGrow Labs Engineering Studio</span>
              </div>
              <div>Location: Colombo, Sri Lanka · Global Operations</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADFD0] shadow-[0_16px_40px_rgba(31,61,43,0.06)]">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">Message Sent</h3>
                <p className="text-xs text-[#202820]/70 font-sans">
                  Thank you! Our engineering team will review your inquiry and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                    Services You Need
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => {
                      const isSelected = selectedServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                              : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-neutral-200/50'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8B5E3C] font-semibold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kasun Bandara"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] text-xs font-sans text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8B5E3C] font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kasun@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] text-xs font-sans text-[#202820] focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8B5E3C] font-semibold mb-1">
                    Project Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your brand, challenges, and timeline..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD0] text-xs font-sans text-[#202820] focus:outline-none focus:border-[#1F3D2B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Project Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
