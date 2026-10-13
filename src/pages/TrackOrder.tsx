import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatRs } from '../data/products';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  MapPin,
  MessageCircle,
  HelpCircle,
  RotateCcw,
  Edit2,
  Lock,
  Package,
} from 'lucide-react';

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lookupOrder, orders, showToast } = useStore();

  const urlOrder = searchParams.get('order') || '';
  const urlPhone = searchParams.get('phone') || '';

  // Local lookup form inputs
  const [orderInput, setOrderInput] = useState(urlOrder || 'CC-000123');
  const [phoneInput, setPhoneInput] = useState(urlPhone || '77 123 4567');
  const [hasSearched, setHasSearched] = useState(Boolean(urlOrder && urlPhone));

  const [copiedWaybill, setCopiedWaybill] = useState(false);

  // If query params exist on mount, perform search
  useEffect(() => {
    if (urlOrder) {
      setOrderInput(urlOrder);
      if (urlPhone) {
        setPhoneInput(urlPhone);
        setHasSearched(true);
      }
    }
  }, [urlOrder, urlPhone]);

  // Find order
  const activeOrder = hasSearched ? lookupOrder(orderInput, phoneInput) : null;

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim() || !phoneInput.trim()) {
      showToast('Please enter both Order Reference Number and Phone Number.');
      return;
    }
    setHasSearched(true);
    setSearchParams({ order: orderInput.trim(), phone: phoneInput.trim() });
  };

  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(true);
    showToast('Consignment waybill copied to clipboard');
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-2xl mx-auto">
      {/* Top Navigation & Return Link */}
      <div className="flex items-center justify-between mb-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] transition-colors py-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Shop</span>
        </Link>
        <span className="text-[11px] font-semibold text-[#6B6B6B] bg-[#f0eded] border border-[#EADFD0] px-3 py-1 rounded-full">
          Provisions Dispatch
        </span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-[#424843] mt-1 leading-relaxed">
          Follow your handcrafted Ceylon harvest provisions from single-estate orchard to your doorstep.
        </p>
      </div>

      {/* VIEW A: LOOKUP FORM (when not yet searched or when toggled to edit) */}
      {!hasSearched ? (
        <div className="bg-white border border-[#EADFD0] p-6 rounded-2xl shadow-sm flex flex-col gap-5">
          <div>
            <span className="text-[11px] font-sans uppercase font-bold text-[#8B5E3C] tracking-wider">
              Consignment Search
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1F3D2B] mt-1">
              Locate Your Harvest Parcel
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Input your 6-digit order identifier and registered contact telephone to fetch realtime dispatch milestones.
            </p>
          </div>

          <form onSubmit={handleLookupSubmit} className="flex flex-col gap-4">
            {/* Order Reference Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="track-order-id">
                Order Reference Number
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#8B5E3C] absolute left-3.5">
                  tag
                </span>
                <input
                  id="track-order-id"
                  type="text"
                  required
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  placeholder="e.g. CC-000123"
                  className="w-full h-12 pl-10 pr-4 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              <span className="text-[11px] text-[#6B6B6B]">
                Found in your SMS receipt and order confirmation.
              </span>
            </div>

            {/* Recipient Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="track-phone">
                Recipient Mobile Contact
              </label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 h-12 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs font-semibold text-[#1F3D2B] select-none shrink-0">
                  <span className="mr-1">🇱🇰</span> +94
                </div>
                <input
                  id="track-phone"
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="77 123 4567"
                  className="w-full h-12 px-3.5 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>
              <span className="text-[11px] text-[#6B6B6B]">
                Enter registered contact number (e.g. 77 123 4567).
              </span>
            </div>

            {/* Privacy note */}
            <div className="p-3 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl flex items-start gap-2.5 text-xs text-[#424843]">
              <Lock className="w-4 h-4 text-[#8B5E3C] shrink-0 mt-0.5" />
              <p className="leading-snug">
                Your privacy is guarded. Mobile verification ensures only authorized order details and residence addresses are rendered.
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Search className="w-4 h-4" />
              <span>Track Order Now</span>
            </button>
          </form>

          {/* Quick Demo Seed Order Helper Chips */}
          <div className="pt-3 border-t border-[#EADFD0]">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8B5E3C] block mb-2">
              Try Seeded Demo Orders:
            </span>
            <div className="flex flex-wrap gap-2">
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setOrderInput(o.id);
                    setPhoneInput(o.customer.phone.replace('+94', '').trim());
                    setHasSearched(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] border border-[#EADFD0] text-xs font-medium text-[#1F3D2B] transition-colors"
                >
                  #{o.id} ({o.status})
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : activeOrder ? (
        /* VIEW B: ACTIVE TRACKING (DISPATCHED / ACTIVE STATUS) VIEW */
        <div className="flex flex-col gap-5">
          {/* Query Modifier Card */}
          <div className="bg-white border border-[#EADFD0] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#EADFD0]/60">
              <span className="text-xs uppercase font-bold tracking-wider text-[#8B5E3C] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Live Order Lookup
              </span>
              <span className="text-xs font-semibold text-[#2E7D4F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
                Live Tracking
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#f6f3f2] border border-[#EADFD0] px-3.5 py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase">Order ID</span>
                <span className="font-serif text-base font-bold text-[#1F3D2B]">#{activeOrder.id}</span>
              </div>
              <div className="bg-[#f6f3f2] border border-[#EADFD0] px-3.5 py-2 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] text-[#6B6B6B] font-bold uppercase">Phone Number</span>
                <span className="font-serif text-base font-bold text-[#1F3D2B] truncate">
                  {activeOrder.customer.phone}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasSearched(false)}
              className="w-full py-2.5 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#EADFD0]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Change Lookup Details</span>
            </button>
          </div>

          {/* Result Primary Status Card */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs text-[#6B6B6B]">Waybill #{activeOrder.waybill}</span>
                <h2 className="font-serif text-2xl font-bold text-[#1F3D2B] mt-0.5">
                  Order #{activeOrder.id}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8ebd1] text-[#022111] text-xs font-bold tracking-wide capitalize shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D2B] animate-ping" />
                {activeOrder.status === 'dispatched'
                  ? 'In Transit'
                  : activeOrder.status === 'delivered'
                  ? 'Delivered'
                  : activeOrder.status}
              </span>
            </div>

            <div className="bg-[#f6f3f2] border border-[#EADFD0] rounded-xl p-3.5 mb-3">
              <span className="text-[10px] text-[#8B5E3C] font-bold uppercase tracking-wider block mb-0.5">
                Estimated Arrival
              </span>
              <span className="font-serif text-lg font-bold text-[#1F3D2B]">
                {activeOrder.estimatedArrival}
              </span>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Dispatched from Colombo central botanical packaging facility
              </p>
            </div>

            <div className="flex items-center justify-between text-[#6B6B6B] text-xs pt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#8B5E3C]">calendar_today</span>
                {activeOrder.createdAt}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#1F3D2B]">
                <Package className="w-4 h-4 text-[#8B5E3C]" />
                {activeOrder.items.length} Artisan Items ({formatRs(activeOrder.total)})
              </span>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-[#EADFD0] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                Fulfillment Journey
              </h3>
              <span className="text-xs text-[#8B5E3C] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">eco</span>
                <span>Estate Fresh</span>
              </span>
            </div>

            <div className="relative pl-6 flex flex-col gap-6">
              {/* Connecting background vertical line */}
              <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-[#EADFD0]" />

              {activeOrder.timeline.map((step, idx) => {
                const isCurrent = step.status === activeOrder.status;

                return (
                  <div key={idx} className="relative flex items-start">
                    {/* Step Icon Badge */}
                    <div
                      className={`absolute -left-[24px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs z-10 ${
                        step.completed
                          ? 'bg-[#1F3D2B] text-white ring-2 ring-[#c8ebd1]'
                          : isCurrent
                          ? 'bg-[#D9A441] text-[#1F3D2B] ring-4 ring-[#ffdeaa]'
                          : 'bg-[#f0eded] text-[#6B6B6B]'
                      }`}
                    >
                      {step.completed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="pl-3 w-full">
                      <div
                        className={
                          isCurrent
                            ? 'bg-[#f6f3f2] border border-[#EADFD0] p-3.5 rounded-xl shadow-xs'
                            : ''
                        }
                      >
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-semibold leading-snug ${
                              step.completed || isCurrent ? 'text-[#1F3D2B]' : 'text-[#6B6B6B]'
                            }`}
                          >
                            {step.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-bold text-[#8B5E3C] bg-[#ffdcc5] px-2 py-0.5 rounded-full">
                              Current Step
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                          {step.timestamp} • {step.description}
                        </p>
                        {step.location && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#1F3D2B] font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#8B5E3C]" />
                            <span>{step.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Shipping Specification */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                Shipping Specification
              </h3>
              <span className="text-xs text-[#2E7D4F] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Insured Transit</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f6f3f2] border border-[#EADFD0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B]">
                  <Truck className="w-5 h-5 text-[#8B5E3C]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6B6B] uppercase font-bold block">Logistics Partner</span>
                  <p className="font-serif text-sm font-bold text-[#1F3D2B]">Certis Lanka / Pronto</p>
                </div>
              </div>
              <span className="text-xs bg-white border border-[#EADFD0] px-2.5 py-1 rounded-full text-[#8B5E3C] font-semibold">
                Express Parcel
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#EADFD0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B6B6B] uppercase font-bold block">Consignment Waybill</span>
                <span className="font-mono text-sm font-bold text-[#1F3D2B] tracking-wide">
                  {activeOrder.waybill}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyWaybill(activeOrder.waybill)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADFD0] text-[#1F3D2B] text-xs font-semibold hover:bg-[#EADFD0]/40 transition-colors shadow-2xs active:scale-95"
              >
                {copiedWaybill ? <Check className="w-3.5 h-3.5 text-[#2E7D4F]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWaybill ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Destination Address */}
            <div className="flex flex-col gap-1 pt-1 text-xs">
              <span className="text-[10px] text-[#6B6B6B] uppercase font-bold">Destination Address</span>
              <p className="font-serif text-sm font-bold text-[#1F3D2B]">{activeOrder.customer.name}</p>
              <p className="text-[#424843]">
                {activeOrder.shippingAddress.street}
                {activeOrder.shippingAddress.landmark ? `, ${activeOrder.shippingAddress.landmark}` : ''}
                <br />
                {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.district}{' '}
                {activeOrder.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          {/* Provisions in Parcel Summary */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#EADFD0] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                Provisions in Parcel
              </h3>
              <span className="text-xs font-semibold text-[#8B5E3C]">
                {activeOrder.items.length} Items Total
              </span>
            </div>

            <div className="flex flex-col gap-3 divide-y divide-[#EADFD0]/60">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover bg-[#f6f3f2] border border-[#EADFD0] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs sm:text-sm font-semibold text-[#1F3D2B] truncate">
                      {item.productName}
                    </h5>
                    <span className="text-[11px] text-[#6B6B6B]">
                      {item.variantWeight} • Qty {item.quantity}
                    </span>
                  </div>
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#1F3D2B] tabular-nums shrink-0">
                    {formatRs(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 bg-[#f6f3f2] border border-[#EADFD0] p-3 rounded-xl flex items-center justify-between text-xs font-bold text-[#1F3D2B]">
              <span>Total Billed Amount ({activeOrder.paymentMethod.toUpperCase()})</span>
              <span className="font-serif text-base tabular-nums">{formatRs(activeOrder.total)}</span>
            </div>
          </div>

          {/* WhatsApp Support Card */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                  Need Delivery Assistance?
                </h4>
                <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                  Have a gate delivery note or access code? Chat live with our Colombo fulfillment team.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/94718882345?text=${encodeURIComponent(
                `Hello Ceylon Crunch, I am tracking order #${activeOrder.id} (${activeOrder.waybill}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-3 px-4 rounded-full bg-[#25D366] hover:brightness-105 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+94 71 888 2345)</span>
            </a>
          </div>
        </div>
      ) : (
        /* VIEW C: EMPATHETIC "NO ORDER FOUND" ERROR VIEW */
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-[#EADFD0] p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
            {/* Empathetic Visual Icon */}
            <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[36px]">manage_search</span>
              </div>
            </div>

            <span className="font-sans text-xs uppercase font-bold text-[#8B5E3C] tracking-widest">
              Notice
            </span>
            <h3 className="font-serif text-2xl text-[#1F3D2B] font-semibold mt-1">
              We Couldn't Find That Order
            </h3>
            <p className="text-xs sm:text-sm text-[#424843] mt-2 max-w-sm leading-relaxed">
              We checked our dispatch records for order reference{' '}
              <strong className="text-[#1F3D2B]">{orderInput}</strong> with phone{' '}
              <strong className="text-[#1F3D2B]">+94 {phoneInput}</strong>, but no matching dispatch manifest was located.
            </p>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-6 max-w-sm">
              <button
                type="button"
                onClick={() => setHasSearched(false)}
                className="w-full h-12 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Another Order Number</span>
              </button>

              <a
                href={`https://wa.me/94718882345?text=${encodeURIComponent(
                  `Hello Ceylon Crunch, I'm having trouble locating my order #${orderInput}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-full bg-[#f6f3f2] hover:bg-[#EADFD0] text-[#1F3D2B] text-xs font-semibold flex items-center justify-center gap-2 border border-[#EADFD0] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Connect with Concierge on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Helpful Guidance */}
          <div className="bg-white border border-[#EADFD0] p-5 rounded-2xl shadow-sm">
            <h4 className="font-serif text-base font-bold text-[#1F3D2B] mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#8B5E3C]" />
              <span>Helpful Guidance</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#424843]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                <span>
                  Check your SMS receipt for the exact 6-digit identifier starting with{' '}
                  <strong className="text-[#1F3D2B]">CC-</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                <span>
                  Orders placed within the last 15 minutes may take a few moments to sync into our island courier manifest.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                <span>
                  Ensure you are using the exact recipient mobile number entered during checkout.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
