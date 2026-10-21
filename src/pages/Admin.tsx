import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore, Order, OrderStatus, PaymentStatus } from '../lib/store';
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
  EyeOff,
  X,
  FileText,
  Database,
  RefreshCw,
  Image as ImageIcon,
  Mail,
  Store,
  Upload,
  Save,
  RotateCcw,
  Check,
  Menu,
  CreditCard,
  Building2,
  Banknote,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  adminUploadProductImage,
  fetchPublicSiteSettings,
  adminUpdateSiteSettings,
} from '../lib/supabase';
import { seedProductsToSupabase } from '../lib/seedDatabase';

// Status badge component with authentic ValGrow Labs palette
function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
    placed:    { bg: '#fef9c3', color: '#854d0e', label: 'Placed' },
    paid:      { bg: '#dcfce7', color: '#166534', label: 'Paid' },
    confirmed: { bg: '#e0f2fe', color: '#0369a1', label: 'Confirmed' },
    packed:    { bg: '#fef3c7', color: '#b45309', label: 'Packed' },
    shipped:   { bg: '#dbeafe', color: '#1e40af', label: 'Shipped' },
    dispatched:{ bg: '#dbeafe', color: '#1e40af', label: 'Dispatched' },
    delivered: { bg: '#f0fdf4', color: '#15803d', label: 'Delivered' },
    cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
    failed:    { bg: '#fee2e2', color: '#991b1b', label: 'Failed' },
    active:    { bg: '#dcfce7', color: '#166534', label: 'Active' },
    inactive:  { bg: '#f3f4f6', color: '#6b7280', label: 'Inactive' },
    admin:     { bg: '#ede9fe', color: '#6d28d9', label: 'Admin' },
    super_admin: { bg: '#fef3c7', color: '#92400e', label: 'Super Admin' },
  };

  const s = STATUS_COLORS[status.toLowerCase()] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  return (
    <span
      className={`inline-block font-semibold capitalize rounded-full tracking-wide ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs'
      }`}
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// StatCard component with main page heritage styling
function StatCard({
  label,
  value,
  sub,
  icon,
  color = '#1F3D2B',
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color?: string;
  trend?: number | null;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '24px 26px',
        border: '1px solid #EADFD0',
        boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: '#FAF6EF',
          border: '1px solid #EADFD0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#1F3D2B',
            fontFamily: 'Playfair Display, Georgia, serif',
            lineHeight: 1.15,
          }}
        >
          {value}
        </div>
        {(sub || trend != null) && (
          <div style={{ fontSize: 12, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            {trend != null && (
              <span style={{ color: trend >= 0 ? '#2E7D4F' : '#B3261E', fontWeight: 600 }}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
              </span>
            )}
            {sub && <span style={{ color: '#8B5E3C' }}>{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// Live Sri Lankan date & time component
function AdminDate() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
      <span>
        {time.toLocaleDateString('en-LK', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
        {' • '}
        {time.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}

export type AdminNavTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'newsletter'
  | 'team'
  | 'settings-branding'
  | 'settings-theme'
  | 'settings-hero'
  | 'settings-homepage'
  | 'settings-navigation'
  | 'settings-footer'
  | 'settings-payments'
  | 'settings-delivery'
  | 'settings-store'
  | 'settings-announcement'
  | 'settings-seo'
  | 'inquiries';

export const Admin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    updateSiteSettingsState,
  } = useStore();

  // Active navigation tab
  const [activeTab, setActiveTabState] = useState<AdminNavTab>(() => {
    const tabParam = searchParams.get('tab') as AdminNavTab | null;
    return tabParam || 'dashboard';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const setActiveTab = (tab: AdminNavTab) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
    setMobileMenuOpen(false);
  };

  // Draft tracking for product variant editing
  interface VariantEditDraft {
    price: string;
    originalPrice: string;
    stock: string;
  }
  const [variantDrafts, setVariantDrafts] = useState<Record<string, VariantEditDraft>>({});
  const [savingVariantIds, setSavingVariantIds] = useState<Record<string, boolean>>({});
  const [recentlySavedVariantIds, setRecentlySavedVariantIds] = useState<Record<string, boolean>>({});

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

  const handleSaveVariant = async (prodId: string, v: ProductVariant) => {
    const draft = variantDrafts[v.id];
    if (!draft) return;
    const priceNum = draft.price.trim() === '' ? v.price : parseFloat(draft.price);
    const origNum = draft.originalPrice.trim() === '' ? undefined : parseFloat(draft.originalPrice);
    const stockNum = draft.stock.trim() === '' ? v.stock : parseInt(draft.stock, 10);

    setSavingVariantIds((prev) => ({ ...prev, [v.id]: true }));
    try {
      await updateProductVariantPrice(prodId, v.id, priceNum);
      if (origNum !== undefined || v.originalPrice !== undefined) {
        await updateProductVariantOriginalPrice(prodId, v.id, origNum);
      }
      await updateProductStock(prodId, v.id, stockNum);
      setRecentlySavedVariantIds((prev) => ({ ...prev, [v.id]: true }));
      setTimeout(() => {
        setRecentlySavedVariantIds((prev) => ({ ...prev, [v.id]: false }));
      }, 2500);
      showToast(`Saved variant updates for ${v.weight}`);
    } catch {
      showToast('Error saving variant updates');
    } finally {
      setSavingVariantIds((prev) => ({ ...prev, [v.id]: false }));
    }
  };

  // Website Configuration State
  interface AdminSiteConfig {
    storeName: string;
    tagline: string;
    logoUrl: string;
    announcementBanner: string;
    announcementActive: boolean;
    freeDeliveryThreshold: number;
    standardDeliveryFee: number;
    courierPartner: string;
    deliveryEstimate: string;
    payhereMerchantId: string;
    payhereMode: string;
    enablePayhere: boolean;
    payhereSecret: string;
    enableCod: boolean;
    enableBankTransfer: boolean;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankBranch: string;
    bankDetails: string;
    contactEmail: string;
    contactPhone: string;
    primaryColor: string;
    goldColor: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    heroBannerUrl: string;
    featuredTitle: string;
    featuredSubtitle: string;
    footerAbout: string;
    roasteryAddress: string;
    operatingHours: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  }

  const [siteConfig, setSiteConfig] = useState<AdminSiteConfig>(() => {
    const defaults: AdminSiteConfig = {
      storeName: 'Ceylon Crunch - Artisan Provisions',
      tagline: 'Healthy Crunch for Every Home — Sourced with patience, shared with intention.',
      logoUrl: '/logo.png',
      announcementBanner: 'Free island-wide delivery on orders over Rs. 3,000 · Small-Batch Freshness Guaranteed',
      announcementActive: true,
      freeDeliveryThreshold: 3000,
      standardDeliveryFee: 300,
      courierPartner: 'Ceylon Express Tracked Courier',
      deliveryEstimate: '1-2 Business Days (Island-wide)',
      payhereMerchantId: '1228491',
      payhereMode: 'sandbox',
      enablePayhere: true,
      payhereSecret: '',
      enableCod: true,
      enableBankTransfer: true,
      bankName: 'Commercial Bank / Sampath Bank',
      bankAccountName: 'Ceylon Crunch (Pvt) Ltd',
      bankAccountNumber: '1000 2489 8210',
      bankBranch: 'Kollupitiya (Colombo 03)',
      bankDetails: 'Commercial Bank of Ceylon · Acc: 1000 2489 8210 · Ceylon Crunch (Pvt) Ltd · Kollupitiya',
      contactEmail: 'hello@ceyloncrunch.lk',
      contactPhone: '+94 77 944 3867',
      primaryColor: '#1F3D2B',
      goldColor: '#C5A059',
      heroTitle: 'Pure Ceylon Harvest. Handcrafted in Small Batches.',
      heroSubtitle: 'Single-origin cashews, sun-dried exotic fruits, and organic roastery snacks delivered direct to your door.',
      heroCtaText: 'Explore Collection',
      heroBannerUrl: '/hero-banner.png',
      featuredTitle: 'Curated Harvest Collection',
      featuredSubtitle: 'Freshly roasted whole-grade cashews and artisanal sun-dried fruits.',
      footerAbout: 'Ceylon Crunch is dedicated to the preservation of heritage roastery craft, ethical farmer partnerships, and clean wholesome snacking across Sri Lanka.',
      roasteryAddress: 'No. 42/1, Alfred House Gardens, Colombo 03, Sri Lanka',
      operatingHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
      seoTitle: 'Ceylon Crunch | Artisan Cashew & Organic Dried Fruits Sri Lanka',
      seoDescription: 'Order premium artisanal cashew snacks, roasted cashews, and organic dried fruits in Sri Lanka. Islandwide tracked courier delivery.',
      seoKeywords: 'ceylon cashews, roasted cashews colombo, dried fruits sri lanka, healthy snacks sri lanka',
    };

    try {
      const saved = localStorage.getItem('ceylon_crunch_site_settings');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
    return defaults;
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Load site config on mount
  useEffect(() => {
    if (!isAdmin || !isSupabaseConfigured) return;
    fetchPublicSiteSettings().then((settings) => {
      if (settings) {
        setSiteConfig((prev: AdminSiteConfig) => ({
          ...prev,
          storeName: settings.store_name || prev.storeName,
          tagline: settings.tagline || prev.tagline,
          logoUrl: settings.logo_url || prev.logoUrl,
          announcementBanner: settings.announcement_banner || prev.announcementBanner,
          announcementActive: settings.announcement_active ?? prev.announcementActive,
          freeDeliveryThreshold: settings.free_delivery_threshold ?? prev.freeDeliveryThreshold,
          standardDeliveryFee: settings.standard_delivery_fee ?? prev.standardDeliveryFee,
          courierPartner: settings.courier_partner || prev.courierPartner,
          deliveryEstimate: settings.delivery_estimate || prev.deliveryEstimate,
          payhereMerchantId: (settings as any).payhere_merchant_id || prev.payhereMerchantId,
          payhereMode: (settings as any).payhere_mode || prev.payhereMode,
          enablePayhere: (settings as any).payhere_enabled ?? prev.enablePayhere,
          payhereSecret: (settings as any).payhere_secret || prev.payhereSecret,
          enableCod: (settings as any).cod_enabled ?? prev.enableCod,
          enableBankTransfer: (settings as any).bank_transfer_enabled ?? prev.enableBankTransfer,
          bankName: (settings as any).bank_name || prev.bankName,
          bankAccountName: (settings as any).bank_account_name || prev.bankAccountName,
          bankAccountNumber: (settings as any).bank_account_number || prev.bankAccountNumber,
          bankBranch: (settings as any).bank_branch || prev.bankBranch,
          bankDetails: settings.bank_details || prev.bankDetails,
          contactEmail: settings.contact_email || prev.contactEmail,
          contactPhone: settings.contact_phone || prev.contactPhone,
          primaryColor: settings.primary_color || prev.primaryColor,
          goldColor: settings.gold_color || prev.goldColor,
          heroTitle: settings.hero_title || prev.heroTitle,
          heroSubtitle: settings.hero_subtitle || prev.heroSubtitle,
          heroCtaText: settings.hero_cta_text || prev.heroCtaText,
          heroBannerUrl: settings.hero_banner_url || prev.heroBannerUrl,
          featuredTitle: settings.featured_title || prev.featuredTitle,
          featuredSubtitle: settings.featured_subtitle || prev.featuredSubtitle,
          footerAbout: settings.footer_about || prev.footerAbout,
          roasteryAddress: settings.roastery_address || prev.roasteryAddress,
          operatingHours: settings.operating_hours || prev.operatingHours,
          seoTitle: settings.seo_title || prev.seoTitle,
          seoDescription: settings.seo_description || prev.seoDescription,
          seoKeywords: settings.seo_keywords || prev.seoKeywords,
        }));
      }
    });
  }, [isAdmin]);

  // Orders filters and drawer
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewingOrderSlip, setViewingOrderSlip] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageInputVal, setImageInputVal] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Newsletter subscribers state & export
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([
    { email: 'patron@ceyloncrunch.lk', date: 'Oct 18, 2026', status: 'active' },
    { email: 'hello@valgrowlabs.com', date: 'Oct 15, 2026', status: 'active' },
    { email: 'concierge@ceyloncrunch.lk', date: 'Oct 12, 2026', status: 'active' },
    { email: 'artisan@ceyloncrunch.lk', date: 'Oct 09, 2026', status: 'active' },
  ]);

  const handleExportNewsletter = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Email,Subscription Date,Status\n' +
      newsletterSubscribers.map((e) => `${e.email},${e.date},${e.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ceylon_crunch_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers CSV exported successfully!');
  };

  // Team state & invite modal
  interface TeamMember {
    name: string;
    email: string;
    role: string;
    status: string;
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: 'Devananth', email: 'devananth048@gmail.com', role: 'Super Admin', status: 'active' },
    { name: 'Ceylon Crunch Admin', email: 'admin@ceyloncrunch.lk', role: 'Super Admin', status: 'active' },
    { name: 'Priyashantha', email: 'operations@ceyloncrunch.lk', role: 'Store Manager', status: 'active' },
  ]);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Store Manager');

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast('Please provide name and email for the new team member.');
      return;
    }
    setTeamMembers((prev) => [
      ...prev,
      {
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole,
        status: 'active',
      },
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddTeamModalOpen(false);
    showToast(`Added ${newMemberName.trim()} to store management team!`);
  };

  // Authentication State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    const password = passwordInput.trim();

    if (!email || !password) {
      setLoginError('Please enter both admin email and password.');
      return;
    }

    setLoginError(null);
    setIsLoggingIn(true);
    const result = await loginAdmin(email, password);
    setIsLoggingIn(false);
    if (result.success) {
      setPasswordInput('');
      showToast('Logged in as Ceylon Crunch Atelier Administrator');
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials.');
      showToast(result.error || 'Incorrect email or password.');
    }
  };

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
    showToast('Saving store configuration...');
    updateSiteSettingsState(siteConfig);
    try {
      localStorage.setItem('ceylon_crunch_site_settings', JSON.stringify(siteConfig));
    } catch {}

    const res = await adminUpdateSiteSettings({
      store_name: siteConfig.storeName,
      tagline: siteConfig.tagline,
      logo_url: siteConfig.logoUrl,
      announcement_banner: siteConfig.announcementBanner,
      announcement_active: siteConfig.announcementActive,
      free_delivery_threshold: siteConfig.freeDeliveryThreshold,
      standard_delivery_fee: siteConfig.standardDeliveryFee,
      courier_partner: siteConfig.courierPartner,
      delivery_estimate: siteConfig.deliveryEstimate,
      payhere_merchant_id: siteConfig.payhereMerchantId,
      payhere_mode: siteConfig.payhereMode,
      payhere_enabled: siteConfig.enablePayhere,
      payhere_secret: siteConfig.payhereSecret,
      cod_enabled: siteConfig.enableCod,
      bank_transfer_enabled: siteConfig.enableBankTransfer,
      bank_name: siteConfig.bankName,
      bank_account_name: siteConfig.bankAccountName,
      bank_account_number: siteConfig.bankAccountNumber,
      bank_branch: siteConfig.bankBranch,
      bank_details: siteConfig.bankDetails,
      contact_email: siteConfig.contactEmail,
      contact_phone: siteConfig.contactPhone,
      primary_color: siteConfig.primaryColor,
      gold_color: siteConfig.goldColor,
      hero_title: siteConfig.heroTitle,
      hero_subtitle: siteConfig.heroSubtitle,
      hero_cta_text: siteConfig.heroCtaText,
      hero_banner_url: siteConfig.heroBannerUrl,
      featured_title: siteConfig.featuredTitle,
      featured_subtitle: siteConfig.featuredSubtitle,
      footer_about: siteConfig.footerAbout,
      roastery_address: siteConfig.roasteryAddress,
      operating_hours: siteConfig.operatingHours,
      seo_title: siteConfig.seoTitle,
      seo_description: siteConfig.seoDescription,
      seo_keywords: siteConfig.seoKeywords,
    });
    setIsSavingConfig(false);
    if (res.success) {
      showToast('Storefront configuration saved successfully!');
    } else {
      showToast(res.error || 'Configuration saved locally.');
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilterStatus !== 'all') {
        const s = o.status.toLowerCase();
        const f = orderFilterStatus.toLowerCase();
        if (f === 'pending' && s !== 'pending' && s !== 'placed') return false;
        if (f !== 'pending' && s !== f) return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = (o.customer?.name || '').toLowerCase().includes(q);
        const matchEmail = (o.customer?.email || '').toLowerCase().includes(q);
        const matchPhone = (o.customer?.phone || '').toLowerCase().includes(q);
        return matchId || matchName || matchEmail || matchPhone;
      }
      return true;
    });
  }, [orders, orderFilterStatus, orderSearchQuery]);

  // Status counts for overview
  const statusCounts = useMemo(() => {
    const counts = { pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => {
      const s = o.status.toLowerCase();
      if (s === 'pending' || s === 'placed') counts.pending++;
      else if (s === 'paid' || s === 'confirmed') counts.paid++;
      else if (s === 'shipped' || s === 'dispatched' || s === 'packed') counts.shipped++;
      else if (s === 'delivered') counts.delivered++;
      else if (s === 'cancelled' || s === 'failed') counts.cancelled++;
    });
    return counts;
  }, [orders]);

  // Revenue calculation
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => ['paid', 'confirmed', 'shipped', 'dispatched', 'delivered'].includes(o.status.toLowerCase()))
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  // If loading session verification, show loader
  if (isAdminLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBF7F0' }}>
        <RefreshCw style={{ width: 32, height: 32, color: '#1E5631', animation: 'spin 1s linear infinite', marginBottom: 12 }} />
        <p style={{ fontSize: 14, fontWeight: 500, color: '#1E5631' }}>Verifying administrator session...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If not authenticated, show the authentic Atelier Admin Portal login screen
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <img src="/logo.png" alt="Ceylon Crunch" style={{ height: 56, margin: '0 auto 16px', display: 'block', objectFit: 'contain' }} />
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#163d23', margin: 0 }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
              Sign in to manage products, orders, and configuration
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#3d3d3d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="admin@ceyloncrunch.lk"
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5ddd0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#3d3d3d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="••••••••••••"
                    style={{ width: '100%', padding: '12px 16px', paddingRight: 40, border: '1.5px solid #e5ddd0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                  >
                    {showAdminPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 10, color: '#c0392b', fontSize: 13 }}>
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#1E5631',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.2s',
                  marginTop: 4,
                }}
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Admin Dashboard</span>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Link to="/" style={{ fontSize: 13, color: '#8B5E3C', textDecoration: 'none', fontWeight: 500 }}>
                ← Return to Storefront
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#888' }}>
            Designed &amp; Developed by{' '}
            <a href="https://valgrowlabs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>
              ValGrow Labs
            </a>
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Sidebar navigation links definitions
  const sidebarNav: { label: string; tab: AdminNavTab | null; icon: string }[] = [
    { label: 'Dashboard',   tab: 'dashboard',           icon: '▦' },
    { label: 'Orders',      tab: 'orders',              icon: '📦' },
    { label: 'Products',    tab: 'products',            icon: '🥜' },
    { label: 'Inquiries',   tab: 'inquiries',           icon: '💬' },
    { label: 'Newsletter',  tab: 'newsletter',          icon: '✉' },
    { label: 'Team',        tab: 'team',                icon: '👥' },
    { label: 'SETTINGS',    tab: null,                  icon: '' },
    { label: 'Branding',    tab: 'settings-branding',   icon: '🎨' },
    { label: 'Theme',       tab: 'settings-theme',      icon: '🖌' },
    { label: 'Hero',        tab: 'settings-hero',       icon: '🖼' },
    { label: 'Homepage',    tab: 'settings-homepage',   icon: '🏠' },
    { label: 'Navigation',  tab: 'settings-navigation', icon: '🔗' },
    { label: 'Footer',      tab: 'settings-footer',     icon: '📄' },
    { label: 'Payments',    tab: 'settings-payments',   icon: '💳' },
    { label: 'Delivery',    tab: 'settings-delivery',   icon: '🚚' },
    { label: 'Store',       tab: 'settings-store',      icon: '🏪' },
    { label: 'Announcement',tab: 'settings-announcement',icon: '📢' },
    { label: 'SEO',         tab: 'settings-seo',        icon: '🔍' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FBF7F0', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        .admin-nav-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .admin-nav-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-nav-scroll::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.25);
          border-radius: 4px;
        }
        .admin-nav-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.5);
        }
      `}</style>
      {/* ────────────────────────────────────────────────────────── */}
      {/* CEYLON CRUNCH LUXURY FOREST GREEN SIDEBAR (Fixed 240px)     */}
      {/* ────────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 240,
          height: '100vh',
          background: '#162C1F',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 100,
          borderRight: '1px solid #234330',
          boxShadow: '4px 0 24px rgba(22, 44, 31, 0.2)',
        }}
      >
        {/* Logo Section */}
        <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid #234330' }}>
          <div
            onClick={() => setActiveTab('dashboard')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '4px 2px',
              transition: 'opacity 0.15s ease',
            }}
            title="Go to Dashboard"
          >
            {siteConfig.logoUrl && siteConfig.logoUrl !== '/logo.png' && siteConfig.logoUrl !== '/img/logo.png' ? (
              <img
                src={siteConfig.logoUrl}
                alt="Ceylon Crunch Logo"
                style={{ height: 44, maxWidth: '100%', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <img
                  src="/favicon.png"
                  alt="Ceylon Crunch Emblem"
                  style={{
                    height: 44,
                    width: 44,
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 16.5,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      color: '#FFFFFF',
                      lineHeight: 1.1,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    CEYLON
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 15.5,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      color: '#C5A059',
                      lineHeight: 1.1,
                      marginTop: 1,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    CRUNCH
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: 'linear-gradient(90deg, #C5A059 0%, rgba(197, 160, 89, 0.2) 100%)',
                      margin: '3px 0 2px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: 8,
                      color: '#9EBAA8',
                      fontStyle: 'italic',
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.1,
                    }}
                  >
                    From Nature To Your Doorstep
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#C5A059',
              marginTop: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C5A059' }} />
            <span>Admin Portal · Heritage</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="admin-nav-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 0', scrollbarWidth: 'thin', scrollbarColor: 'rgba(197, 160, 89, 0.25) transparent' }}>
          {sidebarNav.map((item, idx) => {
            if (!item.tab) {
              return (
                <div
                  key={idx}
                  style={{
                    padding: '14px 20px 4px',
                    fontSize: 10,
                    color: '#5C7A67',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    userSelect: 'none',
                  }}
                >
                  {item.label}
                </div>
              );
            }
            const active = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActiveTab(item.tab!)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 20px',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#FFFFFF' : '#9EBAA9',
                  background: active ? 'rgba(197, 160, 89, 0.16)' : 'transparent',
                  borderLeft: active ? '3px solid #C5A059' : '3px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#9EBAA9';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: 15, color: active ? '#C5A059' : 'inherit' }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.tab === 'orders' && orders.length > 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>
                    {orders.length}
                  </span>
                )}
                {item.tab === 'products' && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059', padding: '1px 7px', borderRadius: 10, fontWeight: 700 }}>
                    {products.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile + Sign Out Section */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #234330' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#C5A059',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#162C1F',
                flexShrink: 0,
              }}
            >
              {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {adminEmail || 'Administrator'}
              </div>
              <div style={{ fontSize: 11, color: '#8FA998', textTransform: 'capitalize' }}>
                Super Admin
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logoutAdmin}
            style={{
              width: '100%',
              padding: '8px',
              background: '#234330',
              color: '#C5A059',
              border: '1px solid #2D543C',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#B3261E';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#234330';
              e.currentTarget.style.color = '#C5A059';
            }}
          >
            Sign Out
          </button>
          <div style={{ marginTop: 10, fontSize: 11, color: '#5C7A67', textAlign: 'center' }}>
            <a href="https://valgrowlabs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#5C7A67', textDecoration: 'none' }}>
              ValGrow Labs
            </a>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────── */}
      {/* MAIN VIEWPORT CANVAS (Margin-left: 240px)                  */}
      {/* ────────────────────────────────────────────────────────── */}
      <div style={{ marginLeft: 240, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF7F0' }}>
        {/* Sticky Top Bar */}
        <header
          style={{
            height: 60,
            background: '#FFFFFF',
            borderBottom: '1px solid #EADFD0',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            boxShadow: '0 1px 4px rgba(139, 94, 60, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1F3D2B',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ↗ View Store
            </Link>
            <span style={{ color: '#EADFD0' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B6B6B' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D4F' }} />
              <span>Live Supabase Connected</span>
            </div>
          </div>
          <AdminDate />
        </header>

        {/* Content Body */}
        <main style={{ padding: 32, flex: 1 }}>
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW                                */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Dashboard
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} — here&apos;s what&apos;s happening today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 50,
                    background: '#1F3D2B',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: isSeeding ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(31, 61, 43, 0.2)',
                  }}
                >
                  <RefreshCw style={{ width: 14, height: 14, animation: isSeeding ? 'spin 1s linear infinite' : 'none' }} />
                  <span>{isSeeding ? 'Syncing Catalog...' : '⚡ Sync Catalog to Supabase'}</span>
                </button>
              </div>

              {/* 4 Large Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                <StatCard
                  label="Revenue This Month"
                  value={`LKR ${totalRevenue.toLocaleString()}`}
                  icon="💰"
                  color="#2E7D4F"
                  trend={14}
                />
                <StatCard
                  label="Total Orders"
                  value={orders.length.toLocaleString()}
                  sub={`${statusCounts.pending} pending`}
                  icon="📦"
                  color="#1F3D2B"
                />
                <StatCard
                  label="Active Products"
                  value={products.filter((p) => p.variants?.some((v) => v.stock > 0)).length.toString()}
                  sub={`${products.length} total`}
                  icon="🥜"
                  color="#8B5E3C"
                />
                <StatCard
                  label="Inquiries & Messages"
                  value={inquiries.length.toString()}
                  sub="Active customer tickets"
                  icon="✉"
                  color="#C5A059"
                />
              </div>

              {/* 5 Status Filter Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
                {[
                  { label: 'Pending', status: 'pending', count: statusCounts.pending },
                  { label: 'Paid', status: 'paid', count: statusCounts.paid },
                  { label: 'Shipped', status: 'shipped', count: statusCounts.shipped },
                  { label: 'Delivered', status: 'delivered', count: statusCounts.delivered },
                  { label: 'Cancelled', status: 'cancelled', count: statusCounts.cancelled },
                ].map(({ label, status, count }) => (
                  <div
                    key={status}
                    onClick={() => {
                      setOrderFilterStatus(status);
                      setActiveTab('orders');
                    }}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #EADFD0',
                      padding: '16px 20px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(139, 94, 60, 0.04)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 94, 60, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 94, 60, 0.04)';
                    }}
                  >
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 4 }}>
                      {count}
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>

              {/* Recent Orders Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #EADFD0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', margin: 0 }}>Recent Orders</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{ fontSize: 13, color: '#8B5E3C', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    View all {orders.length} orders →
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F7F2EA' }}>
                        {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                          <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map((order) => (
                        <tr
                          key={order.id}
                          style={{ borderTop: '1px solid #F0E6D8' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF8F4')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#1F3D2B', fontWeight: 700 }}>
                              #{order.id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1F3D2B' }}>{order.customer.name}</div>
                            <div style={{ fontSize: 12, color: '#6B6B6B' }}>{order.customer.email}</div>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: '#1F3D2B' }}>
                            LKR {(order.total || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 13, color: '#6B6B6B', textTransform: 'capitalize' }}>
                            {(order.paymentMethod || 'cod').replace('_', ' ')}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <StatusBadge status={order.status} />
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 13, color: '#8B5E3C' }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' }) : 'Today'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              style={{
                                padding: '6px 14px',
                                background: '#FAF6EF',
                                color: '#1F3D2B',
                                border: '1px solid #EADFD0',
                                borderRadius: 50,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1F3D2B';
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FAF6EF';
                                e.currentTarget.style.color = '#1F3D2B';
                              }}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B', fontSize: 14 }}>
                            No orders placed yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORDERS MANAGEMENT                                 */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Order Management
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Track, verify and fulfill customer orders across Sri Lanka
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshOrders}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 50,
                    background: '#FFFFFF',
                    color: '#1F3D2B',
                    border: '1.5px solid #EADFD0',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw style={{ width: 14, height: 14 }} />
                  <span>Refresh Orders</span>
                </button>
              </div>

              {/* Orders Filters Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #EADFD0', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setOrderFilterStatus(s)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 50,
                          border: orderFilterStatus === s ? 'none' : '1px solid #EADFD0',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: orderFilterStatus === s ? '#1F3D2B' : '#FAF6EF',
                          color: orderFilterStatus === s ? '#FFFFFF' : '#6B6B6B',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by name, email, order ID..."
                    style={{ flex: 1, minWidth: 200, padding: '8px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, outline: 'none', color: '#1F3D2B' }}
                  />
                  <span style={{ fontSize: 13, color: '#8B5E3C', fontWeight: 600 }}>
                    {filteredOrders.length} orders
                  </span>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F7F2EA' }}>
                        {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                          <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          style={{ borderTop: '1px solid #F0E6D8' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF8F4')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#1F3D2B', fontWeight: 700 }}>
                              #{order.id.slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#1F3D2B' }}>{order.customer.name}</div>
                            <div style={{ fontSize: 12, color: '#6B6B6B' }}>{order.customer.phone}</div>
                            <div style={{ fontSize: 11, color: '#8B5E3C' }}>{order.customer.email}</div>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 13, color: '#2B2B2B' }}>
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: '#1F3D2B' }}>
                            LKR {(order.total || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: 13, color: '#2B2B2B', textTransform: 'capitalize' }}>
                              {(order.paymentMethod || 'cod').replace('_', ' ')}
                            </div>
                            {order.paymentSlipUrl && (
                              <button
                                type="button"
                                onClick={() => setViewingOrderSlip(order.paymentSlipUrl!)}
                                style={{ fontSize: 11, color: '#1F3D2B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                              >
                                View Slip ↗
                              </button>
                            )}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <StatusBadge status={order.status} />
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: 13, color: '#8B5E3C' }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short' }) : 'Today'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              style={{
                                padding: '6px 14px',
                                background: '#1F3D2B',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 50,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#6B6B6B', fontSize: 14 }}>
                            No orders match current filter
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PRODUCTS & STOCK MANAGEMENT                       */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Products &amp; Stock
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Full 32 Dried Fruits &amp; Seeds catalog with per-variant prices, live inventory, and image management
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={refreshProducts}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 50,
                      background: '#FFFFFF',
                      color: '#1F3D2B',
                      border: '1.5px solid #EADFD0',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <RefreshCw style={{ width: 14, height: 14 }} />
                    <span>Refresh</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSeedDatabase}
                    disabled={isSeeding}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 50,
                      background: '#1F3D2B',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: isSeeding ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(31, 61, 43, 0.2)',
                    }}
                  >
                    <Database style={{ width: 14, height: 14 }} />
                    <span>Sync to Supabase</span>
                  </button>
                </div>
              </div>

              {/* Products Table Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #EADFD0', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Search catalog by product name or category..."
                    style={{ flex: 1, padding: '9px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                  />
                  <span style={{ fontSize: 13, color: '#8B5E3C', fontWeight: 600 }}>
                    {products.length} products
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F7F2EA' }}>
                        {['Product', 'Category', 'Variants & Pricing', 'Status', 'Image'].map((h) => (
                          <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter((p) => !productSearchQuery || p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(productSearchQuery.toLowerCase()))
                        .map((product) => (
                          <tr
                            key={product.id}
                            style={{ borderTop: '1px solid #F0E6D8' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF8F4')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img
                                  src={product.images?.[0] || '/img/product-1.jpg'}
                                  alt={product.name}
                                  style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#F5EFEB', border: '1px solid #EADFD0' }}
                                />
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1F3D2B' }}>{product.name}</div>
                                  <div style={{ fontSize: 12, color: '#8B5E3C', marginTop: 2, display: 'flex', alignItems: 'center' }}>
                                    <span>/{product.slug}</span>
                                    <a
                                      href={`/product/${product.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: 11, color: '#C5A059', textDecoration: 'none', marginLeft: 8, fontWeight: 600 }}
                                    >
                                      View in Store ↗
                                    </a>
                                  </div>
                                  {product.badge && (
                                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: '#FAF6EF', color: '#8B5E3C', border: '1px solid #EADFD0' }}>
                                      {product.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px', fontSize: 13, color: '#6B6B6B', verticalAlign: 'top' }}>
                              {product.category}
                            </td>
                            <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {product.variants.map((v) => {
                                  const draft = variantDrafts[v.id];
                                  const currentPrice = draft ? draft.price : String(v.price);
                                  const currentStock = draft ? draft.stock : String(v.stock);
                                  const isSaving = savingVariantIds[v.id];
                                  const isSaved = recentlySavedVariantIds[v.id];

                                  return (
                                    <div
                                      key={v.id}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        background: '#FAF8F4',
                                        border: '1px solid #EADFD0',
                                        padding: '6px 10px',
                                        borderRadius: 8,
                                        fontSize: 12,
                                      }}
                                    >
                                      <span style={{ fontWeight: 700, minWidth: 44, color: '#1F3D2B' }}>
                                        {v.weight}:
                                      </span>
                                      <span style={{ color: '#8B5E3C', fontWeight: 600 }}>Rs.</span>
                                      <input
                                        type="number"
                                        value={currentPrice}
                                        onChange={(e) => handleDraftChange(v.id, 'price', e.target.value, v)}
                                        style={{ width: 75, padding: '4px 6px', background: '#FFFFFF', border: '1px solid #D9CEBE', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1F3D2B', outline: 'none' }}
                                      />
                                      <span style={{ color: '#8B5E3C', marginLeft: 4, fontWeight: 600 }}>Stock:</span>
                                      <input
                                        type="number"
                                        value={currentStock}
                                        onChange={(e) => handleDraftChange(v.id, 'stock', e.target.value, v)}
                                        style={{ width: 55, padding: '4px 6px', background: '#FFFFFF', border: '1px solid #D9CEBE', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#1F3D2B', outline: 'none' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleSaveVariant(product.id, v)}
                                        disabled={isSaving}
                                        style={{
                                          padding: '5px 12px',
                                          borderRadius: 6,
                                          border: 'none',
                                          background: isSaved ? '#2E7D4F' : '#1F3D2B',
                                          color: '#FFFFFF',
                                          fontSize: 11,
                                          fontWeight: 600,
                                          cursor: isSaving ? 'not-allowed' : 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 4,
                                          transition: 'all 0.15s',
                                        }}
                                      >
                                        {isSaving ? '…' : isSaved ? <Check style={{ width: 12, height: 12 }} /> : <Save style={{ width: 12, height: 12 }} />}
                                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                              <StatusBadge status={product.variants.some((v) => v.stock > 0) ? 'active' : 'inactive'} />
                            </td>
                            <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingImageId(product.id);
                                  setImageInputVal(product.images?.[0] || '');
                                }}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: 8,
                                  background: '#FAF6EF',
                                  border: '1px solid #EADFD0',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#1F3D2B',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#1F3D2B';
                                  e.currentTarget.style.color = '#FFFFFF';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#FAF6EF';
                                  e.currentTarget.style.color = '#1F3D2B';
                                }}
                              >
                                Edit Image
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: INQUIRIES & MESSAGES                              */}
          {/* ======================================================== */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Customer Inquiries
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Messages submitted via contact and corporate gifting inquiries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshInquiries}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 50,
                    background: '#FFFFFF',
                    color: '#1F3D2B',
                    border: '1.5px solid #EADFD0',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Refresh
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {inquiries.map((inq) => (
                  <div key={inq.id} style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #EADFD0', boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1F3D2B' }}>{inq.name}</div>
                        <div style={{ fontSize: 13, color: '#6B6B6B' }}>{inq.email} • {inq.phone}</div>
                      </div>
                      <span style={{ fontSize: 11, color: '#8B5E3C', fontWeight: 600 }}>{inq.createdAt}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>
                      Subject: {inq.subject}
                    </div>
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, margin: 0, background: '#FAF8F4', border: '1px solid #EADFD0', padding: 14, borderRadius: 10 }}>
                      {inq.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                      {inq.phone && (
                        <a
                          href={`tel:${inq.phone}`}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 50,
                            background: '#FAF6EF',
                            color: '#1F3D2B',
                            border: '1px solid #EADFD0',
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          📞 Call
                        </a>
                      )}
                      <a
                        href={`mailto:${inq.email}?subject=Re: Ceylon Crunch Concierge - ${encodeURIComponent(inq.subject)}&body=Dear ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for reaching out to Ceylon Crunch.%0D%0A%0D%0A`}
                        style={{
                          padding: '6px 16px',
                          borderRadius: 50,
                          background: '#1F3D2B',
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        ✉ Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div style={{ gridColumn: '1/-1', background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', padding: 40, textAlign: 'center', color: '#6B6B6B' }}>
                    No customer inquiries received yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: NEWSLETTER SUBSCRIBERS                            */}
          {/* ======================================================== */}
          {activeTab === 'newsletter' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Newsletter Subscribers
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Patrons subscribed to harvest updates, private reserve notifications, and seasonal notes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportNewsletter}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 50,
                    background: '#1F3D2B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(31, 61, 43, 0.2)',
                  }}
                >
                  ⬇ Export CSV ({newsletterSubscribers.length})
                </button>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', padding: 24, boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7F2EA' }}>
                      {['Subscriber Email', 'Subscribed Date', 'Status'].map((h) => (
                        <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newsletterSubscribers.map((n, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #F0E6D8' }}>
                        <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: '#1F3D2B' }}>{n.email}</td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: '#8B5E3C' }}>{n.date}</td>
                        <td style={{ padding: '14px 18px' }}><StatusBadge status={n.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: TEAM MANAGEMENT                                   */}
          {/* ======================================================== */}
          {activeTab === 'team' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0 }}>
                    Team &amp; Access Roles
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Manage store administrators, managers, and access permissions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(true)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 50,
                    background: '#1F3D2B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(31, 61, 43, 0.2)',
                  }}
                >
                  + Add Team Member
                </button>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', padding: 24, boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7F2EA' }}>
                      {['Administrator', 'Email', 'Role', 'Status'].map((h) => (
                        <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((u, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #F0E6D8' }}>
                        <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: '#1F3D2B' }}>{u.name}</td>
                        <td style={{ padding: '14px 18px', fontSize: 13, color: '#6B6B6B' }}>{u.email}</td>
                        <td style={{ padding: '14px 18px' }}><StatusBadge status={u.role.toLowerCase().replace(' ', '_')} /></td>
                        <td style={{ padding: '14px 18px' }}><StatusBadge status={u.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: SETTINGS EDITORS (11 Customizable Sections)       */}
          {/* ======================================================== */}
          {activeTab.startsWith('settings-') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0, textTransform: 'capitalize' }}>
                    {activeTab.replace('settings-', '')} Configuration
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 4, margin: 0 }}>
                    Customizable store settings saved directly to Supabase
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  style={{
                    padding: '9px 24px',
                    borderRadius: 50,
                    background: '#1F3D2B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isSavingConfig ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(31, 61, 43, 0.2)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Save style={{ width: 14, height: 14 }} />
                  <span>{isSavingConfig ? 'Saving Settings...' : 'Save Settings'}</span>
                </button>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 32, border: '1px solid #EADFD0', boxShadow: '0 4px 20px -2px rgba(139, 94, 60, 0.05)', maxWidth: 760 }}>
                {/* 1. BRANDING */}
                {activeTab === 'settings-branding' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Store Name</label>
                      <input
                        value={siteConfig.storeName}
                        onChange={(e) => setSiteConfig({ ...siteConfig, storeName: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Brand Tagline</label>
                      <input
                        value={siteConfig.tagline}
                        onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Main Logo Asset URL</label>
                      <input
                        value={siteConfig.logoUrl}
                        onChange={(e) => setSiteConfig({ ...siteConfig, logoUrl: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                      <div style={{ marginTop: 8, padding: '10px 16px', background: '#FAF6EF', borderRadius: 10, display: 'inline-flex', alignItems: 'center', border: '1px solid #EADFD0', gap: 12 }}>
                        <img src={siteConfig.logoUrl || '/logo.png'} alt="Logo preview" style={{ height: 38, objectFit: 'contain' }} />
                        <span style={{ fontSize: 12, color: '#6B6B6B' }}>Storefront Display Preview</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. THEME */}
                {activeTab === 'settings-theme' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Primary Brand Green</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="color" value={siteConfig.primaryColor} onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} style={{ width: 44, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                          <input value={siteConfig.primaryColor} onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} style={{ flex: 1, padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Accent Gold</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="color" value={siteConfig.goldColor} onChange={(e) => setSiteConfig({ ...siteConfig, goldColor: e.target.value })} style={{ width: 44, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                          <input value={siteConfig.goldColor} onChange={(e) => setSiteConfig({ ...siteConfig, goldColor: e.target.value })} style={{ flex: 1, padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }} />
                        </div>
                      </div>
                    </div>
                    {/* Theme Palette Live Preview */}
                    <div style={{ marginTop: 10, padding: 18, borderRadius: 14, background: '#FAF8F4', border: '1px solid #EADFD0', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: siteConfig.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                        CC
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: siteConfig.primaryColor }}>Ceylon Crunch Heritage Theme</div>
                        <div style={{ fontSize: 12, color: siteConfig.goldColor, fontWeight: 600 }}>Accent Tone: {siteConfig.goldColor}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HERO BANNER */}
                {activeTab === 'settings-hero' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Hero Headline</label>
                      <input
                        value={siteConfig.heroTitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Hero Sub-headline</label>
                      <textarea
                        rows={3}
                        value={siteConfig.heroSubtitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, color: '#1F3D2B', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Button CTA Text</label>
                        <input
                          value={siteConfig.heroCtaText}
                          onChange={(e) => setSiteConfig({ ...siteConfig, heroCtaText: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Hero Image Banner Path</label>
                        <input
                          value={siteConfig.heroBannerUrl}
                          onChange={(e) => setSiteConfig({ ...siteConfig, heroBannerUrl: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                    </div>
                    {siteConfig.heroBannerUrl && (
                      <div style={{ marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: '#8B5E3C', fontWeight: 600 }}>Banner Preview:</span>
                        <div style={{ marginTop: 4, height: 100, borderRadius: 10, overflow: 'hidden', border: '1px solid #EADFD0' }}>
                          <img src={siteConfig.heroBannerUrl} alt="Hero banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. HOMEPAGE */}
                {activeTab === 'settings-homepage' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Featured Collection Title</label>
                      <input
                        value={siteConfig.featuredTitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, featuredTitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Featured Collection Subtitle</label>
                      <textarea
                        rows={2}
                        value={siteConfig.featuredSubtitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, featuredSubtitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, color: '#1F3D2B', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ background: '#FAF8F4', padding: 16, borderRadius: 12, border: '1px solid #EADFD0', fontSize: 13, color: '#424843', lineHeight: 1.6 }}>
                      <strong>Active Trust Badges:</strong>
                      <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                        <li>100% Pure Ceylon Single-Origin Cashews</li>
                        <li>Small-Batch Roasting Guarantee</li>
                        <li>Tracked Courier Delivery across Sri Lanka</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 5. NAVIGATION */}
                {activeTab === 'settings-navigation' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Header Navigation Menu Links</label>
                      <input
                        value="Shop, Our Story, Roasting Process, Corporate Gifting, Contact"
                        readOnly
                        style={{ width: '100%', padding: '10px 14px', background: '#F5EFEB', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#6B6B6B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Header Hotline Phone</label>
                      <input
                        value={siteConfig.contactPhone}
                        onChange={(e) => setSiteConfig({ ...siteConfig, contactPhone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* 6. FOOTER */}
                {activeTab === 'settings-footer' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Footer Brand Mission</label>
                      <textarea
                        rows={3}
                        value={siteConfig.footerAbout}
                        onChange={(e) => setSiteConfig({ ...siteConfig, footerAbout: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, color: '#1F3D2B', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Roastery Atelier Address</label>
                      <input
                        value={siteConfig.roasteryAddress}
                        onChange={(e) => setSiteConfig({ ...siteConfig, roasteryAddress: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Copyright Notice</label>
                      <input
                        value={`© ${new Date().getFullYear()} Ceylon Crunch (Pvt) Ltd. All rights reserved.`}
                        readOnly
                        style={{ width: '100%', padding: '10px 14px', background: '#F5EFEB', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#6B6B6B' }}
                      />
                    </div>
                  </div>
                )}

                {/* 7. PAYMENTS */}
                {activeTab === 'settings-payments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Card 1: Direct Bank Transfer */}
                    <div style={{ background: '#FFFFFF', border: '1.5px solid #EADFD0', borderRadius: 14, padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADFD0', paddingBottom: 14, marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FAF6EF', border: '1px solid #EADFD0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F3D2B' }}>
                            <Building2 style={{ width: 18, height: 18 }} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F3D2B', margin: 0 }}>Direct Bank Transfer (Manual Slip Verification)</h3>
                            <p style={{ fontSize: 12, color: '#6B6B6B', margin: '2px 0 0' }}>Customers receive verified bank account details upon checkout and upload their deposit slip.</p>
                          </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1F3D2B', cursor: 'pointer', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={siteConfig.enableBankTransfer}
                            onChange={(e) => setSiteConfig({ ...siteConfig, enableBankTransfer: e.target.checked })}
                            style={{ accentColor: '#1F3D2B', width: 18, height: 18 }}
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Bank Name</label>
                          <input
                            value={siteConfig.bankName}
                            onChange={(e) => setSiteConfig({ ...siteConfig, bankName: e.target.value })}
                            placeholder="e.g. Commercial Bank of Ceylon / Sampath Bank"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Account Holder Name</label>
                          <input
                            value={siteConfig.bankAccountName}
                            onChange={(e) => setSiteConfig({ ...siteConfig, bankAccountName: e.target.value })}
                            placeholder="e.g. Ceylon Crunch (Pvt) Ltd"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Account Number</label>
                          <input
                            value={siteConfig.bankAccountNumber}
                            onChange={(e) => setSiteConfig({ ...siteConfig, bankAccountNumber: e.target.value })}
                            placeholder="e.g. 1000 2489 8210"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Branch Name / Code</label>
                          <input
                            value={siteConfig.bankBranch}
                            onChange={(e) => setSiteConfig({ ...siteConfig, bankBranch: e.target.value })}
                            placeholder="e.g. Kollupitiya (Colombo 03)"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Customer Instructions &amp; WhatsApp Slip Submission</label>
                        <textarea
                          rows={2}
                          value={siteConfig.bankDetails}
                          onChange={(e) => setSiteConfig({ ...siteConfig, bankDetails: e.target.value })}
                          placeholder="Please transfer the exact order amount and upload the slip or WhatsApp to..."
                          style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Card 2: PayHere Online Payment Gateway */}
                    <div style={{ background: '#FFFFFF', border: '1.5px solid #EADFD0', borderRadius: 14, padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADFD0', paddingBottom: 14, marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FAF6EF', border: '1px solid #EADFD0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F3D2B' }}>
                            <CreditCard style={{ width: 18, height: 18 }} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F3D2B', margin: 0 }}>PayHere Online Payment Gateway</h3>
                              <span style={{ fontSize: 10, fontWeight: 700, background: '#2455C6', color: '#FFFFFF', padding: '2px 8px', borderRadius: 6 }}>VISA · MC · LANKAQR</span>
                            </div>
                            <p style={{ fontSize: 12, color: '#6B6B6B', margin: '2px 0 0' }}>Central Bank approved gateway supporting Credit Cards, Debit Cards, LankaQR, Genie, and FriMi.</p>
                          </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1F3D2B', cursor: 'pointer', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={siteConfig.enablePayhere}
                            onChange={(e) => setSiteConfig({ ...siteConfig, enablePayhere: e.target.checked })}
                            style={{ accentColor: '#1F3D2B', width: 18, height: 18 }}
                          />
                          <span>Enabled</span>
                        </label>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>PayHere Merchant ID</label>
                          <input
                            value={siteConfig.payhereMerchantId}
                            onChange={(e) => setSiteConfig({ ...siteConfig, payhereMerchantId: e.target.value })}
                            placeholder="e.g. 1228491"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>PayHere Merchant Secret</label>
                          <input
                            type="password"
                            value={siteConfig.payhereSecret}
                            onChange={(e) => setSiteConfig({ ...siteConfig, payhereSecret: e.target.value })}
                            placeholder="Secret key for MD5 checkout signature"
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Environment Mode</label>
                          <select
                            value={siteConfig.payhereMode}
                            onChange={(e) => setSiteConfig({ ...siteConfig, payhereMode: e.target.value })}
                            style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                          >
                            <option value="sandbox">Sandbox (Testing Mode)</option>
                            <option value="live">Live (Production Gateway)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Cash on Delivery */}
                    <div style={{ background: '#FFFFFF', border: '1.5px solid #EADFD0', borderRadius: 14, padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FAF6EF', border: '1px solid #EADFD0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F3D2B' }}>
                            <Banknote style={{ width: 18, height: 18 }} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F3D2B', margin: 0 }}>Cash on Delivery (COD)</h3>
                            <p style={{ fontSize: 12, color: '#6B6B6B', margin: '2px 0 0' }}>Pay cash or scan courier rider's LankaQR upon parcel handover at customer doorstep.</p>
                          </div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1F3D2B', cursor: 'pointer', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={siteConfig.enableCod}
                            onChange={(e) => setSiteConfig({ ...siteConfig, enableCod: e.target.checked })}
                            style={{ accentColor: '#1F3D2B', width: 18, height: 18 }}
                          />
                          <span>Enabled</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. DELIVERY */}
                {activeTab === 'settings-delivery' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Free Delivery Threshold (LKR)</label>
                        <input
                          type="number"
                          value={siteConfig.freeDeliveryThreshold}
                          onChange={(e) => setSiteConfig({ ...siteConfig, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Standard Delivery Fee (LKR)</label>
                        <input
                          type="number"
                          value={siteConfig.standardDeliveryFee}
                          onChange={(e) => setSiteConfig({ ...siteConfig, standardDeliveryFee: parseInt(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Courier Partner</label>
                        <input
                          value={siteConfig.courierPartner}
                          onChange={(e) => setSiteConfig({ ...siteConfig, courierPartner: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Estimated Delivery Window</label>
                        <input
                          value={siteConfig.deliveryEstimate}
                          onChange={(e) => setSiteConfig({ ...siteConfig, deliveryEstimate: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. STORE & ROASTERY */}
                {activeTab === 'settings-store' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Concierge Email</label>
                        <input
                          value={siteConfig.contactEmail}
                          onChange={(e) => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Concierge Hotline Phone</label>
                        <input
                          value={siteConfig.contactPhone}
                          onChange={(e) => setSiteConfig({ ...siteConfig, contactPhone: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Physical Roastery Atelier Location</label>
                      <input
                        value={siteConfig.roasteryAddress}
                        onChange={(e) => setSiteConfig({ ...siteConfig, roasteryAddress: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Operating Hours</label>
                      <input
                        value={siteConfig.operatingHours}
                        onChange={(e) => setSiteConfig({ ...siteConfig, operatingHours: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* 10. ANNOUNCEMENT */}
                {activeTab === 'settings-announcement' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Top Announcement Banner Message</label>
                      <input
                        value={siteConfig.announcementBanner}
                        onChange={(e) => setSiteConfig({ ...siteConfig, announcementBanner: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1F3D2B', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={siteConfig.announcementActive}
                        onChange={(e) => setSiteConfig({ ...siteConfig, announcementActive: e.target.checked })}
                        style={{ accentColor: '#1F3D2B', width: 16, height: 16 }}
                      />
                      <span>Show banner on storefront</span>
                    </label>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: '#8B5E3C', fontWeight: 600 }}>Storefront Banner Preview:</span>
                      <div style={{ marginTop: 6, background: '#162C1F', color: '#C5A059', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                        {siteConfig.announcementBanner}
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. SEO & METADATA */}
                {activeTab === 'settings-seo' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>SEO Meta Title</label>
                      <input
                        value={siteConfig.seoTitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, seoTitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Meta Description</label>
                      <textarea
                        rows={3}
                        value={siteConfig.seoDescription}
                        onChange={(e) => setSiteConfig({ ...siteConfig, seoDescription: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 13, color: '#1F3D2B', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 }}>Meta Keywords (comma-separated)</label>
                      <input
                        value={siteConfig.seoKeywords}
                        onChange={(e) => setSiteConfig({ ...siteConfig, seoKeywords: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 10, fontSize: 14, color: '#1F3D2B', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ORDER DETAIL SLIDE-OVER DRAWER MODAL                       */}
      {/* ────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(22, 44, 31, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 200,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 540,
              background: '#FFFFFF',
              height: '100%',
              overflowY: 'auto',
              padding: 32,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              boxShadow: '-8px 0 32px rgba(22, 44, 31, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EADFD0', paddingBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, color: '#8B5E3C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Order Details</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F3D2B', fontFamily: 'monospace', margin: '4px 0 0' }}>
                  #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ width: 34, height: 34, borderRadius: '50%', background: '#FAF6EF', border: '1px solid #EADFD0', color: '#1F3D2B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Status updates */}
            <div style={{ background: '#FAF6EF', padding: 18, borderRadius: 14, border: '1px solid #EADFD0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8B5E3C', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                Update Fulfillment Status
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={async () => {
                      await updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder({ ...selectedOrder, status: st });
                      showToast(`Order status updated to ${st}`);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 600,
                      border: selectedOrder.status === st ? 'none' : '1px solid #EADFD0',
                      cursor: 'pointer',
                      background: selectedOrder.status === st ? '#1F3D2B' : '#FFFFFF',
                      color: selectedOrder.status === st ? '#FFFFFF' : '#1F3D2B',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F3D2B', marginBottom: 8, fontFamily: 'Playfair Display, Georgia, serif' }}>Customer &amp; Delivery Address</h3>
              <div style={{ background: '#FAF8F4', border: '1px solid #EADFD0', padding: 16, borderRadius: 12, fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
                <div><strong>Name:</strong> {selectedOrder.customer.name}</div>
                <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                <div style={{ marginTop: 6 }}>
                  <strong>Address:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district}
                </div>
                {selectedOrder.shippingAddress.landmark && (
                  <div><strong>Landmark:</strong> {selectedOrder.shippingAddress.landmark}</div>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F3D2B', marginBottom: 8, fontFamily: 'Playfair Display, Georgia, serif' }}>Purchased Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FAF8F4', border: '1px solid #EADFD0', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={item.image || '/img/product-1.jpg'} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #EADFD0' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F3D2B' }}>{item.productName}</div>
                        <div style={{ fontSize: 12, color: '#8B5E3C' }}>{item.variantWeight} × {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1F3D2B' }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', borderTop: '1px solid #EADFD0', fontSize: 15, fontWeight: 700 }}>
                  <span style={{ color: '#1F3D2B' }}>Total Amount</span>
                  <span style={{ color: '#1F3D2B' }}>LKR {(selectedOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bank Slip if uploaded */}
            {selectedOrder.paymentSlipUrl && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F3D2B', marginBottom: 8, fontFamily: 'Playfair Display, Georgia, serif' }}>Bank Transfer Deposit Slip</h3>
                <img
                  src={selectedOrder.paymentSlipUrl}
                  alt="Deposit slip"
                  style={{ width: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 10, border: '1px solid #EADFD0' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Edit Modal */}
      {editingImageId && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(22, 44, 31, 0.45)', backdropFilter: 'blur(3px)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setEditingImageId(null)}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', boxShadow: '0 10px 40px rgba(22, 44, 31, 0.2)', padding: 28, maxWidth: 440, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif' }}>Update Product Image</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B6B6B', marginBottom: 6 }}>Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(editingImageId, f);
                }}
                disabled={isUploadingImage}
                style={{ fontSize: 13, color: '#1F3D2B' }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B6B6B', marginBottom: 6 }}>Or Paste Image URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={imageInputVal}
                  onChange={(e) => setImageInputVal(e.target.value)}
                  placeholder="/img/product-1.jpg or https://..."
                  style={{ flex: 1, padding: '8px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (editingImageId && imageInputVal.trim()) {
                      await updateProductImage(editingImageId, imageInputVal.trim());
                      setEditingImageId(null);
                      showToast('Product image updated!');
                    }
                  }}
                  style={{ padding: '8px 16px', background: '#1F3D2B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Save URL
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setEditingImageId(null)}
                style={{ padding: '8px 18px', background: '#FAF6EF', border: '1px solid #EADFD0', borderRadius: 50, fontSize: 13, fontWeight: 600, color: '#1F3D2B', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slip Modal View */}
      {viewingOrderSlip && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(22, 44, 31, 0.65)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setViewingOrderSlip(null)}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', padding: 20, maxWidth: 540, width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
            <img src={viewingOrderSlip} alt="Payment slip" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 10 }} />
            <button
              type="button"
              onClick={() => setViewingOrderSlip(null)}
              style={{ width: '100%', padding: '12px', marginTop: 16, background: '#1F3D2B', color: '#FFFFFF', border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isAddTeamModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(22, 44, 31, 0.45)', backdropFilter: 'blur(3px)', zIndex: 215, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setIsAddTeamModalOpen(false)}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #EADFD0', boxShadow: '0 10px 40px rgba(22, 44, 31, 0.2)', padding: 28, maxWidth: 440, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#1F3D2B', fontFamily: 'Playfair Display, Georgia, serif' }}>Invite Store Administrator</h3>
            <form onSubmit={handleAddTeamMember} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Full Name</label>
                <input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Email Address</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="kasun@ceyloncrunch.lk"
                  style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 5 }}>Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', background: '#FAF8F4', border: '1.5px solid #EADFD0', borderRadius: 8, fontSize: 13, color: '#1F3D2B', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Fulfillment Agent">Fulfillment Agent</option>
                  <option value="Content Editor">Content Editor</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  style={{ padding: '8px 18px', background: '#FAF6EF', border: '1px solid #EADFD0', borderRadius: 50, fontSize: 13, fontWeight: 600, color: '#1F3D2B', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#1F3D2B', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
