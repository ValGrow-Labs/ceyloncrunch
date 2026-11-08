import React from 'react';
import { ArrowUp, Sparkles, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseStudyFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navSections = [
    { id: 'overview', number: '01', title: 'The Brief & Challenges' },
    { id: 'pillars', number: '02', title: 'Engineering Blueprint' },
    { id: 'impact', number: '03', title: 'Business Impact & Stack' },
    { id: 'contact', number: '04', title: 'Project Inquiry' },
  ];

  return (
    <footer className="relative bg-[#112318] text-white pt-12 sm:pt-16 pb-10 sm:pb-14 border-t border-[#1F3D2B]/80 overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-emerald-500/[0.04] blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-[#D9A441]/[0.03] blur-3xl pointer-events-none rounded-full" />

      {/* Top subtle decorative gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-white/[0.08]">
          {/* Col 1: Studio Brand & Vision (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/valgrow-logo.png"
                alt="ValGrow Labs Logo"
                className="h-9 w-auto object-contain"
              />
              <div>
                <span className="font-sans font-extrabold tracking-tight text-2xl text-white block leading-none">
                  ValGrow Labs
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.16em] text-[#D9A441] font-bold mt-1 block">
                  Digital Engineering Studio
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed">
              We design and engineer bespoke software platforms, high-converting digital storefronts, and intelligent operations systems for forward-thinking enterprises.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/90">
                <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
                <span className="font-medium">Studio: Colombo, Sri Lanka</span>
              </div>

              <a
                href="mailto:contact@valgrowlabs.com?subject=Studio Inquiry"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-[#D9A441] hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>contact@valgrowlabs.com</span>
              </a>
            </div>
          </div>

          {/* Col 2: Case Study Quick Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#D9A441] font-bold block">
              Case Study Navigation
            </span>
            <nav className="flex flex-col space-y-2">
              {navSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className="group flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/[0.05] transition-all text-left cursor-pointer border border-transparent hover:border-white/[0.06]"
                >
                  <span className="text-sm sm:text-base text-white/85 group-hover:text-white font-medium group-hover:translate-x-0.5 transition-transform">
                    {sec.title}
                  </span>
                  <span className="text-xs text-[#D9A441]/70 group-hover:text-[#D9A441] font-mono transition-colors">
                    {sec.number}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Col 3: Modern Project Card Bento (4 cols) */}
          <div className="lg:col-span-4 bg-white/[0.04] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between gap-5 hover:border-white/20 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.18em] text-[#D9A441] font-bold">
                  Project Capsule
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D4F]/25 text-[#7ee787] text-[11px] font-semibold border border-[#2E7D4F]/40">
                  Live Production
                </span>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Ceylon Crunch LK
                </h4>
                <p className="text-xs sm:text-sm text-white/70 mt-0.5">
                  Artisanal Harvest · D2C E-Commerce & CMS
                </p>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['React 19', 'Supabase', 'PayHere', '25 Districts'].map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 rounded-md bg-white/[0.06] text-[11px] text-white/80 font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-2">
              <Link
                to="/store"
                className="w-full py-2.5 px-4 rounded-xl bg-[#D9A441] hover:bg-[#c99534] text-xs sm:text-sm font-bold text-[#162C1F] flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_16px_rgba(217,164,65,0.3)] whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Store Prototype</span>
              </Link>

              <a
                href="https://ceyloncrunch.lk"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 border border-white/10 transition-colors whitespace-nowrap"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/60">
          <p>© 2026 ValGrow Labs. Engineered with precision.</p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-[#D9A441] hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
