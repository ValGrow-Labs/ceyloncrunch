import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-[#111111] border-t border-[#3A3A3A] rounded-t-3xl pt-10 pb-24 lg:pb-12 text-[#F5F2EB]">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8 space-y-10">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A3A3A] pb-6">
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Ceylon Crunch - From Nature To Your Doorstep"
              className="h-14 lg:h-16 w-auto object-contain"
            />
          </Link>
          <p className="text-xs sm:text-sm text-[#C4C4C4] font-medium tracking-wide">
            A fresh selection of nuts, dates, dried fruits and more.
          </p>
        </div>

        {/* Simplified Navigation Grid (3 Organized Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* SHOP */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              SHOP
            </span>
            <ul className="space-y-2.5 text-sm text-[#C4C4C4]">
              <li>
                <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/nuts" className="hover:text-[#C9A84C] transition-colors">
                  Nuts &amp; Seeds
                </Link>
              </li>
              <li>
                <Link to="/category/dried-fruits" className="hover:text-[#C9A84C] transition-colors">
                  Dates &amp; Dried Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/spices" className="hover:text-[#C9A84C] transition-colors">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/gifting" className="hover:text-[#C9A84C] transition-colors">
                  Gifts &amp; Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* ABOUT */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              ABOUT
            </span>
            <ul className="space-y-2.5 text-sm text-[#C4C4C4]">
              <li>
                <Link to="/our-story" className="hover:text-[#C9A84C] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#C9A84C] transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C9A84C] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/corporate" className="hover:text-[#C9A84C] transition-colors">
                  Corporate Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A84C] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              CUSTOMER CARE
            </span>
            <ul className="space-y-2.5 text-sm text-[#C4C4C4]">
              <li>
                <Link to="/delivery" className="hover:text-[#C9A84C] transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#C9A84C] transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#C9A84C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#C9A84C] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Full-Width GET IN TOUCH Contact Section */}
        <div className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl p-5 sm:p-7 shadow-inner">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C9A84C]">
                GET IN TOUCH
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-1">
              {/* Phone */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#3A3A3A] flex items-center justify-center text-[#C9A84C] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block">Phone</span>
                  <a
                    href="tel:+94779443867"
                    className="text-sm font-medium text-[#F5F2EB] hover:text-[#C9A84C] transition-colors break-words"
                    title="Call Ceylon Crunch"
                  >
                    +94 77 944 3867
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#3A3A3A] flex items-center justify-center text-[#C9A84C] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block">Email</span>
                  <a
                    href="mailto:ceyloncrunch26@gmail.com"
                    className="text-sm font-medium text-[#F5F2EB] hover:text-[#C9A84C] transition-colors break-all block leading-tight"
                    title="Email Ceylon Crunch"
                  >
                    ceyloncrunch26@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#C9A84C]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#3A3A3A] flex items-center justify-center text-[#C9A84C] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A8A] block">Location</span>
                  <span className="text-sm font-medium text-[#F5F2EB] block leading-tight">
                    Colombo, Sri Lanka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social & Exact Copyright */}
        <div className="pt-4 border-t border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4C4C4]">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-all shadow-2xs"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/share/1ENWdAdxez/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-all shadow-2xs"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@ceyloncrunchlk?_r=1&_t=ZS-9APNpLNJ9l8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-8 h-8 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-all shadow-2xs"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  d="M14.5 3v11.2a3.3 3.3 0 1 1-2.3-3.15V7.9a6.1 6.1 0 1 0 5.2 6V8.6c1.25.9 2.8 1.4 4.4 1.4V6.8c-2.4 0-4.4-1.5-4.9-3.8z"
                  fill="#25F4EE"
                  transform="translate(-1 0.5)"
                />
                <path
                  d="M14.5 3v11.2a3.3 3.3 0 1 1-2.3-3.15V7.9a6.1 6.1 0 1 0 5.2 6V8.6c1.25.9 2.8 1.4 4.4 1.4V6.8c-2.4 0-4.4-1.5-4.9-3.8z"
                  fill="#FE2C55"
                  transform="translate(0.7 -0.3)"
                />
                <path d="M14.5 3v11.2a3.3 3.3 0 1 1-2.3-3.15V7.9a6.1 6.1 0 1 0 5.2 6V8.6c1.25.9 2.8 1.4 4.4 1.4V6.8c-2.4 0-4.4-1.5-4.9-3.8z" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Exact Copyright */}
          <div className="text-center sm:text-right text-xs text-[#C4C4C4] leading-relaxed font-sans">
            <p>© 2026 Ceylon Crunch (Pvt) Ltd.</p>
            <p>Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
