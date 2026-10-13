import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, ShieldCheck, Leaf } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-12">
      {/* 1. Header & Story */}
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
          About Ceylon Crunch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5132] tracking-tight">
          Good Products. Carefully Chosen.
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#8B5E3C] italic max-w-xl mx-auto">
          From Nature to Your Doorstep.
        </p>
      </div>

      <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-[#EADFD0] shadow-sm">
        <img
          src="/hero-banner.jpg"
          alt="Artisanal Ceylon harvest table"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Story Text */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4 text-sm sm:text-base text-[#424843] leading-relaxed">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#1B5132] block">
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
        <p className="font-medium text-[#1F3D2B]">
          We are building Ceylon Crunch one product and one customer at a time.
        </p>
        <div className="pt-2">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF8F4] border border-[#EADFD0] text-xs font-bold text-[#1B5132]">
            From Nature to Your Doorstep.
          </span>
        </div>
      </div>

      {/* 2. What We Believe / Our Approach */}
      <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8B5E3C] block">
          What We Believe · Our Approach
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
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
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADFD0] pb-4">
          <div>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8B5E3C] block">
              Our Promise
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B] mt-0.5">
              Simple. Honest. Reliable.
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#2E7D4F] bg-[#E6ECE2] px-3.5 py-1 rounded-full self-start sm:self-center">
            Ceylon Crunch Standard
          </span>
        </div>

        <p className="text-sm sm:text-base text-[#424843] leading-relaxed">
          We aim to make every part of your experience straightforward — from choosing your products to receiving your order.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/60 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#1F3D2B] block">Good Products</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/60 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#1F3D2B] block">Clear Info</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/60 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#1F3D2B] block">Careful Packing</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/60 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#1F3D2B] block">Reliable Service</span>
          </div>
        </div>

        <p className="font-serif text-base font-semibold text-[#1F3D2B] pt-1">
          That's Ceylon Crunch.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          to="/shop"
          className="h-12 px-8 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
        >
          <span>Explore Our Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
