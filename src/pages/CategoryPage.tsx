import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { CATEGORIES, getLowestPrice } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { EthicalHarvestBanner } from '../components/product/EthicalHarvestBanner';
import { ArrowLeft, ArrowUpDown, Check } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();

  const [activeSubFilter, setActiveSubFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Validate category slug
  const categoryInfo = CATEGORIES.find((c) => c.slug === slug);
  if (!categoryInfo || slug === 'all') {
    return <Navigate to="/shop" replace />;
  }

  // Category specific editorial details
  const editorialDetails = (() => {
    switch (slug) {
      case 'nuts':
        return {
          title: 'Nuts',
          tagline: 'Quality Nuts for Every Day.',
          kicker: 'Pure Single Origin',
          description:
            'Choose from a selection of nuts in different varieties, sizes and flavours.',
          subFilters: [
            { id: 'all', label: 'All Nuts' },
            { id: 'walnuts', label: 'Walnuts' },
            { id: 'almonds', label: 'Almonds' },
            { id: 'cashews', label: 'Cashew' },
            { id: 'pistachios', label: 'Pistachio' },
          ],
        };
      case 'dried-fruits':
        return {
          title: 'Dried Fruits',
          tagline: 'Naturally Sweet Options for Everyday Snacking.',
          kicker: 'Sun-Drenched Harvest',
          description:
            'Naturally sweet and convenient for everyday snacking, baking and sharing.',
          subFilters: [
            { id: 'all', label: 'All Dried Fruits' },
            { id: 'raisins', label: 'Raisins' },
            { id: 'figs', label: 'Dried Figs' },
            { id: 'apricots', label: 'Dried Apricots' },
            { id: 'kiwi', label: 'Dried Kiwi' },
            { id: 'prunes', label: 'Dried Prunes' },
          ],
        };
      case 'dates':
        return {
          title: 'Dates',
          tagline: 'Soft, Naturally Sweet and Perfect for Sharing.',
          kicker: 'Natural Caramel Honey',
          description:
            'A selection of dates for snacking, sharing and gifting.',
          subFilters: [
            { id: 'all', label: 'All Dates' },
            { id: 'wet-dates', label: 'Wet Dates' },
            { id: 'dry-dates', label: 'Dry Dates' },
          ],
        };
      case 'seeds':
        return {
          title: 'Seeds',
          tagline: 'Simple Ingredients for Snacks, Meals and Recipes.',
          kicker: 'Vital Superfoods',
          description:
            'Simple additions to your everyday meals, breakfast bowls and wholesome recipes.',
          subFilters: [
            { id: 'all', label: 'All Seeds' },
            { id: 'chia', label: 'Chia Seeds' },
            { id: 'pumpkin', label: 'Pumpkin Seeds' },
            { id: 'sunflower', label: 'Sunflower Seeds' },
            { id: 'flax', label: 'Flax Seeds' },
            { id: 'makhana', label: 'Fox Nuts' },
          ],
        };

      case 'exotic-nuts':
        return {
          title: 'Exotic Nuts',
          tagline: 'Rare Reserve Kernels from Premier Estates.',
          kicker: 'Connoisseur Selection',
          description:
            'Velvety Hazelnuts, buttery Australian-style Macadamia Nuts, and rich mammoth Pecan Nuts roasted in small batches.',
          subFilters: [
            { id: 'all', label: 'All Exotic Nuts' },
            { id: 'hazelnuts', label: 'Hazelnuts' },
            { id: 'macadamia', label: 'Macadamia Nuts' },
            { id: 'pecan', label: 'Pecan Nuts' },
          ],
        };

      case 'spices':
        return {
          title: 'Whole Spices',
          tagline: 'Authentic True Ceylon Heritage.',
          kicker: 'Hill Country Terroir',
          description:
            'Whole Spices including pencil-thin true Alba cinnamon quills from Mirissa estates and high-potency black peppercorns from Matale gardens.',
          subFilters: [
            { id: 'all', label: 'All Whole Spices' },
            { id: 'cinnamon', label: 'Ceylon Cinnamon' },
            { id: 'pepper', label: 'Black Pepper' },
          ],
        };
      case 'gifts-hampers':
        return {
          title: 'Curated Hampers',
          tagline: 'Bespoke Provisions for Special Occasions.',
          kicker: 'Thoughtful Celebrations',
          description:
            'Handcrafted solid pine chests, engraved teak boxes, and customized festive assortments tied with grosgrain ribbon.',
          subFilters: [
            { id: 'all', label: 'All Hampers' },
            { id: 'pine', label: 'Pine Chests' },
            { id: 'corporate', label: 'Corporate Gifts' },
          ],
        };
      default:
        return {
          title: categoryInfo.name,
          tagline: 'Artisanal Provisions.',
          kicker: 'Ethical Harvest',
          description: 'Single-origin handcrafted provisions from Sri Lanka.',
          subFilters: [{ id: 'all', label: 'All Items' }],
        };
    }
  })();

  // Filter products by category and active sub-filter
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category === slug)
      .filter((p) => {
        if (activeSubFilter === 'all') return true;
        const query = activeSubFilter.toLowerCase();
        const name = p.name.toLowerCase();
        if (query === 'cashews') return name.includes('cashew');
        if (query === 'almonds') return name.includes('almond');
        if (query === 'pistachios') return name.includes('pistachio');
        if (query === 'walnuts') return name.includes('walnut');
        if (query === 'hazelnuts') return name.includes('hazelnut');
        if (query === 'macadamia') return name.includes('macadamia');
        if (query === 'pecan') return name.includes('pecan');
        if (query === 'raisins') return name.includes('raisin');
        if (query === 'figs') return name.includes('fig');
        if (query === 'apricots') return name.includes('apricot');
        if (query === 'kiwi') return name.includes('kiwi');
        if (query === 'prunes') return name.includes('prune');
        if (query === 'wet-dates') return name.includes('wet date');
        if (query === 'dry-dates') return name.includes('dry date');
        if (query === 'chia') return name.includes('chia');
        if (query === 'pumpkin') return name.includes('pumpkin');
        if (query === 'sunflower') return name.includes('sunflower');
        if (query === 'flax') return name.includes('flax');
        if (query === 'makhana') return name.includes('fox nut') || name.includes('makhana');
        return true;
      })
      .sort((a, b) => {
        const priceA = getLowestPrice(a).price;
        const priceB = getLowestPrice(b).price;

        if (sortOption === 'price-asc') return priceA - priceB;
        if (sortOption === 'price-desc') return priceB - priceA;
        if (sortOption === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, slug, activeSubFilter, sortOption]);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-4">
        <Link to="/" className="flex items-center gap-1 hover:text-[#1F3D2B] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-[#EADFD0]">•</span>
        <Link to="/shop" className="hover:text-[#1F3D2B] transition-colors">
          Shop
        </Link>
        <span className="text-[#EADFD0]">•</span>
        <span className="font-semibold text-[#1F3D2B]">{editorialDetails.title}</span>
      </nav>

      {/* Category Editorial Header */}
      <header className="relative mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc5]/60 text-[#794e2e] mb-2.5 shadow-2xs">
          <span className="material-symbols-outlined text-[14px]">eco</span>
          <span className="font-sans text-[11px] font-bold tracking-widest uppercase">
            {editorialDetails.kicker}
          </span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight">
          {editorialDetails.title}
        </h1>
        <p className="font-serif text-base lg:text-lg text-[#8B5E3C] italic mt-0.5">
          {editorialDetails.tagline}
        </p>
        <p className="text-sm text-[#424843] mt-2 max-w-xl leading-relaxed">
          {editorialDetails.description}
        </p>
      </header>

      {/* Sub-Filter Chips */}
      {editorialDetails.subFilters.length > 1 && (
        <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 mb-6 py-1">
          {editorialDetails.subFilters.map((sf) => {
            const isSelected = activeSubFilter === sf.id;
            return (
              <button
                key={sf.id}
                type="button"
                onClick={() => setActiveSubFilter(sf.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm'
                    : 'bg-white text-[#2B2B2B] border-[#EADFD0] hover:border-[#1F3D2B]/40 shadow-2xs'
                }`}
              >
                {sf.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Toolbar: Count + Sort */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EADFD0]">
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-sm font-semibold text-[#1F3D2B] tabular-nums">
            {filteredProducts.length}
          </span>
          <span className="text-xs text-[#6B6B6B]">provisions found</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="h-9 px-3.5 rounded-full bg-white border border-[#EADFD0] shadow-2xs flex items-center gap-1.5 text-xs font-semibold text-[#1F3D2B] hover:border-[#1F3D2B] transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span className="text-[#8B5E3C]">
              {sortOption === 'price-asc'
                ? 'Price: Low to High'
                : sortOption === 'price-desc'
                ? 'Price: High to Low'
                : sortOption === 'rating'
                ? 'Customer Favourites'
                : 'Featured'}
            </span>
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EADFD0] rounded-xl shadow-xl z-40 py-1.5">
                {[
                  { id: 'featured', label: 'Featured & Curated' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Customer Favourites' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSortOption(s.id as any);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between ${
                      sortOption === s.id ? 'font-bold text-[#1F3D2B] bg-[#f6f3f2]' : 'text-[#424843] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortOption === s.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Two-Column on mobile, Four-Column on desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#EADFD0] rounded-2xl p-8 text-center text-[#6B6B6B] text-sm mb-10">
          No products found in this category yet.
        </div>
      )}

      {/* Ethical Harvest Commitment Banner */}
      <EthicalHarvestBanner />
    </div>
  );
};
