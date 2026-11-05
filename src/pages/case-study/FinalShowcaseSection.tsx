import React from 'react';
import { ExternalLink, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalShowcaseSection: React.FC = () => {
  return (
    <section id="showcase" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Editorial Showcase Container */}
        <div className="bg-[#1F3D2B] rounded-3xl overflow-hidden text-white border border-[#162C1F] shadow-[0_24px_60px_rgba(22,44,31,0.25)] p-8 sm:p-14 lg:p-20 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#D9A441] text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                15 // Production Launch
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.035em] leading-[1.0] text-white">
                Authentic Products. <br />
                <span className="italic font-normal text-[#D9A441] pr-1">Intelligent</span> Commerce.
              </h2>

              <p className="font-serif italic text-lg sm:text-2xl text-white/90 leading-relaxed max-w-xl font-normal">
                We brought together thoughtful design, robust engineering, and intelligent automation to create a digital platform that helps Ceylon Crunch deliver authentic Sri Lankan flavours through a seamless shopping experience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="https://ceyloncrunch.lk"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#162C1F] bg-[#D9A441] hover:bg-[#C5A059] shadow-lg transition-all cursor-pointer group"
                >
                  <span>Visit Ceylon Crunch</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xs transition-all"
                >
                  <span>Launch Store Prototype</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Metadata */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-white/70 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                  <span>Live Production Verified</span>
                </div>
                <div>Colombo, Sri Lanka</div>
                <div className="flex items-center gap-2">
                  <img
                    src="/valgrow-logo.png"
                    alt="ValGrow Labs Logo"
                    className="h-3.5 w-auto object-contain"
                  />
                  <span>Engineered by ValGrow Labs</span>
                </div>
              </div>
            </div>

            {/* Right Mosaic Imagery Column (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/20 shadow-md">
                  <img
                    src="/products/nuts/cashews.jpg"
                    alt="Ceylon Cashews"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square border border-white/20 shadow-md">
                  <img
                    src="/products/nuts/pistachios.jpg"
                    alt="Ceylon Pistachios"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden aspect-square border border-white/20 shadow-md">
                  <img
                    src="/products/nuts/almonds.jpg"
                    alt="Ceylon Almonds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/20 shadow-md">
                  <img
                    src="/products/gifting/curated-hamper.jpg"
                    alt="Curated Hamper"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
