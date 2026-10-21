import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto pb-24">
      {/* Subtle Botanical Leaf Pattern Accents (Decorative Background) */}
      <div className="absolute -top-8 -right-8 w-64 h-64 pointer-events-none opacity-[0.14] text-[#214F35] hidden sm:block">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M100 190 C100 130 140 100 180 80 C150 120 120 150 100 190 Z" fill="currentColor" />
          <path d="M100 190 C100 140 70 110 30 95 C60 130 85 160 100 190 Z" fill="currentColor" />
          <path d="M100 190 Q100 100 105 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M104 130 C125 115 145 108 165 105" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M102 110 C80 98 62 93 42 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M104 70 C122 58 138 52 154 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M103 50 C86 40 72 35 55 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-1/3 -left-12 w-64 h-64 pointer-events-none opacity-[0.12] text-[#A66A3F] hidden sm:block">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full -rotate-12">
          <path d="M100 190 C100 130 140 100 180 80 C150 120 120 150 100 190 Z" fill="currentColor" />
          <path d="M100 190 C100 140 70 110 30 95 C60 130 85 160 100 190 Z" fill="currentColor" />
          <path d="M100 190 Q100 100 105 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M104 130 C125 115 145 108 165 105" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M102 110 C80 98 62 93 42 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col w-full space-y-12 relative z-10">
        {/* 1. Header & Story */}
        <div className="text-center space-y-3.5 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EF] border border-[#EDE2D3] shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-[#214F35]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66A3F]">
              About Ceylon Crunch
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#183C2B] tracking-tight">
            Good Products. Carefully Chosen.
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#A66A3F] italic max-w-xl mx-auto">
            From Nature to Your Doorstep.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video sm:h-96 rounded-3xl overflow-hidden border border-[#EDE2D3] shadow-[0_12px_36px_rgba(24,60,43,0.08)] ring-1 ring-[#183C2B]/5 group">
          <img
            src="/story-hero-nuts.jpg"
            alt="Artisanal Ceylon harvest table"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />
        </div>

        {/* Story Text */}
        <div className="bg-[#FAF6EF] border border-[#EDE2D3] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(24,60,43,0.03)] space-y-4 text-sm sm:text-base text-[#424843] leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#EDE2D3]/40 to-transparent pointer-events-none rounded-bl-full" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#214F35] block">
            Our Story
          </span>
          <p>
            Ceylon Crunch began with a simple goal — to make quality nuts, dried fruits and wholesome foods more accessible to people across Sri Lanka.
          </p>
          <p>
            We believe choosing good food shouldn't have to be complicated.
          </p>
          <p>
            That's why we focus on the things that matter: good products, careful selection, clean presentation and reliable service.
          </p>
          <p>
            From sourcing to packing to delivery, we pay attention to the details.
          </p>
          <p className="font-medium text-[#183C2B]">
            We are building Ceylon Crunch one product and one customer at a time.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#EDE2D3] text-xs font-bold text-[#214F35] shadow-2xs">
              From Nature to Your Doorstep.
            </span>
          </div>
        </div>

        {/* 2. What We Believe / Our Approach */}
        <div className="bg-[#FAF6EF] border border-[#EDE2D3] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(24,60,43,0.03)] space-y-4 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-radial from-[#214F35]/5 to-transparent pointer-events-none rounded-tl-full" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#A66A3F] block">
            What We Believe · Our Approach
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183C2B]">
            Quality Comes First.
          </h2>
          <p className="text-sm sm:text-base text-[#424843] leading-relaxed">
            We don't believe in offering products simply to make the range bigger. We would rather offer products we can stand behind.
          </p>
          <p className="text-sm sm:text-base text-[#424843] leading-relaxed">
            We look for quality, freshness, value and consistency when selecting what goes into our collection.
          </p>
        </div>

        {/* 3. Our Promise */}
        <div className="bg-[#FAF6EF] border border-[#EDE2D3] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(24,60,43,0.03)] space-y-5 text-center sm:text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDE2D3] pb-4">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#A66A3F] block">
                Our Promise
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183C2B] mt-0.5">
                Simple. Honest. Reliable.
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#214F35] bg-[#214F35]/10 border border-[#214F35]/15 px-3.5 py-1 rounded-full self-start sm:self-center">
              Ceylon Crunch Standard
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#424843] leading-relaxed">
            We aim to make every part of your experience straightforward — from choosing your products to receiving your order.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#EDE2D3] text-center shadow-2xs hover:border-[#214F35]/30 hover:shadow-xs transition-all duration-300">
              <span className="font-bold text-xs sm:text-sm text-[#183C2B] block">Good Products</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EDE2D3] text-center shadow-2xs hover:border-[#214F35]/30 hover:shadow-xs transition-all duration-300">
              <span className="font-bold text-xs sm:text-sm text-[#183C2B] block">Clear Info</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EDE2D3] text-center shadow-2xs hover:border-[#214F35]/30 hover:shadow-xs transition-all duration-300">
              <span className="font-bold text-xs sm:text-sm text-[#183C2B] block">Careful Packing</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#EDE2D3] text-center shadow-2xs hover:border-[#214F35]/30 hover:shadow-xs transition-all duration-300">
              <span className="font-bold text-xs sm:text-sm text-[#183C2B] block">Reliable Service</span>
            </div>
          </div>

          <p className="font-serif text-base font-semibold text-[#183C2B] pt-1">
            That's Ceylon Crunch.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            to="/shop"
            className="h-12 px-8 rounded-full bg-[#214F35] hover:bg-[#183C2B] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(33,79,53,0.2)] hover:shadow-[0_6px_20px_rgba(24,60,43,0.3)] transition-all cursor-pointer"
          >
            <span>Explore Our Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
