import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useStore, OrderStatus, PaymentStatus } from '../lib/store';
import { formatRs, Product, ProductVariant } from '../data/products';
import {
  Shield,
  Lock,
  LogOut,
  Package,
  Layers,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  Eye,
  X,
  FileText,
  Database,
  RefreshCw,
  Image as ImageIcon,
  Mail,
  Upload,
  Save,
  RotateCcw,
  Loader2,
  Check,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  adminUploadProductImage,
  fetchPublicSiteSettings,
  adminUpdateSiteSettings,
} from '../lib/supabase';
import { seedProductsToSupabase } from '../lib/seedDatabase';

export const Admin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const {
    isAdmin,
    isAdminLoading,
    adminEmail,
    loginAdmin,
    logoutAdmin,
    orders,
    refreshOrders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    products,
    refreshProducts,
    updateProductStock,
    updateProductVariantPrice,
    updateProductVariantOriginalPrice,
    updateProductVariants,
    updateProductImage,
    inquiries,
    refreshInquiries,
    showToast,
  } = useStore();

  // Draft tracking for product variant editing
  interface VariantEditDraft {
    price: string;
    originalPrice: string;
    stock: string;
  }

  const [variantDrafts, setVariantDrafts] = useState<Record<string, VariantEditDraft>>({});
  const [savingProductIds, setSavingProductIds] = useState<Record<string, boolean>>({});
  const [recentlySavedProductIds, setRecentlySavedProductIds] = useState<Record<string, boolean>>({});
  const [savingVariantIds, setSavingVariantIds] = useState<Record<string, boolean>>({});
  const [recentlySavedVariantIds, setRecentlySavedVariantIds] = useState<Record<string, boolean>>({});

  const isVariantDirty = (v: ProductVariant) => {
    const draft = variantDrafts[v.id];
    if (!draft) return false;

    const currentPrice = draft.price.trim() === '' ? v.price : parseFloat(draft.price);
    const currentOrig = draft.originalPrice.trim() === '' ? undefined : parseFloat(draft.originalPrice);
    const currentStock = draft.stock.trim() === '' ? v.stock : parseInt(draft.stock, 10);

    const priceDiff = !isNaN(currentPrice) && currentPrice !== v.price;
    const origDiff =
      (currentOrig === undefined && v.originalPrice !== undefined) ||
      (currentOrig !== undefined && v.originalPrice === undefined) ||
      (currentOrig !== undefined && v.originalPrice !== undefined && !isNaN(currentOrig) && currentOrig !== v.originalPrice);
    const stockDiff = !isNaN(currentStock) && currentStock !== v.stock;

    return priceDiff || origDiff || stockDiff;
  };

  const isProductDirty = (prod: Product) => {
    return prod.variants.some((v) => isVariantDirty(v));
  };

  const handleDraftChange = (
    variantId: string,
    field: keyof VariantEditDraft,
    val: string,
    v: ProductVariant
  ) => {
    setVariantDrafts((prev) => {
      const existing = prev[variantId] || {
        price: String(v.price),
        originalPrice: v.originalPrice !== undefined ? String(v.originalPrice) : '',
        stock: String(v.stock),
      };
      return {
        ...prev,
        [variantId]: {
          ...existing,
          [field]: val,
        },
      };
    });
  };

  const handleResetProduct = (prod: Product) => {
    setVariantDrafts((prev) => {
      const next = { ...prev };
      prod.variants.forEach((v) => {
        delete next[v.id];
      });
      return next;
    });
    showToast(`Discarded unsaved changes for ${prod.name}`);
  };

  const handleSaveProduct = async (prod: Product) => {
    setSavingProductIds((prev) => ({ ...prev, [prod.id]: true }));

    const updates = prod.variants.map((v) => {
      const draft = variantDrafts[v.id];
      let price = v.price;
      let originalPrice = v.originalPrice;
      let stock = v.stock;

      if (draft) {
        if (draft.price.trim() !== '') {
          const parsed = parseFloat(draft.price);
          if (!isNaN(parsed) && parsed >= 0) price = Math.round(parsed);
        }
        if (draft.originalPrice.trim() !== '') {
          const parsed = parseFloat(draft.originalPrice);
          if (!isNaN(parsed) && parsed >= 0) originalPrice = Math.round(parsed);
        } else {
          originalPrice = undefined;
        }
        if (draft.stock.trim() !== '') {
          const parsed = parseInt(draft.stock, 10);
          if (!isNaN(parsed) && parsed >= 0) stock = Math.round(parsed);
        }
      }

      return {
        id: v.id,
        price,
        originalPrice,
        stock,
      };
    });

    const res = await updateProductVariants(prod.id, updates);
    setSavingProductIds((prev) => ({ ...prev, [prod.id]: false }));

    if (res.success) {
      setVariantDrafts((prev) => {
        const next = { ...prev };
        prod.variants.forEach((v) => delete next[v.id]);
        return next;
      });

      setRecentlySavedProductIds((prev) => ({ ...prev, [prod.id]: true }));
      setTimeout(() => {
        setRecentlySavedProductIds((prev) => ({ ...prev, [prod.id]: false }));
      }, 3000);

      showToast(`Saved pricing & stock for ${prod.name}`);
    } else {
      showToast(`Failed to save: ${res.error || 'Unknown error'}`);
    }
  };

  const handleSaveVariant = async (prod: Product, v: ProductVariant) => {
    setSavingVariantIds((prev) => ({ ...prev, [v.id]: true }));

    const draft = variantDrafts[v.id];
    let price = v.price;
    let originalPrice = v.originalPrice;
    let stock = v.stock;

    if (draft) {
      if (draft.price.trim() !== '') {
        const parsed = parseFloat(draft.price);
        if (!isNaN(parsed) && parsed >= 0) price = Math.round(parsed);
      }
      if (draft.originalPrice.trim() !== '') {
        const parsed = parseFloat(draft.originalPrice);
        if (!isNaN(parsed) && parsed >= 0) originalPrice = Math.round(parsed);
      } else {
        originalPrice = undefined;
      }
      if (draft.stock.trim() !== '') {
        const parsed = parseInt(draft.stock, 10);
        if (!isNaN(parsed) && parsed >= 0) stock = Math.round(parsed);
      }
    }

    const res = await updateProductVariants(prod.id, [
      {
        id: v.id,
        price,
        originalPrice,
        stock,
      },
    ]);

    setSavingVariantIds((prev) => ({ ...prev, [v.id]: false }));

    if (res.success) {
      setVariantDrafts((prev) => {
        const next = { ...prev };
        delete next[v.id];
        return next;
      });

      setRecentlySavedVariantIds((prev) => ({ ...prev, [v.id]: true }));
      setTimeout(() => {
        setRecentlySavedVariantIds((prev) => ({ ...prev, [v.id]: false }));
      }, 3000);

      showToast(`Saved ${prod.name} (${v.weight})`);
    } else {
      showToast(`Failed to save variant: ${res.error || 'Unknown error'}`);
    }
  };

  // Product image editing state
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageInputVal, setImageInputVal] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Supabase Auth credentials input
  const [emailInput, setEmailInput] = useState('admin@ceyloncrunch.lk');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab (syncs with ?tab= query parameter and /admin/:subpath)
  const getInitialTab = (): 'orders' | 'inventory' | 'config' | 'inquiries' => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && ['orders', 'inventory', 'config', 'inquiries'].includes(tabFromQuery)) {
      return tabFromQuery as 'orders' | 'inventory' | 'config' | 'inquiries';
    }
    const pathPart = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    if (pathPart && ['orders', 'inventory', 'config', 'inquiries'].includes(pathPart)) {
      return pathPart as 'orders' | 'inventory' | 'config' | 'inquiries';
    }
    return 'orders';
  };

  const [activeTab, setActiveTabState] = useState<'orders' | 'inventory' | 'config' | 'inquiries'>(getInitialTab);

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && ['orders', 'inventory', 'config', 'inquiries'].includes(tabFromQuery)) {
      setActiveTabState(tabFromQuery as 'orders' | 'inventory' | 'config' | 'inquiries');
      return;
    }
    const pathPart = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    if (pathPart && ['orders', 'inventory', 'config', 'inquiries'].includes(pathPart)) {
      setActiveTabState(pathPart as 'orders' | 'inventory' | 'config' | 'inquiries');
    }
  }, [location.pathname, searchParams]);

  const setActiveTab = (tab: 'orders' | 'inventory' | 'config' | 'inquiries') => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  // Website Configuration State
  const [siteConfig, setSiteConfig] = useState({
    storeName: 'Ceylon Crunch - Artisan Provisions',
    announcementBanner: 'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed',
    freeDeliveryThreshold: 5000,
    standardDeliveryFee: 450,
    payhereMerchantId: '1228491',
    payhereMode: 'sandbox',
    bankDetails: 'Commercial Bank of Ceylon · Acc: 1000482910 · Ceylon Crunch (Pvt) Ltd',
    contactEmail: 'ceyloncrunch26@gmail.com',
    contactPhone: '+94 77 944 3867',
    supabaseProjectUrl: 'https://ceyloncrunch-db.supabase.co',
    supabaseStorageBucket: 'product-images',
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Load site config from Supabase on mount
  useEffect(() => {
    if (!isAdmin || !isSupabaseConfigured) return;
    fetchPublicSiteSettings().then((settings) => {
      if (settings) {
        setSiteConfig((prev) => ({
          ...prev,
          storeName: settings.store_name || prev.storeName,
          announcementBanner: settings.announcement_banner || prev.announcementBanner,
          freeDeliveryThreshold: settings.free_delivery_threshold ?? prev.freeDeliveryThreshold,
          standardDeliveryFee: settings.standard_delivery_fee ?? prev.standardDeliveryFee,
          bankDetails: settings.bank_details || prev.bankDetails,
          contactEmail: settings.contact_email || prev.contactEmail,
          contactPhone: settings.contact_phone || prev.contactPhone,
        }));
      }
    });
  }, [isAdmin]);

  // Orders filters
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [viewingOrderSlip, setViewingOrderSlip] = useState<{ id: string; slipUrl: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    showToast('Connecting to Supabase and syncing catalog...');
    const result = await seedProductsToSupabase();
    setIsSeeding(false);
    showToast(result.message);
  };

  const handleFileUpload = async (productId: string, file: File) => {
    setIsUploadingImage(true);
    showToast('Uploading image to Supabase Storage...');
    const res = await adminUploadProductImage(productId, file);
    setIsUploadingImage(false);
    if (res.success && res.url) {
      showToast('Image uploaded and updated in catalog!');
      setEditingImageId(null);
      await refreshProducts();
    } else {
      showToast(res.error || 'Failed to upload image.');
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    showToast('Saving configuration to Supabase...');
    const res = await adminUpdateSiteSettings({
      store_name: siteConfig.storeName,
      announcement_banner: siteConfig.announcementBanner,
      free_delivery_threshold: siteConfig.freeDeliveryThreshold,
      standard_delivery_fee: siteConfig.standardDeliveryFee,
      bank_details: siteConfig.bankDetails,
      contact_email: siteConfig.contactEmail,
      contact_phone: siteConfig.contactPhone,
    });
    setIsSavingConfig(false);
    if (res.success) {
      showToast('Website configuration saved to Supabase!');
    } else {
      showToast(`Failed to save configuration: ${res.error}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const result = await loginAdmin(emailInput.trim(), passwordInput.trim());
    setIsLoggingIn(false);
    if (result.success) {
      setPasswordInput('');
      showToast('Logged in as Ceylon Crunch Atelier Administrator');
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials.');
      showToast(result.error || 'Incorrect email or password.');
    }
  };

  // If loading session verification, show loader
  if (isAdminLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center max-w-sm mx-auto px-4 text-center">
        <RefreshCw className="w-8 h-8 text-[#1F3D2B] animate-spin mb-3" />
        <p className="text-sm font-medium text-[#1F3D2B]">Verifying administrator session...</p>
      </div>
    );
  }

  // If not authenticated, show Supabase Auth login gate
  if (!isAdmin) {
    return (
      <div className="py-20 flex flex-col items-center justify-center max-w-sm mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#1F3D2B] text-center mb-1">
          Atelier Admin Portal
        </h1>
        <p className="text-xs text-[#6B6B6B] text-center mb-6">
          Supabase Auth Protected • Single Source of Truth Console
        </p>

        <form onSubmit={handleLogin} className="w-full bg-white border border-[#EADFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                placeholder="admin@ceyloncrunch.lk"
                className="w-full h-11 pl-10 pr-3.5 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (loginError) setLoginError(null);
                }}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-3.5 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-11 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <span>Login to Console</span>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders
    .filter((o) => {
      if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.toLowerCase().includes(q);
        return matchId || matchName || matchPhone;
      }
      return true;
    });

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADFD0] pb-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
              Supabase PostgreSQL &amp; Storage Connected • PayHere Active
            </span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1F3D2B] mt-0.5">
            Store Administration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {adminEmail && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EADFD0]/50 text-[#1F3D2B] border border-[#EADFD0]">
              {adminEmail}
            </span>
          )}
          <button
            type="button"
            onClick={logoutAdmin}
            className="h-9 px-4 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#EADFD0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Order Management ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Product &amp; Stock Management ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'config'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Website Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'inquiries'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EADFD0]">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search order ID, recipient name, phone..."
                className="w-full h-9 pl-9 pr-3 bg-[#f6f3f2] rounded-xl text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] border border-[#EADFD0]"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['all', 'placed', 'confirmed', 'packed', 'dispatched', 'delivered'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize border transition-all ${
                    orderFilterStatus === st
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                      : 'bg-white text-[#6B6B6B] border-[#EADFD0]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4"
                >
                  {/* Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADFD0]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#1F3D2B]">
                        #{order.id}
                      </span>
                      <span className="text-xs text-[#6B6B6B]">• {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B6B6B]">Total:</span>
                      <span className="font-serif text-base font-bold text-[#1F3D2B] tabular-nums">
                        {formatRs(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Shipping Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#424843]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Customer
                      </span>
                      <span className="font-bold text-[#1F3D2B] block">{order.customer.name}</span>
                      <span>{order.customer.phone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Destination
                      </span>
                      <span className="truncate block">{order.shippingAddress.street}</span>
                      <span>
                        {order.shippingAddress.city}, {order.shippingAddress.district}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Payment & Method
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold uppercase text-[#1F3D2B]">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'received'
                              ? 'bg-[#c8ebd1] text-[#022111]'
                              : 'bg-[#ffdeaa] text-[#271900]'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      {order.paymentSlipUrl && (
                        <button
                          type="button"
                          onClick={() => setViewingOrderSlip({ id: order.id, slipUrl: order.paymentSlipUrl! })}
                          className="mt-1 text-[11px] text-[#8B5E3C] font-semibold underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Uploaded Slip</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="bg-[#f6f3f2] p-2.5 rounded-xl border border-[#EADFD0] text-xs">
                    <span className="font-bold text-[#1F3D2B] block mb-1">Items in Parcel:</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((i, idx) => (
                        <span key={idx} className="bg-white px-2 py-1 rounded-md border border-[#EADFD0] text-[11px]">
                          {i.quantity}x {i.productName} ({i.variantWeight})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#EADFD0]/60">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-[#1F3D2B]">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value as OrderStatus);
                          showToast(`Order #${order.id} status updated to ${e.target.value}`);
                        }}
                        className="h-8 px-2.5 bg-white border border-[#EADFD0] rounded-lg text-xs font-semibold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.paymentStatus !== 'received' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderPaymentStatus(order.id, 'received');
                            showToast(`Payment marked as received for #${order.id}`);
                          }}
                          className="h-8 px-3 rounded-full bg-[#c8ebd1] hover:bg-[#b0dfbe] text-[#022111] text-xs font-semibold transition-colors"
                        >
                          Mark Payment Received
                        </button>
                      )}
                      <Link
                        to={`/track?order=${order.id}&phone=${encodeURIComponent(order.customer.phone.replace('+94', '').trim())}`}
                        target="_blank"
                        className="h-8 px-3 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold flex items-center gap-1 border border-[#EADFD0] transition-colors"
                      >
                        <span>View Tracking Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-xs text-[#6B6B6B]">
                No orders match your filter criteria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
                  Live Small-Batch Inventory
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Edit pack pricing and stock availability directly. Changes sync to Supabase and reflect across all devices immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  refreshProducts();
                  showToast('Inventory re-synced with Supabase');
                }}
                className="h-8 px-3 rounded-full bg-[#FAF8F4] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold flex items-center gap-1.5 border border-[#EADFD0] self-start sm:self-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Inventory</span>
              </button>
            </div>

            <div className="space-y-4 divide-y divide-[#EADFD0]">
              {products.length === 0 ? (
                <p className="text-center py-10 text-xs text-[#6B6B6B]">
                  No products in catalog. Add products or sync from Supabase to manage inventory.
                </p>
              ) : (
                products.map((prod) => {
                  const isProdDirty = isProductDirty(prod);
                  const isSavingProd = !!savingProductIds[prod.id];
                  const isRecentlySaved = !!recentlySavedProductIds[prod.id];

                  return (
                    <div key={prod.id} className="pt-5 first:pt-0 space-y-3">
                      {/* Product Header with Thumbnail & Action Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="relative w-12 h-12 rounded-xl border border-[#EADFD0] overflow-hidden bg-[#FAF8F4] shrink-0 flex items-center justify-center shadow-2xs">
                            {prod.images && prod.images[0] ? (
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-[#8B5E3C]" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                                {prod.name}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F4] border border-[#EADFD0] text-[#8B5E3C] font-semibold capitalize">
                                {prod.category.replace('-', ' ')}
                              </span>
                              {isProdDirty && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                                  Unsaved Edits
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#8B5E3C]">{prod.origin}</span>
                          </div>
                        </div>

                        {/* Action Buttons: Reset, Change Image & Save Product */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                          {/* Discard / Reset button when edited */}
                          {isProdDirty && (
                            <button
                              type="button"
                              onClick={() => handleResetProduct(prod)}
                              className="h-8 px-2.5 rounded-full bg-white hover:bg-[#F2ECE4] border border-[#EADFD0] text-xs font-semibold text-[#8B5E3C] inline-flex items-center gap-1 transition-colors"
                              title="Discard unsaved edits for this product"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </button>
                          )}

                          {/* Change Image Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (editingImageId === prod.id) {
                                setEditingImageId(null);
                              } else {
                                setEditingImageId(prod.id);
                                setImageInputVal(prod.images[0] || '');
                              }
                            }}
                            className="h-8 px-3 rounded-full bg-[#FAF8F4] hover:bg-[#EADFD0] border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] inline-flex items-center gap-1.5 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                            <span>{editingImageId === prod.id ? 'Close' : 'Change Image'}</span>
                          </button>

                          {/* Save Product Button */}
                          <button
                            type="button"
                            disabled={isSavingProd}
                            onClick={() => handleSaveProduct(prod)}
                            className={`h-8 px-3.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              isRecentlySaved
                                ? 'bg-[#EBF6EE] border border-[#A3D9B1] text-[#1F6B38]'
                                : isProdDirty
                                ? 'bg-[#1F3D2B] hover:bg-[#143E26] text-white ring-2 ring-[#C5A059]/60 shadow-sm'
                                : 'bg-[#1F3D2B] hover:bg-[#143E26] text-white'
                            }`}
                            title={isProdDirty ? 'Save unsaved pricing and stock edits' : 'Save product pricing and stock to database'}
                          >
                            {isSavingProd ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span>Saving...</span>
                              </>
                            ) : isRecentlySaved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#1F6B38]" />
                                <span>Saved!</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>Save Product</span>
                                {isProdDirty && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0A96D] animate-pulse" />
                                )}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Inline Image Edit Bar when active */}
                      {editingImageId === prod.id && (
                        <div className="p-4 bg-[#FAF8F4] border border-[#EADFD0] rounded-xl flex flex-col gap-3 animate-in fade-in duration-200">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#EADFD0]">
                            <div>
                              <span className="text-xs font-bold text-[#1F3D2B] block">Change Product Image</span>
                              <span className="text-[11px] text-[#6B6B6B]">Upload a photo from your computer/phone, or set an image URL.</span>
                            </div>

                            <label className={`h-8 px-3 rounded-lg bg-[#1F3D2B] hover:bg-[#143E26] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingImage ? 'Uploading to Supabase...' : 'Upload Image File'}</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                disabled={isUploadingImage}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(prod.id, file);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#1F3D2B] shrink-0">Or Image URL:</span>
                              <input
                                type="text"
                                value={imageInputVal}
                                onChange={(e) => setImageInputVal(e.target.value)}
                                placeholder="/products/dried-fruits/name.jpeg or https://..."
                                className="w-full h-8 px-3 bg-white border border-[#EADFD0] rounded-lg text-xs text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                              />
                            </div>
                            <div className="flex items-center gap-2 justify-end shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (imageInputVal.trim()) {
                                    updateProductImage(prod.id, imageInputVal.trim());
                                    setEditingImageId(null);
                                  } else {
                                    showToast('Please enter a valid image path or URL.');
                                  }
                                }}
                                className="h-8 px-3 rounded-lg bg-[#1F3D2B] hover:bg-[#143E26] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Save URL</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingImageId(null)}
                                className="h-8 px-2.5 rounded-lg bg-white border border-[#EADFD0] hover:bg-[#f6f3f2] text-xs font-medium text-[#6B6B6B]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Variant Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {prod.variants.map((v) => {
                          const draft = variantDrafts[v.id];
                          const displayPrice = draft?.price !== undefined ? draft.price : v.price;
                          const displayOrigPrice = draft?.originalPrice !== undefined ? draft.originalPrice : (v.originalPrice ?? '');
                          const displayStock = draft?.stock !== undefined ? draft.stock : v.stock;

                          const numPrice = typeof displayPrice === 'string' ? (displayPrice.trim() === '' ? 0 : parseFloat(displayPrice)) : displayPrice;
                          const numOrigPrice = typeof displayOrigPrice === 'string' ? (displayOrigPrice.trim() === '' ? undefined : parseFloat(displayOrigPrice)) : displayOrigPrice;
                          const numStock = typeof displayStock === 'string' ? (displayStock.trim() === '' ? 0 : parseInt(displayStock, 10)) : displayStock;

                          const isVarDirty = isVariantDirty(v);
                          const isSavingVar = !!savingVariantIds[v.id];
                          const isRecentlySavedVar = !!recentlySavedVariantIds[v.id];

                          return (
                            <div
                              key={v.id}
                              className={`p-3.5 bg-[#f6f3f2] border rounded-xl flex flex-col justify-between gap-3 shadow-2xs transition-all ${
                                isVarDirty ? 'border-[#C5A059] bg-[#FFFDF9] ring-1 ring-[#C5A059]/30' : 'border-[#EADFD0]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#1F3D2B]">{v.weight}</span>
                                  {isVarDirty && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E0A96D]" title="Unsaved edit" />
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    numStock === 0
                                      ? 'bg-[#ffdad6] text-[#93000a]'
                                      : numStock <= 10
                                      ? 'bg-[#ffdcc5] text-[#301400]'
                                      : 'bg-[#c8ebd1] text-[#022111]'
                                  }`}
                                >
                                  {numStock === 0 ? 'Out of Stock' : numStock <= 10 ? 'Low Stock' : 'In Stock'}
                                </span>
                              </div>

                              <div className="space-y-2 pt-1 border-t border-[#EADFD0]/60">
                                {/* Price Input */}
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[11px] font-medium text-[#6B6B6B]">Price:</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-mono text-[#8B5E3C]">Rs.</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step={1}
                                      aria-label={`Price for ${prod.name} ${v.weight}`}
                                      value={displayPrice}
                                      onWheel={(e) => e.currentTarget.blur()}
                                      onChange={(e) => handleDraftChange(v.id, 'price', e.target.value, v)}
                                      className={`w-20 h-7 px-2 bg-white border rounded text-center text-xs font-bold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] transition-colors ${
                                        draft?.price !== undefined && Number(draft.price) !== v.price
                                          ? 'border-[#C5A059] bg-[#FFFDF9]'
                                          : 'border-[#EADFD0]'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Original / Compare-at Price Input */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-medium text-[#6B6B6B]">Orig. Price:</span>
                                    {numOrigPrice !== undefined && !isNaN(numOrigPrice) && !isNaN(numPrice) && numOrigPrice > numPrice && (
                                      <span className="text-[9px] font-bold text-[#C05621] bg-[#FDF0E6] px-1 py-0.5 rounded leading-none">
                                        -{Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-mono text-[#8B5E3C]">Rs.</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step={1}
                                      placeholder="None"
                                      aria-label={`Original Price for ${prod.name} ${v.weight}`}
                                      value={displayOrigPrice}
                                      onWheel={(e) => e.currentTarget.blur()}
                                      onChange={(e) => handleDraftChange(v.id, 'originalPrice', e.target.value, v)}
                                      className={`w-20 h-7 px-2 bg-white border rounded text-center text-xs font-semibold text-[#6B6B6B] focus:outline-none focus:border-[#1F3D2B] transition-colors ${
                                        draft?.originalPrice !== undefined &&
                                        ((draft.originalPrice === '' && v.originalPrice !== undefined) ||
                                          (draft.originalPrice !== '' && Number(draft.originalPrice) !== v.originalPrice))
                                          ? 'border-[#C5A059] bg-[#FFFDF9]'
                                          : 'border-[#EADFD0]'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Stock Input */}
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[11px] font-medium text-[#6B6B6B]">Stock:</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-mono text-[#8B5E3C]">Qty</span>
                                    <input
                                      type="number"
                                      min={0}
                                      aria-label={`Stock for ${prod.name} ${v.weight}`}
                                      value={displayStock}
                                      onWheel={(e) => e.currentTarget.blur()}
                                      onChange={(e) => handleDraftChange(v.id, 'stock', e.target.value, v)}
                                      className={`w-20 h-7 px-2 bg-white border rounded text-center text-xs font-bold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] transition-colors ${
                                        draft?.stock !== undefined && Number(draft.stock) !== v.stock
                                          ? 'border-[#C5A059] bg-[#FFFDF9]'
                                          : 'border-[#EADFD0]'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Per-variant Quick Save Row */}
                                {(isVarDirty || isSavingVar || isRecentlySavedVar) && (
                                  <div className="pt-2 border-t border-[#EADFD0]/60 flex items-center justify-between animate-in fade-in duration-150">
                                    <span className="text-[10px] text-[#8B5E3C] italic font-medium">
                                      {isRecentlySavedVar ? 'Saved!' : 'Pack modified'}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={isSavingVar}
                                      onClick={() => handleSaveVariant(prod, v)}
                                      className={`h-6 px-2 rounded-md text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                        isRecentlySavedVar
                                          ? 'bg-[#EBF6EE] text-[#1F6B38] border border-[#A3D9B1]'
                                          : 'bg-[#1F3D2B] hover:bg-[#143E26] text-white'
                                      }`}
                                      title={`Save ${prod.name} ${v.weight}`}
                                    >
                                      {isSavingVar ? (
                                        <Loader2 className="w-2.5 h-2.5 animate-spin text-white" />
                                      ) : isRecentlySavedVar ? (
                                        <Check className="w-2.5 h-2.5 text-[#1F6B38]" />
                                      ) : (
                                        <Save className="w-2.5 h-2.5 text-[#C5A059]" />
                                      )}
                                      <span>{isSavingVar ? 'Saving' : isRecentlySavedVar ? 'Saved' : 'Save'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
                Website &amp; Gateway Configuration
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Manage storefront announcement banners, delivery rules, PayHere payment gateway credentials, Bank Transfer accounts, and Supabase PostgreSQL/Storage settings.
              </p>
            </div>

            {/* Supabase Integration Live Card */}
            <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-[#c8ebd1]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#1F3D2B]">
                      Supabase Cloud Backend
                    </h3>
                    <p className="text-[11px] text-[#6B6B6B]">
                      PostgreSQL Database, Storage Buckets &amp; Realtime Engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      isSupabaseConfigured
                        ? 'bg-[#c8ebd1]/50 text-[#022111] border-[#a0dbb0]'
                        : 'bg-[#ffdcc5]/60 text-[#451e00] border-[#fdc39a]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSupabaseConfigured ? 'bg-[#2E7D4F] animate-pulse' : 'bg-[#D97706]'
                      }`}
                    />
                    <span>{isSupabaseConfigured ? 'Connected & Active' : 'Local Mode (Awaiting .env Keys)'}</span>
                  </span>

                  <button
                    type="button"
                    disabled={isSeeding || !isSupabaseConfigured}
                    onClick={handleSeedDatabase}
                    className="h-8 px-3.5 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Syncing...' : 'Sync Catalog to Supabase'}</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#6B6B6B] leading-relaxed pt-2 border-t border-[#EADFD0]/60 flex flex-col sm:flex-row justify-between gap-2">
                <span>
                  Migration SQL available in project: <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADFD0] text-[#1F3D2B] font-mono">supabase/schema.sql</code>
                </span>
                <span className="text-[#8B5E3C]">
                  Tables: <code className="font-mono">products, variants, orders, reviews, inquiries</code>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Storefront Title</label>
                <input
                  type="text"
                  value={siteConfig.storeName}
                  onChange={(e) => setSiteConfig({ ...siteConfig, storeName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={siteConfig.announcementBanner}
                  onChange={(e) => setSiteConfig({ ...siteConfig, announcementBanner: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Free Delivery Threshold (Rs.)</label>
                <input
                  type="number"
                  value={siteConfig.freeDeliveryThreshold}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setSiteConfig({ ...siteConfig, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Standard Island Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  value={siteConfig.standardDeliveryFee}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setSiteConfig({ ...siteConfig, standardDeliveryFee: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">PayHere Merchant ID</label>
                <input
                  type="text"
                  value={siteConfig.payhereMerchantId}
                  onChange={(e) => setSiteConfig({ ...siteConfig, payhereMerchantId: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">PayHere Gateway Environment</label>
                <select
                  value={siteConfig.payhereMode}
                  onChange={(e) => setSiteConfig({ ...siteConfig, payhereMode: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                >
                  <option value="sandbox">Sandbox (Testing Mode)</option>
                  <option value="live">Production (Live PayHere Gateway)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Direct Bank Transfer Account Details</label>
                <input
                  type="text"
                  value={siteConfig.bankDetails}
                  onChange={(e) => setSiteConfig({ ...siteConfig, bankDetails: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Supabase PostgreSQL Project URL</label>
                <input
                  type="text"
                  value={siteConfig.supabaseProjectUrl}
                  onChange={(e) => setSiteConfig({ ...siteConfig, supabaseProjectUrl: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Supabase Image Storage Bucket</label>
                <input
                  type="text"
                  value={siteConfig.supabaseStorageBucket}
                  onChange={(e) => setSiteConfig({ ...siteConfig, supabaseStorageBucket: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={handleSaveConfig}
                className="h-10 px-6 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
              >
                {isSavingConfig ? 'Saving to Supabase...' : 'Save Website Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-2xs">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
              Customer Inquiries
            </h2>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Messages received from the Contact page and corporate concierge requests.
            </p>

            <div className="space-y-3">
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl space-y-2 text-xs text-[#424843]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADFD0]/60 pb-2">
                      <div>
                        <span className="font-bold text-[#1F3D2B] text-sm block">{inq.name}</span>
                        <span className="text-[11px] text-[#6B6B6B]">
                          {inq.email} • {inq.phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#8B5E3C] block">{inq.subject}</span>
                        <span className="text-[10px] text-[#6B6B6B]">{inq.createdAt}</span>
                      </div>
                    </div>

                    <p className="leading-relaxed text-[#2B2B2B] pt-1 italic">
                      "{inq.message}"
                    </p>

                    <div className="pt-2 flex justify-end">
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                        className="px-3 py-1 rounded-full bg-[#1F3D2B] text-white text-[11px] font-semibold hover:bg-[#162C1F] transition-colors"
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-[#6B6B6B]">
                  No customer inquiries received yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Slip Preview Modal */}
      {viewingOrderSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setViewingOrderSlip(null)}
          />
          <div className="relative bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EADFD0] pb-2">
              <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                Bank Payment Slip for #{viewingOrderSlip.id}
              </h3>
              <button
                type="button"
                onClick={() => setViewingOrderSlip(null)}
                className="w-7 h-7 rounded-full bg-[#f0eded] flex items-center justify-center text-[#2B2B2B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-[#f6f3f2] p-2 rounded-xl border border-[#EADFD0]">
              <img
                src={viewingOrderSlip.slipUrl}
                alt="Bank Transfer Slip"
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                updateOrderPaymentStatus(viewingOrderSlip.id, 'received');
                showToast(`Payment verified for #${viewingOrderSlip.id}`);
                setViewingOrderSlip(null);
              }}
              className="w-full h-11 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F]"
            >
              Verify & Approve Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
