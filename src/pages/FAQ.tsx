import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      q: 'How can I place an order?',
      a: 'You can order directly through our website. You can also contact us through WhatsApp for assistance.',
    },
    {
      q: 'Do you deliver across Sri Lanka?',
      a: 'Yes. We offer island-wide delivery.',
    },
    {
      q: 'What sizes are available?',
      a: 'Available sizes depend on the product. Common sizes include 100g, 250g and 500g.',
    },
    {
      q: 'How should I store my products?',
      a: 'Store products in a cool, dry place away from direct sunlight. Once opened, keeping them properly sealed helps maintain freshness.',
    },
    {
      q: 'How long will my order take?',
      a: 'Delivery times depend on your location and courier service. You will receive relevant order and delivery updates.',
    },
    {
      q: 'Can I place a bulk order?',
      a: 'Yes. Contact us for corporate, event, wedding, gifting and other bulk requirements.',
    },
    {
      q: 'Can I customise a hamper?',
      a: 'Yes. Contact us with your requirements and we’ll let you know what options are available.',
    },
    {
      q: 'Do you accept returns?',
      a: 'Please refer to our Returns & Refunds Policy for details.',
    },
    {
      q: 'How can I contact Ceylon Crunch?',
      a: 'You can contact us through WhatsApp, phone, email or our social media pages.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
          Answers & Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F3D2B] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto">
          Everything you need to know about our single-origin provisions, roasting, and island dispatch.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto w-full">
        <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions (e.g. delivery, storage, payments)..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-[#EADFD0] rounded-full text-xs sm:text-sm text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
        />
      </div>

      {/* Accordions */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-sm divide-y divide-[#EADFD0]">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm sm:text-base font-semibold text-[#1F3D2B] gap-4"
                >
                  <span className="font-serif">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8B5E3C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs sm:text-sm text-[#424843] leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-[#6B6B6B] py-6 text-center">
            No matching questions found. Chat with our team on WhatsApp for immediate help!
          </p>
        )}
      </div>
    </div>
  );
};
