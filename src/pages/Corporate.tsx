import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, CheckCircle2, Send, Phone, MessageSquare, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';

export const Corporate: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'Corporate Office',
    quantity: '',
    deliveryDate: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const suitableFor = [
    'Corporate Offices',
    'Hotels',
    'Restaurants',
    'Gyms',
    'Cafés',
    'Events',
    'Weddings & Nikah',
    'Gift Hampers',
    'Retailers',
  ];

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 pt-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B5132]/10 text-[#1B5132] text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          <span>Business Orders</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5132] tracking-tight">
          Buying for a Business or Event?
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          We supply products for businesses, events and larger orders. Whether you're looking for staff gifts, corporate hampers, event packs or regular supply, speak to us about your requirements.
        </p>
      </div>

      {/* Suitable For Strip */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-[#8B5E3C] font-sans text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Suitable For</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {suitableFor.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F4] border border-[#EADFD0]/60 text-xs sm:text-sm font-semibold text-[#1F3D2B]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Form & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-7 bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#E6ECE2] text-[#2E7D4F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                Enquiry Received
              </h2>
              <p className="text-sm text-[#4A4A4A] max-w-md mx-auto">
                Thank you for reaching out. Our business team will review your requirements and contact you within 24 business hours.
              </p>
              <a
                href="https://wa.me/94779443867"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
                  Tell Us What You Need
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  Share your required quantity and preferred delivery date.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Corp / Colombo Hotel"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Your Name"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Estimated Quantity *</label>
                  <input
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 50 hampers / 100 packs"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">Requirements & Details</label>
                <textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Tell us what products you need, custom branding requirements, budget per unit, etc."
                  className="w-full p-3.5 rounded-xl border border-[#EADFD0] text-sm focus:outline-none focus:border-[#1F3D2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#1B5132] hover:bg-[#143E26] text-white font-sans text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>
            </form>
          )}
        </div>

        {/* Benefits & Direct Contact */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F4] border border-[#EADFD0] rounded-2xl p-6 space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
              Why Partner with Ceylon Crunch?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#4A4A4A]">
                <ShieldCheck className="w-5 h-5 text-[#2E7D4F] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3D2B]">Carefully Selected Quality</strong>
                  Products chosen with attention to freshness, grade, and taste.
                </div>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#4A4A4A]">
                <Clock className="w-5 h-5 text-[#2E7D4F] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3D2B]">Reliable Scheduled Delivery</strong>
                  Dispatched on time across Colombo and all island-wide districts.
                </div>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-[#4A4A4A]">
                <Building2 className="w-5 h-5 text-[#2E7D4F] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F3D2B]">Custom Packaging & Hampers</strong>
                  Bespoke branding, ribbons, and personalized cards for corporate events.
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 text-center space-y-3">
            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider block">
              Prefer Immediate Assistance?
            </span>
            <p className="text-xs sm:text-sm text-[#4A4A4A]">
              Connect directly with our corporate team via WhatsApp or phone call.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href="https://wa.me/94779443867"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-10 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+94779443867"
                className="flex-1 h-10 rounded-full border border-[#1B5132] text-[#1B5132] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#FAF8F4] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+94 77 944 3867</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
