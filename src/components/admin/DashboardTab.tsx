import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Layers,
  Users,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Eye,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Order } from '../../lib/store';
import { Product, ProductVariant, formatRs } from '../../data/products';
import { AdminTab } from './AdminSidebar';

interface DashboardTabProps {
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: AdminTab) => void;
  onViewOrder: (order: Order) => void;
  onOpenAddProduct: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  orders,
  products,
  onNavigateTab,
  onViewOrder,
  onOpenAddProduct,
}) => {
  // Real database calculation of metrics
  const totalRevenue = orders.reduce((sum, o) => {
    // Only count non-cancelled orders for revenue
    if (o.status !== ('cancelled' as any)) {
      return sum + (o.total || 0);
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;

  // Distinct customers by phone or email
  const distinctCustomerIdentifiers = new Set(
    orders.map((o) => o.customer.phone.trim() || o.customer.email?.trim() || o.customer.name.trim())
  );
  const totalCustomers = distinctCustomerIdentifiers.size;

  const pendingOrders = orders.filter(
    (o) => o.status === 'placed' || o.paymentStatus === 'pending'
  ).length;

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === 'received' || o.paymentStatus === 'verified'
  ).length;

  const shippedOrders = orders.filter((o) => o.status === 'dispatched').length;

  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const cancelledOrders = orders.filter((o) => o.status === ('cancelled' as any)).length;

  // Identify low stock products across all variants (stock <= 10)
  const lowStockItems: Array<{
    product: Product;
    variantName: string;
    stock: number;
  }> = [];

  products.forEach((p) => {
    p.variants.forEach((v: ProductVariant) => {
      if (v.stock <= 10) {
        lowStockItems.push({
          product: p,
          variantName: v.weight,
          stock: v.stock,
        });
      }
    });
  });

  const recentOrders = orders.slice(0, 8);

  const stats = [
    {
      title: 'Total Revenue',
      value: formatRs(totalRevenue),
      subtext: 'Net gross across all valid orders',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      subtext: `${pendingOrders} awaiting fulfillment`,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      subtext: `${products.reduce((acc, p) => acc + p.variants.length, 0)} total weight variants`,
      icon: Layers,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      subtext: 'Unique patrons with order history',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      subtext: 'Requires queue processing / slip review',
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Paid Orders',
      value: paidOrders.toString(),
      subtext: 'Verified bank transfers & COD pre-clears',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Shipped Orders',
      value: shippedOrders.toString(),
      subtext: 'En route with Pronto tracking',
      icon: Truck,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-800',
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders.toString(),
      subtext: 'Completed patron deliveries',
      icon: PackageCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-800',
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders.toString(),
      subtext: 'Refunded or voided orders',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Top Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-gray-900">Welcome to Ceylon Crunch Admin</h2>
          <p className="text-xs text-gray-500">
            Real-time synchronization active with Supabase PostgreSQL
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddProduct}
            className="h-9 px-3.5 sm:px-4 rounded-xl bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="h-9 px-3.5 sm:px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 9 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {s.title}
                </p>
                <p className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">{s.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Warning Banner if any items low */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Inventory Alert: {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} low in stock!
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Some items have fewer than 10 units remaining. Replenish batch inventory to avoid fulfillment delays.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="h-8 px-3.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-2xs"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* Recent Orders Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900">Recent Orders</h3>
            <p className="text-xs text-gray-500">Live order stream across Sri Lanka</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#1F3D2B] hover:text-[#C5A059] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>See All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No orders recorded yet</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Customer orders placed on the storefront will appear here live.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Visible on screens < md) */}
            <div className="divide-y divide-gray-100 md:hidden">
              {recentOrders.map((order) => {
                const paymentBadge =
                  order.paymentStatus === 'verified'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : order.paymentStatus === 'received'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                const statusBadge =
                  order.status === 'delivered'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : order.status === 'dispatched'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : order.status === 'packed'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : order.status === 'confirmed'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={order.id}
                    onClick={() => onViewOrder(order)}
                    className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-gray-400">{order.createdAt}</span>
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {formatRs(order.total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {order.customer.phone} · {order.shippingAddress.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${paymentBadge}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusBadge}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#1F3D2B] flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
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
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => {
                    const paymentBadge =
                      order.paymentStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.paymentStatus === 'received'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    const statusBadge =
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.status === 'dispatched'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : order.status === 'packed'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : order.status === 'confirmed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => onViewOrder(order)}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{order.customer.name}</div>
                          <div className="text-[11px] text-gray-400">{order.customer.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {formatRs(order.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${paymentBadge}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusBadge}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {order.createdAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewOrder(order);
                            }}
                            className="h-7 px-2.5 rounded-lg bg-gray-100 hover:bg-[#1F3D2B] hover:text-white text-gray-700 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
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
