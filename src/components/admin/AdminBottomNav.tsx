import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  Menu,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminBottomNavProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenMore: () => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMore,
  pendingOrdersCount = 0,
  lowStockCount = 0,
}) => {
  const primaryTabs: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      badge: pendingOrdersCount,
      badgeColor: 'bg-amber-500',
    },
    { id: 'products', label: 'Products', icon: Layers },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount,
      badgeColor: 'bg-rose-500',
    },
  ];

  const isMoreActive = !['dashboard', 'orders', 'products', 'inventory'].includes(activeTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden transition-transform duration-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {primaryTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#1F3D2B] font-semibold scale-102'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#1F3D2B] scale-110' : 'text-gray-400'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`absolute -top-1 -right-2 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs ${
                      item.badgeColor || 'bg-amber-500'
                    }`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-[64px] ${
                  isActive ? 'font-bold text-[#1F3D2B]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {/* Active pill dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#1F3D2B] mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenMore}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            isMoreActive
              ? 'text-[#1F3D2B] font-semibold scale-102'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Open More Tabs Menu"
        >
          <div className="relative">
            <Menu
              className={`w-5 h-5 transition-transform ${
                isMoreActive ? 'text-[#1F3D2B] scale-110' : 'text-gray-400'
              }`}
            />
            {isMoreActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C5A059]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 truncate max-w-[64px] ${
              isMoreActive ? 'font-bold text-[#1F3D2B]' : 'font-medium'
            }`}
          >
            {isMoreActive ? activeTab.slice(0, 7) : 'More'}
          </span>
          {isMoreActive && (
            <span className="w-1 h-1 rounded-full bg-[#1F3D2B] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
