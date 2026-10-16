import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatRs, Product } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Plus,
  Minus,
  AlertTriangle,
  Flame,
  Leaf,
  Handshake,
  ChevronDown,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getProductBySlug, addToCart, reviews, addReview, showToast, toggleWishlist, isWishlisted } = useStore();

  const product = getProductBySlug(slug || '');

  // Active state
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    about: true,
    specs: false,
    delivery: false,
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    author: '',
    location: '',
    rating: 5,
    comment: '',
  });

  // Initialize selected variant when product loads
  const currentVariant = useMemo(() => {
    if (!product) return null;
    if (selectedVariantId) {
      return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
    }
    // Default to first in-stock variant or first variant
    const inStockVar = product.variants.find((v) => v.stock > 0);
    return inStockVar || product.variants[0];
  }, [product, selectedVariantId]);

  if (!product) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="font-serif text-2xl font-bold text-[#1F3D2B] mb-2">Product Not Found</h2>
        <p className="text-sm text-[#6B6B6B] mb-6">The requested provision could not be located in our harvest.</p>
        <Link
          to="/shop"
          className="h-11 px-6 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold flex items-center justify-center"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const productReviews = reviews[product.id] || [];

  const handleWeightSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  const handleQuantityAdjust = (delta: number) => {
    if (!currentVariant) return;
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > currentVariant.stock) return currentVariant.stock;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!currentVariant || currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!currentVariant || currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
    navigate('/checkout');
  };

  const isProductWishlisted = Boolean(product && isWishlisted(product.id));

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product.id);
    showToast(isProductWishlisted ? 'Removed from your wishlist' : 'Saved to your harvest wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
      showToast('Please fill out your name and review message.');
      return;
    }
    addReview(product.id, {
      author: reviewForm.author.trim(),
      location: reviewForm.location.trim() || 'Sri Lanka',
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      verified: true,
    });
    setReviewForm({ author: '', location: '', rating: 5, comment: '' });
    setIsReviewModalOpen(false);
  };

  // Pairs Well With products
  const pairedProducts = products.filter((p) => product.pairsWithIds.includes(p.id));

  const discountPercent =
    currentVariant && currentVariant.originalPrice && currentVariant.originalPrice > currentVariant.price
      ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
      : null;

  return (
    <div className="flex flex-col w-full pb-36 lg:pb-16">
      {/* Breadcrumb Navigation & Share */}
      <div className="flex items-center justify-between py-2 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-[#6B6B6B]">
          <Link
            to="/shop"
            className="w-8 h-8 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] hover:bg-[#1F3D2B] hover:text-white transition-colors mr-1 shadow-2xs"
            aria-label="Back to Shop"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link to="/" className="hover:text-[#1F3D2B]">
            Home
          </Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-[#1F3D2B]">
            Shop
          </Link>
          <span>›</span>
          <Link to={`/category/${product.category}`} className="capitalize hover:text-[#1F3D2B]">
            {product.category.replace('-', ' ')}
          </Link>
          <span>›</span>
          <span className="text-[#1F3D2B] font-semibold truncate max-w-[140px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          className="w-9 h-9 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#424843] hover:text-[#1F3D2B] shadow-2xs transition-colors shrink-0"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-3.5">
          {/* Main Photo Viewport */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#f6f3f2] border border-[#EADFD0] shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Floating Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#8B5E3C] font-sans text-xs font-semibold shadow-xs flex items-center gap-1 border border-[#EADFD0]">
                <span className="material-symbols-outlined text-[14px] text-[#D9A441]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>{product.origin.split(',')[0]}</span>
              </span>
              {product.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F3D2B] text-[#c8ebd1] font-sans text-[10px] tracking-wider uppercase font-bold w-fit shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label="Save to wishlist"
              className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all active:scale-90 z-10 ${
                isProductWishlisted ? 'text-[#B3261E]' : 'text-[#1F3D2B]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isProductWishlisted ? 'fill-[#B3261E]' : ''}`} />
            </button>

            {/* Pagination Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={`View photo ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImageIndex === i ? 'w-5 bg-[#1F3D2B]' : 'w-1.5 bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#1F3D2B] scale-102' : 'border-[#EADFD0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Commerce Controls */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Subtitle & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-sans uppercase tracking-wider text-[#8B5E3C] font-semibold">
              {product.subtitle}
            </span>
            <a
              href="#reviews-section"
              className="flex items-center gap-1 bg-[#f6f3f2] px-2.5 py-0.5 rounded-full border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] hover:bg-[#EADFD0]/60 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
              <span>{product.rating}</span>
              <span className="text-[#6B6B6B] font-normal">({product.reviewCount})</span>
            </a>
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight mt-1">
            {product.name}
          </h1>

          <p className="text-xs uppercase tracking-wider font-semibold text-[#8B5E3C] mt-1.5">
            A carefully selected product for everyday enjoyment.
          </p>

          <p className="text-sm text-[#424843] mt-2 leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Row */}
          {currentVariant && (
            <div className="flex items-baseline gap-2.5 mt-4 pt-2 border-t border-[#EADFD0]/80">
              <span className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-bold tracking-tight tabular-nums">
                {formatRs(currentVariant.price)}
              </span>
              {currentVariant.originalPrice && currentVariant.originalPrice > currentVariant.price && (
                <span className="text-sm text-[#6B6B6B] line-through opacity-70 tabular-nums">
                  {formatRs(currentVariant.originalPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#301400] text-xs font-semibold">
                  Save {discountPercent}%
                </span>
              )}
              <span className="text-xs text-[#6B6B6B] ml-auto">VAT incl.</span>
            </div>
          )}

          {/* Weight Selection Chips */}
          <div className="flex flex-col mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2B]">
                Select Weight / Pack
              </span>
              {currentVariant && (
                <span className="text-xs font-semibold text-[#8B5E3C]">
                  {currentVariant.weight}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.variants.map((v) => {
                const isSelected = currentVariant?.id === v.id;
                const isOutOfStock = v.stock <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleWeightSelect(v.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all border ${
                      isOutOfStock
                        ? 'bg-[#f0eded] text-[#6B6B6B] border-[#EADFD0] cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm'
                        : 'bg-white text-[#2B2B2B] border-[#EADFD0] hover:border-[#1F3D2B]/40'
                    }`}
                  >
                    <span>{v.weight}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-[#c8ebd1]' : 'text-[#6B6B6B]'
                      }`}
                    >
                      {isOutOfStock ? 'Sold Out' : formatRs(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper & Stock Urgency */}
          <div className="flex items-center justify-between mt-5 p-3.5 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#6B6B6B]">Quantity</span>
              <span className="text-xs font-bold text-[#1F3D2B]">Number of packs</span>
            </div>

            <div className="flex items-center bg-white rounded-full p-1 border border-[#EADFD0] shadow-2xs">
              <button
                type="button"
                onClick={() => handleQuantityAdjust(-1)}
                disabled={!currentVariant || currentVariant.stock <= 0}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] flex items-center justify-center text-[#1F3D2B] active:scale-90 transition-transform"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-sans font-bold text-sm px-4 min-w-[36px] text-center tabular-nums text-[#1F3D2B]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityAdjust(1)}
                disabled={!currentVariant || quantity >= currentVariant.stock}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] flex items-center justify-center text-[#1F3D2B] active:scale-90 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Low Stock Warning or Out of Stock Notice */}
          {currentVariant && currentVariant.stock > 0 && currentVariant.stock <= 10 && (
            <div className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ffdcc5]/70 text-[#653d1e] text-xs font-medium border border-[#fdc39a]">
              <span className="material-symbols-outlined text-[18px] text-[#8B5E3C]">bolt</span>
              <span>⚡ Only {currentVariant.stock} packs remaining in this small-batch roast.</span>
            </div>
          )}
          {currentVariant && currentVariant.stock <= 0 && (
            <div className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
              <span>This variant is temporarily out of stock. Roasters are preparing a new batch.</span>
            </div>
          )}

          {/* Desktop Direct Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`h-12 flex-1 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] ${
                !currentVariant || currentVariant.stock <= 0
                  ? 'bg-[#f0eded] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#1F3D2B] hover:bg-[#162C1F] text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart ({formatRs((currentVariant?.price || 0) * quantity)})</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`h-12 px-8 rounded-full text-sm font-semibold flex items-center justify-center transition-all active:scale-[0.99] ${
                !currentVariant || currentVariant.stock <= 0
                  ? 'bg-[#f0eded] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#ffdcc5] hover:bg-[#fdc39a] text-[#301400]'
              }`}
            >
              <span>Buy Now</span>
            </button>
          </div>

          {/* Allergen Notice Card */}
          <div className="mt-6 p-4 rounded-xl bg-white border border-[#EADFD0] flex items-start gap-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-[#8B5E3C] mt-0.5 shrink-0" />
            <div>
              <span className="font-sans text-xs font-bold text-[#1F3D2B] block">
                Allergen Notice
              </span>
              <p className="text-xs text-[#6B6B6B] leading-relaxed mt-0.5">
                {product.allergenNotice}
              </p>
            </div>
          </div>

          {/* Artisan Badges */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="p-3 bg-white border border-[#EADFD0] rounded-xl flex flex-col items-center text-center">
              <Flame className="w-5 h-5 text-[#1F3D2B] mb-1" />
              <span className="text-xs font-semibold text-[#1F3D2B]">Woodfire</span>
              <span className="text-[10px] text-[#6B6B6B]">Low & Slow</span>
            </div>
            <div className="p-3 bg-white border border-[#EADFD0] rounded-xl flex flex-col items-center text-center">
              <Leaf className="w-5 h-5 text-[#1F3D2B] mb-1" />
              <span className="text-xs font-semibold text-[#1F3D2B]">Zero Preservatives</span>
              <span className="text-[10px] text-[#6B6B6B]">100% Clean</span>
            </div>
            <div className="p-3 bg-white border border-[#EADFD0] rounded-xl flex flex-col items-center text-center">
              <Handshake className="w-5 h-5 text-[#1F3D2B] mb-1" />
              <span className="text-xs font-semibold text-[#1F3D2B]">Fair Grower</span>
              <span className="text-[10px] text-[#6B6B6B]">Direct Co-op</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="flex flex-col mt-6 divide-y divide-[#EADFD0] border-y border-[#EADFD0]">
            {/* 1. About */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('about')}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F3D2B]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1F3D2B]">menu_book</span>
                  <span>About This Product</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
                    openAccordions.about ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.about && (
                <div className="mt-3 text-xs sm:text-sm text-[#424843] leading-relaxed space-y-2 pt-1 animate-in fade-in">
                  <p className="font-medium text-[#1F3D2B]">
                    A simple, delicious choice for snacking, sharing or adding to your favourite recipes.
                  </p>
                  {product.extendedAbout.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Specs */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F3D2B]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1F3D2B]">fact_check</span>
                  <span>Product Information</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
                    openAccordions.specs ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.specs && (
                <div className="mt-3 space-y-2 text-xs pt-1 animate-in fade-in">
                  <div className="flex justify-between items-center py-2 px-3 bg-[#f6f3f2] rounded-lg">
                    <span className="text-[#6B6B6B]">Weight</span>
                    <span className="font-semibold text-[#1F3D2B]">{currentVariant?.weight}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#f6f3f2] rounded-lg">
                    <span className="text-[#6B6B6B]">Ingredients</span>
                    <span className="font-semibold text-[#1F3D2B] text-right">{product.ingredients}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#f6f3f2] rounded-lg">
                    <span className="text-[#6B6B6B]">Country of Origin</span>
                    <span className="font-semibold text-[#1F3D2B]">{product.origin}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#f6f3f2] rounded-lg">
                    <span className="text-[#6B6B6B]">Storage</span>
                    <span className="font-semibold text-[#1F3D2B] text-right">{product.storage || 'Store in a cool, dry place.'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#f6f3f2] rounded-lg">
                    <span className="text-[#6B6B6B]">Best Before</span>
                    <span className="font-semibold text-[#1F3D2B]">{product.shelfLife || 'See package.'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Delivery & Care */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('delivery')}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F3D2B]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1F3D2B]">local_shipping</span>
                  <span>Delivery</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
                    openAccordions.delivery ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.delivery && (
                <div className="mt-3 text-xs sm:text-sm text-[#424843] leading-relaxed space-y-2 pt-1 animate-in fade-in">
                  <p className="font-medium text-[#1F3D2B]">
                    Island-wide delivery available.
                  </p>
                  <p className="text-[#6B6B6B]">
                    Delivery charges are calculated at checkout based on your delivery location.
                  </p>
                  <p className="pt-1 text-[11px] text-[#8B5E3C]">
                    • Colombo: 24–48 business hours.<br />
                    • Outstation: 2–4 business days via tracked courier.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product CTA */}
      <section className="mt-12 bg-white rounded-3xl border border-[#EADFD0] p-8 text-center flex flex-col items-center shadow-xs">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F3D2B] mb-2">
          Add Something Good to Your Day.
        </h2>
        <p className="text-sm text-[#6B6B6B] max-w-md mb-6">
          Carefully selected and packed fresh to bring wholesome taste straight to your doorstep.
        </p>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!currentVariant || currentVariant.stock <= 0}
          className="h-12 px-8 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
        >
          Add to Cart {currentVariant ? `— ${formatRs(currentVariant.price * quantity)}` : ''}
        </button>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews-section" className="mt-14 pt-8 border-t border-[#EADFD0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1F3D2B] font-semibold">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#D9A441]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D9A441] text-[#D9A441]" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#1F3D2B]">{product.rating} out of 5</span>
              <span className="text-xs text-[#6B6B6B]">({productReviews.length} total)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="h-10 px-5 rounded-full bg-white border border-[#EADFD0] hover:border-[#1F3D2B] text-xs font-semibold text-[#1F3D2B] shadow-2xs self-start sm:self-auto transition-colors"
          >
            Leave a Review
          </button>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-white border border-[#EADFD0] rounded-2xl shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#c8ebd1] text-[#022111] flex items-center justify-center text-xs font-bold font-sans">
                      {rev.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1F3D2B] block leading-tight">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-[#6B6B6B]">
                        {rev.verified ? 'Verified Buyer · ' : ''}{rev.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-[#D9A441]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#424843] leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-[#6B6B6B] block text-right">
                  {rev.date}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6B6B6B] py-4 col-span-2">
              No reviews submitted yet for this small-batch harvest. Be the first to leave one!
            </p>
          )}
        </div>
      </section>

      {/* "Pairs Well With" Recommendations Carousel */}
      {pairedProducts.length > 0 && (
        <section className="mt-14 pt-8 border-t border-[#EADFD0]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#8B5E3C]">
                Curated Pairings
              </span>
              <h2 className="font-serif text-2xl text-[#1F3D2B] font-semibold">
                Pairs Well With
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-semibold text-[#8B5E3C] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {pairedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Action Bar for Mobile (< 1024px) */}
      <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 px-3 xs:px-4 pb-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-[#EADFD0] shadow-[0_12px_36px_rgba(31,61,43,0.18)] p-2.5 flex items-center gap-2 pointer-events-auto">
          {/* Mini total */}
          <div className="flex flex-col pl-1 xs:pl-2 min-w-[70px] xs:min-w-[85px]">
            <span className="text-[10px] text-[#6B6B6B] font-medium leading-none">Total</span>
            <span className="font-serif text-sm xs:text-base font-bold text-[#1F3D2B] tabular-nums mt-0.5 truncate">
              {currentVariant ? formatRs(currentVariant.price * quantity) : '—'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 xs:gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`h-10 xs:h-11 flex-1 rounded-full text-[11px] xs:text-xs font-semibold flex items-center justify-center gap-1 xs:gap-1.5 shadow-sm active:scale-95 transition-all truncate px-2 ${
                !currentVariant || currentVariant.stock <= 0
                  ? 'bg-[#f0eded] text-[#6B6B6B]'
                  : 'bg-[#1F3D2B] text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
              <span className="truncate">Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`h-10 xs:h-11 px-3 xs:px-4 rounded-full text-[11px] xs:text-xs font-semibold flex items-center justify-center active:scale-95 transition-all whitespace-nowrap shrink-0 ${
                !currentVariant || currentVariant.stock <= 0
                  ? 'bg-[#f0eded] text-[#6B6B6B]'
                  : 'bg-[#ffdcc5] text-[#301400]'
              }`}
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leave a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsReviewModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white border border-[#EADFD0] rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD0] mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                Review {product.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f0eded] text-[#2B2B2B] flex items-center justify-center hover:bg-[#e4e2e1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating stars */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 text-[#D9A441]"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating ? 'fill-[#D9A441]' : 'text-[#EADFD0]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Author name */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  placeholder="e.g. Ruwan Senanayake"
                  className="w-full h-11 px-3.5 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={reviewForm.location}
                  onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                  placeholder="e.g. Colombo 03"
                  className="w-full h-11 px-3.5 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
                  Your Thoughts & Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share details about kernel crunch, aroma, packaging, or freshness..."
                  className="w-full p-3 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] shadow-sm transition-all active:scale-[0.99]"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
