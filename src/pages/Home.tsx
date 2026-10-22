import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../lib/store';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Store, ShieldCheck, Leaf, ShoppingCart, Truck, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  const { products } = useStore();

  // Popular Picks explicitly: Almonds, Cashews, Pistachios, mixed nuts, hamper, nuts box
  const popularPicks = useMemo(() => {
    const desiredSlugs = [
      'roasted-almonds',
      'roasted-cashews',
      'roasted-pistachios',
      'mixed-nuts',
      'curated-hamper',
      'nuts-box',
    ];
    const picked: typeof products = [];
    for (const slug of desiredSlugs) {
      const match = products.find((p) => p.slug === slug);
      if (match) picked.push(match);
    }
    // If any items are missing, fill with featured products
    if (picked.length === 0) {
      return products.filter((p) => p.isFeatured).slice(0, 6);
    }
    return picked;
  }, [products]);

  const trustFeatures = [
    {
      icon: Leaf,
      title: 'Fresh',
      subtitle: 'No artificial additives',
      titleColor: 'text-[#1B5132]',
    },
    {
      icon: ShieldCheck,
      title: 'Premium Quality',
      subtitle: 'Carefully selected',
      titleColor: 'text-[#2B2B2B]',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      subtitle: 'To your doorstep',
      titleColor: 'text-[#1B5132]',
    },
    {
      icon: Heart,
      title: 'Better Choices',
      subtitle: 'For a healthier you',
      titleColor: 'text-[#2B2B2B]',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-12 lg:space-y-16 pb-12">
      {/* 1. FULL-WIDTH HERO & TRUST BANNER */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] -mt-4 sm:-mt-5 lg:-mt-9 border-b border-[#EADFD0] bg-[#FAF8F4] overflow-hidden">
        {/* Top Hero Area */}
        <div className="relative isolate w-full overflow-hidden bg-[#FBF7F0]">
          <motion.img
            src="/hero-nuts.png"
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.05, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover object-[88%_center] xs:object-[82%_center] sm:object-[74%_center] lg:object-[80%_center]"
          />
          <div className="absolute inset-0 bg-[#FBF7F0]/20 pointer-events-none" />
          {/* Directional readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0] via-[#FBF7F0]/85 via-[48%] to-transparent to-[75%] sm:via-[#FBF7F0]/40 sm:via-[40%] sm:to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[1440px] mx-auto flex items-center min-h-[340px] xs:min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
            {/* Hero Copy: Left-Aligned across all screens */}
            <div className="w-full pl-4 xs:pl-6 sm:pl-8 md:pl-12 lg:pl-20 pr-3 sm:pr-6 py-7 xs:py-9 sm:py-12 lg:py-16 flex flex-col items-start text-left space-y-2.5 xs:space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-start gap-1.5 sm:gap-2 text-[#1B5132] font-sans text-[9px] xs:text-[10px] md:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.12em] xs:tracking-[0.14em]"
              >
                <span className="w-2.5 h-[1px] bg-[#1B5132]/50" />
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B5132] shrink-0 animate-leaf-sway" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
                </svg>
                <span className="whitespace-nowrap">Ceylon Crunch — Established 2026</span>
                <span className="w-4 sm:w-6 lg:w-10 h-[1px] bg-[#1B5132]/40" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-serif text-[22px] xs:text-[28px] sm:text-[36px] md:text-[44px] lg:text-[54px] font-bold text-[#0F3822] tracking-tight leading-[1.08] sm:leading-[1.1] uppercase max-w-[66%] xs:max-w-[62%] sm:max-w-[52%] md:max-w-lg lg:max-w-xl"
              >
                Better Choices <br />
                <span className="text-[#B5741E]">
                  Begin Here.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="font-sans text-[11px] xs:text-xs md:text-sm lg:text-base text-[#4A4A4A] leading-relaxed max-w-[64%] xs:max-w-[60%] sm:max-w-[50%] md:max-w-md"
              >
                Quality nuts, dried fruits, dates, seeds, spices, and more — selected with care and delivered to your doorstep.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44 }}
                className="flex flex-row flex-wrap items-center justify-start gap-2 xs:gap-2.5 sm:gap-3 pt-1 w-auto"
              >
                <Link
                  to="/shop"
                  className="group whitespace-nowrap min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] lg:min-h-[48px] px-3.5 xs:px-4.5 sm:px-6 lg:px-8 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-[11px] xs:text-xs lg:text-sm font-semibold inline-flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <ShoppingCart className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/our-story"
                  className="group whitespace-nowrap min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] lg:min-h-[48px] px-3.5 xs:px-4.5 sm:px-6 lg:px-8 rounded-full bg-[#FAF8F4]/90 hover:bg-white text-[#1B5132] border border-[#1B5132]/60 font-sans text-[11px] xs:text-xs lg:text-sm font-semibold inline-flex items-center justify-center gap-1 sm:gap-1.5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Curved Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-7 sm:h-10 lg:h-14 block"
            >
              <path
                d="M0,32 C420,68 960,10 1440,42 L1440,60 L0,60 Z"
                fill="#FAF8F4"
              />
            </svg>
          </div>
        </div>

        {/* Bottom 4-Column Feature / Trust Strip */}
        <div className="bg-[#FAF8F4] px-3 xs:px-4 sm:px-8 lg:px-16 py-4 xs:py-5 sm:py-6 border-t border-[#EFECE6]/80">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 md:gap-0 md:divide-x divide-[#E2DDD2]">
            {trustFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + idx * 0.1 }}
                  className="group flex items-center gap-2.5 xs:gap-3.5 md:justify-center md:px-4 lg:px-6"
                >
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-[#E6ECE2] group-hover:bg-[#1B5132] group-hover:text-white flex items-center justify-center text-[#1B5132] shrink-0 transition-all duration-300 group-hover:scale-110 shadow-2xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-sans text-[11px] xs:text-xs sm:text-sm font-bold ${feat.titleColor} block leading-snug truncate`}>
                      {feat.title}
                    </span>
                    <span className="font-sans text-[10px] sm:text-[11px] text-[#6B6B6B] block mt-0.5 truncate">
                      {feat.subtitle}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY MAIN HEADLINES STRIP (4-Row 2-Column on mobile) */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-2xs"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 text-left">
          {[
            { title: 'NUTS', slug: 'nuts' },
            { title: 'DRIED FRUITS', slug: 'dried-fruits' },
            { title: 'DATES', slug: 'dates' },
            { title: 'SEEDS', slug: 'seeds' },
            { title: 'SPICES', slug: 'spices' },
            { title: 'GIFTS & HAMPERS', slug: 'gifting', isCustom: true },
            { title: 'BERRIES', slug: 'berries' },
            { title: 'MIXES', slug: 'mixes' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={cat.isCustom ? `/${cat.slug}` : `/category/${cat.slug}`}
              className="group block border-b-2 border-[#EADFD0] hover:border-[#B5741E] pb-2 transition-all"
            >
              <span className="font-sans text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1B1B1B] group-hover:text-[#B5741E] transition-colors block text-center sm:text-left leading-tight">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 3. CUSTOMER FAVOURITES - POPULAR PICKS */}
      <section className="flex flex-col space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-baseline justify-between border-b border-[#EADFD0] pb-3"
        >
          <div>
            <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C]">
              Our Favourites
            </span>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold tracking-tight mt-0.5">
              Popular Picks
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Almonds, Cashews, Pistachios, Mixed Nuts, Curated Hampers &amp; Artisan Boxes.
            </p>
          </div>
          <Link
            to="/shop"
            className="group text-xs font-semibold text-[#1F3D2B] hover:text-[#8B5E3C] inline-flex items-center gap-1 transition-colors"
          >
            <span>View all products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid - 6 Popular Picks */}
        {popularPicks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 lg:gap-5">
            {popularPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-8 text-center text-[#6B6B6B] text-sm">
            No products available yet. Check back soon for fresh arrivals!
          </div>
        )}
      </section>

      {/* 4. WHY CEYLON CRUNCH */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xs space-y-6"
      >
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C]">
            WHY CEYLON CRUNCH
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold tracking-tight">
            Good Food. Thoughtfully Chosen.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed pt-1">
            We believe good nutriments makes everyday moments better. From everyday snacking to gifting, we carefully select our products for quality, freshness and taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              Chosen With Purpose
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              A considered range of products for everyday enjoyment and special moments.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              Quality Comes First
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              We pay attention to the products we select and how each order is prepared.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              From Our Hands to Yours
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              Every order is packed with care and delivered to your doorstep.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 5. EXPLORE CEYLON CRUNCH (OUR COLLECTION) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl bg-[#1B5132] text-white p-7 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#D9A441]">
            EXPLORE CEYLON CRUNCH
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl font-bold">
            Goodness for Every Day.
          </h2>
          <p className="text-xs sm:text-sm text-[#FBF7F0]/85 leading-relaxed">
            Discover our range of nuts, dates, dried fruits, seeds and more.
          </p>
        </div>
        <Link
          to="/shop"
          className="h-12 px-7 rounded-full bg-[#FAF8F4] hover:bg-white text-[#1B5132] font-sans text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
        >
          <span>Shop All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>

      {/* 6. SHOP BY CATEGORY (6 VISUAL CARDS) */}
      <section className="flex flex-col space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-baseline justify-between border-b border-[#EADFD0] pb-3"
        >
          <div>
            <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C]">
              Shop by Category
            </span>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold tracking-tight mt-0.5">
              Find What You Need.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-5">
          {[
            {
              name: 'Nuts',
              slug: 'nuts',
              image: '/products/nuts/cashews.jpg',
              description: 'Almonds, cashews, pistachios, walnuts and more.',
            },
            {
              name: 'Dried Fruits',
              slug: 'dried-fruits',
              image: '/products/dried-fruits/dried-apricots.jpeg',
              description: 'Naturally sweet and convenient for everyday snacking.',
            },
            {
              name: 'Seeds & Grains',
              slug: 'seeds',
              image: '/products/seeds/pumpkin-seeds.jpeg',
              description: 'Raw chia, flax, pumpkin, hemp hearts and superfoods.',
            },
            {
              name: 'Tropical Provisions',
              slug: 'dried-fruits',
              image: '/products/dried-fruits/dried-mango.jpeg',
              description: 'Ceylon pineapples, mangoes, bananas, and strawberries.',
            },
            {
              name: 'Healthy Snacks',
              slug: 'mixes',
              image: '/products/nuts/mixed-nuts.jpg',
              description: 'Easy choices for home, work and on the go.',
            },
            {
              name: 'Gifts & Hampers',
              slug: 'gifting',
              image: '/products/gifting/curated-hamper.jpg',
              description: 'Thoughtful options for every occasion.',
              isCustomRoute: true,
            },
          ].map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
            >
              <Link
                to={cat.isCustomRoute ? `/${cat.slug}` : `/category/${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl border border-[#EADFD0] bg-[#f6f3f2] transition-shadow duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/90 via-[#1F3D2B]/35 to-transparent flex flex-col justify-end p-3.5 lg:p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg lg:text-xl font-bold text-white leading-tight group-hover:text-[#ffdeaa] transition-colors">
                      {cat.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#ffdeaa] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <span className="text-[11px] lg:text-xs text-[#FBF7F0]/85 line-clamp-1 mt-0.5">
                    {cat.description}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. ABOUT CEYLON CRUNCH */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xs space-y-4"
      >
        <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C]">
          ABOUT CEYLON CRUNCH
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
          A Little Better, In Every Bite.
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-3xl">
          <p>
            At Ceylon Crunch, we believe good food begins with good choices.
          </p>
          <p>
            We bring together a carefully selected range of nuts, dates, dried fruits and wholesome foods, chosen for the everyday moments that matter.
          </p>
          <p>
            From selecting our products to packing every order, we pay attention to the details that make a difference. Our aim is simple: to bring quality products to your home, with the care they deserve.
          </p>
          <p>
            Whether you're stocking up for yourself, sharing with family or choosing a thoughtful gift, we're here to make every choice a little more special.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/our-story"
            className="h-11 px-7 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Our Story</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* 8. GIFTING BY CEYLON CRUNCH (FOR EVERY OCCASION) */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-[#f6f3f2] border border-[#EADFD0] p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 text-[#8B5E3C] font-sans text-xs font-bold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[18px] animate-float-slow">featured_seasonal_and_gifts</span>
            <span>GIFTING BY CEYLON CRUNCH</span>
          </div>
          <h3 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
            A Thoughtful Gift for Every Occasion.
          </h3>
          <p className="text-sm text-[#424843] leading-relaxed">
            From simple gifts to curated hampers, find something special for the people who matter.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#1F3D2B] block">Perfect for:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Birthdays',
                'Weddings & Nikah',
                'Corporate Gifts',
                'Thank-You Gifts',
                'Festive Gifting',
                'Return Gifts',
              ].map((occ) => (
                <span
                  key={occ}
                  className="rounded-full px-3.5 py-1.5 font-sans text-xs bg-white text-[#1F3D2B] font-semibold border border-[#EADFD0] shadow-2xs hover:border-[#1F3D2B] hover:-translate-y-0.5 transition-all"
                >
                  • {occ}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link
            to="/gifting"
            className="group min-h-[48px] px-8 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-sans text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all"
          >
            <span>Explore Our Gifts →</span>
          </Link>
        </div>
      </motion.section>

      {/* 9. STAY CONNECTED */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs text-center space-y-3"
      >
        <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C] block">
          STAY CONNECTED
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold uppercase tracking-tight">
          A LITTLE MORE FROM CEYLON CRUNCH.
        </h2>
        <p className="text-xs sm:text-sm text-[#4A4A4A] max-w-lg mx-auto">
          Discover new arrivals, serving ideas and updates from us.
        </p>
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
          <a
            href="https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto h-10 px-6 rounded-full bg-[#FAF8F4] border border-[#EADFD0] hover:border-[#1F3D2B] text-xs font-semibold text-[#1F3D2B] inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>Follow Us on Instagram →</span>
          </a>
          <a
            href="https://wa.me/94779443867"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto h-10 px-6 rounded-full bg-[#25D366] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors"
          >
            <span>Join Our WhatsApp Channel</span>
          </a>
        </div>
      </motion.section>

      {/* 10. DISCOVER YOUR FAVOURITES */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white border border-[#EADFD0] p-8 lg:p-12 shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] flex flex-col items-center text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF8F4] border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] animate-float-slow">
          <Store className="w-6 h-6 text-[#1F3D2B]" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold uppercase tracking-tight">
            DISCOVER YOUR FAVOURITES.
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Explore our selection of nuts, dates, dried fruits, seeds and more.
          </p>
        </div>
        <Link
          to="/shop"
          className="min-h-[48px] px-8 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-sans text-sm font-semibold flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Explore Our Collection →
        </Link>
      </motion.section>
    </div>
  );
};
