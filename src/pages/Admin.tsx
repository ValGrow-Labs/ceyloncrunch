import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, OrderStatus, PaymentStatus } from '../lib/store';
import { formatRs } from '../data/products';
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
  X,
  FileText,
  Database,
  RefreshCw,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { seedProductsToSupabase } from '../lib/seedDatabase';

export const Admin: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    orders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    products,
    updateProductStock,
    inquiries,
    showToast,
  } = useStore();

  // Password gate input (Demo password: crunch-admin)
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'config' | 'inquiries'>('orders');

  // Website Configuration State
  const [siteConfig, setSiteConfig] = useState({
    storeName: 'Ceylon Crunch - Artisan Provisions',
    announcementBanner: 'Free island-wide delivery on orders over Rs. 5,000 · Small-Batch Freshness Guaranteed',
    freeDeliveryThreshold: 5000,
    standardDeliveryFee: 450,
    payhereMerchantId: '1228491',
    payhereMode: 'sandbox',
    bankDetails: 'Commercial Bank of Ceylon · Acc: 1000482910 · Ceylon Crunch (Pvt) Ltd',
    contactEmail: 'ceyloncrunch26@gmail.com',
    contactPhone: '+94 77 944 3867',
    supabaseProjectUrl: 'https://ceyloncrunch-db.supabase.co',
    supabaseStorageBucket: 'product-images',
  });

  // Orders filters
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [viewingOrderSlip, setViewingOrderSlip] = useState<{ id: string; slipUrl: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    showToast('Connecting to Supabase and syncing catalog...');
    const result = await seedProductsToSupabase();
    setIsSeeding(false);
    showToast(result.message);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput.trim());
    if (success) {
      setPasswordError(false);
      showToast('Logged in as Ceylon Crunch Atelier Administrator');
    } else {
      setPasswordError(true);
      showToast('Incorrect administrator password. (Demo: crunch-admin)');
    }
  };

  // If not authenticated, show password gate
  if (!isAdmin) {
    return (
      <div className="py-20 flex flex-col items-center justify-center max-w-sm mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#1F3D2B] text-center mb-1">
          Atelier Admin Portal
        </h1>
        <p className="text-xs text-[#6B6B6B] text-center mb-6">
          Supabase Admin Authentication • Manage products, orders, PayHere payments &amp; website configuration.
        </p>

        <form onSubmit={handleLogin} className="w-full bg-white border border-[#EADFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1F3D2B] block mb-1">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8B5E3C] absolute left-3.5" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                placeholder="Enter password..."
                className="w-full h-11 pl-10 pr-3.5 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-[#B3261E] mt-1">
                Incorrect password. Please try again.
              </p>
            )}
            {/* Demo Password Hint for user */}
            <p className="text-[11px] text-[#8B5E3C] mt-2 font-medium">
              Demo Access: Use <code className="bg-[#f0eded] px-1.5 py-0.5 rounded text-[#1F3D2B] font-mono">crunch-admin</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Login to Console</span>
          </button>
        </form>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders
    .filter((o) => {
      if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.toLowerCase().includes(q);
        return matchId || matchName || matchPhone;
      }
      return true;
    });

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EADFD0] pb-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
              Supabase PostgreSQL &amp; Storage Connected • PayHere Active
            </span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1F3D2B] mt-0.5">
            Store Administration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logoutAdmin}
            className="h-9 px-4 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] border border-[#EADFD0] text-xs font-semibold text-[#1F3D2B] flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#EADFD0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Order Management ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Product &amp; Stock Management ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'config'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Website Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'inquiries'
              ? 'bg-[#1F3D2B] text-white shadow-xs'
              : 'bg-white text-[#2B2B2B] border border-[#EADFD0] hover:bg-[#f6f3f2]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EADFD0]">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8B5E3C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search order ID, recipient name, phone..."
                className="w-full h-9 pl-9 pr-3 bg-[#f6f3f2] rounded-xl text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] border border-[#EADFD0]"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['all', 'placed', 'confirmed', 'packed', 'dispatched', 'delivered'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize border transition-all ${
                    orderFilterStatus === st
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                      : 'bg-white text-[#6B6B6B] border-[#EADFD0]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4"
                >
                  {/* Top Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADFD0]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#1F3D2B]">
                        #{order.id}
                      </span>
                      <span className="text-xs text-[#6B6B6B]">• {order.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B6B6B]">Total:</span>
                      <span className="font-serif text-base font-bold text-[#1F3D2B] tabular-nums">
                        {formatRs(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Shipping Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#424843]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Customer
                      </span>
                      <span className="font-bold text-[#1F3D2B] block">{order.customer.name}</span>
                      <span>{order.customer.phone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Destination
                      </span>
                      <span className="truncate block">{order.shippingAddress.street}</span>
                      <span>
                        {order.shippingAddress.city}, {order.shippingAddress.district}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">
                        Payment & Method
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold uppercase text-[#1F3D2B]">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'received'
                              ? 'bg-[#c8ebd1] text-[#022111]'
                              : 'bg-[#ffdeaa] text-[#271900]'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      {order.paymentSlipUrl && (
                        <button
                          type="button"
                          onClick={() => setViewingOrderSlip({ id: order.id, slipUrl: order.paymentSlipUrl! })}
                          className="mt-1 text-[11px] text-[#8B5E3C] font-semibold underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Uploaded Slip</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="bg-[#f6f3f2] p-2.5 rounded-xl border border-[#EADFD0] text-xs">
                    <span className="font-bold text-[#1F3D2B] block mb-1">Items in Parcel:</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((i, idx) => (
                        <span key={idx} className="bg-white px-2 py-1 rounded-md border border-[#EADFD0] text-[11px]">
                          {i.quantity}x {i.productName} ({i.variantWeight})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#EADFD0]/60">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-[#1F3D2B]">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value as OrderStatus);
                          showToast(`Order #${order.id} status updated to ${e.target.value}`);
                        }}
                        className="h-8 px-2.5 bg-white border border-[#EADFD0] rounded-lg text-xs font-semibold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.paymentStatus !== 'received' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderPaymentStatus(order.id, 'received');
                            showToast(`Payment marked as received for #${order.id}`);
                          }}
                          className="h-8 px-3 rounded-full bg-[#c8ebd1] hover:bg-[#b0dfbe] text-[#022111] text-xs font-semibold transition-colors"
                        >
                          Mark Payment Received
                        </button>
                      )}
                      <Link
                        to={`/track?order=${order.id}&phone=${encodeURIComponent(order.customer.phone.replace('+94', '').trim())}`}
                        target="_blank"
                        className="h-8 px-3 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold flex items-center gap-1 border border-[#EADFD0] transition-colors"
                      >
                        <span>View Tracking Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-xs text-[#6B6B6B]">
                No orders match your filter criteria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-2xs">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
              Live Small-Batch Inventory
            </h2>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Edit pack availability directly. Changes take effect across product pages and checkout immediately.
            </p>

            <div className="space-y-4 divide-y divide-[#EADFD0]">
              {products.map((prod) => (
                <div key={prod.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                        {prod.name}
                      </h3>
                      <span className="text-xs text-[#8B5E3C]">{prod.origin}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {prod.variants.map((v) => (
                      <div
                        key={v.id}
                        className="p-3 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1F3D2B]">{v.weight}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              v.stock === 0
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : v.stock <= 10
                                ? 'bg-[#ffdcc5] text-[#301400]'
                                : 'bg-[#c8ebd1] text-[#022111]'
                            }`}
                          >
                            {v.stock === 0 ? 'Out of Stock' : v.stock <= 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#6B6B6B]">{formatRs(v.price)}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-[#6B6B6B]">Stock:</span>
                            <input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                  updateProductStock(prod.id, v.id, val);
                                }
                              }}
                              className="w-16 h-7 px-2 bg-white border border-[#EADFD0] rounded text-center text-xs font-bold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
                Website &amp; Gateway Configuration
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Manage storefront announcement banners, delivery rules, PayHere payment gateway credentials, Bank Transfer accounts, and Supabase PostgreSQL/Storage settings.
              </p>
            </div>

            {/* Supabase Integration Live Card */}
            <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-[#c8ebd1]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#1F3D2B]">
                      Supabase Cloud Backend
                    </h3>
                    <p className="text-[11px] text-[#6B6B6B]">
                      PostgreSQL Database, Storage Buckets &amp; Realtime Engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      isSupabaseConfigured
                        ? 'bg-[#c8ebd1]/50 text-[#022111] border-[#a0dbb0]'
                        : 'bg-[#ffdcc5]/60 text-[#451e00] border-[#fdc39a]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSupabaseConfigured ? 'bg-[#2E7D4F] animate-pulse' : 'bg-[#D97706]'
                      }`}
                    />
                    <span>{isSupabaseConfigured ? 'Connected & Active' : 'Local Mode (Awaiting .env Keys)'}</span>
                  </span>

                  <button
                    type="button"
                    disabled={isSeeding || !isSupabaseConfigured}
                    onClick={handleSeedDatabase}
                    className="h-8 px-3.5 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-[11px] font-semibold inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Syncing...' : 'Sync Catalog to Supabase'}</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#6B6B6B] leading-relaxed pt-2 border-t border-[#EADFD0]/60 flex flex-col sm:flex-row justify-between gap-2">
                <span>
                  Migration SQL available in project: <code className="bg-white px-1.5 py-0.5 rounded border border-[#EADFD0] text-[#1F3D2B] font-mono">supabase/schema.sql</code>
                </span>
                <span className="text-[#8B5E3C]">
                  Tables: <code className="font-mono">products, variants, orders, reviews, inquiries</code>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Storefront Title</label>
                <input
                  type="text"
                  value={siteConfig.storeName}
                  onChange={(e) => setSiteConfig({ ...siteConfig, storeName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={siteConfig.announcementBanner}
                  onChange={(e) => setSiteConfig({ ...siteConfig, announcementBanner: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Free Delivery Threshold (Rs.)</label>
                <input
                  type="number"
                  value={siteConfig.freeDeliveryThreshold}
                  onChange={(e) => setSiteConfig({ ...siteConfig, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Standard Island Delivery Fee (Rs.)</label>
                <input
                  type="number"
                  value={siteConfig.standardDeliveryFee}
                  onChange={(e) => setSiteConfig({ ...siteConfig, standardDeliveryFee: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">PayHere Merchant ID</label>
                <input
                  type="text"
                  value={siteConfig.payhereMerchantId}
                  onChange={(e) => setSiteConfig({ ...siteConfig, payhereMerchantId: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">PayHere Gateway Environment</label>
                <select
                  value={siteConfig.payhereMode}
                  onChange={(e) => setSiteConfig({ ...siteConfig, payhereMode: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                >
                  <option value="sandbox">Sandbox (Testing Mode)</option>
                  <option value="live">Production (Live PayHere Gateway)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Direct Bank Transfer Account Details</label>
                <input
                  type="text"
                  value={siteConfig.bankDetails}
                  onChange={(e) => setSiteConfig({ ...siteConfig, bankDetails: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Supabase PostgreSQL Project URL</label>
                <input
                  type="text"
                  value={siteConfig.supabaseProjectUrl}
                  onChange={(e) => setSiteConfig({ ...siteConfig, supabaseProjectUrl: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F3D2B] block mb-1">Supabase Image Storage Bucket</label>
                <input
                  type="text"
                  value={siteConfig.supabaseStorageBucket}
                  onChange={(e) => setSiteConfig({ ...siteConfig, supabaseStorageBucket: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Website & Supabase configuration saved successfully!')}
                className="h-10 px-6 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Save Website Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-2xs">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B] mb-1">
              Customer Inquiries
            </h2>
            <p className="text-xs text-[#6B6B6B] mb-4">
              Messages received from the Contact page and corporate concierge requests.
            </p>

            <div className="space-y-3">
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl space-y-2 text-xs text-[#424843]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADFD0]/60 pb-2">
                      <div>
                        <span className="font-bold text-[#1F3D2B] text-sm block">{inq.name}</span>
                        <span className="text-[11px] text-[#6B6B6B]">
                          {inq.email} • {inq.phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#8B5E3C] block">{inq.subject}</span>
                        <span className="text-[10px] text-[#6B6B6B]">{inq.createdAt}</span>
                      </div>
                    </div>

                    <p className="leading-relaxed text-[#2B2B2B] pt-1 italic">
                      "{inq.message}"
                    </p>

                    <div className="pt-2 flex justify-end">
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                        className="px-3 py-1 rounded-full bg-[#1F3D2B] text-white text-[11px] font-semibold hover:bg-[#162C1F] transition-colors"
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-[#6B6B6B]">
                  No customer inquiries received yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Slip Preview Modal */}
      {viewingOrderSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setViewingOrderSlip(null)}
          />
          <div className="relative bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EADFD0] pb-2">
              <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                Bank Payment Slip for #{viewingOrderSlip.id}
              </h3>
              <button
                type="button"
                onClick={() => setViewingOrderSlip(null)}
                className="w-7 h-7 rounded-full bg-[#f0eded] flex items-center justify-center text-[#2B2B2B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-[#f6f3f2] p-2 rounded-xl border border-[#EADFD0]">
              <img
                src={viewingOrderSlip.slipUrl}
                alt="Bank Transfer Slip"
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                updateOrderPaymentStatus(viewingOrderSlip.id, 'received');
                showToast(`Payment verified for #${viewingOrderSlip.id}`);
                setViewingOrderSlip(null);
              }}
              className="w-full h-11 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold hover:bg-[#162C1F]"
            >
              Verify & Approve Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
