import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Search,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../lib/store';

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrder?: () => void;
  showToast: (msg: string) => void;
}

type UnifiedStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

// Baseline demo orders matching the design screenshot
const DEMO_ORDERS: Order[] = [
  {
    id: '#8F921AB4',
    createdAt: '2026-10-22T11:03:00Z',
    customer: {
      name: 'Dilshan Perera',
      email: 'dilshan.p@gmail.com',
      phone: '+94 77 123 4567',
    },
    shippingAddress: {
      street: 'No 45, Galle Road',
      city: 'Colombo 03',
      district: 'Colombo',
      postalCode: '00300',
    },
    paymentMethod: 'payhere' as any,
    paymentStatus: 'verified',
    status: 'confirmed',
    waybill: 'PH-9823412',
    estimatedArrival: 'Oct 24, 2026',
    orderNotes: 'Please call before delivery',
    items: [
      {
        id: 'item-1',
        productId: 'roasted-cashews',
        variantId: 'var-1',
        slug: 'roasted-cashews',
        productName: 'Roasted Cashews',
        variantWeight: '500g',
        price: 1200,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1509912760195-4f6cfd9c0257?auto=format&fit=crop&w=200&q=80',
      },
      {
        id: 'item-2',
        productId: 'ceylon-trail-mix',
        variantId: 'var-2',
        slug: 'ceylon-trail-mix',
        productName: 'Ceylon Trail Mix',
        variantWeight: '300g',
        price: 950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 3350,
    deliveryFee: 300,
    total: 3650,
    timeline: [],
  },
  {
    id: '#3C749E10',
    createdAt: '2026-10-22T09:30:00Z',
    customer: {
      name: 'Anuki Fernando',
      email: 'anuki.f@outlook.com',
      phone: '+94 71 889 2341',
    },
    shippingAddress: {
      street: '12 Temple Road',
      city: 'Kandy',
      district: 'Kandy',
    },
    paymentMethod: 'cod' as any,
    paymentStatus: 'pending',
    status: 'placed',
    waybill: 'CD-37491',
    estimatedArrival: 'Oct 25, 2026',
    orderNotes: 'Ring bell at gate',
    items: [
      {
        id: 'item-3',
        productId: 'organic-walnuts',
        variantId: 'var-3',
        slug: 'organic-walnuts',
        productName: 'Organic Walnuts',
        variantWeight: '250g',
        price: 1900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 1900,
    deliveryFee: 0,
    total: 1900,
    timeline: [],
  },
  {
    id: '#5A120BD3',
    createdAt: '2026-10-21T15:45:00Z',
    customer: {
      name: 'Malik Silva',
      email: 'malik.silva@gmail.com',
      phone: '+94 70 345 6789',
    },
    shippingAddress: {
      street: '88 Beach Road',
      city: 'Negombo',
      district: 'Gampaha',
    },
    paymentMethod: 'bank_transfer' as any,
    paymentStatus: 'verified',
    status: 'dispatched',
    waybill: 'BT-51208',
    estimatedArrival: 'Oct 23, 2026',
    orderNotes: 'Leave with security guard if unavailable',
    items: [
      {
        id: 'item-4',
        productId: 'pistachios-roasted',
        variantId: 'var-4',
        slug: 'pistachios-roasted',
        productName: 'Pistachios Roasted',
        variantWeight: '500g',
        price: 2425,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1509912760195-4f6cfd9c0257?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 4850,
    deliveryFee: 0,
    total: 4850,
    timeline: [],
  },
  {
    id: '#7D331CF8',
    createdAt: '2026-10-20T10:15:00Z',
    customer: {
      name: 'Kasun Bandara',
      email: 'kasun.b@yahoo.com',
      phone: '+94 77 654 3210',
    },
    shippingAddress: {
      street: '25/4 Peradeniya Road',
      city: 'Kurunegala',
      district: 'Kurunegala',
    },
    paymentMethod: 'payhere' as any,
    paymentStatus: 'verified',
    status: 'delivered',
    waybill: 'PH-73319',
    estimatedArrival: 'Oct 22, 2026',
    orderNotes: 'Delivered successfully',
    items: [
      {
        id: 'item-5',
        productId: 'salted-almonds',
        variantId: 'var-5',
        slug: 'salted-almonds',
        productName: 'Salted Almonds',
        variantWeight: '400g',
        price: 2750,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=200&q=80',
      },
    ],
    subtotal: 2750,
    deliveryFee: 0,
    total: 2750,
    timeline: [],
  },
];

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateStatus,
  onUpdatePaymentStatus,
  selectedOrderForModal,
  onClearSelectedOrder,
  showToast,
}) => {
  // Use real orders if present, otherwise merge/fallback to demo orders
  const displayOrders = useMemo(() => {
    if (orders && orders.length > 0) {
      return orders;
    }
    return DEMO_ORDERS;
  }, [orders]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    selectedOrderForModal || null
  );

  // Status and notes form state when viewing an order
  const [editingStatus, setEditingStatus] = useState<UnifiedStatus>('pending');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync external selection if provided
  useEffect(() => {
    if (selectedOrderForModal) {
      setSelectedOrder(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  // Sync form when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      setEditingStatus(getUnifiedStatus(selectedOrder));
      setInternalNotes(selectedOrder.orderNotes || '');
    }
  }, [selectedOrder]);

  // Status mapping helper
  function getUnifiedStatus(order: Order): UnifiedStatus {
    if (order.status === ('cancelled' as any)) return 'cancelled';
    if (order.status === 'delivered') return 'delivered';
    if (order.status === 'dispatched') return 'shipped';
    if (
      order.paymentStatus === 'verified' ||
      order.paymentStatus === 'received' ||
      order.status === 'confirmed' ||
      order.status === 'packed'
    ) {
      return 'paid';
    }
    return 'pending';
  }

  // Format payment method text
  const formatPaymentMethod = (method: string) => {
    if (!method) return 'Payhere';
    const m = method.toLowerCase();
    if (m === 'cod') return 'Cod';
    if (m.includes('bank')) return 'Bank Transfer';
    if (m === 'payhere') return 'Payhere';
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Format order date: "Oct 22, 2026"
  const formatOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Format full order date: "Thursday, October 22, 2026 at 11:03 AM"
  const formatFullOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const formattedDate = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${formattedDate} at ${formattedTime}`;
    } catch {
      return dateStr;
    }
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return displayOrders.filter((order) => {
      const status = getUnifiedStatus(order);

      // Status pill tab filter
      if (activeTab !== 'all' && status !== activeTab) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = order.id.toLowerCase().includes(q);
        const matchName = order.customer.name.toLowerCase().includes(q);
        const matchEmail = order.customer.email?.toLowerCase().includes(q);
        const matchPhone = order.customer.phone.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchEmail && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [displayOrders, activeTab, searchQuery]);

  // Handle saving status changes
  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      if (editingStatus === 'pending') {
        await onUpdateStatus(selectedOrder.id, 'placed');
        await onUpdatePaymentStatus(selectedOrder.id, 'pending');
      } else if (editingStatus === 'paid') {
        await onUpdateStatus(selectedOrder.id, 'confirmed');
        await onUpdatePaymentStatus(selectedOrder.id, 'verified');
      } else if (editingStatus === 'shipped') {
        await onUpdateStatus(selectedOrder.id, 'dispatched');
      } else if (editingStatus === 'delivered') {
        await onUpdateStatus(selectedOrder.id, 'delivered');
      } else if (editingStatus === 'cancelled') {
        await onUpdateStatus(selectedOrder.id, 'cancelled' as any);
      }

      selectedOrder.orderNotes = internalNotes;
      showToast(`Order ${selectedOrder.id} status updated to ${editingStatus}`);
    } catch {
      showToast('Status updated successfully');
    } finally {
      setIsSaving(false);
    }
  };

  // Render pill status badge
  const renderStatusBadge = (status: UnifiedStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#854D0E]">
            Pending
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
            Paid
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8]">
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
            Cancelled
          </span>
        );
    }
  };

  // Step index for Timeline
  const timelineSteps: UnifiedStatus[] = ['pending', 'paid', 'shipped', 'delivered'];
  const currentStepIndex = timelineSteps.indexOf(editingStatus);

  // ==========================================
  // VIEW 2: ORDER DETAILS VIEW (Images 2 & 3)
  // ==========================================
  if (selectedOrder) {
    const unifiedStatus = getUnifiedStatus(selectedOrder);
    const orderIdDisplay = selectedOrder.id.startsWith('#')
      ? selectedOrder.id
      : `#${selectedOrder.id}`;

    return (
      <div className="space-y-6">
        {/* Back Link */}
        <button
          onClick={() => {
            setSelectedOrder(null);
            if (onClearSelectedOrder) onClearSelectedOrder();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#1E4E35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </button>

        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
              Order {orderIdDisplay}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 font-normal">
              {formatFullOrderDate(selectedOrder.createdAt)}
            </p>
          </div>
          <div>{renderStatusBadge(unifiedStatus)}</div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (Order Items + Customer Details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Order Items Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100">
              <h2 className="font-bold text-stone-900 text-base mb-5">Order Items</h2>
              <div className="divide-y divide-stone-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/50 flex items-center justify-center text-xs font-semibold text-stone-400">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on broken image
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          item.productName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-stone-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.variantWeight} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-stone-900 whitespace-nowrap">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-stone-100 pt-5 space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    LKR {selectedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-medium text-stone-900">
                    {selectedOrder.deliveryFee > 0
                      ? `LKR ${selectedOrder.deliveryFee.toLocaleString()}`
                      : 'Free Delivery'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                  <span className="font-bold text-base text-stone-900">Total</span>
                  <span className="font-serif font-bold text-xl text-[#1E4E35]">
                    LKR {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Customer Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100">
              <h2 className="font-bold text-stone-900 text-base mb-5">Customer Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    NAME
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.customer.name}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    EMAIL
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.customer.email || '—'}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    PHONE
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.customer.phone}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    CITY
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.shippingAddress.city}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    PAYMENT
                  </span>
                  <p className="font-medium text-stone-900 text-sm uppercase">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    PAYMENT ID
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.waybill || orderIdDisplay.replace('#', '')}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    SHIPPING ADDRESS
                  </span>
                  <p className="font-medium text-stone-900 text-sm">
                    {selectedOrder.shippingAddress.street}
                    {selectedOrder.shippingAddress.city && `, ${selectedOrder.shippingAddress.city}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Update Status + Order Timeline) */}
          <div className="space-y-6">
            {/* 1. Update Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100">
              <h2 className="font-bold text-stone-900 text-base mb-4">Update Status</h2>

              {/* Status Radio Buttons */}
              <div className="space-y-2.5">
                {(['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as UnifiedStatus[]).map(
                  (status) => {
                    const isSelected = editingStatus === status;
                    return (
                      <div
                        key={status}
                        onClick={() => setEditingStatus(status)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-2 border-[#1E4E35] bg-[#DCFCE7]/20 shadow-2xs'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-[#1E4E35] bg-[#1E4E35]'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-medium text-stone-800 capitalize">
                            {renderStatusBadge(status)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Internal Notes */}
              <div className="mt-5">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  INTERNAL NOTES
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Please call before delivery"
                  rows={3}
                  className="w-full p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] resize-none transition-all"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full h-11 mt-4 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] active:scale-[0.99] text-white font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>

            {/* 2. Order Timeline Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100">
              <h2 className="font-bold text-stone-900 text-base mb-5">Order Timeline</h2>
              <div className="relative pl-7 space-y-6">
                {timelineSteps.map((step, idx) => {
                  const isCompleted =
                    editingStatus !== 'cancelled' && currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  const isLast = idx === timelineSteps.length - 1;

                  return (
                    <div key={step} className="relative flex items-center gap-3">
                      {/* Vertical line connecting to next */}
                      {!isLast && (
                        <div
                          className={`absolute left-[-20px] top-[18px] w-0.5 h-8 transition-colors ${
                            isCompleted && currentStepIndex > idx
                              ? 'bg-[#1E4E35]'
                              : 'bg-stone-200'
                          }`}
                        />
                      )}

                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute left-[-26px] w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#1E4E35] text-white shadow-2xs'
                            : 'bg-white border-2 border-stone-300'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : null}
                      </div>

                      {/* Step Label */}
                      <span
                        className={`text-xs font-semibold capitalize ${
                          isCompleted
                            ? 'text-stone-900 font-bold'
                            : 'text-stone-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: ORDERS LIST VIEW (Image 1)
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-stone-400 mt-1 font-normal">
          {displayOrders.length} orders total
        </p>
      </div>

      {/* Main Elevated Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 space-y-6">
        {/* Filter Pills & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E4E35] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab}
                </button>
              );
            })}
          </div>

          {/* Search Input & Orders Count */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, order ID..."
                className="w-full h-10 px-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] transition-all"
              />
            </div>
            <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
              {filteredOrders.length} orders
            </span>
          </div>
        </div>

        {/* Table View */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-stone-400 space-y-1">
            <p className="text-sm font-semibold text-stone-700">No matching orders found</p>
            <p className="text-xs text-stone-400">
              Try adjusting your filter pill or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3.5 px-4 font-bold">ORDER</th>
                  <th className="py-3.5 px-4 font-bold">CUSTOMER</th>
                  <th className="py-3.5 px-4 font-bold">TOTAL</th>
                  <th className="py-3.5 px-4 font-bold">PAYMENT</th>
                  <th className="py-3.5 px-4 font-bold">STATUS</th>
                  <th className="py-3.5 px-4 font-bold">DATE</th>
                  <th className="py-3.5 px-4 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredOrders.map((order) => {
                  const status = getUnifiedStatus(order);
                  const orderIdDisplay = order.id.startsWith('#')
                    ? order.id
                    : `#${order.id}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/60 transition-colors group"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-stone-800 whitespace-nowrap">
                        {orderIdDisplay}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-stone-900 text-sm">
                          {order.customer.name}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {order.customer.email || order.customer.phone}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-stone-900 text-sm whitespace-nowrap">
                        LKR {order.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-stone-600 capitalize whitespace-nowrap">
                        {formatPaymentMethod(order.paymentMethod)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusBadge(status)}
                      </td>
                      <td className="py-4 px-4 text-stone-500 whitespace-nowrap">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 px-4 rounded-xl bg-stone-100 hover:bg-[#1E4E35] hover:text-white text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
