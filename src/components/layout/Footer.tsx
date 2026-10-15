import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

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
          <p className="text-xs text-[#C4C4C4] font-medium uppercase tracking-widest">
            Hand-harvested · Sun-cured · Ceylon Pure
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
          {/* Shop */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              Shop
            </span>
            <ul className="space-y-2 text-sm text-[#C4C4C4]">
              <li>
                <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/nuts" className="hover:text-[#C9A84C] transition-colors">
                  Nuts
                </Link>
              </li>
              <li>
                <Link to="/category/dried-fruits" className="hover:text-[#C9A84C] transition-colors">
                  Dried Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/dates" className="hover:text-[#C9A84C] transition-colors">
                  Dates
                </Link>
              </li>
              <li>
                <Link to="/category/seeds" className="hover:text-[#C9A84C] transition-colors">
                  Seeds
                </Link>
              </li>
              <li>
                <Link to="/category/spices" className="hover:text-[#C9A84C] transition-colors">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/category/seeds" className="hover:text-[#C9A84C] transition-colors">
                  Healthy Snacks
                </Link>
              </li>
              <li>
                <Link to="/gifting" className="hover:text-[#C9A84C] transition-colors">
                  Gifts &amp; Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              Company
            </span>
            <ul className="space-y-2 text-sm text-[#C4C4C4]">
              <li>
                <Link to="/our-story" className="hover:text-[#C9A84C] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A84C] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#C9A84C] transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C9A84C] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/corporate" className="hover:text-[#C9A84C] transition-colors">
                  Corporate &amp; Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#C9A84C] transition-colors text-xs font-semibold">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              Help
            </span>
            <ul className="space-y-2 text-sm text-[#C4C4C4]">
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
              <li>
                <Link to="/track" className="hover:text-[#C9A84C] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#C9A84C] transition-colors flex items-center gap-1">
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C9A84C] block">
              CONTACT
            </span>
            <ul className="space-y-2 text-sm text-[#C4C4C4]">
              <li>
                <a
                  href="tel:+94779443867"
                  className="hover:text-[#C9A84C] transition-colors flex items-center gap-1.5"
                  title="Call Ceylon Crunch"
                >
                  <span>+94 77 944 3867</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:ceyloncrunch26@gmail.com"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  ceyloncrunch26@gmail.com
                </a>
              </li>
              <li className="pt-1">Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-6 border-t border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4C4C4]">
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
          <p className="text-center sm:text-right">© 2026 Ceylon Crunch. All rights reserved. Handcrafted in Sri Lanka.</p>
        </div>

        {/* Developer Credit */}
        <div className="pt-2 text-center text-xs text-[#8A8A8A]">
          Designed &amp; Developed by <span className="font-bold text-[#C9A84C]">ValGrow Labs</span>
        </div>
      </div>
    </footer>
  );
};
