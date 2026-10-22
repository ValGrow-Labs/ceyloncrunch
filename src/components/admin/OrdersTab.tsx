import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../lib/store';
import { formatRs } from '../../data/products';

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrder?: () => void;
  showToast: (msg: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateStatus,
  onUpdatePaymentStatus,
  selectedOrderForModal,
  onClearSelectedOrder,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | 'month'>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(
    selectedOrderForModal || null
  );

  const [copiedId, setCopiedId] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sync external prop if changed
  React.useEffect(() => {
    if (selectedOrderForModal) {
      setActiveModalOrder(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.phone.toLowerCase().includes(q) ||
        (order.customer.email && order.customer.email.toLowerCase().includes(q)) ||
        order.shippingAddress.city.toLowerCase().includes(q) ||
        order.shippingAddress.district.toLowerCase().includes(q);

      // 2. Status Filter
      const matchStatus = statusFilter === 'all' || order.status === statusFilter;

      // 3. Payment Filter
      const matchPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

      // 4. Date Filter
      let matchDate = true;
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        if (!isNaN(orderDate.getTime())) {
          if (dateFilter === 'today') {
            matchDate = orderDate.toDateString() === now.toDateString();
          } else if (dateFilter === '7days') {
            const diffTime = Math.abs(now.getTime() - orderDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            matchDate = diffDays <= 7;
          } else if (dateFilter === 'month') {
            matchDate =
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear();
          }
        }
      }

      return matchSearch && matchStatus && matchPayment && matchDate;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter, dateFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast(`Copied Order ID: ${id}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCloseModal = () => {
    setActiveModalOrder(null);
    if (onClearSelectedOrder) onClearSelectedOrder();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID, patron, phone, city..."
              className="w-full h-10 pl-10 pr-8 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
          >
            <option value="all">All Fulfillment Statuses</option>
            <option value="placed">Placed (New)</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="verified">Verified</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full h-10 px-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Showing <strong className="text-gray-900">{filteredOrders.length}</strong> of{' '}
            <strong className="text-gray-900">{orders.length}</strong> total orders
          </span>
          {(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setDateFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">No matching orders located</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search keywords, status filter, or date range.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Order Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-gray-100 md:hidden">
              {paginatedOrders.map((order) => {
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
                    onClick={() => setActiveModalOrder(order)}
                    className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                          {order.id}
                        </span>
                        {order.paymentSlipUrl && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Slip
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400">{order.createdAt}</span>
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {formatRs(order.total)}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {order.shippingAddress.city}, {order.shippingAddress.district}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {order.customer.phone}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 shrink-0">
                        {order.paymentMethod}
                      </span>
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalOrder(order);
                        }}
                        className="h-7 px-3 rounded-lg bg-gray-100 hover:bg-[#1F3D2B] hover:text-white text-gray-700 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
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
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer & Destination</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => {
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
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                        onClick={() => setActiveModalOrder(order)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono font-bold text-gray-900">
                            <span>{order.id}</span>
                            {order.paymentSlipUrl && (
                              <span
                                title="Bank deposit slip attached"
                                className="w-2 h-2 rounded-full bg-blue-500"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{order.customer.name}</div>
                          <div className="text-[11px] text-gray-400">
                            {order.shippingAddress.city}, {order.shippingAddress.district} · {order.customer.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {formatRs(order.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-gray-700 uppercase text-[10px] px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200">
                            {order.paymentMethod}
                          </span>
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
                              setActiveModalOrder(order);
                            }}
                            className="h-7 px-3 rounded-lg bg-gray-100 hover:bg-[#1F3D2B] hover:text-white text-gray-700 text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      currentPage === pageNum
                        ? 'bg-[#1F3D2B] text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Order Details Modal */}
      {activeModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-4 sm:p-7 space-y-5 sm:space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-xl text-gray-900">
                    Order {activeModalOrder.id}
                  </h3>
                  <button
                    onClick={() => handleCopyOrderId(activeModalOrder.id)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                    title="Copy Order ID"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {activeModalOrder.createdAt} · Courier Waybill: {activeModalOrder.waybill}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Modification Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-200">
              {/* Fulfillment Status */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Fulfillment Status (Live DB)
                </label>
                <select
                  value={activeModalOrder.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as OrderStatus;
                    await onUpdateStatus(activeModalOrder.id, newStatus);
                    setActiveModalOrder({ ...activeModalOrder, status: newStatus });
                    showToast(`Updated order status to ${newStatus}`);
                  }}
                  className="w-full h-10 px-3 bg-white rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
                >
                  <option value="placed">Placed (New Order)</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed in Foil Pouch</option>
                  <option value="dispatched">Dispatched to Courier</option>
                  <option value="delivered">Delivered to Patron</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Payment Status (Live DB)
                </label>
                <select
                  value={activeModalOrder.paymentStatus}
                  onChange={async (e) => {
                    const newPayment = e.target.value as PaymentStatus;
                    await onUpdatePaymentStatus(activeModalOrder.id, newPayment);
                    setActiveModalOrder({ ...activeModalOrder, paymentStatus: newPayment });
                    showToast(`Updated payment status to ${newPayment}`);
                  }}
                  className="w-full h-10 px-3 bg-white rounded-xl border border-gray-300 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
                >
                  <option value="pending">Pending (Awaiting Proof / Cash)</option>
                  <option value="received">Received (Slip Uploaded)</option>
                  <option value="verified">Verified (Funds Cleared)</option>
                </select>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Customer Contact
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-2 text-xs">
                  <div className="font-bold text-gray-900 text-sm">{activeModalOrder.customer.name}</div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${activeModalOrder.customer.phone}`} className="hover:underline">
                      {activeModalOrder.customer.phone}
                    </a>
                  </div>
                  {activeModalOrder.customer.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${activeModalOrder.customer.email}`} className="hover:underline truncate">
                        {activeModalOrder.customer.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Delivery Destination
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-1 text-xs">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">{activeModalOrder.shippingAddress.street}</p>
                      {activeModalOrder.shippingAddress.landmark && (
                        <p className="text-gray-500">Landmark: {activeModalOrder.shippingAddress.landmark}</p>
                      )}
                      <p className="text-gray-600">
                        {activeModalOrder.shippingAddress.city}, {activeModalOrder.shippingAddress.district}{' '}
                        {activeModalOrder.shippingAddress.postalCode && `· ${activeModalOrder.shippingAddress.postalCode}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Deposit Slip Attachment Viewer */}
            {activeModalOrder.paymentSlipUrl && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-blue-900">
                      Bank Transfer Receipt Attached
                    </span>
                  </div>
                  <a
                    href={activeModalOrder.paymentSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <span>Full View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="rounded-xl overflow-hidden border border-blue-200 bg-white max-h-56 flex items-center justify-center">
                  <img
                    src={activeModalOrder.paymentSlipUrl}
                    alt="Customer Bank Transfer Slip"
                    className="max-h-56 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Ordered Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Order Items ({activeModalOrder.items.length})
              </h4>
              <div className="border border-gray-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Weight</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeModalOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <span className="font-semibold text-gray-900">{item.productName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{item.variantWeight}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600">
                          {formatRs(item.price)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                          {formatRs(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRs(activeModalOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Islandwide Delivery Fee</span>
                <span>
                  {activeModalOrder.deliveryFee === 0 ? 'FREE' : formatRs(activeModalOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-[#1F3D2B] font-serif text-base">
                  {formatRs(activeModalOrder.total)}
                </span>
              </div>
            </div>

            {/* Gift Note / Order Notes if present */}
            {activeModalOrder.giftNote && (
              <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-xl p-3.5 text-xs">
                <span className="font-bold text-[#8B5E3C] uppercase text-[10px] block mb-1">
                  Custom Gift Note to Include in Packaging:
                </span>
                <p className="text-gray-700 italic font-serif">"{activeModalOrder.giftNote}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
