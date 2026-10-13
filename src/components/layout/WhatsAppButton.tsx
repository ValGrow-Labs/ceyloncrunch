import React from 'react';
import { useLocation } from 'react-router-dom';

export const WhatsAppButton: React.FC = () => {
  const location = useLocation();

  // Hidden on checkout flow to prevent covering payment/order action buttons
  if (location.pathname.startsWith('/checkout') || location.pathname.includes('/confirmed')) {
    return null;
  }

  // On mobile product details, hide floating button to avoid covering the bottom action bar
  const isProductPage = location.pathname.startsWith('/product/');

  const whatsappUrl =
    'https://wa.me/94779443867?text=' +
    encodeURIComponent('Hello Ceylon Crunch, I would like to inquire about your handcrafted provisions.');

  return (
    <aside
      className={`fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 pb-safe pointer-events-auto ${
        isProductPage ? 'hidden lg:block' : ''
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ceylon Crunch Concierge on WhatsApp"
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_12px_28px_-4px_rgba(31,61,43,0.3)] hover:scale-105 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[26px] sm:text-[28px]">chat</span>
        <span className="sr-only">Chat on WhatsApp</span>

        {/* Desktop tooltip */}
        <span className="hidden lg:group-hover:inline-block absolute right-16 bg-[#1F3D2B] text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md">
          Chat with Concierge (+94 77 944 3867)
        </span>
      </a>
    </aside>
  );
};
