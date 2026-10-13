import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, normalizePhone, PaymentMethod } from '../lib/store';
import { formatRs } from '../data/products';
import {
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const SRI_LANKAN_DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Galle',
  'Matara',
  'Kurunegala',
  'Puttalam',
  'Jaffna',
  'Badulla',
  'Ratnapura',
  'Anuradhapura',
  'Batticaloa',
  'Hambantota',
  'Matale',
  'Nuwara Eliya',
  'Trincomalee',
  'Kegalle',
  'Ampara',
  'Monaragala',
  'Polonnaruwa',
  'Vavuniya',
  'Kilinochchi',
  'Mannar',
  'Mullaitivu',
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, deliveryFee, cartTotal, itemCount, giftNote, createOrder, showToast } =
    useStore();

  // Redirect to cart if empty
  if (cart.length === 0) {
    navigate('/cart');
  }

  // UI state
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs
  const [name, setName] = useState('Dilshan Perera');
  const [phone, setPhone] = useState('77 123 4567');
  const [email, setEmail] = useState('dilshan@example.com');
  const [street, setStreet] = useState('No. 42/1, Alfred House Gardens');
  const [landmark, setLandmark] = useState('Level 4, Sky Villa');
  const [city, setCity] = useState('Colombo 03');
  const [district, setDistrict] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00300');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderNotes, setOrderNotes] = useState(giftNote || '');

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    street?: string;
    city?: string;
  }>({});

  // Live SL Phone validation
  const validatePhone = (input: string): boolean => {
    const digits = input.replace(/\D/g, '');
    // SL valid numbers: 9 digits if without country code, or 10 digits starting with 0, or 11 starting with 94
    if (digits.length === 9 && ['7', '1', '2', '3', '4', '5', '6', '8', '9'].includes(digits[0])) {
      return true;
    }
    if (digits.length === 10 && digits.startsWith('0')) {
      return true;
    }
    if (digits.length === 11 && digits.startsWith('94')) {
      return true;
    }
    return false;
  };

  const isPhoneValid = validatePhone(phone);
  const isNameValid = name.trim().length >= 2;
  const isStreetValid = street.trim().length >= 4;
  const isCityValid = city.trim().length >= 2;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string; street?: string; city?: string } = {};

    if (!isNameValid) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!isPhoneValid) {
      newErrors.phone = 'Please enter a valid 9-digit mobile number (e.g., 77 123 4567)';
    }
    if (!isStreetValid) {
      newErrors.street = 'Please enter your street delivery address.';
    }
    if (!isCityValid) {
      newErrors.city = 'Please enter your town or city.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast('Please correct the highlighted fields before placing your order.');
      return;
    }

    setIsSubmitting(true);

    // Create the order
    setTimeout(() => {
      // Format SL normalized mobile phone number
      const normalizedPhone = '+94 ' + normalizePhone(phone).slice(2).replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');

      const result = createOrder({
        customer: {
          name: name.trim(),
          phone: normalizedPhone,
          email: email.trim() || undefined,
        },
        shippingAddress: {
          street: street.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          district,
          postalCode: postalCode.trim() || undefined,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderNotes: orderNotes.trim() || undefined,
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        total: cartTotal,
      });

      setIsSubmitting(false);

      if (result.success && result.order) {
        navigate(`/order/${result.order.id}/confirmed`);
      } else {
        showToast(result.error || 'Failed to place order. Please review stock availability.');
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-36 lg:pb-16 max-w-4xl mx-auto">
      {/* Top Navigation & Step Indicator */}
      <div className="flex items-center justify-between py-2 mb-3">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5E3C] hover:text-[#1F3D2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f6f3f2] border border-[#EADFD0] text-[#6B6B6B] rounded-full text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C]" />
          <span>Checkout • Step 1 to 4</span>
        </div>
      </div>

      {/* Header Title */}
      <div className="mb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C] block mb-1">
          CHECKOUT
        </span>
        <h1 className="font-serif text-3xl lg:text-4xl text-[#1F3D2B] font-semibold tracking-tight">
          Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
          Enter your delivery and contact details below to complete your order.
        </p>
      </div>

      {/* Collapsible Order Summary Card */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl shadow-sm overflow-hidden mb-6 transition-all">
        <button
          type="button"
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#f6f3f2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ffdcc5] flex items-center justify-center text-[#794e2e]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-[#1F3D2B] block leading-tight">
                Order Summary
              </span>
              <span className="text-xs text-[#6B6B6B]">{itemCount} artisan items</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#1F3D2B] tabular-nums">
              {formatRs(cartTotal)}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 ${
                isSummaryOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {isSummaryOpen && (
          <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#EADFD0] animate-in fade-in">
            {/* Items list */}
            <div className="flex flex-col gap-2.5 pt-2 divide-y divide-[#EADFD0]/60">
              {cart.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between gap-3 pt-2 first:pt-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f6f3f2] shrink-0 border border-[#EADFD0]">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-[#1F3D2B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-xs sm:text-sm text-[#1F3D2B] truncate font-semibold">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-[#6B6B6B]">{item.variantWeight}</p>
                    </div>
                  </div>
                  <span className="font-sans text-xs sm:text-sm font-semibold text-[#1F3D2B] tabular-nums shrink-0">
                    {formatRs(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="bg-[#f6f3f2] rounded-xl p-3.5 flex flex-col gap-2 text-xs text-[#424843] mt-2 border border-[#EADFD0]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F3D2B] tabular-nums">{formatRs(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Island Courier</span>
                <span className="font-semibold text-[#1F3D2B] tabular-nums">
                  {deliveryFee === 0 ? <span className="text-[#2E7D4F]">FREE</span> : formatRs(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EADFD0] text-sm font-bold text-[#1F3D2B]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatRs(cartTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Checkout Form Flow */}
      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
        {/* 1. Contact Information */}
        <section className="bg-white border border-[#EADFD0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F3D2B] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-[#1F3D2B] font-semibold">
                Contact Information
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#8B5E3C]">Required</span>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="contact-name">
              Full Name
            </label>
            <div className="relative flex items-center">
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Dilshan Perera"
                className="w-full h-12 px-3.5 pr-10 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
              {isNameValid && (
                <CheckCircle2 className="w-5 h-5 absolute right-3 text-[#2E7D4F]" />
              )}
            </div>
            {errors.name && <p className="text-xs text-[#B3261E] mt-0.5">{errors.name}</p>}
          </div>

          {/* Mobile Phone Number (with live validation matching mockups) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="contact-phone">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <div className="h-12 px-3 bg-[#f6f3f2] border border-[#EADFD0] flex items-center gap-1.5 rounded-lg shrink-0 text-sm font-semibold text-[#1F3D2B]">
                <span>🇱🇰</span>
                <span>+94</span>
              </div>
              <div
                className={`relative flex-1 flex items-center rounded-lg transition-all ${
                  phone && !isPhoneValid
                    ? 'bg-[#ffdad6]/20 border border-[#ba1a1a] shadow-[inset_0_0_0_1.5px_#ba1a1a]'
                    : 'bg-[#f6f3f2] border border-[#EADFD0] focus-within:bg-white focus-within:border-[#1F3D2B]'
                }`}
              >
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="77 123 4567"
                  className="w-full h-12 px-3.5 pr-10 bg-transparent rounded-lg text-sm text-[#1F3D2B] focus:outline-none"
                />
                {phone && !isPhoneValid && (
                  <AlertCircle className="w-5 h-5 absolute right-3 text-[#ba1a1a]" />
                )}
                {isPhoneValid && (
                  <CheckCircle2 className="w-5 h-5 absolute right-3 text-[#2E7D4F]" />
                )}
              </div>
            </div>

            {phone && !isPhoneValid && (
              <p className="text-xs text-[#ba1a1a] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please enter a valid 9-digit mobile number (e.g., 77 123 4567)</span>
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="contact-email">
                Email Address
              </label>
              <span className="text-[11px] text-[#6B6B6B]">(Optional)</span>
            </div>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dilshan@example.com"
              className="w-full h-12 px-3.5 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
            <span className="text-[11px] text-[#6B6B6B] mt-0.5">
              For immediate order receipt and courier tracking updates.
            </span>
          </div>
        </section>

        {/* 2. Delivery Address */}
        <section className="bg-white border border-[#EADFD0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F3D2B] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-[#1F3D2B] font-semibold">
                Delivery Address
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#8B5E3C]">Island-Wide</span>
          </div>

          {/* Street Address */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="addr-street">
              Street Address
            </label>
            <div className="relative flex items-center">
              <input
                id="addr-street"
                type="text"
                required
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  if (errors.street) setErrors({ ...errors, street: undefined });
                }}
                placeholder="House/Flat number and street name"
                className="w-full h-12 px-3.5 pr-10 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
              {isStreetValid && (
                <CheckCircle2 className="w-5 h-5 absolute right-3 text-[#2E7D4F]" />
              )}
            </div>
            {errors.street && <p className="text-xs text-[#B3261E] mt-0.5">{errors.street}</p>}
          </div>

          {/* Apartment / Landmark */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="addr-landmark">
                Apartment, Suite & Landmark
              </label>
              <span className="text-[11px] text-[#6B6B6B]">(Optional)</span>
            </div>
            <input
              id="addr-landmark"
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark, gate code, or floor"
              className="w-full h-12 px-3.5 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          {/* City & District Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="addr-city">
                City / Town
              </label>
              <div className="relative flex items-center">
                <input
                  id="addr-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) setErrors({ ...errors, city: undefined });
                  }}
                  placeholder="e.g. Colombo 03 or Kandy"
                  className="w-full h-12 px-3.5 pr-10 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
                />
                {isCityValid && (
                  <CheckCircle2 className="w-5 h-5 absolute right-3 text-[#2E7D4F]" />
                )}
              </div>
              {errors.city && <p className="text-xs text-[#B3261E] mt-0.5">{errors.city}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="addr-district">
                District
              </label>
              <div className="relative flex items-center">
                <select
                  id="addr-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-12 px-3.5 pr-8 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] appearance-none"
                >
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 pointer-events-none text-[#6B6B6B]" />
              </div>
            </div>
          </div>

          {/* Postal Code */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#1F3D2B]" htmlFor="addr-postal">
              Postal Code
            </label>
            <input
              id="addr-postal"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 00300"
              className="w-full h-12 px-3.5 bg-[#f6f3f2] rounded-lg border border-[#EADFD0] text-sm text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#ffdcc5]/50 border border-[#fdc39a]/60 rounded-xl text-[#301400]">
            <Truck className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-xs font-semibold">Standard courier dispatched within 24 hours</span>
          </div>
        </section>

        {/* 3. Payment Method */}
        <section className="bg-white border border-[#EADFD0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F3D2B] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-[#1F3D2B] font-semibold">
                Payment Method
              </h2>
            </div>
            <Lock className="w-4 h-4 text-[#8B5E3C]" />
          </div>

          <div className="flex flex-col gap-3">
            {/* Option A: Cash on Delivery (COD) */}
            <label
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                paymentMethod === 'cod'
                  ? 'bg-[#f6f3f2] border-[#1F3D2B] shadow-[inset_0_0_0_1.5px_#1F3D2B]'
                  : 'bg-white border-[#EADFD0] hover:bg-[#f6f3f2]/60'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mt-1 h-4 w-4 text-[#1F3D2B] accent-[#1F3D2B]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-bold text-[#1F3D2B]">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F3D2B] text-white">
                    Most Popular
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  Pay with cash or local LANKAQR upon parcel arrival. Zero processing fees.
                </p>
              </div>
            </label>

            {/* Option B: Direct Bank Transfer */}
            <label
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                paymentMethod === 'bank'
                  ? 'bg-[#f6f3f2] border-[#1F3D2B] shadow-[inset_0_0_0_1.5px_#1F3D2B]'
                  : 'bg-white border-[#EADFD0] hover:bg-[#f6f3f2]/60'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                className="mt-1 h-4 w-4 text-[#1F3D2B] accent-[#1F3D2B]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-bold text-[#1F3D2B]">
                    Direct Bank Transfer
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e4e2e1] text-[#424843]">
                    Manual Slip
                  </span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  Commercial Bank or Sampath Bank. Account credentials and your unique Order Reference will appear immediately on the next screen with slip upload.
                </p>
              </div>
            </label>

            {/* Option C: PayHere Online Payment Gateway */}
            <label
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                paymentMethod === 'card'
                  ? 'bg-[#f6f3f2] border-[#1F3D2B] shadow-[inset_0_0_0_1.5px_#1F3D2B]'
                  : 'bg-white border-[#EADFD0] hover:bg-[#f6f3f2]/60'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mt-1 h-4 w-4 text-[#1F3D2B] accent-[#1F3D2B]"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-sans text-sm font-bold text-[#1F3D2B]">
                    PayHere Online Payment Gateway
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#2455C6] text-white font-bold tracking-wide">
                      PayHere
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0eded] text-[#1F3D2B] font-bold">
                      VISA
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0eded] text-[#1F3D2B] font-bold">
                      MC
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ffdcc5] text-[#301400] font-bold">
                      LANKAQR
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  Secure online payment via PayHere (Central Bank of Sri Lanka approved gateway) supporting Visa, Mastercard, Amex, LankaQR, Genie &amp; FriMi.
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* 4. Order Notes */}
        <section className="bg-white border border-[#EADFD0] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#EADFD0] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#1F3D2B] text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-[#1F3D2B] font-semibold">
                Order Notes
              </h2>
            </div>
            <span className="text-xs text-[#6B6B6B]">(Optional)</span>
          </div>

          <p className="text-xs text-[#6B6B6B]">
            Adding a personal handwritten card or gate delivery instructions?
          </p>
          <textarea
            rows={3}
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Special courier delivery notes, apartment access code, or personalized gift message..."
            className="w-full p-3 bg-[#f6f3f2] rounded-xl border border-[#EADFD0] text-xs text-[#1F3D2B] focus:bg-white focus:outline-none focus:border-[#1F3D2B] resize-none"
          />
        </section>

        {/* Sticky Bottom Bar for Checkout */}
        <div className="fixed bottom-0 lg:bottom-4 left-0 w-full z-40 bg-white/95 lg:bg-white lg:max-w-xl lg:left-1/2 lg:-translate-x-1/2 backdrop-blur-md px-4 py-3 border-t lg:border border-[#EADFD0] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:rounded-2xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6B6B6B]">Total to Pay (Island Delivery included)</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B] tabular-nums">
                  {formatRs(cartTotal)}
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[#f6f3f2] border border-[#EADFD0] rounded-full text-xs font-semibold text-[#8B5E3C]">
                <span>{itemCount} Items</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-[#6B6B6B] text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#2E7D4F]" />
              <span>256-bit Encrypted Sri Lankan Checkout • Pay on Delivery Guaranteed</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
