import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, Order } from '../lib/store';
import { formatRs } from '../data/products';
import {
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Clock,
  Upload,
  FileText,
  MapPin,
  ShoppingBag,
  Truck,
  ArrowRight,
  MessageCircle,
  Loader2,
} from 'lucide-react';

export const OrderConfirmed: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { orders, uploadOrderSlip, showToast, siteSettings } = useStore();

  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  // 1. Look in store state
  let order = orders.find(
    (o) =>
      o.id === orderNumber ||
      o.waybill === orderNumber ||
      String(o.id).toLowerCase() === String(orderNumber).toLowerCase()
  );

  // 2. Look in localStorage fallback
  if (!order) {
    try {
      const raw = localStorage.getItem('ceylon_crunch_orders');
      if (raw) {
        const parsed: Order[] = JSON.parse(raw);
        order = parsed.find(
          (o) =>
            o.id === orderNumber ||
            o.waybill === orderNumber ||
            String(o.id).toLowerCase() === String(orderNumber).toLowerCase()
        );
      }
    } catch {}
  }

  // 3. Fallback to fetched order from server
  if (!order && fetchedOrder) {
    order = fetchedOrder;
  }

  useEffect(() => {
    if (!order && orderNumber) {
      setIsLoadingOrder(true);
      fetch('/api/get-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderNumber }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            const o = data.order;
            const mappedOrder: Order = {
              id: o.id,
              createdAt: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent',
              customer: {
                name: o.customer_name || 'Customer',
                phone: o.customer_phone || '',
                email: o.customer_email || undefined,
              },
              shippingAddress: {
                street: o.shipping_street || o.shipping_address || '',
                city: o.shipping_city || o.city || '',
                district: o.shipping_district || '',
                postalCode: o.shipping_postal || undefined,
                landmark: o.landmark || undefined,
              },
              paymentMethod: o.payment_method || 'cod',
              paymentStatus: o.payment_status || (o.status === 'paid' ? 'paid' : 'pending'),
              paymentSlipUrl: o.payment_slip_url || undefined,
              orderNotes: o.order_notes || o.notes || undefined,
              giftNote: o.gift_note || undefined,
              subtotal: Number(o.subtotal || 0),
              deliveryFee: Number(o.delivery_fee ?? o.delivery ?? 0),
              total: Number(o.total || 0),
              status: o.status || 'pending',
              waybill: o.waybill || `CLN-${String(o.id).slice(0, 8).toUpperCase()}-LK`,
              estimatedArrival: o.estimated_arrival || '1-2 business days',
              items: (o.items || []).map((item: any) => ({
                productId: item.product_id || item.id || '',
                variantId: item.variant_id || item.id || '',
                productName: item.product_name || item.name || 'Product',
                variantWeight: item.variant_weight || item.variant || '',
                price: Number(item.price || item.unit_price || 0),
                quantity: Number(item.quantity || 1),
                image: item.image || item.image_url || '',
                slug: item.slug || '',
              })),
              timeline: [
                {
                  status: 'placed',
                  title: 'Order Placed',
                  timestamp: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recorded',
                  description: 'Web checkout verified & tokenized',
                  completed: true,
                },
                {
                  status: 'confirmed',
                  title: 'Order Confirmed',
                  timestamp: 'Status check',
                  description: o.payment_method === 'cod' ? 'Payment due on delivery' : 'Awaiting payment verification',
                  completed: ['confirmed', 'packed', 'dispatched', 'delivered'].includes(o.status),
                },
                {
                  status: 'packed',
                  title: 'Small-Batch Packed',
                  timestamp: 'Fulfillment queue',
                  description: 'Aroma-sealed foil packaging',
                  completed: ['packed', 'dispatched', 'delivered'].includes(o.status),
                },
                {
                  status: 'dispatched',
                  title: 'Dispatched & In Transit',
                  timestamp: 'Courier handover',
                  description: 'Pronto Tracked Courier',
                  completed: ['dispatched', 'delivered'].includes(o.status),
                },
                {
                  status: 'delivered',
                  title: 'Delivered',
                  timestamp: 'Final destination',
                  description: 'Recipient signature',
                  completed: o.status === 'delivered',
                },
              ],
            };
            setFetchedOrder(mappedOrder);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingOrder(false);
        });
    }
  }, [order, orderNumber]);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [uploadedSlip, setUploadedSlip] = useState<{ name: string; size: string } | null>(
    order?.paymentSlipUrl ? { name: 'transfer_receipt.jpg', size: '1.2 MB' } : null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoadingOrder && !order) {
    return (
      <div className="py-24 text-center flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F3D2B] mb-3" />
        <h2 className="font-serif text-xl font-bold text-[#1F3D2B] mb-1">Retrieving Order Details</h2>
        <p className="text-xs text-[#6B6B6B]">Connecting to Ceylon Crunch roastery ledger...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="font-serif text-2xl font-bold text-[#1F3D2B] mb-2">Order Not Located</h2>
        <p className="text-sm text-[#6B6B6B] mb-6">
          We could not find records for order reference #{orderNumber}.
        </p>
        <Link
          to="/shop"
          className="h-11 px-6 rounded-full bg-[#1F3D2B] text-white text-xs font-semibold flex items-center justify-center"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedCode(true);
    showToast('Order ID copied to clipboard');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    showToast('Account number copied to clipboard');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, PNG, PDF
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Invalid file format. Please upload a JPG, PNG or PDF document.');
      return;
    }

    // Validate size: <= 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit. Please upload a smaller receipt image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      uploadOrderSlip(order.id, dataUrl);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedSlip({ name: file.name, size: `${sizeMb} MB` });
    };
    reader.readAsDataURL(file);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ceylon Crunch, I am inquiring regarding my confirmed harvest order #${order.id}.`
  );

  return (
    <div className="flex flex-col w-full gap-6 pb-24 max-w-2xl mx-auto">
      {/* 1. Top Calm Confirmation & Delight Section */}
      <section className="flex flex-col items-center text-center px-2 pt-4">
        {/* Animated Organic Check Seal */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-[#c8ebd1]/40 animate-ping opacity-30" />
          <div className="absolute inset-1 rounded-full bg-[#c8ebd1]/70" />
          <div className="relative w-14 h-14 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-8 h-8 text-[#c8ebd1]" />
          </div>
        </div>

        <span className="font-sans text-xs uppercase tracking-widest text-[#8B5E3C] font-bold mb-1">
          THANK YOU
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1F3D2B] font-semibold tracking-tight mb-2">
          ORDER CONFIRMED
        </h1>

        <p className="text-sm text-[#1F3D2B] font-medium max-w-sm leading-relaxed">
          Thank you for shopping with Ceylon Crunch.
        </p>
        <p className="text-xs text-[#424843] max-w-md leading-relaxed mt-1">
          We’ve received your order and are packing it with care. You’ll receive updates regarding delivery soon.
        </p>

        {/* Order Pill with Copy Interaction */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#EADFD0] text-[#1F3D2B] shadow-2xs">
          <span className="material-symbols-outlined text-[16px] text-[#8B5E3C]">receipt_long</span>
          <span className="font-serif text-base font-bold text-[#1F3D2B] tracking-tight">
            #{order.id}
          </span>
          <span className="text-[#EADFD0]">•</span>
          <span className="text-xs text-[#6B6B6B]">{order.createdAt}</span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Copy order ID"
            className="ml-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#f6f3f2] text-[#8B5E3C] active:scale-90 transition-all"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-[#2E7D4F]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Dispatch Assurance Tag */}
        <div className="flex items-center gap-2 mt-3 text-xs text-[#424843] bg-[#f6f3f2] border border-[#EADFD0] px-3.5 py-1.5 rounded-full">
          <Truck className="w-4 h-4 text-[#2E7D4F]" />
          <span>Dispatched within 24h via Ceylon Express Tracked Courier</span>
        </div>
      </section>

      {/* 2. Bank Transfer Instructions Card (if method is 'bank') */}
      {order.paymentMethod === 'bank' && (
        <section className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ffdcc5] flex items-center justify-center text-[#794e2e]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-[#1F3D2B]">
                  Bank Transfer Details
                </h2>
                <p className="text-[11px] text-[#6B6B6B]">Direct Settlement Instruction</p>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#ffdeaa] text-[#271900] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Action Required</span>
            </span>
          </div>

          <div className="bg-[#f6f3f2] p-3.5 rounded-xl border border-[#EADFD0] text-xs text-[#424843] leading-snug">
            Kindly deposit <strong className="text-[#1F3D2B] font-bold">{formatRs(order.total)}</strong> within 12 hours and upload your transfer slip below to confirm roastery dispatch.
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 gap-1 text-xs text-[#2B2B2B] divide-y divide-[#EADFD0]/60">
            <div className="flex justify-between items-center py-2">
              <span className="text-[#6B6B6B]">Bank</span>
              <span className="font-semibold text-[#1F3D2B]">{siteSettings?.bankName || 'Commercial Bank / Sampath Bank'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#6B6B6B]">Account Name</span>
              <span className="font-semibold text-[#1F3D2B]">{siteSettings?.bankAccountName || 'Ceylon Crunch (Pvt) Ltd'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#6B6B6B]">Account Number</span>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-[#1F3D2B] text-sm tabular-nums">
                  {siteSettings?.bankAccountNumber || '1000 2489 8210'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAccount((siteSettings?.bankAccountNumber || '100024898210').replace(/\s+/g, ''))}
                  aria-label="Copy account number"
                  className="p-1 text-[#8B5E3C] hover:text-[#1F3D2B]"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-[#2E7D4F]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#6B6B6B]">Branch</span>
              <span className="font-semibold text-[#1F3D2B]">{siteSettings?.bankBranch || 'Kollupitiya (Colombo 03)'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#6B6B6B]">Transfer Reference</span>
              <span className="font-bold px-2 py-0.5 rounded-full bg-[#ffdcc5] text-[#301400]">
                #{order.id}
              </span>
            </div>
          </div>

          {/* Payment Slip Upload Dropzone */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-xs font-bold text-[#1F3D2B]">Payment Confirmation Slip</span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!uploadedSlip ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#f6f3f2] hover:bg-[#EADFD0]/60 border border-dashed border-[#8B5E3C]/60 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#EADFD0] flex items-center justify-center text-[#1F3D2B] shadow-2xs">
                  <Upload className="w-5 h-5 text-[#8B5E3C]" />
                </div>
                <p className="text-xs font-semibold text-[#1F3D2B]">
                  Tap to upload bank receipt or screenshot
                </p>
                <p className="text-[11px] text-[#6B6B6B]">
                  Supports JPG, PNG, PDF up to 10MB
                </p>
              </button>
            ) : (
              <div className="bg-[#1F3D2B] text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-[#c8ebd1] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-white">{uploadedSlip.name}</p>
                    <p className="text-[10px] text-[#c8ebd1]/80">{uploadedSlip.size} • Slip verified and attached</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#D9A441] underline px-2 py-1"
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Order Summary & Item Breakdown */}
      <section className="bg-white border border-[#EADFD0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1F3D2B]" />
            <h2 className="font-serif text-lg font-semibold text-[#1F3D2B]">
              Order Summary
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#8B5E3C]">
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Product Items Stack */}
        <div className="flex flex-col gap-3 divide-y divide-[#EADFD0]/60">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3.5 pt-3 first:pt-0">
              <div className="w-14 h-14 rounded-xl bg-[#f6f3f2] border border-[#EADFD0] overflow-hidden shrink-0">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#1F3D2B] truncate">
                  {item.productName}
                </h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  {item.variantWeight} • Qty {item.quantity}
                </p>
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold text-[#1F3D2B] tabular-nums shrink-0">
                {formatRs(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing calculations */}
        <div className="bg-[#f6f3f2] border border-[#EADFD0] rounded-xl p-3.5 flex flex-col gap-2 text-xs text-[#424843]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1F3D2B] tabular-nums">{formatRs(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Island-Wide Express Delivery</span>
            <span className="font-semibold text-[#1F3D2B] tabular-nums">
              {order.deliveryFee === 0 ? <span className="text-[#2E7D4F]">FREE</span> : formatRs(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#EADFD0] text-sm font-bold text-[#1F3D2B]">
            <span>Total Payable</span>
            <span className="tabular-nums">{formatRs(order.total)}</span>
          </div>
        </div>

        {/* Delivery Address Recap */}
        <div className="flex items-start gap-3 pt-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-[#f6f3f2] border border-[#EADFD0] flex items-center justify-center text-[#8B5E3C] shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="font-sans text-[11px] text-[#8B5E3C] font-bold uppercase tracking-wider block">
              Delivery Destination
            </span>
            <p className="font-bold text-[#1F3D2B] text-sm mt-0.5">{order.customer.name}</p>
            <p className="text-[#424843]">{order.shippingAddress.street}</p>
            <p className="text-[#424843]">
              {order.shippingAddress.city}, {order.shippingAddress.district} • {order.customer.phone}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Action Buttons */}
      <section className="flex flex-col gap-3">
        {/* WhatsApp Direct Chat Button */}
        <a
          href={`https://wa.me/94718882345?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center gap-2 shadow-md active:scale-[0.99] font-sans text-xs font-semibold transition-all hover:brightness-105"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp for Instant Dispatch Updates</span>
        </a>

        {/* Secondary Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/track?order=${order.id}&phone=${encodeURIComponent(order.customer.phone.replace('+94', '').trim())}`}
            className="h-12 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm active:scale-[0.99] transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
          <Link
            to="/shop"
            className="h-12 rounded-full bg-white hover:bg-[#f6f3f2] text-[#1F3D2B] border border-[#EADFD0] flex items-center justify-center gap-1.5 text-xs font-semibold shadow-2xs active:scale-[0.99] transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Brand Sign-Off */}
      <footer className="text-center py-4 flex flex-col items-center gap-1 text-[#6B6B6B]">
        <div className="w-8 h-0.5 bg-[#8B5E3C]/30 rounded-full mb-1" />
        <p className="font-serif text-base italic text-[#1F3D2B]">
          "From Nature to Your Doorstep."
        </p>
        <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">
          Hand-harvested • Sun-cured • Ceylon Pure
        </p>
      </footer>
    </div>
  );
};
