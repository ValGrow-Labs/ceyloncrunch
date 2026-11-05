import React, { useState } from 'react';
import { Sparkles, Copy, Check, ShoppingBag, Heart, Star, ShieldCheck, Tag } from 'lucide-react';
import { ColorSwatch } from './types';

export const DesignSystemSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string>('250g');
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'added'>('idle');

  const swatches: ColorSwatch[] = [
    {
      name: 'Primary Forest',
      hex: '#1F3D2B',
      role: 'Core brand anchor, primary CTAs, main titles',
      textColor: 'text-white',
    },
    {
      name: 'Dark Forest',
      hex: '#162C1F',
      role: 'Hover accents, deep footer background, contrast',
      textColor: 'text-white',
    },
    {
      name: 'Terracotta & Cinnamon',
      hex: '#8B5E3C',
      role: 'Artisanal spice heritage, subheadings, badges',
      textColor: 'text-white',
    },
    {
      name: 'Canvas Ivory',
      hex: '#FBF7F0',
      role: 'Organic page background, warm tactile canvas',
      textColor: 'text-[#1F3D2B]',
      border: true,
    },
    {
      name: 'Champagne Gold',
      hex: '#D9A441',
      role: 'Luxury gifting accents, star ratings, highlights',
      textColor: 'text-[#162C1F]',
    },
    {
      name: 'Secondary Gold',
      hex: '#C5A059',
      role: 'Warm borders, subtle icon fills, badges',
      textColor: 'text-[#162C1F]',
    },
    {
      name: 'Charcoal Text',
      hex: '#202820',
      role: 'High-legibility editorial body copy and forms',
      textColor: 'text-white',
    },
  ];

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleSimulateAdd = () => {
    setButtonState('loading');
    setTimeout(() => {
      setButtonState('added');
      setTimeout(() => setButtonState('idle'), 2500);
    }, 600);
  };

  return (
    <section id="design-system" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            Visual Identity
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight leading-tight">
            A Visual Identity <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C]">Inspired by</span> Nature.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans">
            We rejected generic Silicon Valley SaaS design tropes — opting instead for a warm, editorial aesthetic that honors Sri Lanka's agricultural richness through calibrated natural colors and high-contrast typography.
          </p>
        </div>

        {/* 1. Color Palette Swatches */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
              Calibrated Color Tokens
            </h3>
            <span className="text-xs text-[#8B5E3C] font-mono">
              Click any swatch to copy HEX
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {swatches.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => copyToClipboard(swatch.hex)}
                className="group text-left rounded-2xl overflow-hidden border border-[#EADFD0] bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div
                  className={`h-24 sm:h-28 p-3 flex flex-col justify-between transition-transform duration-200 group-hover:scale-102 ${
                    swatch.border ? 'border-b border-[#EADFD0]' : ''
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  <div className="flex justify-end">
                    <span className="p-1 rounded-md bg-black/10 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedHex === swatch.hex ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-white" />
                      )}
                    </span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${swatch.textColor}`}>
                    {swatch.hex}
                  </span>
                </div>
                <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#1F3D2B] leading-tight">
                      {swatch.name}
                    </h4>
                    <p className="text-[10px] text-[#202820]/70 mt-1 line-clamp-2 leading-tight">
                      {swatch.role}
                    </p>
                  </div>
                  {copiedHex === swatch.hex && (
                    <span className="text-[9px] font-mono text-[#2E7D4F] font-bold mt-1 block">
                      Copied!
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Bespoke Typography System */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
              Bespoke Typographic Hierarchy
            </h3>
            <span className="text-xs text-[#8B5E3C] font-mono tracking-wider uppercase">
              Curated Optical Trio
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* 1. Cormorant Garamond */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF6EF] mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C]">
                    Editorial Display & Serifs
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1F3D2B]">
                    Cormorant Garamond
                  </span>
                </div>
                <div className="space-y-3">
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1F3D2B] leading-[1.02] tracking-[-0.035em]">
                    Artisanal Harvests for Moments That Matter.
                  </h1>
                  <p className="font-serif italic text-lg text-[#8B5E3C] leading-snug">
                    "From Ceylon's lush plantations straight to your doorstep."
                  </p>
                  <p className="text-xs text-[#202820]/75 leading-relaxed font-sans pt-1">
                    Inspired by Claude Garamont's 16th-century classical letterforms. Delivers high-contrast organic dignity, editorial grace, and luxury gastronomic heritage.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#FAF6EF] font-mono text-[10px] text-[#8B5E3C] flex items-center justify-between">
                <span>Medium (500) · Bold (700)</span>
                <span className="text-[#2E7D4F] font-bold">Display Scale</span>
              </div>
            </div>

            {/* 2. Plus Jakarta Sans */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF6EF] mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C]">
                    Interface & Checkout Forms
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1F3D2B]">
                    Plus Jakarta Sans
                  </span>
                </div>
                <div className="space-y-3 font-sans">
                  <p className="text-sm sm:text-base font-semibold text-[#1F3D2B] leading-snug tracking-[-0.015em]">
                    High-Density Legibility Across Rapid Mobile Checkouts.
                  </p>
                  <p className="text-xs text-[#202820]/80 leading-relaxed">
                    A razor-sharp geometric grotesque with generous counter-spaces and a tall x-height, engineered for clarity under direct sunlight on smartphone screens.
                  </p>
                  <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] text-xs space-y-1">
                    <span className="font-bold text-[#1F3D2B] block">Samantha Perera</span>
                    <span className="text-[#202820]/70 text-[11px] block">No. 45/2 Alfred House Gardens, Colombo 03</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#FAF6EF] font-mono text-[10px] text-[#8B5E3C] flex items-center justify-between">
                <span>Regular (400) · SemiBold (600)</span>
                <span className="text-[#2E7D4F] font-bold">UI System</span>
              </div>
            </div>

            {/* 3. JetBrains Mono */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF6EF] mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5E3C]">
                    Cryptographic & Waybill Mono
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1F3D2B]">
                    JetBrains Mono
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="font-mono text-xs font-semibold text-[#1F3D2B] leading-relaxed">
                    Zero-Ambiguity Financial Hashing & Live State Payloads.
                  </p>
                  <p className="text-xs text-[#202820]/80 leading-relaxed font-sans">
                    Employed for PayHere MD5 checkout verification hashes, sequential courier waybills, and district delivery matrices.
                  </p>
                  <div className="p-3 rounded-xl bg-[#162C1F] text-white font-mono text-[11px] space-y-1">
                    <div className="text-[#D9A441] text-[10px]">WAYBILL: CLN-48291054-LK</div>
                    <div className="text-white/80">HASH: 4F92A...8E31B</div>
                    <div className="text-[#2E7D4F] font-bold">TOTAL: LKR 4,050.00</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3.5 border-t border-[#FAF6EF] font-mono text-[10px] text-[#8B5E3C] flex items-center justify-between">
                <span>Medium (500) · Bold (700)</span>
                <span className="text-[#D9A441] font-bold">Data Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interactive UI Component Token Showcase */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
              Interactive Component Tokens
            </h3>
            <span className="text-xs text-[#8B5E3C] font-mono">
              Live Interactive Demonstration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interactive Card: Product Component */}
            <div className="bg-white rounded-3xl p-5 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#FAF6EF] mb-4 border border-[#EADFD0]/60">
                  <img
                    src="/products/nuts/cashews.jpg"
                    alt="Ceylon Cashews"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1F3D2B] text-[#D9A441]">
                    Bestseller
                  </span>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#8B5E3C] hover:text-[#B3261E] transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[#D9A441] mb-1">
                  <Star className="w-3.5 h-3.5 fill-[#D9A441]" />
                  <span className="text-xs font-bold text-[#1F3D2B]">4.9</span>
                  <span className="text-[11px] text-[#8B5E3C]">(128 reviews)</span>
                </div>

                <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                  Jumbo Roasted Salted Cashews
                </h4>
                <p className="text-xs text-[#202820]/70 mt-0.5">
                  Hand-selected Sri Lankan cashews
                </p>

                {/* Variant Switcher */}
                <div className="mt-3 flex items-center gap-1.5">
                  {['100g', '250g', '500g', '1kg'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        selectedWeight === w
                          ? 'bg-[#1F3D2B] text-white shadow-2xs'
                          : 'bg-[#FAF6EF] text-[#202820] hover:bg-[#EADFD0]'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-5 pt-3 border-t border-[#FAF6EF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8B5E3C] block">
                    Price ({selectedWeight})
                  </span>
                  <span className="text-base font-bold text-[#1F3D2B] font-mono">
                    {selectedWeight === '100g'
                      ? 'Rs. 850'
                      : selectedWeight === '250g'
                      ? 'Rs. 1,850'
                      : selectedWeight === '500g'
                      ? 'Rs. 3,600'
                      : 'Rs. 6,950'}
                  </span>
                </div>

                <button
                  onClick={handleSimulateAdd}
                  disabled={buttonState !== 'idle'}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    buttonState === 'added'
                      ? 'bg-[#2E7D4F] text-white'
                      : 'bg-[#1F3D2B] hover:bg-[#162C1F] text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    {buttonState === 'idle'
                      ? 'Add to Cart'
                      : buttonState === 'loading'
                      ? 'Adding...'
                      : 'Added!'}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Card: Buttons & Badges */}
            <div className="bg-white rounded-3xl p-6 border border-[#EADFD0] shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-3">
                  Buttons & Badges Token Library
                </span>

                <div className="space-y-3">
                  <button className="w-full py-2.5 px-4 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F] transition-all shadow-sm flex items-center justify-center gap-2">
                    <span>Primary Action Button</span>
                  </button>

                  <button className="w-full py-2.5 px-4 rounded-full bg-white border border-[#1F3D2B] text-[#1F3D2B] text-xs font-semibold hover:bg-[#FAF6EF] transition-all flex items-center justify-center gap-2">
                    <span>Secondary Outline Button</span>
                  </button>

                  <button className="w-full py-2.5 px-4 rounded-full bg-[#D9A441] text-[#162C1F] text-xs font-semibold hover:bg-[#C5A059] transition-all flex items-center justify-center gap-2 shadow-2xs">
                    <span>Gifting Accent Button</span>
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-[#FAF6EF]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2.5">
                    Badges & Status Indicators:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F3D2B] text-[#D9A441]">
                      Slow Roasted
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2E7D4F]/10 text-[#2E7D4F] border border-[#2E7D4F]/20">
                      In Stock (48)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#B3261E]/10 text-[#B3261E] border border-[#B3261E]/20">
                      Low Stock (3)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#8B5E3C]/10 text-[#8B5E3C]">
                      Free Islandwide Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Card: Form Fields & Inputs */}
            <div className="bg-white rounded-3xl p-6 border border-[#EADFD0] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-3">
                  Form Field Token Styles
                </span>

                <div className="space-y-3 font-sans">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Recipient Phone Number
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="+94 77 944 3867"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EADFD0] bg-[#FAF6EF]/50 text-xs text-[#202820] font-mono focus:outline-none"
                    />
                    <span className="text-[10px] text-[#2E7D4F] font-medium mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Auto-normalized for courier dispatch
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1F3D2B] mb-1">
                      Delivery District
                    </label>
                    <div className="px-3.5 py-2 rounded-xl border border-[#EADFD0] bg-white text-xs text-[#202820] flex items-center justify-between">
                      <span>Colombo (Zone 1 - LKR 350)</span>
                      <span className="text-[10px] font-mono text-[#8B5E3C]">24h Courier</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FAF6EF]">
                <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] text-center text-xs text-[#8B5E3C] font-mono">
                  Token: <code>--color-canvas</code> / <code>--color-primary</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
