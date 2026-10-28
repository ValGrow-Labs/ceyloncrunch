import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  CheckCircle2,
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Flame,
  Award,
  Clock,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { ProductCard } from '../components/product/ProductCard';

export const Landing: React.FC = () => {
  const { products, showToast } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  // Social Links
  const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr',
    facebook: 'https://www.facebook.com/share/1ENWdAdxez/',
    tiktok: 'https://www.tiktok.com/@ceyloncrunchlk?_r=1&_t=ZS-9APNpLNJ9l8',
    whatsapp: 'https://wa.me/94779443867?text=' + encodeURIComponent('Hello Ceylon Crunch! I am visiting your landing page and would like to order fresh provisions.'),
    phone: '+94 77 944 3867',
    email: 'ceyloncrunch26@gmail.com',
    location: 'Colombo, Sri Lanka',
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('CRUNCH10');
    setCopiedCode(true);
    showToast('Promo code "CRUNCH10" copied to clipboard! (10% OFF)');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Filter curated products for showcase
  const showcaseProducts = products
    .filter((p) => {
      if (activeCategory === 'all') return true;
      return p.category === activeCategory;
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col w-full space-y-16 lg:space-y-24 pb-16">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] -mt-4 sm:-mt-5 lg:-mt-9 border-b border-[#EADFD0] bg-[#FAF8F4] overflow-hidden">
        <div className="relative isolate w-full bg-[#FBF7F0] overflow-hidden">
          {/* Background Hero Image */}
          <motion.img
            src="/hero-nuts.png"
            alt="Ceylon Crunch Premium Harvest"
            initial={{ scale: 1.05, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover object-[86%_center] xs:object-[80%_center] sm:object-[75%_center] lg:object-[82%_center]"
          />

          {/* Readability & Atmosphere Gradients */}
          <div className="absolute inset-0 bg-[#FBF7F0]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0] via-[#FBF7F0]/90 via-[52%] to-transparent to-[85%] sm:via-[#FBF7F0]/60 sm:via-[45%] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF7F0] via-transparent to-transparent pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 max-w-[1440px] mx-auto min-h-[440px] xs:min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
            <div className="w-full max-w-2xl flex flex-col items-start space-y-4 sm:space-y-6 text-left">
              {/* Top Origin Tag */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B5132]/10 border border-[#1B5132]/20 backdrop-blur-xs text-[#1B5132] text-[11px] sm:text-xs font-semibold uppercase tracking-widest"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B5741E] animate-pulse" />
                <span>Single-Estate Harvest · Colombo, Sri Lanka</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F3822] tracking-tight leading-[1.08] uppercase"
              >
                Pure Ceylon Harvest.{' '}
                <span className="block text-[#B5741E] font-serif mt-1">
                  Crafted For True Crunch.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-sans text-xs xs:text-sm sm:text-base lg:text-lg text-[#3E3E3E] leading-relaxed max-w-xl"
              >
                Handpicked Puttalam cashews, California almonds, sun-cured Medjool dates, wild Ceylon spices, and slow-dehydrated tropical fruits — pan-roasted in small batches with zero preservatives.
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center gap-3 pt-2 w-full xs:w-auto"
              >
                <Link
                  to="/shop"
                  className="group min-h-[46px] sm:min-h-[50px] px-6 sm:px-8 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop The Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-h-[46px] sm:min-h-[50px] px-5 sm:px-7 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span>Order on WhatsApp</span>
                </a>
              </motion.div>

              {/* Fast Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#EADFD0]/80 w-full text-left"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F3D2B]">
                  <ShieldCheck className="w-4 h-4 text-[#B5741E] shrink-0" />
                  <span>100% Pure &amp; Natural</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F3D2B]">
                  <Flame className="w-4 h-4 text-[#B5741E] shrink-0" />
                  <span>Small-Batch Roast</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F3D2B]">
                  <Truck className="w-4 h-4 text-[#B5741E] shrink-0" />
                  <span>Islandwide Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F3D2B]">
                  <Star className="w-4 h-4 text-[#B5741E] fill-[#B5741E] shrink-0" />
                  <span>4.9★ Rated Quality</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT SOCIAL MEDIA PAVILION (KEY REQUIREMENT) */}
      <section className="bg-gradient-to-b from-white to-[#FBF7F0] border border-[#EADFD0] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#1B5132]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#B5741E] inline-flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Follow Our Journey Across Ceylon
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#0F3822] font-bold tracking-tight">
              Connect With Ceylon Crunch
            </h2>
            <p className="text-xs sm:text-sm text-[#5B5B5B] leading-relaxed">
              Stay in touch with our daily orchard harvests, artisan pan-roasting stories, healthy crunch recipes, and direct customer care on all official channels.
            </p>
          </div>

          {/* Social Platforms Cards Grid (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. INSTAGRAM */}
            <motion.a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group bg-white rounded-2xl border border-[#EADFD0] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#E1306C]/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/20">
                    Official Feed
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F3D2B] group-hover:text-[#E1306C] transition-colors flex items-center gap-1.5">
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </h3>
                  <p className="text-xs font-mono font-semibold text-[#8B5E3C] mt-0.5">
                    @ceyloncrunch_lk
                  </p>
                </div>

                <p className="text-xs text-[#5B5B5B] leading-relaxed">
                  Daily visual stories of fresh orchard arrivals, artisan pan-roasting behind the scenes, and healthy morning bowls.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs font-semibold text-[#E1306C]">
                <span>Follow on Instagram</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* 2. FACEBOOK */}
            <motion.a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group bg-white rounded-2xl border border-[#EADFD0] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#1877F2]/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
                    Community
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F3D2B] group-hover:text-[#1877F2] transition-colors flex items-center gap-1.5">
                    <span>Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </h3>
                  <p className="text-xs font-mono font-semibold text-[#8B5E3C] mt-0.5">
                    Ceylon Crunch
                  </p>
                </div>

                <p className="text-xs text-[#5B5B5B] leading-relaxed">
                  Join our Sri Lankan patron community. Announcements for new seasonal harvest clusters, hampers, and giveaways.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs font-semibold text-[#1877F2]">
                <span>Visit Facebook Page</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* 3. TIKTOK */}
            <motion.a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group bg-white rounded-2xl border border-[#EADFD0] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#000000]/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#000000] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current">
                      <path d="M14.5 3v11.2a3.3 3.3 0 1 1-2.3-3.15V7.9a6.1 6.1 0 1 0 5.2 6V8.6c1.25.9 2.8 1.4 4.4 1.4V6.8c-2.4 0-4.4-1.5-4.9-3.8z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/10 text-black border border-black/20">
                    Trending Videos
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F3D2B] group-hover:text-black transition-colors flex items-center gap-1.5">
                    <span>TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </h3>
                  <p className="text-xs font-mono font-semibold text-[#8B5E3C] mt-0.5">
                    @ceyloncrunchlk
                  </p>
                </div>

                <p className="text-xs text-[#5B5B5B] leading-relaxed">
                  Crisp unboxing ASMR, 30-second granola recipes, and high-energy snack hacks for school, work &amp; workout.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs font-semibold text-black">
                <span>Watch on TikTok</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>

            {/* 4. WHATSAPP CONCIERGE */}
            <motion.a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group bg-gradient-to-b from-white to-[#F0FDF4] rounded-2xl border-2 border-[#25D366]/40 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#25D366] transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#25D366]/15 text-[#15803d] border border-[#25D366]/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                    Online Now
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1F3D2B] group-hover:text-[#15803d] transition-colors flex items-center gap-1.5">
                    <span>WhatsApp VIP</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  </h3>
                  <p className="text-xs font-mono font-semibold text-[#15803d] mt-0.5">
                    +94 77 944 3867
                  </p>
                </div>

                <p className="text-xs text-[#5B5B5B] leading-relaxed">
                  Chat directly with our Colombo concierge for instant order booking, custom hamper gifting, and corporate delivery.
                </p>
              </div>

              <div className="pt-3 border-t border-[#DCFCE7] flex items-center justify-between text-xs font-semibold text-[#15803d]">
                <span>Direct WhatsApp Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          </div>

          {/* Direct Contact Quick Bar */}
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-[#EADFD0] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 sm:gap-8 text-xs text-[#4A4A4A]">
              <a href={`tel:${SOCIAL_LINKS.phone}`} className="inline-flex items-center gap-2 hover:text-[#B5741E] font-medium transition-colors">
                <Phone className="w-4 h-4 text-[#B5741E]" />
                <span>{SOCIAL_LINKS.phone}</span>
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="inline-flex items-center gap-2 hover:text-[#B5741E] font-medium transition-colors">
                <Mail className="w-4 h-4 text-[#B5741E]" />
                <span>{SOCIAL_LINKS.email}</span>
              </a>
              <span className="inline-flex items-center gap-2 text-[#4A4A4A] font-medium">
                <MapPin className="w-4 h-4 text-[#B5741E]" />
                <span>{SOCIAL_LINKS.location}</span>
              </span>
            </div>

            <div className="text-xs font-semibold text-[#1F3D2B] flex items-center gap-2">
              <span className="text-[#8B5E3C]">Hashtag Us:</span>
              <span className="font-mono text-[#0F3822] bg-[#FAF8F4] px-2.5 py-1 rounded-md border border-[#EADFD0]">
                #CeylonCrunch
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE HARVEST CATALOG SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADFD0] pb-4">
          <div>
            <span className="text-[11px] font-sans uppercase font-bold tracking-widest text-[#B5741E] block">
              Handpicked &amp; Freshly Packed
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F3822] font-bold tracking-tight mt-1">
              Signature Provisions
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
              Select an artisan category to explore our premier harvest collection.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5132] hover:text-[#B5741E] transition-colors"
          >
            <span>View Full 30+ Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Provisions' },
            { id: 'nuts', label: 'Artisan Nuts' },
            { id: 'dried-fruits', label: 'Sun-Dried Fruits' },
            { id: 'dates', label: 'Royal Dates' },
            { id: 'seeds', label: 'Super Seeds' },
            { id: 'spices', label: 'Ceylon Spices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1B5132] text-white shadow-xs'
                  : 'bg-white text-[#4A4A4A] border border-[#EADFD0] hover:border-[#1B5132]/40 hover:bg-[#FAF8F4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {showcaseProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. THE ARTISAN DIFFERENCE (WHY CEYLON CRUNCH) */}
      <section className="bg-white border border-[#EADFD0] rounded-3xl p-6 sm:p-12 shadow-xs space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#B5741E]">
            Our Uncompromising Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#0F3822] font-bold tracking-tight">
            The Ceylon Crunch Difference
          </h2>
          <p className="text-xs sm:text-sm text-[#5B5B5B] leading-relaxed">
            From tropical groves to small pan roasting, we preserve wholesome integrity in every single batch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B5132]/10 text-[#1B5132] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0F3822]">Single-Estate Terroir</h3>
            <p className="text-xs text-[#5B5B5B] leading-relaxed">
              We partner directly with sustainable orchards across Puttalam, Matale, and Nuwara Eliya for unmatched natural provenance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B5132]/10 text-[#1B5132] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0F3822]">Slow Pan-Roasted</h3>
            <p className="text-xs text-[#5B5B5B] leading-relaxed">
              Never deep-fried or processed with industrial palm oils. Gently heated to release rich internal aromatics and superior crunch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B5132]/10 text-[#1B5132] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0F3822]">72-Hour Fresh Seal</h3>
            <p className="text-xs text-[#5B5B5B] leading-relaxed">
              Sealed in multi-layer airtight pouches with oxygen scavengers within 72 hours of harvest to lock in orchard-fresh crispness.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B5132]/10 text-[#1B5132] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#0F3822]">Ethical Compensation</h3>
            <p className="text-xs text-[#5B5B5B] leading-relaxed">
              We ensure our local farming families receive transparent above-market prices, supporting community education and soil health.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED PATRON TESTIMONIALS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#B5741E]">
            Voices of Ceylon
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0F3822] font-bold tracking-tight">
            Loved By Sri Lankan Food Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              quote:
                'The Grade W-210 jumbo cashews are exceptionally crunchy and perfectly salted. Delivered to Colombo 7 within 24 hours of ordering on WhatsApp!',
              author: 'Dilan Perera',
              location: 'Colombo, Sri Lanka',
              badge: 'Verified Buyer',
              rating: 5,
            },
            {
              quote:
                'We customized 40 luxury curated hampers for our company anniversary. The wooden presentation, ribbons, and freshness of the Medjool dates blew our clients away.',
              author: 'Ananya Senanayake',
              location: 'Kandy / Corporate Client',
              badge: 'Corporate Partner',
              rating: 5,
            },
            {
              quote:
                'Hands down the best dried mango and pumpkin seeds in the country. Zero added sugar or chemicals, just pure natural sweetness. My everyday snack.',
              author: 'Dr. Tariq M.',
              location: 'Galle, Sri Lanka',
              badge: 'Verified Buyer',
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EADFD0] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#B5741E]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#B5741E]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#444444] italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#0F3822]">{item.author}</h4>
                  <span className="text-[11px] text-[#7A7A7A]">{item.location}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1B5132]/10 text-[#1B5132]">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXCLUSIVE LANDING PROMOTION VOUCHER CARD */}
      <section className="bg-gradient-to-r from-[#0F3822] via-[#1B5132] to-[#0F3822] text-white rounded-3xl p-7 sm:p-12 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FFDF88]">
              <Sparkles className="w-3.5 h-3.5" />
              Special Landing Invitation
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#FAF8F4]">
              Taste The Island's Finest Harvest Today
            </h2>
            <p className="text-xs sm:text-sm text-[#D3E4D8] leading-relaxed max-w-lg">
              Enjoy 10% off your entire first order of single-estate nuts, dates, and provisions. Fast safe delivery right to your door.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            {/* Promo Code Box */}
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2 w-full min-w-[220px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFDF88]">
                Coupon Code
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-white">
                  CRUNCH10
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Copy coupon code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Link
              to="/shop"
              className="w-full h-11 px-6 rounded-full bg-[#B5741E] hover:bg-[#975f15] text-white font-sans text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Claim &amp; Shop Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
