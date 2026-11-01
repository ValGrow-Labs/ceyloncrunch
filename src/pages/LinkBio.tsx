import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  ShoppingBag,
  Gift,
  Briefcase,
  MessageCircle,
  Truck,
  PhoneCall,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  MapPin,
  X,
  BadgeCheck,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { linkBioConfig, BioLinkItem, SocialLink } from '../data/linksConfig';

// Custom TikTok SVG Icon
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M14.5 3v11.2a3.3 3.3 0 1 1-2.3-3.15V7.9a6.1 6.1 0 1 0 5.2 6V8.6c1.25.9 2.8 1.4 4.4 1.4V6.8c-2.4 0-4.4-1.5-4.9-3.8z" />
  </svg>
);

// Custom WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
  </svg>
);

// Map string icon names to components
const renderButtonIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Globe':
      return <Globe className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'MessageCircle':
      return <WhatsAppIcon className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'PhoneCall':
      return <PhoneCall className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Instagram':
      return <Instagram className={className} />;
    case 'TikTok':
      return <TikTokIcon className={className} />;
    case 'Youtube':
      return <Youtube className={className} />;
    case 'Facebook':
      return <Facebook className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'Phone':
      return <Phone className={className} />;
    default:
      return <Globe className={className} />;
  }
};

const renderSocialIcon = (icon: SocialLink['icon'], className = 'w-5 h-5') => {
  switch (icon) {
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'whatsapp':
      return <WhatsAppIcon className={className} />;
    default:
      return <Globe className={className} />;
  }
};

export const LinkBio: React.FC = () => {
  const { brand, socialLinks, buttons } = linkBioConfig;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${brand.name} | ${brand.tagline}`,
      text: brand.description,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to copy modal
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredButtons = selectedCategory === 'all'
    ? buttons
    : buttons.filter((b) => b.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Links' },
    { id: 'shop', label: 'Shop & Gifts' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Socials' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#2B2B2B] relative selection:bg-[#EADFD0] selection:text-[#1F3D2B] overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Decorative Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#1F3D2B]/10 via-[#C5A059]/10 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#8B5E3C]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#1F3D2B]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 pt-6 pb-12 flex-1 flex flex-col items-center">
        
        {/* Top Floating Action Bar */}
        <header className="w-full flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-all shadow-xs"
            title="Return to Main Store"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Store</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share Link-in-Bio page"
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-[#EADFD0] text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
            title="Share this page"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </header>

        {/* 1. Profile Section */}
        <div className="flex flex-col items-center text-center space-y-3.5 w-full">
          {/* Brand Logo Avatar */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative group"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#1F3D2B] via-[#C5A059] to-[#8B5E3C] shadow-lg shadow-[#1F3D2B]/10">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-3.5 overflow-hidden">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            {brand.verified && (
              <span
                className="absolute bottom-1 right-1 bg-[#1F3D2B] text-[#C5A059] rounded-full p-1 shadow-md border-2 border-white"
                title="Verified Official Brand Profile"
              >
                <BadgeCheck className="w-4 h-4 fill-[#C5A059] text-white" />
              </span>
            )}
          </motion.div>

          {/* Brand Name & Tagline */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1F3D2B]">
                {brand.name}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
              {brand.tagline}
            </p>
          </div>

          {/* Short & Attractive Brand Description */}
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-sm px-2 font-normal">
            {brand.description}
          </p>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B6B6B] bg-[#EADFD0]/40 px-3 py-1 rounded-full border border-[#EADFD0]">
            <MapPin className="w-3 h-3 text-[#C5A059]" />
            <span>{brand.location}</span>
          </div>

          {/* Quick Social Media Icons Row */}
          <div className="pt-2 pb-1 flex items-center justify-center gap-3 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="w-10 h-10 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] hover:text-white hover:bg-[#1F3D2B] hover:border-[#1F3D2B] hover:scale-110 active:scale-95 transition-all shadow-xs"
                title={`${social.name} (${social.handle})`}
              >
                {renderSocialIcon(social.icon, 'w-4 h-4')}
              </a>
            ))}
          </div>
        </div>

        {/* Category Filter Pills (Linktree-style navigation tabs) */}
        <div className="w-full mt-6 mb-4 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-[#1F3D2B] text-white shadow-xs'
                  : 'bg-white/70 text-[#6B6B6B] border border-[#EADFD0] hover:text-[#1F3D2B] hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 2. Link Buttons Section */}
        <div className="w-full space-y-3 mt-1">
          {filteredButtons.map((btn, index) => {
            const isFeatured = btn.highlight;

            const buttonContent = (
              <div
                className={`relative group w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 text-left ${
                  isFeatured
                    ? 'bg-gradient-to-r from-[#1F3D2B] to-[#284E37] text-white shadow-md hover:shadow-lg hover:from-[#162C1F] hover:to-[#1F3D2B] hover:-translate-y-0.5 border border-[#C5A059]/40'
                    : 'bg-white hover:bg-[#FAF8F4] text-[#1F3D2B] border border-[#EADFD0] hover:border-[#C5A059] shadow-xs hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Left: Icon Badge */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isFeatured
                        ? 'bg-[#C5A059] text-[#1F3D2B] shadow-inner'
                        : 'bg-[#FBF7F0] border border-[#EADFD0] text-[#1F3D2B] group-hover:bg-[#1F3D2B] group-hover:text-white group-hover:border-[#1F3D2B]'
                    }`}
                  >
                    {renderButtonIcon(btn.icon, 'w-5 h-5')}
                  </div>

                  {/* Center: Title & Subtitle */}
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm sm:text-base font-semibold leading-snug tracking-tight block ${
                          isFeatured ? 'text-white' : 'text-[#1F3D2B]'
                        }`}
                      >
                        {btn.title}
                      </span>
                      {btn.badge && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isFeatured
                              ? 'bg-[#C5A059] text-[#1F3D2B]'
                              : 'bg-[#1F3D2B]/10 text-[#1F3D2B]'
                          }`}
                        >
                          {btn.badge}
                        </span>
                      )}
                    </div>
                    {btn.subtitle && (
                      <p
                        className={`text-xs mt-0.5 leading-normal truncate ${
                          isFeatured ? 'text-white/80' : 'text-[#6B6B6B]'
                        }`}
                      >
                        {btn.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Action Indicator */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isFeatured
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FBF7F0] text-[#8B5E3C] group-hover:bg-[#1F3D2B] group-hover:text-white'
                  }`}
                >
                  {btn.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            );

            return (
              <motion.div
                key={btn.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                {btn.isExternal ? (
                  <a
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block outline-hidden focus:ring-2 focus:ring-[#C5A059] rounded-2xl"
                  >
                    {buttonContent}
                  </a>
                ) : (
                  <Link
                    to={btn.url}
                    className="block outline-hidden focus:ring-2 focus:ring-[#C5A059] rounded-2xl"
                  >
                    {buttonContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust & Guarantee Callout */}
        <div className="mt-8 w-full bg-white/70 backdrop-blur-xs border border-[#EADFD0] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>100% Handcrafted • Island-Wide Dispatch • Direct WhatsApp Support</span>
          </div>
        </div>

      </div>

      {/* Modern Micro Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-[#EADFD0]/80 bg-white/50 backdrop-blur-md text-center text-xs text-[#6B6B6B] space-y-2">
        <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-[#8B5E3C]">
          <Link to="/" className="hover:text-[#1F3D2B] transition-colors">Home</Link>
          <span>•</span>
          <Link to="/shop" className="hover:text-[#1F3D2B] transition-colors">Products</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-[#1F3D2B] transition-colors">Contact</Link>
          <span>•</span>
          <Link to="/privacy-policy" className="hover:text-[#1F3D2B] transition-colors">Privacy</Link>
        </div>
        <p className="text-[11px] font-sans">
          © {new Date().getFullYear()} Ceylon Crunch (Pvt) Ltd. All rights reserved.
        </p>
      </footer>

      {/* Share / Copy Link Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#EADFD0] space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EADFD0]">
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Share Link-in-Bio
                </h3>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FBF7F0] flex items-center justify-center text-[#6B6B6B] hover:text-[#1F3D2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Share Ceylon Crunch's central links hub with your followers, clients, and partners.
              </p>

              {/* URL Box with Copy Button */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FBF7F0] border border-[#EADFD0]">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="text-xs text-[#1F3D2B] bg-transparent flex-1 outline-hidden select-all font-mono"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Social Share Buttons */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] block mb-2">
                  Share directly:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Discover Ceylon Crunch - From Nature To Your Doorstep: ${window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] text-xs font-semibold hover:bg-[#1877F2]/20 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

