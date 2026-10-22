import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Product, ProductVariant } from '../../data/products';
import { formatRs } from '../../data/products';
import { adminUploadProductImage } from '../../lib/supabase';

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
  onDeleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  onUploadImage: (productId: string, file: File) => Promise<void>;
  showToast: (msg: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
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

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(isAddModalOpen);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<any>('nuts');
  const [badge, setBadge] = useState('');
  const [origin, setOrigin] = useState('Ceylon, Sri Lanka');
  const [roastStyle, setRoastStyle] = useState('Artisan Roasted');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('1500');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [weight, setWeight] = useState('250g');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isAddModalOpen) {
      handleOpenCreate();
    }
  }, [isAddModalOpen]);

  // Categories list
  const categories = [
    { slug: 'all', name: 'All Categories' },
    { slug: 'nuts', name: 'Nuts' },
    { slug: 'dried-fruits', name: 'Dried Fruits' },
    { slug: 'dates', name: 'Dates' },
    { slug: 'seeds', name: 'Seeds & Grains' },
    { slug: 'berries', name: 'Berries' },
    { slug: 'exotic-nuts', name: 'Exotic Nuts' },
    { slug: 'mixes', name: 'Mixes' },
    { slug: 'spices', name: 'Whole Spices' },
    { slug: 'gifts-hampers', name: 'Curated Hampers' },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSubtitle('');
    setCategory('nuts');
    setBadge('');
    setOrigin('Ceylon, Sri Lanka');
    setRoastStyle('Artisan Roasted');
    setDescription('');
    setIngredients('100% natural, ethically sourced');
    setPrice('1500');
    setOriginalPrice('');
    setStock('50');
    setWeight('250g');
    setIsFeatured(false);
    setImageUrl('https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSubtitle(prod.subtitle || '');
    setCategory(prod.category);
    setBadge(prod.badge || '');
    setOrigin(prod.origin || 'Ceylon, Sri Lanka');
    setRoastStyle(prod.roastStyle || 'Artisan Roasted');
    setDescription(prod.description || '');
    setIngredients(prod.ingredients || '');

    const primaryVariant = prod.variants[0];
    setPrice(primaryVariant ? String(primaryVariant.price) : '1500');
    setOriginalPrice(
      primaryVariant?.originalPrice ? String(primaryVariant.originalPrice) : ''
    );
    setStock(primaryVariant ? String(primaryVariant.stock) : '50');
    setWeight(primaryVariant ? primaryVariant.weight : '250g');
    setIsFeatured(Boolean(prod.isFeatured));
    setImageUrl(prod.images[0] || '');
    setIsFormOpen(true);
  };

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    showToast('Uploading photo to Supabase Storage...');

    // If editing existing product, upload directly to Supabase storage
    if (editingProduct) {
      await onUploadImage(editingProduct.id, file);
      setIsUploadingPhoto(false);
      setImageUrl(URL.createObjectURL(file));
      showToast('Photo uploaded and synced!');
    } else {
      // For new product, use temporary preview
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setIsUploadingPhoto(false);
      showToast('Image selected for new product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      showToast('Valid price in LKR is required.');
      return;
    }

    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      showToast('Stock must be a non-negative number.');
      return;
    }

    const numOriginalPrice = originalPrice.trim() !== '' ? parseFloat(originalPrice) : undefined;

    setIsSubmitting(true);

    if (editingProduct) {
      // 1. Update product metadata
      const res = await onUpdateProductDetails(editingProduct.id, {
        name,
        subtitle,
        category,
        badge,
        origin,
        roastStyle,
        description,
        ingredients,
        isFeatured,
        images: imageUrl ? [imageUrl, ...editingProduct.images.slice(1)] : editingProduct.images,
      });

      // 2. Update default variant price & stock
      const firstVariant = editingProduct.variants[0];
      if (firstVariant) {
        await onUpdateVariant(
          editingProduct.id,
          firstVariant.id,
          numPrice,
          numOriginalPrice,
          numStock
        );
      }

      setIsSubmitting(false);
      if (res.success) {
        showToast(`Saved ${name} permanently to database.`);
        setIsFormOpen(false);
      } else {
        showToast(`Failed to update: ${res.error}`);
      }
    } else {
      // Create new product
      const res = await onCreateProduct({
        name,
        subtitle,
        category,
        badge,
        origin,
        roastStyle,
        images: imageUrl ? [imageUrl] : [],
        description: description || `${name} artisan provisions.`,
        ingredients,
        isFeatured,
        price: numPrice,
        originalPrice: numOriginalPrice,
        stock: numStock,
        weight: weight || '250g',
      });

      setIsSubmitting(false);
      if (res.success) {
        showToast(`Created ${name} successfully in Supabase!`);
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
    const res = await onDeleteProduct(isDeletingId);
    setIsDeletingId(null);
    if (res.success) {
      showToast(`Deleted ${prod?.name || 'product'} from catalog.`);
    } else {
      showToast(`Delete failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filter, Add Product Button */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, subtitle, tag..."
                className="w-full h-10 pl-10 pr-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
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
            className="w-full sm:w-auto h-10 px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Catalog holds <strong className="text-gray-900">{filteredProducts.length}</strong> items{' '}
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
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-40 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">No products match your criteria</p>
            <p className="text-xs text-gray-400 mt-1">
              Add a new artisan item or clear your search query.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Product Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-gray-100 md:hidden">
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
                  <div key={prod.id} className="p-4 hover:bg-gray-50/80 transition-colors space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                          <span className="truncate">{prod.name}</span>
                          {prod.isFeatured && (
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">
                          {prod.subtitle || `${prod.variants.length} pack variants`}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium capitalize">
                            {prod.category.replace('-', ' ')}
                          </span>
                          {stockStatus}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Price from</span>
                        <span className="font-bold text-gray-900">{formatRs(lowestPrice)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="h-8 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDeletingId(prod.id)}
                          className="h-8 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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
                <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (LKR)</th>
                    <th className="py-3.5 px-4">Total Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
                      <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                                <span className="truncate">{prod.name}</span>
                                {prod.isFeatured && (
                                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                )}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate">
                                {prod.subtitle || `${prod.variants.length} pack variants`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium capitalize">
                            {prod.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">{formatRs(lowestPrice)}</div>
                          {prod.variants.length > 1 && (
                            <div className="text-[10px] text-gray-400">
                              up to {formatRs(Math.max(...prod.variants.map((v) => v.price)))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">
                          {totalStock} units
                        </td>
                        <td className="py-3 px-4">{stockStatus}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDeletingId(prod.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Product Modal Form */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => {
            setIsFormOpen(false);
            if (onCloseAddModal) onCloseAddModal();
          }}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-4 sm:p-7 space-y-4 sm:space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-xl text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Artisan Product'}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ceylon Spiced Cashews"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Artisan Slow Roasted"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              {/* Category & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  >
                    <option value="nuts">Nuts</option>
                    <option value="dried-fruits">Dried Fruits</option>
                    <option value="dates">Dates</option>
                    <option value="seeds">Seeds & Grains</option>
                    <option value="berries">Berries</option>
                    <option value="exotic-nuts">Exotic Nuts</option>
                    <option value="mixes">Mixes</option>
                    <option value="spices">Whole Spices</option>
                    <option value="gifts-hampers">Curated Hampers</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Default Pack Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="250g, 500g, 1kg"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              {/* Price, Discount Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount / Original (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="Optional compare-at"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              {/* Product Photo Upload to Supabase Storage */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Photography</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFilePicked}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="h-8 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full h-8 px-2.5 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Ingredients */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisan provenance, taste notes, pairing notes..."
                  className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded-sm border-gray-300 text-[#1F3D2B] focus:ring-[#1F3D2B] cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-gray-800 cursor-pointer">
                  Feature in Homepage Curated Bestsellers Showcase
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="h-9 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
              <h3 className="font-serif font-bold text-lg text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this product from Supabase? This will delete all weight variants and cannot be undone.
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
