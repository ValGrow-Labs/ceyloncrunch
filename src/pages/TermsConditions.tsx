import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B] pt-4">
        <Link to="/" className="hover:text-[#1F3D2B] transition-colors">Home</Link>
        <span>•</span>
        <span className="font-semibold text-[#1F3D2B]">Terms & Conditions</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5132]/10 text-[#1B5132] text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
          Website Terms
        </h1>
        <p className="text-xs text-[#6B6B6B]">Last updated: 2026</p>
      </div>

      {/* Content */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-[#2B2B2B] leading-relaxed">
        <section className="space-y-3">
          <p>
            By using the Ceylon Crunch website, you agree to use the website responsibly and provide accurate information when placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">1. Products & Pricing</h2>
          <p>
            Product availability, prices and offers may change without prior notice. All prices are listed in Sri Lankan Rupees (LKR / Rs.).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">2. Product Information & Accuracy</h2>
          <p>
            We make reasonable efforts to ensure that product information and images are accurate. However, packaging, appearance and availability may occasionally vary due to natural harvests and supply conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">3. Orders & Confirmation</h2>
          <p>
            Orders are subject to product availability and confirmation. Ceylon Crunch reserves the right to cancel or adjust orders in cases of stock limitations or pricing errors.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#EADFD0]/60">
          <h2 className="font-serif text-base font-bold text-[#1F3D2B]">Questions?</h2>
          <p>
            For questions regarding these terms, please contact us at{' '}
            <a href="mailto:ceyloncrunch26@gmail.com" className="text-[#1B5132] font-semibold underline">
              ceyloncrunch26@gmail.com
            </a>{' '}
            or WhatsApp{' '}
            <a href="https://wa.me/94779443867" className="text-[#1B5132] font-semibold underline">
              +94 77 944 3867
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
