import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Shipping: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
          Delivery Information
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5132] tracking-tight">
          We Deliver Across Sri Lanka.
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] max-w-lg mx-auto">
          We carefully pack every order before it leaves us.
        </p>
      </div>

      {/* Main Delivery Details Card */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-[#2B2B2B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#8B5E3C] font-sans text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Delivery Areas</span>
          </div>
          <p className="font-semibold text-base text-[#1F3D2B]">
            Island-wide delivery is available.
          </p>
          <p className="text-xs text-[#6B6B6B]">
            From Colombo and the Western Province to Kandy, Galle, Jaffna, and all outstation districts.
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#EADFD0]/60">
          <div className="flex items-center gap-2 text-[#8B5E3C] font-sans text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Delivery Time</span>
          </div>
          <p className="font-semibold text-base text-[#1F3D2B]">
            Orders are normally dispatched within 1–2 working days.
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Delivery time may vary depending on your location and courier service.
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#EADFD0]/60">
          <div className="flex items-center gap-2 text-[#8B5E3C] font-sans text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Delivery Charges</span>
          </div>
          <p className="font-semibold text-base text-[#1F3D2B]">
            Delivery charges are calculated according to your delivery location and order.
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Complimentary delivery is applied automatically on orders over Rs. 5,000.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EADFD0] space-y-1.5">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#8B5E3C] block">
            Important Notice
          </span>
          <p className="text-xs text-[#4A4A4A] leading-relaxed">
            Please make sure your delivery address and contact number are correct when placing your order. For any delivery questions, contact us on WhatsApp.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/contact"
          className="h-11 px-8 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span>Contact Us</span>
        </Link>
        <Link
          to="/track"
          className="h-11 px-8 rounded-full border border-[#1B5132] text-[#1B5132] hover:bg-[#FAF8F4] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
        >
          <span>Track Your Order</span>
        </Link>
      </div>
    </div>
  );
};
