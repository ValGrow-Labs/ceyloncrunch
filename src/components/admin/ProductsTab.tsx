import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
} from 'lucide-react';
import { Product, ProductVariant } from '../../data/products';
import { formatRs } from '../../data/products';

interface ProductsTabProps {
  products: Product[];
  onCreateProduct: (payload: {
    name: string;
    subtitle?: string;
    category: any;
    badge?: string;
    origin?: string;
    roastStyle?: string;
    images: string[];
    description: string;
    ingredients?: string;
    storage?: string;
    shelfLife?: string;
    allergenNotice?: string;
    isFeatured?: boolean;
    price: number;
    originalPrice?: number;
    stock: number;
    weight?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onUpdateProductDetails: (
    productId: string,
    updates: {
      name?: string;
      subtitle?: string;
      category?: any;
      badge?: string;
      origin?: string;
      roastStyle?: string;
      description?: string;
      ingredients?: string;
      isFeatured?: boolean;
      images?: string[];
    }
  ) => Promise<{ success: boolean; error?: string }>;
  onUpdateVariant: (
    productId: string,
    variantId: string,
    price: number,
    originalPrice?: number,
    stock?: number
  ) => Promise<void>;
  onDeleteProduct: (productId: string, slug?: string) => Promise<{ success: boolean; error?: string }>;
  onUploadImage: (productId: string, file: File) => Promise<void>;
  showToast: (msg: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

interface VariantRow {
  id?: string;
  weight: string;
  price: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onCreateProduct,
  onUpdateProductDetails,
  onUpdateVariant,
  onDeleteProduct,
  onUploadImage,
  showToast,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Edit / Add View State
  const [isFormOpen, setIsFormOpen] = useState(isAddModalOpen);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Hidden products state
  const [hiddenProductIds, setHiddenProductIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_hidden_products');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set<string>();
  });

  const handleToggleHide = (productId: string, productName: string) => {
    setHiddenProductIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyHidden = next.has(productId);
      if (isCurrentlyHidden) {
        next.delete(productId);
        showToast(`"${productName}" is now visible on storefront.`);
      } else {
        next.add(productId);
        showToast(`"${productName}" is now hidden from storefront.`);
      }
      try {
        localStorage.setItem(
          'ceylon_crunch_hidden_products',
          JSON.stringify(Array.from(next))
        );
      } catch {}
      return next;
    });
  };

  // 1. Basic Info Fields
  const [name, setName] = useState('Roasted Cashews');
  const [slug, setSlug] = useState('roasted-cashews');
  const [category, setCategory] = useState<string>('Roasted Nuts');
  const [price, setPrice] = useState('1200');
  const [description, setDescription] = useState(
    'Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat.'
  );

  // 2. Product Image
  const [imageUrl, setImageUrl] = useState('/img/product-1.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Variants State
  const [variants, setVariants] = useState<VariantRow[]>([
    { weight: '100g', price: '' },
    { weight: '250g', price: '' },
    { weight: '500g', price: '' },
    { weight: '1KG', price: '' },
  ]);

  // 4. Badge & Visibility State
  const [badgeText, setBadgeText] = useState('Bestseller');
  const [badgeColor, setBadgeColor] = useState('Green (Bestseller)');
  const [rating, setRating] = useState('4.8');
  const [reviewCount, setReviewCount] = useState('142');
  const [isActive, setIsActive] = useState(true);

  // 5. Nutrition Info State
  const [nutrition, setNutrition] = useState({
    servingSize: '30g',
    calories: '180 kcal',
    totalFat: '14g',
    protein: '6g',
    carbohydrates: '9g',
    fibre: '2g',
    sodium: '5mg',
  });

  React.useEffect(() => {
    if (isAddModalOpen) {
      handleOpenCreate();
    }
  }, [isAddModalOpen]);

  // Categories list
  const categories = [
    { slug: 'all', name: 'All Categories' },
    { slug: 'Roasted Nuts', name: 'Roasted Nuts' },
    { slug: 'Raw Nuts', name: 'Raw Nuts' },
    { slug: 'Dried Fruits', name: 'Dried Fruits' },
    { slug: 'Dates', name: 'Dates' },
    { slug: 'Seeds & Grains', name: 'Seeds & Grains' },
    { slug: 'Berries', name: 'Berries' },
    { slug: 'Exotic Nuts', name: 'Exotic Nuts' },
    { slug: 'Mixes', name: 'Mixes' },
    { slug: 'Whole Spices', name: 'Whole Spices' },
    { slug: 'Curated Hampers', name: 'Curated Hampers' },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        categoryFilter === 'all' ||
        p.category.toLowerCase() === categoryFilter.toLowerCase() ||
        p.category.replace('-', ' ').toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategory('Roasted Nuts');
    setPrice('1200');
    setDescription('');
    setImageUrl('/img/product-1.jpg');
    setVariants([
      { weight: '100g', price: '' },
      { weight: '250g', price: '' },
      { weight: '500g', price: '' },
      { weight: '1KG', price: '' },
    ]);
    setBadgeText('Bestseller');
    setBadgeColor('Green (Bestseller)');
    setRating('4.8');
    setReviewCount('142');
    setIsActive(true);
    setNutrition({
      servingSize: '30g',
      calories: '180 kcal',
      totalFat: '14g',
      protein: '6g',
      carbohydrates: '9g',
      fibre: '2g',
      sodium: '5mg',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    setCategory(prod.category.replace('-', ' ') || 'Roasted Nuts');
    
    const primaryVariant = prod.variants[0];
    setPrice(primaryVariant ? String(primaryVariant.price) : '1200');
    setDescription(
      prod.description ||
        'Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat.'
    );
    setImageUrl(prod.images[0] || '/img/product-1.jpg');

    if (prod.variants && prod.variants.length > 0) {
      setVariants(
        prod.variants.map((v) => ({
          id: v.id,
          weight: v.weight,
          price: String(v.price || ''),
        }))
      );
    } else {
      setVariants([
        { weight: '100g', price: '' },
        { weight: '250g', price: '' },
        { weight: '500g', price: '' },
        { weight: '1KG', price: '' },
      ]);
    }

    setBadgeText(prod.badge || 'Bestseller');
    setBadgeColor('Green (Bestseller)');
    setRating(String(prod.rating || 4.8));
    setReviewCount(String(prod.reviewCount || 142));
    setIsActive(!hiddenProductIds.has(prod.id));

    setIsFormOpen(true);
  };

  // Auto-slugify on name change if not editing slug directly
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { weight: '', price: '' }]);
  };

  const handleApplyPresetVariants = () => {
    setVariants([
      { weight: '100g', price: price ? String(Math.round(Number(price) * 0.45)) : '550' },
      { weight: '250g', price: price || '1200' },
      { weight: '500g', price: price ? String(Math.round(Number(price) * 1.9)) : '2250' },
      { weight: '1KG', price: price ? String(Math.round(Number(price) * 3.6)) : '4300' },
    ]);
    showToast('Applied standard weight presets (100g, 250g, 500g, 1KG)');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: 'weight' | 'price', val: string) => {
    const next = [...variants];
    next[index][field] = val;
    setVariants(next);
  };

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    showToast('Uploading photo...');

    if (editingProduct) {
      try {
        await onUploadImage(editingProduct.id, file);
        setImageUrl(URL.createObjectURL(file));
        showToast('Photo uploaded and synced!');
      } catch {
        setImageUrl(URL.createObjectURL(file));
        showToast('Image preview loaded');
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setIsUploadingPhoto(false);
      showToast('Image selected for product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.');
      return;
    }

    const numPrice = Number(price) || 1200;
    setIsSubmitting(true);

    if (editingProduct) {
      const res = await onUpdateProductDetails(editingProduct.id, {
        name,
        category: category.toLowerCase().replace(/\s+/g, '-'),
        badge: badgeText,
        description,
        images: imageUrl ? [imageUrl] : editingProduct.images,
      });

      // Update variants if available
      for (const v of variants) {
        if (v.id && v.price) {
          await onUpdateVariant(editingProduct.id, v.id, Number(v.price) || numPrice);
        }
      }

      // Sync active state
      if (!isActive) {
        setHiddenProductIds((prev) => new Set(prev).add(editingProduct.id));
      } else {
        setHiddenProductIds((prev) => {
          const next = new Set(prev);
          next.delete(editingProduct.id);
          return next;
        });
      }

      setIsSubmitting(false);
      if (res.success) {
        showToast(`Saved ${name} successfully!`);
        setIsFormOpen(false);
      } else {
        showToast(`Failed to update: ${res.error}`);
      }
    } else {
      const res = await onCreateProduct({
        name,
        category: category.toLowerCase().replace(/\s+/g, '-'),
        badge: badgeText,
        images: imageUrl ? [imageUrl] : [],
        description: description || `${name} artisan provisions.`,
        price: numPrice,
        stock: 50,
        weight: variants[0]?.weight || '250g',
      });

      setIsSubmitting(false);
      if (res.success) {
        showToast(`Created ${name} successfully!`);
        setIsFormOpen(false);
        if (onCloseAddModal) onCloseAddModal();
      } else {
        showToast(`Failed to create product: ${res.error}`);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    const prod = products.find((p) => p.id === isDeletingId);
    const res = await onDeleteProduct(isDeletingId, prod?.slug);
    setIsDeletingId(null);
    if (res.success) {
      showToast(`Deleted ${prod?.name || 'product'} from catalog.`);
    } else {
      showToast(`Delete failed: ${res.error}`);
    }
  };

  // ==========================================
  // VIEW 2: FULL PRODUCT EDIT SCREEN (Images 1-4)
  // ==========================================
  if (isFormOpen) {
    return (
      <div className="space-y-6 max-w-5xl">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => {
            setIsFormOpen(false);
            if (onCloseAddModal) onCloseAddModal();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E4E35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>

        {/* Page Title & Slug */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {editingProduct ? `Edit: ${name}` : 'Add New Product'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-normal">
            /{slug || 'new-product'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CARD 1: Basic Info */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
            <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              Basic Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Roasted Cashews"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="roasted-cashews"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] cursor-pointer"
                >
                  <option value="Roasted Nuts">Roasted Nuts</option>
                  <option value="Raw Nuts">Raw Nuts</option>
                  <option value="Dried Fruits">Dried Fruits</option>
                  <option value="Dates">Dates</option>
                  <option value="Seeds & Grains">Seeds & Grains</option>
                  <option value="Berries">Berries</option>
                  <option value="Exotic Nuts">Exotic Nuts</option>
                  <option value="Mixes">Mixes</option>
                  <option value="Whole Spices">Whole Spices</option>
                  <option value="Curated Hampers">Curated Hampers</option>
                </select>
              </div>

              {/* Price (LKR) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1200"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat."
                className="w-full p-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] focus:ring-1 focus:ring-[#1E4E35] transition-all resize-none"
              />
            </div>
          </div>

          {/* CARD 2: Product Image */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
            <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              Product Image
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Product Image
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Thumbnail with red delete circle badge */}
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs text-stone-400 font-semibold">No Image</span>
                    )}
                  </div>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>
                  )}
                </div>

                {/* Image Path input & upload button */}
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/img/product-1.jpg"
                    className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] transition-all"
                  />

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFilePicked}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Uploading...' : '↑ Upload Image'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Variants (Weight + Price) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
            <div>
              <h2 className="font-bold text-stone-900 text-base">
                Variants (Weight + Price)
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Each weight option has its own price. Leave empty to use the base price above.
              </p>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none bg-stone-50/70 sm:bg-transparent border border-stone-200/60 sm:border-0"
                >
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 flex-1">
                    {/* Weight */}
                    <div className="w-full sm:w-64">
                      <label className="block sm:hidden text-[11px] font-semibold text-stone-500 mb-1">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={v.weight}
                        onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                        placeholder="e.g. 250g"
                        className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                      />
                    </div>

                    {/* Price */}
                    <div className="w-full sm:w-64">
                      <label className="block sm:hidden text-[11px] font-semibold text-stone-500 mb-1">
                        Price (LKR)
                      </label>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                        placeholder="Price (LKR)"
                        className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] transition-all"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-end pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="w-full sm:w-auto h-9 sm:h-auto px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors cursor-pointer shrink-0 text-center"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Variant Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
              >
                + Add Variant
              </button>
              <button
                type="button"
                onClick={handleApplyPresetVariants}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Preset: 100g / 250g / 500g / 1KG
              </button>
            </div>
          </div>

          {/* CARD 4: Badge & Visibility */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
            <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              Badge & Visibility
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Bestseller"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              {/* Badge Colour */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Badge Colour
                </label>
                <select
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] cursor-pointer"
                >
                  <option value="Green (Bestseller)">Green (Bestseller)</option>
                  <option value="Gold (Limited)">Gold (Limited)</option>
                  <option value="Amber (Seasonal)">Amber (Seasonal)</option>
                  <option value="Red (Hot Deal)">Red (Hot Deal)</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Rating (0–5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.8"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              {/* Review Count */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Review Count
                </label>
                <input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  placeholder="142"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-stone-800 select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E4E35] accent-[#1E4E35] focus:ring-[#1E4E35] cursor-pointer"
                />
                <span>Active (visible on store)</span>
              </label>
            </div>
          </div>

          {/* CARD 5: Nutrition Info (per serving) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-5">
            <h2 className="font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
              Nutrition Info (per serving)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Serving Size
                </label>
                <input
                  type="text"
                  value={nutrition.servingSize}
                  onChange={(e) => setNutrition({ ...nutrition, servingSize: e.target.value })}
                  placeholder="30g"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Calories
                </label>
                <input
                  type="text"
                  value={nutrition.calories}
                  onChange={(e) => setNutrition({ ...nutrition, calories: e.target.value })}
                  placeholder="180 kcal"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Total Fat
                </label>
                <input
                  type="text"
                  value={nutrition.totalFat}
                  onChange={(e) => setNutrition({ ...nutrition, totalFat: e.target.value })}
                  placeholder="14g"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Protein
                </label>
                <input
                  type="text"
                  value={nutrition.protein}
                  onChange={(e) => setNutrition({ ...nutrition, protein: e.target.value })}
                  placeholder="6g"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Carbohydrates
                </label>
                <input
                  type="text"
                  value={nutrition.carbohydrates}
                  onChange={(e) => setNutrition({ ...nutrition, carbohydrates: e.target.value })}
                  placeholder="9g"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Fibre
                </label>
                <input
                  type="text"
                  value={nutrition.fibre}
                  onChange={(e) => setNutrition({ ...nutrition, fibre: e.target.value })}
                  placeholder="2g"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Sodium
                </label>
                <input
                  type="text"
                  value={nutrition.sodium}
                  onChange={(e) => setNutrition({ ...nutrition, sodium: e.target.value })}
                  placeholder="5mg"
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] transition-all"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] text-white font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60 text-center"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                if (onCloseAddModal) onCloseAddModal();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: PRODUCTS CATALOG LIST VIEW
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filter, Add Product Button */}
      <div className="bg-white rounded-3xl border border-stone-100 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, subtitle, tag..."
                className="w-full h-10 pl-10 pr-3.5 bg-stone-50/80 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#1E4E35]"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 bg-stone-50/80 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:bg-white focus:outline-none focus:border-[#1E4E35] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto h-10 px-4 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Catalog holds <strong className="text-stone-900">{filteredProducts.length}</strong> items{' '}
            {categoryFilter !== 'all' && `in ${categoryFilter}`}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Products Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-400 space-y-1">
            <p className="text-sm font-semibold text-stone-700">No products match your criteria</p>
            <p className="text-xs text-stone-400">
              Add a new artisan item or clear your search query.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Product Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-stone-100 md:hidden">
              {filteredProducts.map((prod) => {
                const lowestPrice = Math.min(...prod.variants.map((v) => v.price));
                const totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);

                const stockStatus =
                  totalStock === 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Out of Stock
                    </span>
                  ) : totalStock <= 10 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Low Stock ({totalStock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      In Stock ({totalStock})
                    </span>
                  );

                return (
                  <div key={prod.id} className="p-4 hover:bg-stone-50/60 transition-colors space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                          <span className="truncate">{prod.name}</span>
                          {prod.isFeatured && (
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 truncate mt-0.5">
                          {prod.subtitle || `${prod.variants.length} pack variants`}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium capitalize">
                            {prod.category.replace('-', ' ')}
                          </span>
                          {stockStatus}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Price from</span>
                        <span className="font-bold text-stone-900">{formatRs(lowestPrice)}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="px-3.5 py-1 rounded-xl bg-[#EBF3FE] hover:bg-[#DCE9FD] text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleHide(prod.id, prod.name)}
                          className={`px-3.5 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                            hiddenProductIds.has(prod.id)
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-[#FDF3E7] hover:bg-[#FAE7D0] text-[#B45309]'
                          }`}
                        >
                          {hiddenProductIds.has(prod.id) ? 'Show' : 'Hide'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDeletingId(prod.id)}
                          className="px-3.5 py-1 rounded-xl bg-[#FDF0ED] hover:bg-[#FCE1DC] text-[#DC2626] font-bold text-xs transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Hidden on screens < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Product</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Price (LKR)</th>
                    <th className="py-3.5 px-4 font-bold">Total Stock</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => {
                    const lowestPrice = Math.min(...prod.variants.map((v) => v.price));
                    const totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);

                    const stockStatus =
                      totalStock === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : totalStock <= 10 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Low Stock ({totalStock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Stock ({totalStock})
                        </span>
                      );

                    return (
                      <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                                <span className="truncate">{prod.name}</span>
                                {prod.isFeatured && (
                                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-stone-400 truncate">
                                {prod.subtitle || `${prod.variants.length} pack variants`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium capitalize">
                            {prod.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900">{formatRs(lowestPrice)}</div>
                          {prod.variants.length > 1 && (
                            <div className="text-[10px] text-stone-400">
                              up to {formatRs(Math.max(...prod.variants.map((v) => v.price)))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-900">
                          {totalStock} units
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {stockStatus}
                            {hiddenProductIds.has(prod.id) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                                Hidden
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              className="px-3.5 py-1 rounded-xl bg-[#EBF3FE] hover:bg-[#DCE9FD] text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleHide(prod.id, prod.name)}
                              className={`px-3.5 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                                hiddenProductIds.has(prod.id)
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-[#FDF3E7] hover:bg-[#FAE7D0] text-[#B45309]'
                              }`}
                            >
                              {hiddenProductIds.has(prod.id) ? 'Show' : 'Hide'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDeletingId(prod.id)}
                              className="px-3.5 py-1 rounded-xl bg-[#FDF0ED] hover:bg-[#FCE1DC] text-[#DC2626] font-bold text-xs transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900">Delete Product</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to permanently delete this product from the catalog? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
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
