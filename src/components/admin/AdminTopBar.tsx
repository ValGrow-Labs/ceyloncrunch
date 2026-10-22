import React from 'react';
import { Menu, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminTopBarProps {
  activeTab: AdminTab;
  onOpenMobile: () => void;
  onSyncDatabase: () => void;
  isSyncing: boolean;
  adminEmail?: string | null;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'Real-time sales, order fulfillment, and revenue metrics',
  },
  orders: {
    title: 'Order Fulfillment & Management',
    subtitle: 'Track, verify bank slips, and update islandwide shipments',
  },
  products: {
    title: 'Artisan Product Catalog',
    subtitle: 'Manage products, pack weights, pricing, and Supabase photos',
  },
  categories: {
    title: 'Category Taxonomy',
    subtitle: 'Organize provisions by types, tags, and product associations',
  },
  customers: {
    title: 'Customer Directory',
    subtitle: 'Registered patrons, delivery destinations, and purchase history',
  },
  inventory: {
    title: 'Inventory & Stock Control',
    subtitle: 'Monitor variant stock levels, prevent depletion, and adjust counts',
  },
  newsletter: {
    title: 'Newsletter Subscribers',
    subtitle: 'Engage mailing list patrons and export subscriber records to CSV',
  },
  hero: {
    title: 'Hero Section Editor',
    subtitle: 'Customize main landing headline, photography, and primary action',
  },
  homepage: {
    title: 'Homepage Sections & Banners',
    subtitle: 'Configure promotional ribbons, featured bestsellers, and story strip',
  },
  navigation: {
    title: 'Store Navigation Menu',
    subtitle: 'Manage header navigation links and customer catalog paths',
  },
  footer: {
    title: 'Footer & Company Info',
    subtitle: 'Contact hotlines, WhatsApp numbers, social links, and legal policies',
  },
  settings: {
    title: 'Store Settings & Policies',
    subtitle: 'Delivery rates, bank accounts, minimum order thresholds, and status',
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  activeTab,
  onOpenMobile,
  onSyncDatabase,
  isSyncing,
  adminEmail,
}) => {
  const current = TAB_TITLES[activeTab] || {
    title: 'Store Administration',
    subtitle: 'Ceylon Crunch Artisan Provisions Admin Portal',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-1 sm:-ml-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none shrink-0"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="font-serif font-bold text-base sm:text-xl text-gray-900 truncate">
              {current.title}
            </h1>
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Live DB</span>
            </span>
          </div>
          <p className="hidden md:block text-xs text-gray-500 truncate">{current.subtitle}</p>
        </div>
      </div>

      {/* Top Bar Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Sync Database Button */}
        <button
          onClick={onSyncDatabase}
          disabled={isSyncing}
          className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          title="Refresh products, orders, and settings from Supabase"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-500 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
        </button>

        {/* View Store Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shadow-xs transition-all cursor-pointer"
          title="View live customer storefront in new tab"
        >
          <span className="hidden xs:inline sm:inline">Store</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {/* User Chip */}
        <div className="flex items-center pl-1 sm:pl-2 border-l border-gray-200">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C5A059] text-white font-serif font-bold text-xs flex items-center justify-center shadow-xs"
            title={adminEmail || 'Administrator'}
          >
            {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};
