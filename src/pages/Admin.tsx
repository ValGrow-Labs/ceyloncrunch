import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useStore, Order, OrderStatus, PaymentStatus } from '../lib/store';
import { adminUploadProductImage } from '../lib/supabase';
import { seedProductsToSupabase } from '../lib/seedDatabase';

// Admin Components
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminTopBar } from '../components/admin/AdminTopBar';
import { AdminBottomNav } from '../components/admin/AdminBottomNav';
import { AdminLogin } from '../components/admin/AdminLogin';
import { DashboardTab } from '../components/admin/DashboardTab';
import { OrdersTab } from '../components/admin/OrdersTab';
import { ProductsTab } from '../components/admin/ProductsTab';
import { CategoriesTab } from '../components/admin/CategoriesTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { InventoryTab } from '../components/admin/InventoryTab';
import { TeamTab } from '../components/admin/TeamTab';
import { NewsletterTab } from '../components/admin/NewsletterTab';
import { HeroSectionTab } from '../components/admin/HeroSectionTab';
import { HomepageSectionsTab } from '../components/admin/HomepageSectionsTab';
import { NavigationTab } from '../components/admin/NavigationTab';
import { FooterTab } from '../components/admin/FooterTab';
import { PaymentsTab } from '../components/admin/PaymentsTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { RefreshCw } from 'lucide-react';

export const Admin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

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
    createProduct,
    updateProductDetails,
    deleteProduct,
    subscribers,
    refreshSubscribers,
    toggleSubscriber,
    deleteSubscriber,
    showToast,
  } = useStore();

  // Derive initial tab from path or query params
  const getInitialTab = (): AdminTab => {
    const path = location.pathname.replace('/admin', '').replace(/^\/+/, '');
    const tabParam = searchParams.get('tab');

    const validTabs: AdminTab[] = [
      'dashboard',
      'orders',
      'products',
      'categories',
      'customers',
      'inventory',
      'newsletter',
      'hero',
      'homepage',
      'navigation',
      'footer',
      'settings',
    ];

    if (validTabs.includes(path as AdminTab)) return path as AdminTab;
    if (tabParam && validTabs.includes(tabParam as AdminTab)) return tabParam as AdminTab;
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<AdminTab>(getInitialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Cross-tab interaction states
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Keep URL aligned
  const handleSelectTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTabState(tabParam as AdminTab);
    }
  }, [searchParams]);

  // Sync data across Supabase tables
  const handleSyncData = async () => {
    setIsSyncing(true);
    showToast('Synchronizing orders, products, and subscribers from Supabase...');
    await Promise.all([refreshProducts(), refreshOrders(), refreshSubscribers()]);
    setIsSyncing(false);
    showToast('All store records up to date!');
  };

  // Run catalog seeder
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    showToast('Running Supabase catalog seeder...');
    const result = await seedProductsToSupabase();
    await refreshProducts();
    setIsSeeding(false);
    showToast(result.message);
  };

  // Image uploader handler
  const handleUploadProductImage = async (productIdOrFile?: string | File, maybeFile?: File) => {
    let productId: string | undefined;
    let file: File | undefined;
    if (productIdOrFile instanceof File) {
      file = productIdOrFile;
    } else {
      productId = productIdOrFile;
      file = maybeFile;
    }
    if (!file) return { success: false, error: 'No file provided' };
    showToast('Uploading photo to Supabase Storage...');
    const res = await adminUploadProductImage(productId, file);
    if (res.success && res.url) {
      showToast('Image uploaded and synced!');
      if (productId) await refreshProducts();
    } else {
      showToast(res.error || 'Failed to upload photo.');
    }
    return res;
  };

  // Variant price & stock updater
  const handleUpdateVariant = async (
    productId: string,
    variantId: string,
    price: number,
    originalPrice?: number,
    stock?: number
  ) => {
    if (stock !== undefined) {
      await updateProductStock(productId, variantId, stock);
    }
    if (price !== undefined) {
      await updateProductVariantPrice(productId, variantId, price);
    }
    if (originalPrice !== undefined) {
      await updateProductVariantOriginalPrice(productId, variantId, originalPrice);
    }
  };

  // Cross-tab quick handlers
  const handleViewOrder = (order: Order) => {
    setSelectedOrderForModal(order);
    handleSelectTab('orders');
  };

  const handleOpenAddProduct = () => {
    setIsAddProductModalOpen(true);
    handleSelectTab('products');
  };

  // Counts for sidebar badges
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.paymentStatus === 'pending'
  ).length;

  const lowStockCount = products.reduce((acc, p) => {
    const hasLow = p.variants.some((v) => v.stock <= 10);
    return acc + (hasLow ? 1 : 0);
  }, 0);

  // 1. Session verification loader
  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center">
        <RefreshCw className="w-8 h-8 text-[#1E4E35] animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#1F3D2B]">Verifying administrator credentials...</p>
        <p className="text-xs text-stone-500 mt-1">Checking secure session with Supabase</p>
      </div>
    );
  }

  // 2. Unauthenticated: Render Admin Login Gate
  if (!isAdmin) {
    return <AdminLogin onLogin={loginAdmin} showToast={showToast} />;
  }

  // 3. Authenticated: Render Full Modern Admin Panel
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex text-[#111827] antialiased">
      {/* 3. Collapsible Dark Sidebar with all 13 items */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onLogout={logoutAdmin}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        adminEmail={adminEmail}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <AdminTopBar
          activeTab={activeTab}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          onSyncDatabase={handleSyncData}
          isSyncing={isSyncing}
          adminEmail={adminEmail}
        />

        {/* Tab View Canvas */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl w-full min-w-0 mx-auto pb-24 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardTab
              orders={orders}
              products={products}
              onNavigateTab={handleSelectTab}
              onViewOrder={handleViewOrder}
              onOpenAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={updateOrderStatus}
              onUpdatePaymentStatus={updateOrderPaymentStatus}
              selectedOrderForModal={selectedOrderForModal}
              onClearSelectedOrder={() => setSelectedOrderForModal(null)}
              showToast={showToast}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onCreateProduct={createProduct}
              onUpdateProductDetails={updateProductDetails}
              onUpdateVariant={handleUpdateVariant}
              onDeleteProduct={deleteProduct}
              onUploadImage={handleUploadProductImage}
              showToast={showToast}
              isAddModalOpen={isAddProductModalOpen}
              onCloseAddModal={() => setIsAddProductModalOpen(false)}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              products={products}
              onNavigateTab={handleSelectTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersTab orders={orders} onViewOrder={handleViewOrder} />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              products={products}
              onUpdateVariantStock={updateProductStock}
              showToast={showToast}
            />
          )}

          {activeTab === 'team' && <TeamTab showToast={showToast} />}

          {activeTab === 'newsletter' && (
            <NewsletterTab
              subscribers={subscribers}
              onToggleSubscriber={toggleSubscriber}
              onDeleteSubscriber={deleteSubscriber}
              showToast={showToast}
            />
          )}

          {activeTab === 'hero' && <HeroSectionTab showToast={showToast} />}

          {activeTab === 'homepage' && (
            <HomepageSectionsTab
              products={products}
              onToggleFeatured={async (id, isFeatured) => {
                await updateProductDetails(id, { isFeatured });
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'navigation' && <NavigationTab showToast={showToast} />}

          {activeTab === 'footer' && <FooterTab showToast={showToast} />}

          {activeTab === 'payments' && <PaymentsTab showToast={showToast} />}

          {activeTab === 'settings' && (
            <SettingsTab
              showToast={showToast}
              onSeedDatabase={handleSeedDatabase}
              isSeeding={isSeeding}
            />
          )}
        </main>

        {/* Mobile Sticky Bottom Navigation (RWD) */}
        <AdminBottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenMore={() => setIsMobileSidebarOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
        />
      </div>
    </div>
  );
};
