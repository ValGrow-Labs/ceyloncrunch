import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

const DEFAULT_NAV: NavLinkItem[] = [
  { id: 'nav-1', label: 'Home', href: '/' },
  { id: 'nav-2', label: 'Shop All Products', href: '/shop' },
  { id: 'nav-3', label: 'Our Story', href: '/our-story' },
  { id: 'nav-4', label: 'Ethical Sourcing', href: '/sourcing' },
  { id: 'nav-5', label: 'Quality Promise', href: '/quality-promise' },
  { id: 'nav-6', label: 'Corporate Gifting', href: '/corporate' },
  { id: 'nav-7', label: 'Track Order', href: '/track' },
  { id: 'nav-8', label: 'Contact', href: '/contact' },
];

interface NavigationTabProps {
  showToast: (msg: string) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ showToast }) => {
  const [links, setLinks] = useState<NavLinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_nav_links');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NAV;
  });

  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavLinkItem | null>(null);
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLabel('');
    setHref('/');
    setIsEditingModalOpen(true);
  };

  const handleOpenEdit = (item: NavLinkItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href);
    setIsEditingModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) {
      showToast('Label and destination URL are required.');
      return;
    }

    if (editingItem) {
      setLinks((prev) =>
        prev.map((l) => (l.id === editingItem.id ? { ...l, label: label.trim(), href: href.trim() } : l))
      );
      showToast(`Updated menu link "${label}"`);
    } else {
      const newItem: NavLinkItem = {
        id: `nav-${Date.now()}`,
        label: label.trim(),
        href: href.trim(),
      };
      setLinks((prev) => [...prev, newItem]);
      showToast(`Added menu link "${label}"`);
    }

    setIsEditingModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Removed navigation link');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= links.length) return;

    setLinks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem('ceylon_crunch_nav_links', JSON.stringify(links));
    } catch {}
    showToast('Navigation menu configuration saved!');
  };

  const handleReset = () => {
    setLinks(DEFAULT_NAV);
    try {
      localStorage.removeItem('ceylon_crunch_nav_links');
    } catch {}
    showToast('Reset navigation menu to defaults.');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Header Navigation Menu</h2>
          <p className="text-xs text-gray-500">
            Configure links displayed in the customer storefront header and mobile drawer
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
            onClick={handleOpenAdd}
            className="h-9 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
          <button
            onClick={handleSave}
            className="h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Menu</span>
          </button>
        </div>
      </div>

      {/* Navigation Links Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="divide-y divide-gray-100">
          {links.map((link, index) => (
            <div
              key={link.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{link.label}</div>
                  <div className="text-xs text-gray-400 font-mono truncate">{link.href}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 shrink-0 self-end sm:self-auto">
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
                  disabled={index === links.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(link)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                  title="Edit link"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Link Modal */}
      {isEditingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-gray-200 max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingItem ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Display Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Shop All"
                  className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Destination URL / Route *</label>
                <input
                  type="text"
                  required
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="/shop or /our-story"
                  className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-semibold shadow-xs cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
