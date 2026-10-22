import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Users,
  Boxes,
  Mail,
  Sparkles,
  LayoutTemplate,
  Compass,
  PanelBottom,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Store,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'customers'
  | 'inventory'
  | 'newsletter'
  | 'hero'
  | 'homepage'
  | 'navigation'
  | 'footer'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  adminEmail?: string | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  adminEmail,
}) => {
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
    section?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package, badge: pendingOrdersCount, badgeColor: 'bg-amber-500' },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount, badgeColor: 'bg-rose-500' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'hero', label: 'Hero Section', icon: Sparkles, section: 'Storefront Content' },
    { id: 'homepage', label: 'Home Page Sections', icon: LayoutTemplate },
    { id: 'navigation', label: 'Navigation', icon: Compass },
    { id: 'footer', label: 'Footer', icon: PanelBottom },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'Configuration' },
  ];

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#111827] text-gray-300 transition-all duration-300 ease-in-out border-r border-gray-800 shadow-2xl ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isMobileOpen ? 'translate-x-0 w-72 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-[#0B0F19]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8B5E3C] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm shrink-0">
              CC
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col leading-tight truncate">
                <span className="font-serif font-bold text-white text-base tracking-wide truncate">
                  Ceylon Crunch
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#C5A059] uppercase">
                  Admin Dashboard
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showSection = item.section && (!isCollapsed || isMobileOpen);

            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <div className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                    {item.section}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#1F2937] text-white shadow-xs font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#C5A059] rounded-r-full" />
                  )}

                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#C5A059]' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  />

                  {(!isCollapsed || isMobileOpen) && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {/* Badge */}
                  {item.badge && Number(item.badge) > 0 ? (
                    <span
                      className={`${
                        item.badgeColor || 'bg-blue-500'
                      } text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isCollapsed && !isMobileOpen ? 'absolute top-1.5 right-1.5 w-2 h-2 p-0' : ''
                      }`}
                    >
                      {isCollapsed && !isMobileOpen ? '' : item.badge}
                    </span>
                  ) : null}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Store Link & Admin User Profile */}
        <div
          className="p-3 border-t border-gray-800 bg-[#0B0F19]/50 space-y-2"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
        >
          {/* Quick Storefront Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={isCollapsed ? 'View Live Store' : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/80 transition-all"
          >
            <Store className="w-4 h-4 text-emerald-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="flex-1 truncate">View Live Store</span>
            )}
            {(!isCollapsed || isMobileOpen) && <ExternalLink className="w-3.5 h-3.5 text-gray-500" />}
          </a>

          {/* Admin User Chip */}
          <div className="flex items-center gap-3 px-3 py-2 bg-[#1A2234] rounded-xl border border-gray-800">
            <div className="w-8 h-8 rounded-full bg-[#1F3D2B] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs flex items-center justify-center shrink-0">
              {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">Administrator</div>
                <div className="text-[10px] text-gray-400 truncate">
                  {adminEmail || 'admin@ceyloncrunch.lk'}
                </div>
              </div>
            )}
          </div>

          {/* 13. Logout Action */}
          <button
            type="button"
            onClick={onLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-900/40 border border-transparent hover:border-rose-800 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>13. Sign Out</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <div className="hidden lg:flex justify-end pt-1">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
