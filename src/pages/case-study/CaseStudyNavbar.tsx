import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

interface CaseStudyNavbarProps {
  onOpenContact?: () => void;
}

export const CaseStudyNavbar: React.FC<CaseStudyNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF7F0]/95 backdrop-blur-md border-b border-[#EADFD0]/80 py-2.5 sm:py-3 shadow-[0_2px_16px_rgba(31,61,43,0.04)]'
          : 'bg-[#FBF7F0]/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Left: ValGrow Labs Branding + Case Study Context */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 sm:gap-3"
            >
              <img
                src="/valgrow-logo.png"
                alt="ValGrow Labs Logo"
                className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
              <div className="flex flex-col">
                <span className="font-sans font-extrabold tracking-tight text-base sm:text-xl md:text-2xl text-[#1F3D2B] leading-none">
                  ValGrow Labs
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-sans tracking-wider text-[#7A4B28] font-bold mt-0.5 sm:mt-1">
                  Engineering Studio
                </span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-2 pl-3 ml-3 border-l border-[#EADFD0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <span className="font-sans text-xs sm:text-sm text-[#7A4B28] tracking-wider uppercase font-bold">
                Work / Ceylon Crunch
              </span>
            </div>
          </div>

          {/* Right: Clean, Uncluttered Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="https://ceyloncrunch.lk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-semibold text-[#1F3D2B] hover:bg-[#FAF6EF] border border-[#EADFD0] transition-colors shadow-2xs whitespace-nowrap"
            >
              <span className="hidden sm:inline">Visit Live Store</span>
              <span className="sm:hidden">Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8B5E3C]" />
            </a>

            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-semibold text-white bg-[#1F3D2B] hover:bg-[#162C1F] shadow-sm transition-all cursor-pointer group whitespace-nowrap"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
