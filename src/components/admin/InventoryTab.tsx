import React, { useState } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Loader2,
} from 'lucide-react';
import { Product, ProductVariant, formatRs } from '../../data/products';

interface InventoryTabProps {
  products: Product[];
  onUpdateVariantStock: (productId: string, variantId: string, newStock: number) => Promise<void>;
  showToast: (msg: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  onUpdateVariantStock,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Draft changes: key is variantId, value is draft stock string
  const [draftStocks, setDraftStocks] = useState<Record<string, string>>({});
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);

  // Flatten products into variant rows
  const allRows: Array<{
    product: Product;
    variant: ProductVariant;
  }> = [];

  products.forEach((p) => {
    p.variants.forEach((v) => {
      allRows.push({ product: p, variant: v });
    });
  });

  // Calculate totals
  const totalUnits = allRows.reduce((sum, r) => sum + r.variant.stock, 0);
  const lowStockCount = allRows.filter((r) => r.variant.stock > 0 && r.variant.stock <= 10).length;
  const outOfStockCount = allRows.filter((r) => r.variant.stock === 0).length;

  const filteredRows = allRows.filter(({ product, variant }) => {
    const matchSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.weight.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    let matchStock = true;
    if (stockFilter === 'low') {
      matchStock = variant.stock > 0 && variant.stock <= 10;
    } else if (stockFilter === 'out') {
      matchStock = variant.stock === 0;
    }

    return matchSearch && matchStock;
  });

  const handleStockDraftChange = (variantId: string, val: string) => {
    setDraftStocks((prev) => ({ ...prev, [variantId]: val }));
  };

  const handleStepStock = (variant: ProductVariant, step: number) => {
    const currentVal =
      draftStocks[variant.id] !== undefined
        ? parseInt(draftStocks[variant.id], 10)
        : variant.stock;

    const nextVal = Math.max(0, (isNaN(currentVal) ? variant.stock : currentVal) + step);
    setDraftStocks((prev) => ({ ...prev, [variant.id]: String(nextVal) }));
  };

  const handleSaveStock = async (product: Product, variant: ProductVariant) => {
    const draftStr = draftStocks[variant.id];
    if (draftStr === undefined) return;

    const parsed = parseInt(draftStr, 10);
    if (isNaN(parsed) || parsed < 0) {
      showToast('Stock must be a valid non-negative number.');
      return;
    }

    setSavingVariantId(variant.id);
    await onUpdateVariantStock(product.id, variant.id, parsed);
    setSavingVariantId(null);

    // Remove from draft
    setDraftStocks((prev) => {
      const next = { ...prev };
      delete next[variant.id];
      return next;
    });

    showToast(`Saved stock for ${product.name} (${variant.weight}): ${parsed} units`);
  };

  const handleResetRow = (variantId: string) => {
    setDraftStocks((prev) => {
      const next = { ...prev };
      delete next[variantId];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Units In Stock
            </p>
            <p className="text-2xl font-serif font-bold text-gray-900">{totalUnits}</p>
            <p className="text-[11px] text-gray-400 mt-1">Across {allRows.length} pack variants</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Low Stock Alerts (≤ 10)
            </p>
            <p className="text-2xl font-serif font-bold text-amber-600">{lowStockCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Nearing depletion</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Out of Stock (0)
            </p>
            <p className="text-2xl font-serif font-bold text-rose-600">{outOfStockCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Hidden from customer purchases</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, variant weight, category..."
              className="w-full h-10 pl-10 pr-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 sm:pb-0">
            <button
              onClick={() => setStockFilter('all')}
              className={`h-9 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                stockFilter === 'all'
                  ? 'bg-[#1F3D2B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allRows.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`h-9 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                stockFilter === 'low'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`h-9 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                stockFilter === 'out'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {filteredRows.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Boxes className="w-10 h-10 mx-auto mb-2 opacity-40 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">No matching inventory rows</p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Inventory Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredRows.map(({ product, variant }) => {
                const draftVal = draftStocks[variant.id];
                const currentDisplay =
                  draftVal !== undefined ? draftVal : String(variant.stock);
                const isDirty =
                  draftVal !== undefined &&
                  draftVal.trim() !== '' &&
                  parseInt(draftVal, 10) !== variant.stock;

                const isSaving = savingVariantId === variant.id;

                const statusBadge =
                  variant.stock === 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Out of Stock
                    </span>
                  ) : variant.stock <= 10 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Low Stock ({variant.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      In Stock ({variant.stock})
                    </span>
                  );

                return (
                  <div
                    key={variant.id}
                    className={`p-4 transition-colors space-y-3 ${
                      isDirty ? 'bg-amber-50/50' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {variant.weight} · <span className="font-semibold text-gray-700">{formatRs(variant.price)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">{statusBadge}</div>
                    </div>

                    {/* Stock Quick Stepper Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100/80">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStepStock(variant, -5)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 cursor-pointer"
                          title="Decrease 5"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepStock(variant, -1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-gray-700 cursor-pointer"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={currentDisplay}
                          onChange={(e) => handleStockDraftChange(variant.id, e.target.value)}
                          className={`w-16 h-8 text-center rounded-lg border font-mono font-bold text-xs focus:outline-none ${
                            isDirty
                              ? 'border-amber-400 bg-amber-50 text-amber-900'
                              : 'border-gray-200 bg-gray-50 text-gray-900 focus:bg-white'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => handleStepStock(variant, 1)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-gray-700 cursor-pointer"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStepStock(variant, 5)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center text-gray-700 cursor-pointer"
                          title="Increase 5"
                        >
                          +5
                        </button>
                      </div>

                      {/* Save / Reset Actions */}
                      {isDirty ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleResetRow(variant.id)}
                            className="h-8 px-2.5 rounded-lg text-gray-500 hover:text-gray-700 bg-gray-100 cursor-pointer text-xs"
                            title="Discard changes"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSaveStock(product, variant)}
                            className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            {isSaving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            <span>Save</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400">Synced</span>
                      )}
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
                    <th className="py-3.5 px-4">Variant Weight</th>
                    <th className="py-3.5 px-4">Unit Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Current Stock & Quick Adjust</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map(({ product, variant }) => {
                    const draftVal = draftStocks[variant.id];
                    const currentDisplay =
                      draftVal !== undefined ? draftVal : String(variant.stock);
                    const isDirty =
                      draftVal !== undefined &&
                      draftVal.trim() !== '' &&
                      parseInt(draftVal, 10) !== variant.stock;

                    const isSaving = savingVariantId === variant.id;

                    const statusBadge =
                      variant.stock === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : variant.stock <= 10 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Low Stock ({variant.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Stock ({variant.stock})
                        </span>
                      );

                    return (
                      <tr
                        key={variant.id}
                        className={`hover:bg-gray-50/80 transition-colors ${
                          isDirty ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{product.name}</div>
                              <div className="text-[10px] text-gray-400 capitalize">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {variant.weight}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {formatRs(variant.price)}
                        </td>
                        <td className="py-3 px-4">{statusBadge}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {/* Decrement Button */}
                            <button
                              type="button"
                              onClick={() => handleStepStock(variant, -5)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                              title="Decrease 5"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepStock(variant, -1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                              title="Decrease 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            {/* Input */}
                            <input
                              type="number"
                              min="0"
                              value={currentDisplay}
                              onChange={(e) => handleStockDraftChange(variant.id, e.target.value)}
                              className={`w-16 h-8 text-center rounded-lg border font-mono font-bold text-xs focus:outline-none ${
                                isDirty
                                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                                  : 'border-gray-200 bg-gray-50 text-gray-900 focus:bg-white'
                              }`}
                            />

                            {/* Increment Button */}
                            <button
                              type="button"
                              onClick={() => handleStepStock(variant, 1)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                              title="Increase 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepStock(variant, 5)}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                              title="Increase 5"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isDirty ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleResetRow(variant.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                                title="Discard change"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleSaveStock(product, variant)}
                                className="h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                {isSaving ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                                <span>Save</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">Synced</span>
                          )}
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
    </div>
  );
};
