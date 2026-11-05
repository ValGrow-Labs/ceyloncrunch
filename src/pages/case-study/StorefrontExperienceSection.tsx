import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Gift,
  Truck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StorefrontExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'homepage' | 'discovery' | 'variants' | 'checkout'>(
    'homepage'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [demoVariant, setDemoVariant] = useState<'100g' | '250g' | '500g' | '1kg'>('250g');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cod'>('card');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'nuts', name: 'Roasted Nuts' },
    { id: 'dried-fruits', name: 'Dried Fruits' },
    { id: 'dates', name: 'Premium Dates' },
    { id: 'seeds', name: 'Organic Seeds' },
    { id: 'spices', name: 'Ceylon Spices' },
    { id: 'gifting', name: 'Luxury Hampers' },
  ];

  const sampleProducts = [
    {
      id: 'p1',
      name: 'Roasted Salted Cashews',
      category: 'nuts',
      price: 'Rs. 1,850',
      rating: 4.9,
      reviews: 142,
      img: '/products/nuts/cashews.jpg',
      badge: 'Bestseller',
      weight: '250g',
    },
    {
      id: 'p2',
      name: 'California Roasted Almonds',
      category: 'nuts',
      price: 'Rs. 1,650',
      rating: 4.8,
      reviews: 98,
      img: '/products/nuts/almonds.jpg',
      badge: 'Popular',
      weight: '250g',
    },
    {
      id: 'p3',
      name: 'Iranian Roasted Pistachios',
      category: 'nuts',
      price: 'Rs. 2,400',
      rating: 5.0,
      reviews: 84,
      img: '/products/nuts/pistachios.jpg',
      badge: 'Premium',
      weight: '250g',
    },
    {
      id: 'p4',
      name: 'Ceylon Sun-Dried Mango Strips',
      category: 'dried-fruits',
      price: 'Rs. 1,200',
      rating: 4.9,
      reviews: 67,
      img: '/products/dried-fruits/dried-mango.jpeg',
      badge: 'Natural',
      weight: '200g',
    },
    {
      id: 'p5',
      name: 'Curated Harvest Gift Hamper',
      category: 'gifting',
      price: 'Rs. 8,500',
      rating: 5.0,
      reviews: 39,
      img: '/products/gifting/curated-hamper.jpg',
      badge: 'Corporate Pick',
      weight: '1.2kg Gift Box',
    },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === selectedCategory);

  const variantPricing = {
    '100g': { price: 'Rs. 850', stock: 64, status: 'In Stock' },
    '250g': { price: 'Rs. 1,850', stock: 42, status: 'In Stock' },
    '500g': { price: 'Rs. 3,600', stock: 18, status: 'Low Stock' },
    '1kg': { price: 'Rs. 6,950', stock: 9, status: 'Limited Batch' },
  };

  const deliveryTariffs: Record<string, { fee: number; transit: string }> = {
    Colombo: { fee: 350, transit: 'Same-day / 24h delivery' },
    Gampaha: { fee: 400, transit: '1–2 business days' },
    Kandy: { fee: 450, transit: '1–2 business days' },
    Galle: { fee: 450, transit: '1–2 business days' },
    Jaffna: { fee: 550, transit: '2–3 business days' },
  };

  return (
    <section id="storefront" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            06 // Storefront Experience
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            A Store Built to Turn <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Discovery into</span> Purchase.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Every screen was meticulously designed to evoke the tactile sensory appeal of premium food shopping while eliminating the traditional friction of multi-step mobile checkouts.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 pb-2 border-b border-[#EADFD0]">
          {[
            { id: 'homepage', label: 'A. Editorial Homepage' },
            { id: 'discovery', label: 'B. Live Category Discovery' },
            { id: 'variants', label: 'C. Multi-Variant Selector' },
            { id: 'checkout', label: 'D. 1-Page Mobile Checkout' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1F3D2B] text-white shadow-sm'
                  : 'text-[#202820]/75 hover:text-[#1F3D2B] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Showcase Stage */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] shadow-[0_20px_50px_rgba(31,61,43,0.06)] p-6 sm:p-10 min-h-[500px]">
          {/* TAB A: HOMEPAGE */}
          {activeTab === 'homepage' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Homepage Mini Hero Mockup */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1F3D2B] text-white p-8 sm:p-12 shadow-inner">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden md:block">
                  <img
                    src="/story-hero-nuts.jpg"
                    alt="Artisanal harvest"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 max-w-lg space-y-4">
                  <span className="px-3 py-1 rounded-full bg-[#D9A441] text-[#162C1F] text-[10px] font-bold uppercase tracking-widest">
                    Spring 2026 Collection
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                    Slow Roasted Nuts & Sun-Dried Fruits
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Direct from certified growers in Sri Lanka. Ethically prepared, zero artificial preservatives.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <span className="px-4 py-2 rounded-full bg-white text-[#1F3D2B] text-xs font-bold shadow-xs">
                      Shop Best Sellers
                    </span>
                    <span className="text-xs text-[#D9A441] font-mono">
                      Free delivery on Rs. 5,000+
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#FAF6EF]">
                {[
                  { title: '100% Authentic', sub: 'Single-origin growers' },
                  { title: 'Small Batch Roasted', sub: 'Maximum crunch & aroma' },
                  { title: 'Islandwide Delivery', sub: 'All 25 districts covered' },
                  { title: 'PayHere Protected', sub: 'Verified card checkout' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF6EF] border border-[#EADFD0]/60">
                    <span className="font-serif text-xs font-bold text-[#1F3D2B] block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#8B5E3C]">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB B: PRODUCT DISCOVERY */}
          {activeTab === 'discovery' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#1F3D2B] text-white shadow-2xs'
                        : 'bg-[#FAF6EF] text-[#202820] hover:bg-[#EADFD0]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl border border-[#EADFD0] bg-white hover:border-[#1F3D2B]/30 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative rounded-xl overflow-hidden aspect-square bg-[#FAF6EF] mb-3">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#1F3D2B] text-[#D9A441]">
                          {product.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#D9A441] mb-1">
                        <Star className="w-3 h-3 fill-[#D9A441]" />
                        <span className="text-xs font-bold text-[#1F3D2B]">{product.rating}</span>
                        <span className="text-[10px] text-[#8B5E3C]">({product.reviews})</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#1F3D2B] leading-tight">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#8B5E3C]">{product.weight}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#FAF6EF] flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#1F3D2B]">
                        {product.price}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg bg-[#1F3D2B] text-white text-[11px] font-semibold hover:bg-[#162C1F] transition-colors flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB C: MULTI-VARIANT SELECTOR */}
          {activeTab === 'variants' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#EADFD0] shadow-sm aspect-square bg-[#FAF6EF]">
                  <img
                    src="/products/nuts/cashews.jpg"
                    alt="Ceylon Jumbo Cashews"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F3D2B] text-[#D9A441]">
                      Direct from Kandy Growers
                    </span>
                    <span className="text-xs text-[#2E7D4F] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Single Origin
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
                    Ceylon Jumbo Roasted Salted Cashews
                  </h3>
                  <p className="text-xs text-[#202820]/75 mt-2 leading-relaxed">
                    Slow-roasted to golden perfection with natural sea salt. Packed immediately in nitrogen-flushed, resealable pouches for lasting crunch.
                  </p>
                </div>

                {/* Weight Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1F3D2B]">Select Pack Size:</span>
                    <span className="text-xs font-mono text-[#2E7D4F] font-medium">
                      Status: {variantPricing[demoVariant].status} ({variantPricing[demoVariant].stock} units left)
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {(['100g', '250g', '500g', '1kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setDemoVariant(w)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          demoVariant === w
                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-sm scale-102'
                            : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                        }`}
                      >
                        <span className="block font-mono font-bold text-sm">{w}</span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            demoVariant === w ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                          }`}
                        >
                          {variantPricing[w].price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Summary & Atomic Lock Notice */}
                <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8B5E3C] block">
                      Active Variant Price
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#1F3D2B]">
                      {variantPricing[demoVariant].price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#8B5E3C] font-mono">
                      Atomic Inventory Lock Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB D: 1-PAGE CHECKOUT */}
          {activeTab === 'checkout' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
              {/* Form Side */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                  <h4 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    1-Page Express Checkout
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Samantha Perera"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Mobile Number (+94 Normalization)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="+94 77 123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Delivery District (All 25 Supported)
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-white text-xs text-[#202820] cursor-pointer"
                    >
                      {Object.keys(deliveryTariffs).map((d) => (
                        <option key={d} value={d}>
                          {d} (Rs. {deliveryTariffs[d].fee})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="45/2 Alfred House Gardens, Colombo 03"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820]"
                    />
                  </div>
                </div>

                {/* Gift Message Card */}
                <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C]">
                    <Gift className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>Complimentary Gift Note:</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="Wishing you a wonderful festival with authentic Ceylon treats!"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#EADFD0] bg-white text-xs text-[#202820] italic font-serif"
                  />
                </div>

                {/* Payment Options */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-[#1F3D2B]">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'card', label: 'PayHere Card' },
                      { id: 'bank', label: 'Bank Slip Upload' },
                      { id: 'cod', label: 'Cash on Delivery' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                          paymentMethod === p.id
                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-2xs'
                            : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary Side */}
              <div className="lg:col-span-5 bg-[#FAF6EF] rounded-2xl p-6 border border-[#EADFD0] flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B] mb-4 pb-2 border-b border-[#EADFD0]">
                    Order Summary
                  </h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#202820]">Roasted Cashews (250g) x 2</span>
                      <span className="font-mono font-bold text-[#1F3D2B]">Rs. 3,700</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#202820]">Delivery ({selectedDistrict})</span>
                      <span className="font-mono font-bold text-[#1F3D2B]">
                        Rs. {deliveryTariffs[selectedDistrict]?.fee || 350}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8B5E3C] italic">
                      Transit: {deliveryTariffs[selectedDistrict]?.transit}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EADFD0]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-sm font-bold text-[#1F3D2B]">Total LKR</span>
                    <span className="font-mono text-xl font-bold text-[#1F3D2B]">
                      Rs. {3700 + (deliveryTariffs[selectedDistrict]?.fee || 350)}
                    </span>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-[#1F3D2B] text-white font-semibold text-xs shadow-md hover:bg-[#162C1F] transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#D9A441]" />
                    <span>Place Order (Instant Confirmation)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
