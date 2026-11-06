import React from 'react';
import { ArrowDown, ExternalLink, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseStudyHeroProps {
  onExploreClick?: () => void;
}

export const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ onExploreClick }) => {
  const scrollToOverview = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const element = document.getElementById('overview');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-32 lg:pb-24 flex flex-col justify-between overflow-hidden bg-[#FBF7F0]"
    >
      {/* Subtle organic background accents */}
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-radial from-[#1F3D2B]/[0.04] via-[#D9A441]/[0.02] to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute bottom-12 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-radial from-[#8B5E3C]/[0.05] to-transparent pointer-events-none blur-2xl -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Top Eyebrow Bar */}
        <div className="flex flex-wrap items-center gap-3.5 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1F3D2B]/8 border border-[#1F3D2B]/15 text-[#1F3D2B] text-sm font-sans tracking-[0.14em] uppercase font-bold">
            <img
              src="/valgrow-logo.png"
              alt="ValGrow Labs"
              className="h-4.5 w-auto object-contain inline-block"
            />
            <span>Case Study · D2C E-Commerce</span>
          </div>
          <span className="text-[#7A4B28] text-sm font-sans tracking-[0.14em] uppercase font-bold">
            Client: Ceylon Crunch · Colombo, LK
          </span>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl xl:text-[5.5rem] font-extrabold text-[#1F3D2B] tracking-[-0.035em] leading-[0.98]">
              From Nature <br />
              <span className="text-[#8B5E3C] pr-1.5 font-bold">to Your</span> Doorstep<span className="text-[#D9A441]">.</span>
            </h1>

            <p className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#8B5E3C] leading-snug tracking-[-0.015em] max-w-2xl font-semibold">
              Building a premium digital commerce experience for authentic Sri Lankan flavours.
            </p>

            <p className="text-lg sm:text-xl text-[#202820] leading-relaxed max-w-xl font-sans font-normal">
              We transformed Ceylon Crunch from a manual social-media ordering business into a modern,
              intelligent, mobile-first e-commerce ecosystem — featuring atomic multi-variant inventory,
              25-district logistics calculation, PayHere payment integration, and a headless merchant CMS.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={scrollToOverview}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#1F3D2B] hover:bg-[#162C1F] shadow-[0_8px_24px_rgba(31,61,43,0.22)] hover:shadow-[0_12px_32px_rgba(31,61,43,0.32)] transition-all transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>Explore the Case Study</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://ceyloncrunch.lk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#1F3D2B] bg-white hover:bg-[#FAF6EF] border border-[#EADFD0] shadow-2xs transition-all"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-4 h-4 text-[#8B5E3C]" />
              </a>

              <Link
                to="/store"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full text-sm font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] hover:bg-[#8B5E3C]/8 border border-transparent transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Store Prototype</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Food & Packaging Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Feature Image (High-res roasted cashews / artisanal spread) */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#EADFD0] shadow-[0_20px_50px_rgba(31,61,43,0.14)] bg-white aspect-[4/5] group">
                <img
                  src="/products/nuts/cashews.jpg"
                  alt="Ceylon Crunch Premium Roasted Cashews"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162C1F]/80 via-transparent to-transparent" />

                {/* Overlaid Editorial Caption */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs uppercase font-bold tracking-wider text-[#D9A441] mb-2">
                    Artisanal Harvest
                  </div>
                  <h4 className="font-sans text-xl sm:text-2xl font-bold leading-tight text-white">
                    Jumbo Roasted Cashews & Ceylon Spices
                  </h4>
                  <p className="text-sm sm:text-base text-white/95 font-sans mt-1">
                    100% natural, slow-roasted in small batches in Colombo.
                  </p>
                </div>
              </div>

              {/* Overlapping Floating Secondary Card (Curated Hamper) */}
              <div className="hidden sm:flex absolute -bottom-6 -left-8 w-56 rounded-2xl overflow-hidden border-2 border-white shadow-[0_16px_36px_rgba(31,61,43,0.18)] bg-white p-3.5 flex-col gap-2 transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="w-full h-24 rounded-xl overflow-hidden bg-[#FAF6EF]">
                  <img
                    src="/products/gifting/curated-hamper.jpg"
                    alt="Ceylon Crunch Curated Gift Hamper"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#7A4B28]">
                    B2B & Gifting
                  </span>
                  <span className="text-base font-sans font-bold text-[#1F3D2B] leading-tight mt-0.5">
                    Luxury Hampers
                  </span>
                  <span className="text-sm text-[#2E7D4F] font-bold mt-0.5">
                    Corporate Portal
                  </span>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md border border-[#EADFD0] rounded-2xl p-4 shadow-lg flex items-center gap-3 transform rotate-3">
                <div className="w-11 h-11 rounded-xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#7A4B28]">
                    Conversion Rate
                  </span>
                  <span className="text-lg font-bold text-[#1F3D2B]">+42% Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Bar & Scroll Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-8 border-t border-[#EADFD0]/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div>
            <span className="block text-xs uppercase font-sans tracking-[0.16em] text-[#7A4B28] font-bold mb-1">
              Client
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1F3D2B] tracking-[-0.01em]">Ceylon Crunch LK</span>
          </div>

          <div>
            <span className="block text-xs uppercase font-sans tracking-[0.16em] text-[#7A4B28] font-bold mb-1">
              Industry
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1F3D2B] tracking-[-0.01em]">D2C E-Commerce & Gifting</span>
          </div>

          <div>
            <span className="block text-xs uppercase font-sans tracking-[0.16em] text-[#7A4B28] font-bold mb-1">
              Services
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1F3D2B] tracking-[-0.01em]">
              UI/UX · Full-Stack · CMS
            </span>
          </div>

          <div>
            <span className="block text-xs uppercase font-sans tracking-[0.16em] text-[#7A4B28] font-bold mb-1">
              Core Stack
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1F3D2B] tracking-[-0.01em]">React 19 · TS · Supabase</span>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToOverview}
            className="group flex flex-col items-center gap-1.5 text-sm text-[#7A4B28] hover:text-[#1F3D2B] transition-colors cursor-pointer"
            aria-label="Scroll to overview"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold">Scroll to explore</span>
            <div className="w-7 h-10 rounded-full border border-[#8B5E3C]/40 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 rounded-full bg-[#1F3D2B] animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
