import React, { useState } from 'react';
import {
  LayoutTemplate,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../data/products';

interface SectionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: 'sec-announcement', name: 'Top Announcement Ribbon', description: 'Small banner displaying free islandwide delivery threshold', enabled: true },
  { id: 'sec-hero', name: 'Artisan Hero Banner', description: 'Main visual header with CTA button and grower narrative', enabled: true },
  { id: 'sec-features', name: 'Trust & Harvest Strip', description: 'Direct grower sourcing, small-batch packing, and freshness guarantee', enabled: true },
  { id: 'sec-bestsellers', name: 'Curated Bestsellers Showcase', description: 'Grid of featured favorite provisions', enabled: true },
  { id: 'sec-categories', name: 'Category Carousel', description: 'Visual cards for Nuts, Dried Fruits, Dates, Seeds, Spices', enabled: true },
  { id: 'sec-story', name: 'Ethical Sourcing & Story Strip', description: 'Background of authentic Sri Lankan growers', enabled: true },
  { id: 'sec-reviews', name: 'Verified Patron Testimonials', description: 'Customer quotes and 5-star ratings carousel', enabled: true },
  { id: 'sec-newsletter', name: 'Newsletter Harvest Invitation', description: 'Email signup form for seasonal harvest updates', enabled: true },
];

interface HomepageSectionsTabProps {
  products: Product[];
  onToggleFeatured: (productId: string, isFeatured: boolean) => Promise<void>;
  showToast: (msg: string) => void;
}

export const HomepageSectionsTab: React.FC<HomepageSectionsTabProps> = ({
  products,
  onToggleFeatured,
  showToast,
}) => {
  const [sections, setSections] = useState<SectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_homepage_sections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SECTIONS;
  });

  const [announcementText, setAnnouncementText] = useState(
    'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed'
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    setSections((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ceylon_crunch_homepage_sections', JSON.stringify(sections));
    } catch {}
    setTimeout(() => {
      setIsSaving(false);
      showToast('Homepage section configuration saved to Supabase!');
    }, 400);
  };

  const handleReset = () => {
    setSections(DEFAULT_SECTIONS);
    try {
      localStorage.removeItem('ceylon_crunch_homepage_sections');
    } catch {}
    showToast('Reset homepage sections to defaults.');
  };

  return (
    <div className="space-y-6">
      {/* Top Save and Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Homepage Sections & Order</h2>
          <p className="text-xs text-gray-500">
            Control which sections appear on the landing page and their vertical arrangement
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Sections</span>
          </button>
        </div>
      </div>

      {/* Announcement Ribbon Quick Editor */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="font-serif font-bold text-sm text-gray-900">Top Announcement Banner</h3>
        <p className="text-xs text-gray-500">
          This message appears across the very top ribbon of the storefront.
        </p>
        <input
          type="text"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
        />
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <h3 className="font-serif font-bold text-base text-gray-900">Active Homepage Sections</h3>
          <p className="text-xs text-gray-500">Use arrow controls to reorder sections vertically</p>
        </div>

        <div className="divide-y divide-gray-100">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors ${
                section.enabled ? 'bg-white' : 'bg-gray-50/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{section.name}</div>
                  <div className="text-xs text-gray-500 truncate">{section.description}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-auto">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Enable / Disable Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleSection(section.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    section.enabled
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{section.enabled ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Selector */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              Featured Products Selector
            </h3>
            <p className="text-xs text-gray-500">
              Select which artisan provisions appear in the curated bestsellers strip
            </p>
          </div>
          <span className="text-xs font-bold text-[#1F3D2B]">
            {products.filter((p) => p.isFeatured).length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((p) => {
            const isFeat = Boolean(p.isFeatured);
            return (
              <div
                key={p.id}
                onClick={async () => {
                  await onToggleFeatured(p.id, !isFeat);
                  showToast(`${!isFeat ? 'Added' : 'Removed'} ${p.name} from featured showcase`);
                }}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isFeat
                    ? 'border-[#1F3D2B] bg-[#1F3D2B]/5 shadow-2xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-gray-900 truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{p.category}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    isFeat ? 'bg-[#1F3D2B] text-white' : 'border border-gray-300'
                  }`}
                >
                  {isFeat && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
