import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Calendar,
  X,
  Eye,
} from 'lucide-react';
import { Order } from '../../lib/store';
import { formatRs } from '../../data/products';

interface CustomerProfileData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  district: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

interface CustomersTabProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ orders, onViewOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfileData | null>(null);

  // Group and synthesize customers from actual order history
  const customers = useMemo(() => {
    const map = new Map<string, CustomerProfileData>();

    orders.forEach((o) => {
      const key =
        o.customer.phone.trim().replace(/\D/g, '') ||
        o.customer.email?.trim().toLowerCase() ||
        o.customer.name.trim().toLowerCase();

      if (!key) return;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          id: key,
          name: o.customer.name,
          phone: o.customer.phone,
          email: o.customer.email,
          city: o.shippingAddress.city,
          district: o.shippingAddress.district,
          orderCount: 1,
          totalSpent: o.total || 0,
          lastOrderDate: o.createdAt,
          orders: [o],
        });
      } else {
        existing.orderCount += 1;
        existing.totalSpent += o.total || 0;
        existing.orders.push(o);
        // keep latest date
        existing.lastOrderDate = o.createdAt;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Summary */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patrons by customer name, phone, email, or city..."
              className="w-full h-10 pl-10 pr-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
          <span className="text-xs font-semibold text-gray-500 shrink-0">
            {customers.length} Registered Patrons
          </span>
        </div>
      </div>

      {/* Customers Table */}
      {/* Customers Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">No customer profiles located</p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Patron Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1F3D2B]/10 text-[#1F3D2B] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {c.name ? c.name[0].toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">{c.name}</div>
                        <div className="text-[11px] text-gray-400">{c.city}, {c.district}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-emerald-700 block">
                        {formatRs(c.totalSpent)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-gray-700">{c.phone}</span>
                      {c.email && (
                        <span className="text-[11px] text-gray-400 truncate max-w-[140px]">
                          {c.email}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(c);
                      }}
                      className="h-7 px-2.5 rounded-lg bg-gray-100 hover:bg-[#1F3D2B] hover:text-white text-gray-700 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on screens < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Patron Name</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4 text-center">Orders</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                    <th className="py-3.5 px-4">Last Order</th>
                    <th className="py-3.5 px-4 text-right">History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1F3D2B]/10 text-[#1F3D2B] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                            {c.name ? c.name[0].toUpperCase() : 'P'}
                          </div>
                          <div className="font-bold text-gray-900">{c.name}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-900 font-mono font-medium">{c.phone}</div>
                        {c.email && <div className="text-[11px] text-gray-400">{c.email}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-700">{c.city}</div>
                        <div className="text-[10px] text-gray-400">{c.district} District</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 font-bold text-gray-900">
                          {c.orderCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {formatRs(c.totalSpent)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{c.lastOrderDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(c);
                          }}
                          className="h-7 px-3 rounded-lg bg-gray-100 hover:bg-[#1F3D2B] hover:text-white text-gray-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Orders</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl border border-gray-200 max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1F3D2B] text-[#C5A059] font-serif font-bold text-base flex items-center justify-center shadow-xs">
                  {selectedCustomer.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedCustomer.phone} · {selectedCustomer.city}, {selectedCustomer.district}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Orders</span>
                <span className="text-lg font-serif font-bold text-gray-900">
                  {selectedCustomer.orderCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Lifetime Spent</span>
                <span className="text-lg font-serif font-bold text-emerald-700">
                  {formatRs(selectedCustomer.totalSpent)}
                </span>
              </div>
            </div>

            {/* List of orders */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Purchase History
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                {selectedCustomer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSelectedCustomer(null);
                      onViewOrder(ord);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-gray-900">{ord.id}</div>
                      <div className="text-[11px] text-gray-400">{ord.createdAt} · {ord.items.length} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatRs(ord.total)}</div>
                      <span className="text-[10px] font-semibold text-emerald-700 capitalize">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
