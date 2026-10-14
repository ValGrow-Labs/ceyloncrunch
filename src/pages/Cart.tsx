import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { formatRs } from '../data/products';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Truck,
  Edit3,
  Lock,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Store,
  ChevronDown,
} from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    itemCount,
    giftNote,
    setGiftNote,
  } = useStore();

  const [isNoteOpen, setIsNoteOpen] = useState(Boolean(giftNote));

  // Progress toward free delivery (Goal: Rs. 5,000)
  const freeDeliveryThreshold = 5000;
  const awayAmount = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="flex flex-col w-full pt-4 pb-20">
        <div className="flex items-center justify-between py-2 mb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Provisions</span>
          </Link>
        </div>

        {/* Real Empty State */}
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-[#EADFD0] rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] gap-y-4 max-w-lg mx-auto">
          <div className="relative w-28 h-28 rounded-full bg-[#ffdcc5] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[44px] text-[#8B5E3C]">shopping_basket</span>
            </div>
            <span className="absolute top-2 right-2 bg-[#ffdeaa] text-[#271900] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              0 kg
            </span>
          </div>

          <div className="flex flex-col gap-1 max-w-xs">
            <h1 className="font-serif text-2xl text-[#1F3D2B] font-semibold">Your Cart is Empty</h1>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Looks like you haven't added any handcrafted roasted cashews or heirloom dried fruits to your basket yet.
            </p>
          </div>

          <div className="w-full max-w-xs pt-2">
            <Link
              to="/shop"
              className="w-full h-12 bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-sans text-xs font-semibold rounded-full inline-flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Store className="w-4 h-4" />
              <span>Explore Fresh Harvest</span>
            </Link>
          </div>

          <div className="bg-[#f6f3f2] px-4 py-2 rounded-full mt-2 border border-[#EADFD0]">
            <p className="text-xs text-[#8B5E3C] font-medium">
              ✨ Tip: Orders placed before 2 PM dispatch same-day
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pt-4 pb-20">
      {/* Top Return Link */}
      <div className="flex items-center justify-between py-2 mb-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Header Area */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight">
            Your Cart
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Review your items before checking out.
          </p>
        </div>
        <span className="bg-[#ffdcc5] text-[#301400] px-3 py-1 rounded-full text-xs font-semibold shadow-2xs">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Items & Notes */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Free Delivery Progress Card */}
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffdcc5] flex items-center justify-center text-[#794e2e]">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-sans text-sm font-semibold text-[#1F3D2B]">
                  Free Island Delivery
                </span>
              </div>
              <span className="text-xs font-semibold text-[#8B5E3C]">
                {awayAmount > 0 ? `${formatRs(awayAmount)} away` : 'Unlocked!'}
              </span>
            </div>

            <p className="text-xs text-[#6B6B6B]">
              {awayAmount > 0 ? (
                <>
                  Add <strong className="text-[#8B5E3C] font-semibold">{formatRs(awayAmount)}</strong> more to unlock complimentary doorstep delivery.
                </>
              ) : (
                <span className="text-[#2E7D4F] font-semibold">
                  Congratulations! Complimentary island-wide courier unlocked.
                </span>
              )}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#f0eded] rounded-full h-2.5 overflow-hidden p-0.5 mt-0.5">
              <div
                className="bg-gradient-to-r from-[#1F3D2B] via-[#466551] to-[#D9A441] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#6B6B6B]">
              <span>Current: {formatRs(cartSubtotal)}</span>
              <span className="font-semibold text-[#1F3D2B]">Goal: {formatRs(freeDeliveryThreshold)}</span>
            </div>
          </div>

          {/* Product Line Items */}
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.variantId}
                className="bg-white border border-[#EADFD0] rounded-2xl p-3 sm:p-4 shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] flex gap-3 sm:gap-3.5 items-center transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#f6f3f2] border border-[#EADFD0]">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif text-xs xs:text-sm sm:text-base font-semibold text-[#1F3D2B] hover:text-[#8B5E3C] truncate leading-snug"
                    >
                      {item.productName}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.variantId)}
                      aria-label={`Remove ${item.productName}`}
                      className="text-[#6B6B6B] hover:text-[#B3261E] p-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#6B6B6B] mt-0.5">{item.variantWeight}</p>

                  <div className="flex justify-between items-center gap-2 mt-2.5 sm:mt-3">
                    {/* Stepper */}
                    <div className="flex items-center bg-[#f6f3f2] border border-[#EADFD0] rounded-full px-1.5 sm:px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#2B2B2B] hover:text-[#1F3D2B] active:scale-90 transition-transform"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-sans text-xs font-bold px-2 text-[#1F3D2B] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#2B2B2B] hover:text-[#1F3D2B] active:scale-90 transition-transform"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-sans font-bold text-xs xs:text-sm sm:text-base text-[#1F3D2B] tabular-nums truncate">
                      {formatRs(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collapsible Order Note Accordion */}
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)]">
            <button
              type="button"
              onClick={() => setIsNoteOpen(!isNoteOpen)}
              className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1F3D2B]"
            >
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#8B5E3C]" />
                <span>Add Packaging Note or Gifting Request</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6B6B6B] transition-transform ${isNoteOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isNoteOpen && (
              <div className="mt-3 pt-2 border-t border-[#EADFD0] space-y-1.5 animate-in fade-in">
                <p className="text-xs text-[#6B6B6B]">
                  Special instructions for our Colombo roasters or courier handling:
                </p>
                <textarea
                  rows={3}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="e.g. Please include a handwritten gift card saying 'Happy Birthday Ayesha!', or leave parcel at security desk if unattended..."
                  className="w-full p-3 bg-[#f6f3f2] border border-[#EADFD0] rounded-xl text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="bg-white border border-[#EADFD0] rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] flex flex-col gap-3.5">
            <h2 className="font-serif text-xl text-[#1F3D2B] font-semibold">Order Summary</h2>

            <div className="flex flex-col gap-2.5 text-xs text-[#424843]">
              <div className="flex justify-between items-center">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-[#1F3D2B] tabular-nums">
                  {formatRs(cartSubtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span>Standard Island Delivery</span>
                  <span className="text-[10px] text-[#6B6B6B]">(Ceylon Express)</span>
                </div>
                <span className="font-semibold text-[#1F3D2B] tabular-nums">
                  {deliveryFee === 0 ? <span className="text-[#2E7D4F]">FREE</span> : formatRs(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#8B5E3C]">
                <span>Island-wide Express Tracked</span>
                <span>Dispatches within 24h</span>
              </div>
            </div>

            <div className="h-px bg-[#EADFD0] w-full my-1" />

            <div className="flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-[#1F3D2B]">Estimated Total</span>
                <span className="text-[10px] text-[#6B6B6B]">Inclusive of sales levies & tax</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#1F3D2B] tabular-nums">
                {formatRs(cartTotal)}
              </span>
            </div>

            {/* Single Origin Trust Pill */}
            <div className="bg-[#f6f3f2] rounded-xl p-2.5 flex items-center justify-center gap-2 text-[#1F3D2B] text-xs font-semibold mt-1 border border-[#EADFD0]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
              <span>Single-origin certification included</span>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full h-12 bg-[#1F3D2B] hover:bg-[#162C1F] text-white font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="w-full h-11 bg-white hover:bg-[#f6f3f2] text-[#1F3D2B] border border-[#EADFD0] font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.99]"
            >
              <span>Continue Shopping</span>
            </Link>

            <p className="text-center text-[11px] text-[#6B6B6B]">
              Guaranteed safe checkout via Cash on Delivery, Bank Transfer, or Card
            </p>
          </div>

          {/* Trust Assurances Banner */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border border-[#EADFD0] rounded-xl p-3 flex flex-col items-center text-center shadow-2xs">
              <Leaf className="w-5 h-5 text-[#8B5E3C] mb-1" />
              <span className="text-xs font-bold text-[#1F3D2B]">100% Single Estate</span>
              <span className="text-[10px] text-[#6B6B6B] mt-0.5">Direct fair-trade</span>
            </div>
            <div className="bg-white border border-[#EADFD0] rounded-xl p-3 flex flex-col items-center text-center shadow-2xs">
              <Lock className="w-5 h-5 text-[#8B5E3C] mb-1" />
              <span className="text-xs font-bold text-[#1F3D2B]">Encrypted Checkout</span>
              <span className="text-[10px] text-[#6B6B6B] mt-0.5">Safe transactions</span>
            </div>
            <div className="bg-white border border-[#EADFD0] rounded-xl p-3 flex flex-col items-center text-center shadow-2xs">
              <Truck className="w-5 h-5 text-[#8B5E3C] mb-1" />
              <span className="text-xs font-bold text-[#1F3D2B]">24h Dispatch</span>
              <span className="text-[10px] text-[#6B6B6B] mt-0.5">Freshly packed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
