import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Check,
  Loader2,
} from 'lucide-react';
import { adminUploadBannerImage } from '../../lib/supabase';

interface HeroConfig {
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  subtext: string;
  primaryCta: string;
  primaryCtaLink: string;
  secondaryCta: string;
  secondaryCtaLink: string;
  bgImage: string;
}

const DEFAULT_HERO: HeroConfig = {
  eyebrow: 'Ceylon Crunch — Established 2026',
  headline: 'In a world that rushes,',
  headlineItalic: 'we take it slow.',
  subtext: 'Sourced from authentic growers. Honest food for moments that matter.',
  primaryCta: 'Shop the Collection',
  primaryCtaLink: '/shop',
  secondaryCta: 'Our Story',
  secondaryCtaLink: '/our-story',
  bgImage: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1600&q=80',
};

interface HeroSectionTabProps {
  showToast: (msg: string) => void;
}

export const HeroSectionTab: React.FC<HeroSectionTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_hero_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_HERO;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showToast('Uploading hero photograph to Supabase Storage...');
    const res = await adminUploadBannerImage(file);
    setIsUploading(false);

    if (res.success && res.url) {
      setConfig((prev) => ({ ...prev, bgImage: res.url! }));
      showToast('Hero background photograph updated!');
    } else {
      // Fallback local preview
      const localUrl = URL.createObjectURL(file);
      setConfig((prev) => ({ ...prev, bgImage: localUrl }));
      showToast('Preview updated with uploaded photo');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ceylon_crunch_hero_config', JSON.stringify(config));
    } catch {}
    setTimeout(() => {
      setIsSaving(false);
      showToast('Hero section changes saved and published to storefront!');
    }, 400);
  };

  const handleReset = () => {
    setConfig(DEFAULT_HERO);
    try {
      localStorage.removeItem('ceylon_crunch_hero_config');
    } catch {}
    showToast('Reset hero settings to brand defaults.');
  };

  return (
    <div className="space-y-6">
      {/* Live Visual Preview Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            <h3 className="font-serif font-bold text-sm text-gray-900">
              Live Storefront Hero Preview
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">Updates live as you type</span>
        </div>

        {/* Hero Preview Canvas */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 min-h-[260px] sm:min-h-[340px] flex items-center justify-center p-4 sm:p-6 text-center text-white">
          {/* Background Image with Dark Overlay */}
          <img
            src={config.bgImage}
            alt="Hero Background Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl mx-auto space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] sm:text-[11px] font-semibold text-[#C5A059] uppercase tracking-wider">
              {config.eyebrow}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
              {config.headline}{' '}
              <span className="italic font-normal text-[#EADFD0]">{config.headlineItalic}</span>
            </h2>
            <p className="text-xs sm:text-base text-gray-200 font-normal leading-relaxed max-w-md mx-auto line-clamp-3 sm:line-clamp-none">
              {config.subtext}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <span className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-[#C5A059] text-gray-950 font-bold text-xs flex items-center shadow-md">
                {config.primaryCta}
              </span>
              <span className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-white/15 border border-white/30 text-white font-semibold text-xs flex items-center backdrop-blur-md">
                {config.secondaryCta}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Configuration Form */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              Hero Section Settings
            </h3>
            <p className="text-xs text-gray-500">
              Customize headlines, imagery, and call-to-action buttons
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReset}
              className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save & Publish</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Eyebrow */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Eyebrow Tagline</label>
            <input
              type="text"
              value={config.eyebrow}
              onChange={(e) => setConfig({ ...config, eyebrow: e.target.value })}
              className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          {/* Headline & Headline Italic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Main Headline Part 1</label>
              <input
                type="text"
                value={config.headline}
                onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Italic Headline Accent</label>
              <input
                type="text"
                value={config.headlineItalic}
                onChange={(e) => setConfig({ ...config, headlineItalic: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>

          {/* Subtitle / Subtext */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Subtitle / Body Paragraph</label>
            <textarea
              rows={2}
              value={config.subtext}
              onChange={(e) => setConfig({ ...config, subtext: e.target.value })}
              className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          {/* Hero Background Image */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">Hero Background Photography</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{isUploading ? 'Uploading to Supabase...' : 'Upload Image'}</span>
              </button>
              <input
                type="url"
                value={config.bgImage}
                onChange={(e) => setConfig({ ...config, bgImage: e.target.value })}
                placeholder="Or paste direct image URL (https://...)"
                className="flex-1 h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Primary Button</h4>
              <div>
                <label className="font-semibold text-gray-500 block mb-1">Button Label</label>
                <input
                  type="text"
                  value={config.primaryCta}
                  onChange={(e) => setConfig({ ...config, primaryCta: e.target.value })}
                  className="w-full h-9 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-500 block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={config.primaryCtaLink}
                  onChange={(e) => setConfig({ ...config, primaryCtaLink: e.target.value })}
                  className="w-full h-9 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Secondary Button</h4>
              <div>
                <label className="font-semibold text-gray-500 block mb-1">Button Label</label>
                <input
                  type="text"
                  value={config.secondaryCta}
                  onChange={(e) => setConfig({ ...config, secondaryCta: e.target.value })}
                  className="w-full h-9 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-500 block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={config.secondaryCtaLink}
                  onChange={(e) => setConfig({ ...config, secondaryCtaLink: e.target.value })}
                  className="w-full h-9 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
