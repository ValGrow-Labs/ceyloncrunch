import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, AlertCircle, MessageSquare } from 'lucide-react';

export const ReturnsRefunds: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B] pt-4">
        <Link to="/" className="hover:text-[#1F3D2B] transition-colors">Home</Link>
        <span>•</span>
        <span className="font-semibold text-[#1F3D2B]">Returns & Refunds</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5132]/10 text-[#1B5132] text-xs font-bold uppercase tracking-wider">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Returns & Refunds</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
          Our Approach
        </h1>
        <p className="text-xs text-[#6B6B6B]">Last updated: 2026</p>
      </div>

      {/* Content */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-[#2B2B2B] leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/80 text-[#8B5E3C]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium">
              Because our products are food items, returns are subject to food-safety considerations.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">Damaged, Defective or Incorrect Items</h2>
          <p>
            If you receive an incorrect, damaged or defective product, please contact us as soon as possible with your order details and photographs where applicable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">Resolution Process</h2>
          <p>
            We will review the issue promptly and provide an appropriate solution, including replacement, credit, or refund.
          </p>
        </section>

        <section className="space-y-3 pt-3 border-t border-[#EADFD0]/60">
          <h2 className="font-serif text-base font-bold text-[#1F3D2B]">Contact Support</h2>
          <p>
            For questions about a specific order, contact us through WhatsApp or email:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://wa.me/94779443867"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp: +94 77 944 3867</span>
            </a>
            <a
              href="mailto:ceyloncrunch26@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B5132] text-white text-xs font-semibold hover:bg-[#143E26] transition-colors"
            >
              <span>Email: ceyloncrunch26@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
