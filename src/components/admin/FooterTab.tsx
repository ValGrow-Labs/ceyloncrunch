import React, { useState } from 'react';
import {
  PanelBottom,
  Save,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface FooterConfig {
  tagline: string;
  subTagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  copyright: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

const DEFAULT_FOOTER: FooterConfig = {
  tagline: 'Healthy Crunch for Every Home. Sourced from authentic Sri Lankan growers.',
  subTagline: 'From the land. Handled with care. Shared with intention.',
  contactEmail: 'ceyloncrunch26@gmail.com',
  contactPhone: '+94 77 944 3867',
  whatsapp: '+94779443867',
  address: 'Colombo, Sri Lanka',
  copyright: '© 2026 Ceylon Crunch (Pvt) Ltd. All rights reserved.',
  instagramUrl: 'https://instagram.com/ceyloncrunch',
  facebookUrl: 'https://facebook.com/ceyloncrunch',
  tiktokUrl: 'https://tiktok.com/@ceylon.crunch',
};

interface FooterTabProps {
  showToast: (msg: string) => void;
}

export const FooterTab: React.FC<FooterTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<FooterConfig>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_footer_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FOOTER;
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ceylon_crunch_footer_config', JSON.stringify(config));
    } catch {}
    setTimeout(() => {
      setIsSaving(false);
      showToast('Footer configuration saved and updated on live store!');
    }, 400);
  };

  const handleReset = () => {
    setConfig(DEFAULT_FOOTER);
    try {
      localStorage.removeItem('ceylon_crunch_footer_config');
    } catch {}
    showToast('Reset footer settings to defaults.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Footer & Contact Details</h2>
          <p className="text-xs text-gray-500">
            Manage bottom brand statement, contact hotlines, WhatsApp, and social profiles
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
            className="h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Footer</span>
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Brand Statements */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Brand Statements
          </h3>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Primary Tagline</label>
            <textarea
              rows={2}
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Secondary Brand Statement</label>
            <textarea
              rows={2}
              value={config.subTagline}
              onChange={(e) => setConfig({ ...config, subTagline: e.target.value })}
              className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Copyright Statement</label>
            <input
              type="text"
              value={config.copyright}
              onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
              className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Contact & Location Details
          </h3>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Customer Support Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full h-10 pl-9 pr-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Hotline / Telephone</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="w-full h-10 pl-9 pr-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">WhatsApp Concierge Number</label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={config.whatsapp}
                onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                className="w-full h-10 pl-9 pr-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">HQ Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                className="w-full h-10 pl-9 pr-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gray-500" />
            <span>Social Media Profiles</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Instagram URL</label>
              <input
                type="url"
                value={config.instagramUrl}
                onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Facebook URL</label>
              <input
                type="url"
                value={config.facebookUrl}
                onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">TikTok URL</label>
              <input
                type="url"
                value={config.tiktokUrl}
                onChange={(e) => setConfig({ ...config, tiktokUrl: e.target.value })}
                className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
