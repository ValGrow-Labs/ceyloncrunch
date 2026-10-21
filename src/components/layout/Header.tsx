import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../../lib/store';
import { CATALOG_DIRECTORY } from '../../data/products';
import { Search, ShoppingBag, Menu, X, UserRound, ArrowRight, Phone, ChevronDown, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const { itemCount, patronProfile, isAdmin, customerEmail, siteSettings } = useStore();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle Escape key to close drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsShopMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isShopMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!shopMenuRef.current?.contains(event.target as Node)) {
        setIsShopMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isShopMenuOpen]);

  // Lock body scroll when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleShopButtonClick = () => {
    setIsShopMenuOpen(false);
    navigate('/shop');
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 pt-safe bg-[#FBF7F0]/95 backdrop-blur-xl border-b border-[#EADFD0] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        {/* Top Free Island Delivery Banner */}
        {siteSettings?.announcementActive !== false && (
          <div className="bg-[#1F3D2B] text-[#FBF7F0] px-3 sm:px-4 py-1.5 text-center transition-all">
            <p className="font-sans text-[10px] sm:text-[11px] lg:text-xs font-medium tracking-wide line-clamp-1 sm:line-clamp-none">
              {siteSettings?.announcementBanner || 'Free island-wide delivery on orders over Rs. 3,000 · Small-Batch Freshness Guaranteed'}
            </p>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="max-w-[1320px] mx-auto h-15 sm:h-16 px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 relative">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#424843] hover:text-[#1F3D2B] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center shrink-0 group py-1">
              <img
                src="/logo.png"
                alt="Ceylon Crunch - From Nature To Your Doorstep"
                className="h-9 sm:h-11 lg:h-13 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-sans text-sm font-medium text-[#2B2B2B]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-[#1F3D2B] transition-colors py-1 ${isActive ? 'text-[#1F3D2B] font-semibold border-b-2 border-[#1F3D2B]' : 'text-[#6B6B6B]'}`
              }
            >
              Home
            </NavLink>
            <div
              className="static"
              ref={shopMenuRef}
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <button
                type="button"
                aria-expanded={isShopMenuOpen}
                aria-controls="shop-category-menu"
                onClick={handleShopButtonClick}
                className={`inline-flex items-center gap-1 hover:text-[#1F3D2B] transition-colors py-1 ${isShopMenuOpen ? 'text-[#1F3D2B] font-semibold border-b-2 border-[#1F3D2B]' : 'text-[#6B6B6B]'}`}
              >
                <span>Shop</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isShopMenuOpen && (
                  <motion.div
                    id="shop-category-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.99 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-4 right-4 top-full z-50 pt-2 max-w-[1240px] mx-auto pointer-events-auto"
                  >
                    <div className="rounded-2xl border border-[#EADFD0] bg-white p-5 sm:p-6 shadow-2xl">
                      {/* Category Headlines Only - Balanced 8-Column Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4 items-end">
                        {[
                          { title: 'ALL PROVISIONS', slug: 'all', href: '/shop' },
                          { title: 'NUTS', slug: 'nuts', href: '/category/nuts' },
                          { title: 'DRIED FRUITS', slug: 'dried-fruits', href: '/category/dried-fruits' },
                          { title: 'DATES', slug: 'dates', href: '/category/dates' },
                          { title: 'SEEDS', slug: 'seeds', href: '/category/seeds' },
                          { title: 'BERRIES', slug: 'berries', href: '/category/berries' },
                          { title: 'EXOTIC NUTS', slug: 'exotic-nuts', href: '/category/exotic-nuts' },
                          { title: 'MIXES', slug: 'mixes', href: '/category/mixes' },
                          { title: 'WHOLE SPICES', slug: 'spices', href: '/category/spices' },
                        ].map((cat) => (
                          <Link
                            key={cat.slug}
                            to={cat.href}
                            onClick={() => setIsShopMenuOpen(false)}
                            className="group flex flex-col items-center justify-end h-11 pb-2.5 border-b-2 border-[#EADFD0] hover:border-[#B5741E] transition-all"
                          >
                            <span className="font-sans text-[11px] sm:text-xs lg:text-[13px] font-extrabold uppercase tracking-wider text-[#1B1B1B] group-hover:text-[#B5741E] transition-colors whitespace-nowrap text-center leading-none">
                              {cat.title}
                            </span>
                          </Link>
                        ))}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink
              to="/gifting"
              className={({ isActive }) =>
                `hover:text-[#1F3D2B] transition-colors py-1 ${isActive ? 'text-[#1F3D2B] font-semibold border-b-2 border-[#1F3D2B]' : 'text-[#6B6B6B]'}`
              }
            >
              Gifting
            </NavLink>
            <NavLink
              to="/our-story"
              className={({ isActive }) =>
                `hover:text-[#1F3D2B] transition-colors py-1 ${isActive ? 'text-[#1F3D2B] font-semibold border-b-2 border-[#1F3D2B]' : 'text-[#6B6B6B]'}`
              }
            >
              Our Story
            </NavLink>
            <NavLink
              to="/track"
              className={({ isActive }) =>
                `hover:text-[#1F3D2B] transition-colors py-1 ${isActive ? 'text-[#1F3D2B] font-semibold border-b-2 border-[#1F3D2B]' : 'text-[#6B6B6B]'}`
              }
            >
              Track Order
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search provisions"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#424843] hover:text-[#1F3D2B] hover:bg-[#EADFD0]/40 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              aria-label="View Cart"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#424843] hover:text-[#1F3D2B] hover:bg-[#EADFD0]/40 relative transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-sans text-[10px] leading-none font-bold shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Customer Account / Sign In */}
            <Link
              to="/profile"
              aria-label={customerEmail ? 'Customer Account & Orders' : 'Customer Sign In or Register'}
              title={
                customerEmail
                  ? `Customer Account: ${patronProfile?.name || customerEmail} (Signed In)`
                  : 'Customer Sign In & Registration'
              }
              className="relative flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-[#EADFD0]/40 transition-colors group"
            >
              <div className="relative w-8 h-8 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center shadow-xs text-xs font-bold group-hover:scale-105 transition-transform">
                {patronProfile?.name ? (
                  <span>{patronProfile.name.trim()[0].toUpperCase()}</span>
                ) : customerEmail ? (
                  <span>{customerEmail[0].toUpperCase()}</span>
                ) : (
                  <UserRound className="w-4 h-4" />
                )}
                {customerEmail && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2E7D4F] border-2 border-white rounded-full"
                    title="Customer Signed In"
                  />
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-[#424843] group-hover:text-[#1F3D2B]">
                {customerEmail ? (patronProfile?.name?.split(' ')[0] || 'My Account') : 'Sign In'}
              </span>
            </Link>

          </div>
        </div>

        {/* Collapsible Search Bar (Dropdown) */}
        {isSearchOpen && (
          <div className="w-full bg-[#FBF7F0] border-t border-[#EADFD0] px-4 py-3 shadow-inner animate-in fade-in slide-in-from-top-2">
            <div className="max-w-[700px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-[#8B5E3C] absolute left-3.5" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jumbo cashews, Medjool dates, cinnamon quills..."
                  className="w-full h-11 pl-11 pr-24 rounded-full bg-white border border-[#EADFD0] text-sm text-[#1F3D2B] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#1F3D2B] focus:ring-1 focus:ring-[#1F3D2B] shadow-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu (with Focus Trap & Overlay) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="relative mr-auto w-full max-w-xs h-full bg-[#FBF7F0] shadow-2xl flex flex-col p-6 overflow-y-auto no-scrollbar border-r border-[#EADFD0] animate-in slide-in-from-left duration-300"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EADFD0]">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Ceylon Crunch - From Nature To Your Doorstep"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-9 h-9 rounded-full bg-[#f0eded] text-[#2B2B2B] flex items-center justify-center hover:bg-[#e4e2e1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Account Quick Card */}
            <div className="mt-4 p-3 bg-white border border-[#EADFD0] rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                  {patronProfile?.name ? (
                    <span>{patronProfile.name.trim()[0].toUpperCase()}</span>
                  ) : customerEmail ? (
                    <span>{customerEmail[0].toUpperCase()}</span>
                  ) : (
                    <UserRound className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1F3D2B] truncate leading-tight">
                    {customerEmail ? (patronProfile?.name || customerEmail) : 'Customer Account'}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] truncate">
                    {customerEmail ? 'Signed In Patron' : 'Track orders & saved items'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                {customerEmail ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] hover:bg-[#EADFD0] transition-colors"
                  >
                    Orders
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1F3D2B] text-white text-[11px] font-bold hover:bg-[#162C1F] transition-colors shadow-2xs"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#EADFD0] text-[#1F3D2B] text-[11px] font-bold hover:bg-[#EADFD0] transition-colors"
                    >
                      Join
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col py-4 space-y-6 flex-1">
              {/* Shop Categories */}
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#8B5E3C] block mb-2.5">
                  Harvest Categories
                </span>
                <ul className="space-y-2 font-serif text-base text-[#1F3D2B]">
                  <li>
                    <Link
                      to="/shop"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>All Provisions</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/nuts"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Nuts</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/dried-fruits"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Dried Fruits</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/dates"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Dates</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/seeds"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Seeds</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/berries"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Berries</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/exotic-nuts"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Exotic Nuts</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/mixes"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Mixes</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/category/spices"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#8B5E3C] transition-colors"
                    >
                      <span>Island Spices</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/gifting"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-1 text-[#8B5E3C] font-semibold"
                    >
                      <span>Gifts & Hampers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company & Story */}
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#8B5E3C] block mb-2.5">
                  About Ceylon Crunch
                </span>
                <ul className="space-y-2 text-sm text-[#424843]">
                  <li>
                    <Link to="/our-story" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Our Story & Heritage
                    </Link>
                  </li>
                  <li>
                    <Link to="/sourcing" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Ethical Sourcing
                    </Link>
                  </li>
                  <li>
                    <Link to="/quality-promise" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Quality Promise
                    </Link>
                  </li>
                  <li>
                    <Link to="/track" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Track Your Order
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help & Support */}
              <div>
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#8B5E3C] block mb-2.5">
                  Assistance
                </span>
                <ul className="space-y-2 text-sm text-[#424843]">
                  <li>
                    <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Frequently Asked Questions
                    </Link>
                  </li>
                  <li>
                    <Link to="/shipping" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Island Shipping Details
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1 font-semibold text-[#1F3D2B]">
                      Customer Profile &amp; Orders
                    </Link>
                  </li>
                  {!customerEmail ? (
                    <>
                      <li>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1F3D2B] block py-1 text-sm text-[#424843]">
                          Customer Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)} className="hover:text-[#8B5E3C] block py-1 text-sm text-[#8B5E3C] font-medium">
                          Create Account
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ul>
              </div>
            </div>

            {/* Quick Contact & WhatsApp Concierge in drawer */}
            <div className="pt-4 border-t border-[#EADFD0] flex flex-col gap-2">
              <a
                href="tel:+94779443867"
                className="w-full py-2.5 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us: +94 77 944 3867</span>
              </a>
              <a
                href="https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-98"
              >
                <span>WhatsApp: +94 77 944 3867</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
