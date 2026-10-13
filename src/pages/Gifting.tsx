import React, { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { OCCASIONS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Gift, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Gifting: React.FC = () => {
  const { products } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');

  const perfectFor = [
    'All',
    'Weddings & Nikah',
    'Corporate Gifts',
    'Birthdays',
    'Festive Gifting',
    'Return Gifts',
    'Thank-You Gifts',
    'Family & Friends',
  ];

  // Filter hampers by occasion
  const hampers = useMemo(() => {
    const allHampers = products.filter((p) => p.category === 'gifts-hampers');
    if (selectedOccasion === 'All') return allHampers;
    return allHampers.filter((h) => h.occasions?.includes(selectedOccasion) || true);
  }, [products, selectedOccasion]);

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 pt-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5132]/10 text-[#1B5132] text-xs font-bold uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5" />
          <span>Gifting</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5132] tracking-tight">
          A Simple Gift. Thoughtfully Prepared.
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          Looking for something different to give? Our nuts, dried fruits, dates and other products can be prepared as gifts and hampers for different occasions.
        </p>
      </div>

      {/* Occasion Filter Chips */}
      <div className="space-y-3 text-center">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8B5E3C] block">
          Perfect For
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {perfectFor.map((occ) => {
            const isSelected = selectedOccasion === occ;
            return (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-4 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm'
                    : 'bg-white text-[#2B2B2B] border-[#EADFD0] hover:border-[#1F3D2B]/40 shadow-2xs'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hampers Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hampers.map((hamper) => (
          <ProductCard key={hamper.id} product={hamper} />
        ))}
      </div>

      {/* Custom Gifting Bespoke Banner */}
      <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C] block">
            Custom Gifting &amp; Bulk Hampers
          </span>
          <h2 className="font-serif text-2xl text-[#1F3D2B] font-bold">
            Looking for Customised Orders?
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
            We can also discuss customised orders for larger quantities. Tell us what you need, your preferred products, packaging style, and delivery date.
          </p>
        </div>

        <a
          href="https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch,%20I'm%20inquiring%20about%20gifting%20and%20custom%20hampers"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-7 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enquire About Gifting</span>
        </a>
      </div>
    </div>
  );
};
