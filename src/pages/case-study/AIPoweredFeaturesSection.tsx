import React, { useState } from 'react';
import { Sparkles, Bot, Wand2, Copy, Check, RefreshCw, BookOpen, Utensils, Search } from 'lucide-react';

export const AIPoweredFeaturesSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('cashews');
  const [generationMode, setGenerationMode] = useState<'description' | 'pairings' | 'seo'>('description');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const productTemplates: Record<string, { name: string; ingredients: string; origin: string }> = {
    cashews: {
      name: 'Ceylon Jumbo Roasted Salted Cashews',
      ingredients: 'Whole Jumbo Cashew Nuts, Natural Pure Sea Salt',
      origin: 'Kandy & Central Province, Sri Lanka',
    },
    mango: {
      name: 'Artisanal Ceylon Sun-Dried Mango Strips',
      ingredients: 'Naturally Tree-Ripened Karthakolomban Mango, Lime Juice',
      origin: 'Polonnaruwa Organic Orchards, Sri Lanka',
    },
    hamper: {
      name: 'The Royal Harvest Curated Gifting Hamper',
      ingredients: 'Roasted Cashews, Almonds, Medjool Dates, Dried Mango, Spiced Chai',
      origin: 'Multi-Estate Single Harvest Ceylon Selection',
    },
  };

  const aiOutputs: Record<string, Record<string, string>> = {
    cashews: {
      description:
        'Harvested at peak maturity from heirloom orchards in Kandy, our Jumbo Cashews are meticulously batch-roasted using indirect heat to unlock their buttery, golden crunch. Finished with unrefined sea salt harvested along the southern coast of Sri Lanka, this is an honest celebration of pure island agriculture.',
      pairings:
        '• Ceylon Single-Estate Black Tea (Orange Pekoe)\n• Aged Dutch Edam Cheese or local Buffalo Curd\n• Chilled dry white wine or artisanal craft gin\n• Chopped over spicy vegetable stir-fries or traditional rice curries',
      seo:
        'Title: Buy Jumbo Roasted Salted Cashews Online Sri Lanka | Ceylon Crunch\nMeta: Indulge in premium, slow-roasted Sri Lankan cashews with pure sea salt. Nitrogen-flushed for lasting crunch. Fast delivery across all 25 districts.',
    },
    mango: {
      description:
        'Sun-drenched Karthakolomban mangoes gently dried under controlled solar warmth to preserve natural fruit enzymes and deep, tangy sweetness. Free of sulfur, refined sugars, or artificial colors, offering a chewy, guilt-free taste of Ceylon sunshine.',
      pairings:
        '• Organic Greek yogurt bowls with chia seeds\n• Dark single-origin chocolate slabs\n• Charcuterie boards with soft brie and walnuts\n• Post-workout sustained energy snacks',
      seo:
        'Title: Pure Sun-Dried Mango Strips Sri Lanka | 100% Natural | Ceylon Crunch\nMeta: Order authentic dried mango slices with zero added sugar. Ethically harvested in Polonnaruwa. Available in 200g and 500g pouches with islandwide shipping.',
    },
    hamper: {
      description:
        'An opulent presentation of Sri Lanka’s finest agricultural treasures. Features our signature Jumbo Cashews, whole roasted almonds, organic sun-dried fruits, and ceremonial spiced chai packaged in handcrafted wooden weave boxes tied with champagne satin ribbon.',
      pairings:
        '• Executive corporate gifts and festive milestone celebrations\n• Avurudu & Christmas family harvest feasts\n• High-end diplomatic and luxury diaspora gifting',
      seo:
        'Title: Luxury Corporate Gift Hampers Colombo | Ceylon Crunch Gifting\nMeta: Handcrafted gourmet Sri Lankan gift boxes filled with premium roasted nuts and dried fruits. Includes personalized gold foil greeting card. Order online.',
    },
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 700);
  };

  const copyText = () => {
    const text = aiOutputs[selectedProduct][generationMode];
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentOutput = aiOutputs[selectedProduct][generationMode];

  return (
    <section id="ai-engine" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            12 // Machine Intelligence
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Adding Intelligence to <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Everyday</span> Operations.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            To eliminate hundreds of hours of manual catalog copywriting, ValGrow Labs integrated the Google Gemini 2.0 API (`@google/genai`) into the merchant admin console — generating culinary tasting notes, food pairings, and SEO metadata in seconds.
          </p>
        </div>

        {/* Interactive AI Demonstration Studio */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-[0_20px_50px_rgba(31,61,43,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Selection & Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-2">
                  Step 01 · Select Product SKU:
                </span>
                <div className="space-y-2">
                  {[
                    { id: 'cashews', label: 'Jumbo Roasted Cashews', tag: 'Nuts' },
                    { id: 'mango', label: 'Artisanal Dried Mango', tag: 'Fruits' },
                    { id: 'hamper', label: 'Royal Harvest Hamper', tag: 'Gifting' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p.id);
                        handleGenerate();
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        selectedProduct === p.id
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-2xs font-semibold'
                          : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                      }`}
                    >
                      <span className="font-serif text-sm">{p.label}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          selectedProduct === p.id
                            ? 'bg-[#D9A441] text-[#162C1F]'
                            : 'bg-white text-[#8B5E3C] border border-[#EADFD0]'
                        }`}
                      >
                        {p.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Mode Tabs */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-2">
                  Step 02 · Select Generation Task:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'description', label: 'Editorial Copy', icon: BookOpen },
                    { id: 'pairings', label: 'Pairing Notes', icon: Utensils },
                    { id: 'seo', label: 'SEO Metadata', icon: Search },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = generationMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setGenerationMode(m.id as any);
                          handleGenerate();
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-2xs'
                            : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'}`} />
                        <span className="text-[11px] font-sans font-medium">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Raw SKU Context Metadata */}
              <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-[#8B5E3C] block font-semibold">
                  SKU Context Injected into Gemini Prompt:
                </span>
                <div>
                  <strong className="text-[#1F3D2B]">Name:</strong>{' '}
                  <span className="text-[#202820]">{productTemplates[selectedProduct].name}</span>
                </div>
                <div>
                  <strong className="text-[#1F3D2B]">Origin:</strong>{' '}
                  <span className="text-[#202820]">{productTemplates[selectedProduct].origin}</span>
                </div>
                <div>
                  <strong className="text-[#1F3D2B]">Ingredients:</strong>{' '}
                  <span className="text-[#202820]">{productTemplates[selectedProduct].ingredients}</span>
                </div>
              </div>
            </div>

            {/* Right Column: AI Output Terminal (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EF]">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#2E7D4F]" />
                  <span className="font-mono text-xs font-bold text-[#1F3D2B]">
                    Google Gemini 2.0 Flash Synthesis
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="p-1.5 rounded-lg border border-[#EADFD0] text-[#1F3D2B] hover:bg-[#FAF6EF] transition-colors"
                    title="Regenerate Output"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={copyText}
                    className="px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#1F3D2B] hover:text-white transition-colors text-xs font-semibold text-[#1F3D2B] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Output Display Card */}
              <div className="bg-[#162C1F] rounded-2xl p-6 text-white min-h-[260px] flex flex-col justify-between shadow-inner">
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-12">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D9A441] border-t-transparent animate-spin" />
                    <span className="font-mono text-xs text-[#D9A441]">
                      Synthesizing via Google Gemini API...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#D9A441] uppercase">
                      <Sparkles className="w-3 h-3" /> Model: gemini-2.0-flash · Zero Temperature Drift
                    </div>
                    <pre className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                      {currentOutput}
                    </pre>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                  <span>Execution Time: ~450ms</span>
                  <span>Direct Integration with Supabase Products Table</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
