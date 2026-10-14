import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../lib/store';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Store, ShieldCheck, Leaf, ShoppingCart, Truck, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  const { products } = useStore();

  // Selected favorites
  const favorites = products.filter((p) => p.isFeatured);

  const categories = [
    {
      name: 'Nuts',
      slug: 'nuts',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg/960px-Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg',
      description: 'Walnuts (Akhrot), Almonds (Badam), Cashew (Kaju) & Pistachio (Pista)',
    },
    {
      name: 'Dried Fruits',
      slug: 'dried-fruits',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Dried_figs_%282%29.jpg/960px-Dried_figs_%282%29.jpg',
      description: 'Raisins (Kishmish), Dried Figs (Anjeer), Apricots, Kiwi & Prunes',
    },
    {
      name: 'Dates',
      slug: 'dates',
      image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
      description: 'Wet Dates (Khajur) & Dry Dates (Chuara)',
    },
    {
      name: 'Seeds',
      slug: 'seeds',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Pepita_de_calabaza.jpg/960px-Pepita_de_calabaza.jpg',
      description: 'Chia, Cucumber, Flax, Musk Melon, Pumpkin, Quinoa, Sunflower & Fox Nuts',
    },
    {
      name: 'Berries',
      slug: 'berries',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Blueberries.jpg',
      description: 'Blueberries, Cranberries & Black Currant',
    },
    {
      name: 'Exotic Nuts',
      slug: 'exotic-nuts',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Macadamia_nuts.jpg/960px-Macadamia_nuts.jpg',
      description: 'Hazelnuts, Macadamia Nuts & Pecan Nuts',
    },
    {
      name: 'Mixes',
      slug: 'mixes',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Mixed_nuts_small_white1.jpg/960px-Mixed_nuts_small_white1.jpg',
      description: 'Berries Mix, Nut Mix, Seeds Mix & Trail Mix',
    },
    {
      name: 'Whole Spices',
      slug: 'spices',
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Cinnamomum_verum_spices.jpg/960px-Cinnamomum_verum_spices.jpg',
      description: 'True Ceylon Alba Cinnamon Quills, Black Pepper & Cardamom',
    },
  ];

  const trustFeatures = [
    {
      icon: Leaf,
      title: '100% Natural',
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
      title: 'Fast & Fresh Delivery',
      subtitle: 'Across the island',
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
      {/* 1. FULL-WIDTH HERO & TRUST BANNER (Responsive across all viewports, no scrollbar jitter) */}
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
            className="absolute inset-0 w-full h-full object-cover object-[78%_center] sm:object-[72%_center] lg:object-[80%_center]"
          />
          {/* Subtle readability gradient on small screens only */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0]/95 via-[#FBF7F0]/75 to-transparent sm:via-[#FBF7F0]/30 sm:to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[1440px] mx-auto flex items-center min-h-[420px] xs:min-h-[460px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
            {/* Hero Copy */}
            <div className="w-full px-4 xs:px-5 sm:pl-8 sm:pr-4 md:pl-12 lg:pl-20 lg:pr-6 py-10 xs:py-12 sm:py-10 lg:py-16 flex flex-col items-center text-center sm:items-start sm:text-left space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[#1B5132] font-sans text-[10px] md:text-[11px] lg:text-xs font-semibold uppercase tracking-[0.14em]"
              >
                <span className="w-2.5 h-[1px] bg-[#1B5132]/50" />
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1B5132] shrink-0 animate-leaf-sway" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
                </svg>
                <span>Ceylon Crunch — Established 2026</span>
                <span className="w-4 sm:w-6 lg:w-10 h-[1px] bg-[#1B5132]/40" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-serif text-2xl xs:text-3xl sm:text-[36px] md:text-[44px] lg:text-[54px] font-bold text-[#0F3822] tracking-tight leading-[1.1] uppercase"
              >
                Good Products. <br />
                <span className="text-[#B5741E]">
                  Carefully Chosen.
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32 }}
                className="font-sans text-xs sm:text-xs md:text-sm lg:text-base text-[#4A4A4A] leading-relaxed max-w-md"
              >
                Quality nuts, dried fruits, dates, seeds and more — selected with care and delivered to your doorstep.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44 }}
                className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center sm:justify-start gap-2.5 sm:gap-3 pt-1 w-full xs:w-auto"
              >
                <Link
                  to="/shop"
                  className="group min-h-[42px] sm:min-h-[44px] lg:min-h-[48px] px-6 sm:px-6 lg:px-8 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs lg:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <ShoppingCart className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/our-story"
                  className="group min-h-[42px] sm:min-h-[44px] lg:min-h-[48px] px-6 sm:px-6 lg:px-8 rounded-full bg-[#FAF8F4]/90 hover:bg-white text-[#1B5132] border border-[#1B5132]/60 font-sans text-xs lg:text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Organic Curved Wave Divider matching reference image */}
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

      {/* 2. CATEGORY HEADLINES ONLY STRIP */}
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
            { title: 'BERRIES', slug: 'berries' },
            { title: 'EXOTIC NUTS', slug: 'exotic-nuts' },
            { title: 'MIXES', slug: 'mixes' },
            { title: 'WHOLE SPICES', slug: 'spices' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group block border-b-2 border-[#EADFD0] hover:border-[#B5741E] pb-2 transition-all"
            >
              <span className="font-sans text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1B1B1B] group-hover:text-[#B5741E] transition-colors block text-center sm:text-left leading-tight">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 3. CUSTOMER FAVOURITES */}
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
              A selection of products our customers love.
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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 lg:gap-5">
          {favorites.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
            Why Ceylon Crunch
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold tracking-tight">
            Simple Choices. Better Ingredients.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed pt-1">
            We believe good nutriments starts with good ingredients. From everyday snacking to gifting, we carefully select our products for quality, freshness and taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              Carefully Selected
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              Products chosen with attention to quality and freshness.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              Quality You Can Trust
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              We focus on products we are happy to put our name behind.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EADFD0]/80 space-y-2">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
              Delivered With Care
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              Packed carefully and delivered across Sri Lanka.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 5. COLLECTION BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl bg-[#1B5132] text-white p-7 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#D9A441]">
            Our Collection
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl font-bold">
            Something for Every Taste.
          </h2>
          <p className="text-xs sm:text-sm text-[#FBF7F0]/85 leading-relaxed">
            Explore our selection of nuts, dried fruits, dates, seeds and other wholesome foods.
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

      {/* 6. SHOP BY CATEGORY (6 CARDS) */}
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
              image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg/960px-Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg',
              description: 'Almonds, cashews, pistachios, walnuts and more.',
            },
            {
              name: 'Dried Fruits',
              slug: 'dried-fruits',
              image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Dried_figs_%282%29.jpg/960px-Dried_figs_%282%29.jpg',
              description: 'Naturally sweet and convenient for everyday snacking.',
            },
            {
              name: 'Dates',
              slug: 'dates',
              image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
              description: 'A selection of dates for snacking, sharing and gifting.',
            },
            {
              name: 'Seeds',
              slug: 'seeds',
              image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Pepita_de_calabaza.jpg/960px-Pepita_de_calabaza.jpg',
              description: 'Simple additions to your everyday meals.',
            },
            {
              name: 'Healthy Snacks',
              slug: 'seeds',
              image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Mixed_nuts_small_white1.jpg/960px-Mixed_nuts_small_white1.jpg',
              description: 'Easy choices for home, work and on the go.',
            },
            {
              name: 'Gifts & Hampers',
              slug: 'gifting',
              image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
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
          About Ceylon Crunch
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
          Good Food, Carefully Chosen.
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-3xl">
          <p>
            Ceylon Crunch was created with a simple idea: make quality nutriments and wholesome foods easier to enjoy.
          </p>
          <p>
            We carefully select our products, pack them with care and bring them straight to your doorstep.
          </p>
          <p>
            Whether you're buying for yourself, your family, your workplace or someone special, we want every order to be a good one.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/our-story"
            className="h-11 px-7 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Read Our Story</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* 8. GIFTING */}
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
            <span>For Every Occasion</span>
          </div>
          <h3 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
            Something Worth Sharing.
          </h3>
          <p className="text-sm text-[#424843] leading-relaxed">
            From simple gifts to carefully prepared hampers, Ceylon Crunch makes it easy to share something good.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#1F3D2B] block">Ideal for:</span>
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
            <span>Explore Gifting</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* 9. CONNECT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs text-center space-y-3"
      >
        <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C] block">
          Stay Connected
        </span>
        <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
          Fresh Products. New Ideas. Updates.
        </h2>
        <p className="text-xs sm:text-sm text-[#4A4A4A] max-w-lg mx-auto">
          Follow Ceylon Crunch for new products, offers, recipes, serving ideas and more.
        </p>
        <div className="flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
          <a
            href="https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto h-10 px-6 rounded-full bg-[#FAF8F4] border border-[#EADFD0] hover:border-[#1F3D2B] text-xs font-semibold text-[#1F3D2B] inline-flex items-center justify-center gap-2 transition-colors"
          >
            <span>Follow Us on Instagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://wa.me/94779443867"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto h-10 px-6 rounded-full bg-[#25D366] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors"
          >
            <span>WhatsApp Channel</span>
          </a>
        </div>
      </motion.section>

      {/* 10. FINAL CALL TO ACTION */}
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
          <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
            Ready to Find Your Favourites?
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Shop quality nuts, dried fruits, dates, seeds and more.
          </p>
        </div>
        <Link
          to="/shop"
          className="min-h-[48px] px-8 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-sans text-sm font-semibold flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Shop Now
        </Link>
      </motion.section>
    </div>
  );
};
