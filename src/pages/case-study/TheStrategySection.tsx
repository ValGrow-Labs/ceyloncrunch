import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  ListFilter,
  ShoppingCart,
  CheckCircle,
  CreditCard,
  Truck,
  LayoutDashboard,
  Boxes,
  Database,
  BarChart3,
  Sliders,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const TheStrategySection: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'customer' | 'merchant'>('customer');
  const [selectedNode, setSelectedNode] = useState<number>(0);

  const customerSteps = [
    {
      title: 'Customer Discovery',
      icon: User,
      desc: 'Mobile-first landing page with editorial storytelling, seasonal banners, and brand philosophy.',
      payload: '{ referrer: "direct/instagram", device: "mobile-webkit", session: "active" }',
      protocol: 'HTTPS / HTTP3 edge delivery',
    },
    {
      title: 'Product Catalog',
      icon: ListFilter,
      desc: 'Instant category filtering (Nuts, Dried Fruits, Dates, Seeds, Spices, Hampers) without reloads.',
      payload: '{ category: "nuts", filter: "in_stock", queryTime: "12ms" }',
      protocol: 'Supabase Realtime Cached Index',
    },
    {
      title: 'Variant & Cart',
      icon: ShoppingCart,
      desc: 'Interactive 100g to 1kg weight selection with dynamic pricing, inventory validation, and cart drawer.',
      payload: '{ variantId: "var-cashew-250g", price: 1850, stock: 48, qty: 2 }',
      protocol: 'Client LocalStorage + Session Sync',
    },
    {
      title: '1-Page Checkout',
      icon: ShoppingBag,
      desc: 'Streamlined checkout with phone normalization, 25-district tariff calculator, and gift card notes.',
      payload: '{ phone: "94771234567", district: "Colombo", deliveryFee: 350 }',
      protocol: 'Atomic Form Validation via Zod',
    },
    {
      title: 'Multi-Rail Payment',
      icon: CreditCard,
      desc: 'PayHere MD5 signature gateway, direct bank slip upload to cloud storage, or Cash on Delivery.',
      payload: '{ method: "payhere", md5_hash: "A8F90...3B", currency: "LKR" }',
      protocol: 'Encrypted Serverless RPC',
    },
    {
      title: 'Order Tracking',
      icon: CheckCircle,
      desc: 'Unique CC-XXXXXX reference creation, live 5-step status pipeline, and courier waybill assignment.',
      payload: '{ orderId: "CC-842915", waybill: "CLN-48291054-LK", status: "confirmed" }',
      protocol: 'PostgreSQL Realtime Broadcast',
    },
    {
      title: 'Doorstep Delivery',
      icon: Truck,
      desc: 'Direct courier handoff with standardized label, SMS dispatch updates, and verified delivery receipt.',
      payload: '{ courier: "Colombo Urban Courier", eta: "24-48 hours", status: "delivered" }',
      protocol: 'Automated Waybill Dispatch',
    },
  ];

  const merchantSteps = [
    {
      title: 'Admin Dashboard',
      icon: LayoutDashboard,
      desc: 'Central command console with high-level KPI cards, live order stream, and daily revenue stats.',
      payload: '{ dailyRevenue: 1420500, pendingOrders: 14, unreadInquiries: 3 }',
      protocol: 'Supabase Auth RBAC Protected',
    },
    {
      title: 'Product Management',
      icon: Boxes,
      desc: 'Full CRUD operations for snack items, rich image uploads, tasting notes, and AI description generation.',
      payload: '{ productId: "prod-almonds", action: "update_price", variant: "500g" }',
      protocol: 'Supabase Storage CDN + REST API',
    },
    {
      title: 'Real-Time Inventory',
      icon: Database,
      desc: 'Atomic stock level controller across all weight variants with immediate low-stock visual flags.',
      payload: '{ variant: "pistachio-100g", currentStock: 8, thresholdAlert: true }',
      protocol: 'PostgreSQL Row-Level Sync',
    },
    {
      title: 'Live Order Center',
      icon: CheckCircle,
      desc: 'Kanban & table views for instant order status transitions, bank slip approval, and waybill printing.',
      payload: '{ orderId: "CC-842915", newStatus: "packed", verifiedBy: "Admin" }',
      protocol: 'Server-Side Webhook Pipeline',
    },
    {
      title: 'Visual Headless CMS',
      icon: Sliders,
      desc: 'No-code controls for announcement bar text, hero banners, delivery tariffs, and promotional ribbons.',
      payload: '{ announcement: "Free delivery islandwide on orders over Rs. 5,000" }',
      protocol: 'Global Site Settings Table',
    },
    {
      title: 'Analytics & CRM',
      icon: BarChart3,
      desc: 'Customer lifetime value, corporate gifting leads, repeat buyer metrics, and email export.',
      payload: '{ subscribers: 842, aov: 4153, repeatCustomerRate: "68%" }',
      protocol: 'Realtime Aggregated Analytics',
    },
  ];

  const currentSteps = activeWorkflow === 'customer' ? customerSteps : merchantSteps;
  const activeNodeData = currentSteps[selectedNode] || currentSteps[0];

  return (
    <section id="strategy" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            03 // Connected Ecosystem
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            One Ecosystem. <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Every Operation</span> Connected.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Rather than stitching together disparate third-party plugins, ValGrow Labs architected an integrated commerce ecosystem where every customer action seamlessly feeds back-office operations.
          </p>
        </div>

        {/* Workflow Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            onClick={() => {
              setActiveWorkflow('customer');
              setSelectedNode(0);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeWorkflow === 'customer'
                ? 'bg-[#1F3D2B] text-white shadow-sm'
                : 'bg-white text-[#202820] border border-[#EADFD0] hover:bg-[#FBF7F0]'
            }`}
          >
            Customer Shopping Journey (7 Steps)
          </button>

          <button
            onClick={() => {
              setActiveWorkflow('merchant');
              setSelectedNode(0);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeWorkflow === 'merchant'
                ? 'bg-[#1F3D2B] text-white shadow-sm'
                : 'bg-white text-[#202820] border border-[#EADFD0] hover:bg-[#FBF7F0]'
            }`}
          >
            Merchant Operations Workflow (6 Modules)
          </button>
        </div>

        {/* Interactive Horizontal Flow Ribbon */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] p-6 sm:p-8 shadow-sm mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max gap-3 py-2">
            {currentSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = selectedNode === idx;
              return (
                <React.Fragment key={step.title}>
                  <button
                    onClick={() => setSelectedNode(idx)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md scale-102'
                        : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:border-[#1F3D2B]/30 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-[#D9A441]' : 'bg-white text-[#1F3D2B]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`text-[9px] uppercase font-mono tracking-widest block ${
                          isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                        }`}
                      >
                        Step 0{idx + 1}
                      </span>
                      <span className="font-serif font-bold text-xs sm:text-sm whitespace-nowrap">
                        {step.title}
                      </span>
                    </div>
                  </button>

                  {idx < currentSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#8B5E3C]/40 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Card */}
        <div className="bg-white rounded-3xl border border-[#EADFD0] p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8B5E3C] uppercase tracking-wider">
              <Info className="w-4 h-4 text-[#D9A441]" />
              <span>Step 0{selectedNode + 1} System Specification</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
              {activeNodeData.title}
            </h3>
            <p className="text-sm text-[#202820]/80 leading-relaxed font-sans">
              {activeNodeData.desc}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#2E7D4F] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2E7D4F]" />
              <span>Protocol: {activeNodeData.protocol}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#162C1F] rounded-2xl p-4 font-mono text-[11px] text-[#D9A441] space-y-1.5 overflow-x-auto shadow-inner">
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-sans mb-1">
              Live State Payload Example:
            </div>
            <pre className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {activeNodeData.payload}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
