import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { CATEGORIES, getLowestPrice } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Search, X, SlidersHorizontal, ArrowUpDown, Check, RefreshCw } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'curated';
  const currentQuery = searchParams.get('q') || '';
  const currentPriceRange = searchParams.get('price') || 'all';
  const currentInStockOnly = searchParams.get('inStock') === 'true';

  // Local search input with debounce
  const [searchInput, setSearchInput] = useState(currentQuery);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(currentQuery);
  }, [currentQuery]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentQuery) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('q', searchInput.trim());
          } else {
            next.delete('q');
          }
          return next;
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, currentQuery, setSearchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (currentCategory !== 'all' && p.category !== currentCategory) {
          return false;
        }

        // Search text
        if (currentQuery.trim()) {
          const query = currentQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchSub = p.subtitle.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchOrigin = p.origin.toLowerCase().includes(query);
          if (!matchName && !matchSub && !matchDesc && !matchOrigin) {
            return false;
          }
        }

        // Price range filter
        const { price, inStock } = getLowestPrice(p);
        if (currentPriceRange === 'under-1500' && price >= 1500) return false;
        if (currentPriceRange === '1500-3000' && (price < 1500 || price > 3000)) return false;
        if (currentPriceRange === 'over-3000' && price <= 3000) return false;

        // In-stock only
        if (currentInStockOnly && !inStock) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = getLowestPrice(a).price;
        const priceB = getLowestPrice(b).price;

        if (currentSort === 'price-asc') return priceA - priceB;
        if (currentSort === 'price-desc') return priceB - priceA;
        if (currentSort === 'rating') return b.rating - a.rating;
        // Default: curated (featured first)
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCategory, currentQuery, currentPriceRange, currentInStockOnly, currentSort]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== 'all') count++;
    if (currentPriceRange !== 'all') count++;
    if (currentInStockOnly) count++;
    return count;
  }, [currentCategory, currentPriceRange, currentInStockOnly]);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === '' || value === 'all' || value === 'false') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
    setIsFilterSheetOpen(false);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Search Field */}
      <div className="relative w-full mb-6">
        <div className="relative flex items-center w-full h-12 bg-white rounded-full border border-[#EADFD0] shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] px-4 focus-within:border-[#1F3D2B] focus-within:ring-1 focus-within:ring-[#1F3D2B]">
          <Search className="w-5 h-5 text-[#8B5E3C] mr-2.5 shrink-0" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent border-0 outline-none text-base sm:text-sm text-[#1F3D2B] placeholder:text-[#6B6B6B]/70 pr-8"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
              className="absolute right-3 w-6 h-6 rounded-full bg-[#f0eded] text-[#6B6B6B] hover:text-[#1F3D2B] flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editorial Section Header */}
      <div className="flex flex-col mb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C] mb-1">
          SHOP
        </span>
        <h1 className="font-serif text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight">
          OUR COLLECTION
        </h1>
        <p className="font-medium text-[#1F3D2B] text-base mt-1">
          Quality, Made Simple.
        </p>
        <p className="text-sm text-[#6B6B6B] mt-0.5">
          Explore our full range of carefully selected products.
        </p>
      </div>

      {/* Horizontally Scrolling Category Chips */}
      <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 mb-6 py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => updateParam('category', cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all active:scale-95 border ${
                isSelected
                  ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm'
                  : 'bg-white text-[#2B2B2B] border-[#EADFD0] hover:border-[#1F3D2B]/40 shadow-2xs'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Count + Filter Button + Sort Button */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EADFD0]">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-[#1F3D2B] tabular-nums">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Filter Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="h-9 px-3.5 rounded-full bg-white border border-[#EADFD0] shadow-2xs flex items-center gap-1.5 text-xs font-semibold text-[#1F3D2B] hover:border-[#1F3D2B] active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D9A441] text-[#1F3D2B] text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Sort Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="h-9 px-3.5 rounded-full bg-white border border-[#EADFD0] shadow-2xs flex items-center gap-1 text-xs font-semibold text-[#1F3D2B] hover:border-[#1F3D2B] active:scale-95 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span className="hidden sm:inline">Sort: </span>
              <span className="text-[#8B5E3C]">
                {currentSort === 'price-asc'
                  ? 'Price: Low'
                  : currentSort === 'price-desc'
                  ? 'Price: High'
                  : currentSort === 'rating'
                  ? 'Favourites'
                  : 'Curated'}
              </span>
            </button>

            {/* Sort Dropdown Menu */}
            {isSortMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSortMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EADFD0] rounded-xl shadow-xl z-40 py-1.5 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('sort', 'curated');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentSort === 'curated'
                        ? 'font-bold text-[#1F3D2B] bg-[#f6f3f2]'
                        : 'text-[#424843] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>Curated & Featured</span>
                    {currentSort === 'curated' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('sort', 'price-asc');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentSort === 'price-asc'
                        ? 'font-bold text-[#1F3D2B] bg-[#f6f3f2]'
                        : 'text-[#424843] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>Price: Low to High</span>
                    {currentSort === 'price-asc' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('sort', 'price-desc');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentSort === 'price-desc'
                        ? 'font-bold text-[#1F3D2B] bg-[#f6f3f2]'
                        : 'text-[#424843] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>Price: High to Low</span>
                    {currentSort === 'price-desc' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('sort', 'rating');
                      setIsSortMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentSort === 'rating'
                        ? 'font-bold text-[#1F3D2B] bg-[#f6f3f2]'
                        : 'text-[#424843] hover:bg-[#f6f3f2]'
                    }`}
                  >
                    <span>Customer Favourites</span>
                    {currentSort === 'rating' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Product Catalog Grid (2-col on mobile, 4-col on desktop) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Real Empty State with Helpful CTAs */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-[#EADFD0] rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)]">
          <div className="w-20 h-20 rounded-full bg-[#f6f3f2] border border-[#EADFD0] flex items-center justify-center text-[#8B5E3C] mb-4">
            <span className="material-symbols-outlined text-[40px]">manage_search</span>
          </div>
          <h2 className="font-serif text-2xl text-[#1F3D2B] font-semibold mb-1">
            No provisions found
          </h2>
          <p className="text-sm text-[#6B6B6B] max-w-sm mb-6 leading-relaxed">
            We couldn't find any items matching your selected criteria. Try adjusting your filters or search terms.
          </p>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-11 px-6 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#162C1F] shadow-sm active:scale-95 transition-all mb-6"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[11px] uppercase font-bold text-[#8B5E3C] tracking-wider mb-2">
              Popular Searches
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Jumbo Cashews', 'Medjool Dates', 'Almonds', 'Gift Hampers'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchInput(term)}
                  className="px-3.5 py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-xs font-medium text-[#1F3D2B] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet / Modal */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterSheetOpen(false)}
          />

          <div className="relative w-full sm:max-w-md max-h-[85vh] bg-[#FBF7F0] rounded-t-3xl sm:rounded-3xl border border-[#EADFD0] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#EADFD0] bg-white">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">Filter & Refine</h3>
                <p className="text-xs text-[#6B6B6B]">Refine your provisions selection</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-9 h-9 rounded-full bg-[#f0eded] text-[#2B2B2B] flex items-center justify-center hover:bg-[#e4e2e1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="p-5 space-y-6 overflow-y-auto no-scrollbar">
              {/* Category */}
              <div>
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#1F3D2B] block mb-2.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => updateParam('category', cat.slug)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        currentCategory === cat.slug
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                          : 'bg-white text-[#2B2B2B] border-[#EADFD0]'
                      }`}
                    >
                      {cat.shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#1F3D2B] block mb-2.5">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-1500', label: 'Under Rs. 1,500' },
                    { id: '1500-3000', label: 'Rs. 1,500 - 3,000' },
                    { id: 'over-3000', label: 'Over Rs. 3,000' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateParam('price', p.id)}
                      className={`h-10 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center text-center transition-all ${
                        currentPriceRange === p.id
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                          : 'bg-white text-[#2B2B2B] border-[#EADFD0]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Only Toggle */}
              <div className="bg-white p-4 rounded-xl border border-[#EADFD0] flex items-center justify-between">
                <div>
                  <span className="font-sans text-xs font-bold text-[#1F3D2B] block">
                    In Stock Only
                  </span>
                  <span className="text-[11px] text-[#6B6B6B]">
                    Hide seasonal out-of-stock items
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={currentInStockOnly}
                  onClick={() => updateParam('inStock', currentInStockOnly ? 'false' : 'true')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    currentInStockOnly ? 'bg-[#1F3D2B]' : 'bg-[#e4e2e1]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      currentInStockOnly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="p-4 bg-white border-t border-[#EADFD0] flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 h-12 rounded-full bg-[#f6f3f2] text-[#2B2B2B] text-xs font-semibold hover:bg-[#e4e2e1] transition-colors"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 h-12 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] shadow-sm transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
