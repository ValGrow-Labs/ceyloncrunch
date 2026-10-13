import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../lib/store';

export const MobileTabBar: React.FC = () => {
  const { itemCount } = useStore();

  const navItems = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/shop', label: 'Shop', icon: 'storefront' },
    { to: '/gifting', label: 'Gifting', icon: 'featured_seasonal_and_gifts' },
    { to: '/cart', label: 'Cart', icon: 'shopping_bag', badge: itemCount },
    { to: '/track', label: 'Track Order', icon: 'local_shipping' },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 w-full z-40 pb-safe bg-[#FBF7F0]/95 backdrop-blur-xl border-t border-[#EADFD0] shadow-[0_-4px_20px_-2px_rgba(139,94,60,0.06)]"
    >
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors relative ${
                isActive
                  ? 'text-[#1F3D2B] font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#1F3D2B]'
              }`
            }
          >
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] px-1 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center font-sans text-[10px] leading-none font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-sans text-[11px] mt-0.5 tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
