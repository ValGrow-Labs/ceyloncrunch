import React from 'react';
import { ArrowUp, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
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

  return (
    <footer className="bg-[#162C1F] text-white pt-16 pb-12 border-t border-[#1F3D2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: ValGrow Labs Branding (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/valgrow-logo.png"
                alt="ValGrow Labs Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-serif font-bold tracking-tight text-xl text-white">
                ValGrow Labs
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/85 max-w-sm font-sans leading-relaxed">
              We design and engineer bespoke software platforms, high-converting digital storefronts, and intelligent operations systems for forward-thinking enterprises.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm font-mono text-[#D9A441]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
              <span>Studio: Colombo, Sri Lanka</span>
            </div>
          </div>

          {/* Col 2: Case Study Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3.5 font-sans">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D9A441] font-bold block">
              Case Study Sections
            </span>
            <ul className="space-y-2.5 text-sm text-white/90">
              <li>
                <button
                  onClick={() => scrollTo('overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  The Brief & Challenges
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('pillars')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Engineering Blueprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('impact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Business Impact & Stack
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Project Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Project Links & Live Store (4 cols) */}
          <div className="md:col-span-4 space-y-4 font-sans">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D9A441] font-bold block">
              Client & Project Metadata
            </span>
            <div className="space-y-2.5 text-sm text-white/90">
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-white/75">Client:</span>
                <span className="font-semibold text-white">Ceylon Crunch LK</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-white/75">Deliverable:</span>
                <span className="font-semibold text-white">D2C E-Commerce & CMS</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/10">
                <span className="text-white/75">Year:</span>
                <span className="font-mono text-white">2026 Production</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://ceyloncrunch.lk"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-white/15 transition-colors"
              >
                <span>Visit Ceylon Crunch Live</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
              </a>

              <Link
                to="/store"
                className="w-full py-2.5 px-4 rounded-xl bg-[#D9A441] hover:bg-[#C5A059] text-xs font-semibold text-[#162C1F] flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Interactive Store Prototype</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans">
          <p>© 2026 ValGrow Labs. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-[#D9A441] hover:text-white transition-colors cursor-pointer font-mono uppercase tracking-wider"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
