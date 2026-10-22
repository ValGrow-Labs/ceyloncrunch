import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../../data/products';
import { AdminTab } from './AdminSidebar';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Nuts',
    slug: 'nuts',
    description: 'Artisan slow-roasted California almonds, Puttalam cashews, and salted pistachios',
    image: '/products/nuts/cashews.jpg',
  },
  {
    id: 'cat-2',
    name: 'Dried Fruits',
    slug: 'dried-fruits',
    description: 'Sun-dried figs, golden raisins, Turkish apricots, tropical mango slices, and prunes',
    image: '/products/dried-fruits/dried-mango.jpeg',
  },
  {
    id: 'cat-3',
    name: 'Seeds & Grains',
    slug: 'seeds',
    description: 'Raw organic pumpkin seeds, chia seeds, golden flax, quinoa, and sunflower seeds',
    image: '/products/seeds/pumpkin-seeds.jpeg',
  },
];

interface CategoriesTabProps {
  products: Product[];
  onNavigateTab: (tab: AdminTab) => void;
  showToast: (msg: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  products,
  onNavigateTab,
  showToast,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validSlugs = new Set(['nuts', 'dried-fruits', 'seeds']);
          const filtered = parsed.filter((c: CategoryItem) => validSlugs.has(c.slug));
          if (filtered.length > 0) {
            return filtered.map((c: CategoryItem) => {
              if (c.slug === 'nuts' && (!c.image || c.image.includes('wikimedia'))) c.image = '/products/nuts/cashews.jpg';
              if (c.slug === 'dried-fruits' && (!c.image || c.image.includes('wikimedia'))) c.image = '/products/dried-fruits/dried-mango.jpeg';
              if (c.slug === 'seeds' && (!c.image || c.image.includes('wikimedia'))) c.image = '/products/seeds/pumpkin-seeds.jpeg';
              return c;
            });
          }
        }
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const saveToStorage = (updated: CategoryItem[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('ceylon_crunch_categories', JSON.stringify(updated));
    } catch {}
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.');
      return;
    }

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: name.trim(), slug: finalSlug, description: description.trim(), image: image.trim() }
          : c
      );
      saveToStorage(updated);
      showToast(`Updated category "${name}"`);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        image:
          image.trim() ||
          'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
      };
      saveToStorage([...categories, newCat]);
      showToast(`Added category "${name}"`);
    }

    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!isDeletingId) return;
    const cat = categories.find((c) => c.id === isDeletingId);
    const updated = categories.filter((c) => c.id !== isDeletingId);
    saveToStorage(updated);
    setIsDeletingId(null);
    showToast(`Removed category "${cat?.name || ''}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Taxonomy Categories</h2>
          <p className="text-xs text-gray-500">
            Define product categories, imagery, and store organization
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto h-9 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const associatedProductsCount = products.filter(
            (p) => p.category === cat.slug || p.category.includes(cat.slug)
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="relative h-36 bg-gray-100 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <h3 className="font-serif font-bold text-base leading-tight drop-shadow-xs">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-gray-200 font-mono font-medium">
                        /{cat.slug}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                      {associatedProductsCount} items
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab('products')}
                  className="text-xs font-semibold text-[#1F3D2B] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Products</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeletingId(cat.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 p-4 sm:p-6 space-y-4 max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Exotic Nuts"
                  className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="exotic-nuts (auto-generated if empty)"
                  className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short tagline or notes about this category"
                  className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
                {image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-200">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-semibold shadow-xs cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeletingId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsDeletingId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900">Delete Category?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Removing this category will not delete the associated products, but they will be recategorized.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="h-9 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
