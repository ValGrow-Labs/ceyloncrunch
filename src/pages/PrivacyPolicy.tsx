import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B] pt-4">
        <Link to="/" className="hover:text-[#1F3D2B] transition-colors">Home</Link>
        <span>•</span>
        <span className="font-semibold text-[#1F3D2B]">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5132]/10 text-[#1B5132] text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3D2B] tracking-tight">
          Your Privacy Matters.
        </h1>
        <p className="text-xs text-[#6B6B6B]">Last updated: 2026</p>
      </div>

      {/* Content */}
      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-[#2B2B2B] leading-relaxed">
        <section className="space-y-3">
          <p>
            We respect your privacy and take reasonable steps to protect the information you provide when using our website or placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">Information We Collect</h2>
          <p>
            Information may include your name, contact number, email address and delivery details provided during order placement or contact inquiries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">How We Use Your Information</h2>
          <p>
            We use this information to process orders, arrange delivery, communicate with customers and improve our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">Data Protection & Privacy</h2>
          <p className="font-semibold text-[#1F3D2B]">
            We do not sell your personal information.
          </p>
          <p>
            Your information is stored securely and accessed only by authorized personnel involved in fulfilling your orders and inquiries.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#EADFD0]/60">
          <h2 className="font-serif text-base font-bold text-[#1F3D2B]">Contact Us</h2>
          <p>
            For questions regarding your information, please contact us at{' '}
            <a href="mailto:ceyloncrunch26@gmail.com" className="text-[#1B5132] font-semibold underline">
              ceyloncrunch26@gmail.com
            </a>{' '}
            or through WhatsApp at{' '}
            <a href="https://wa.me/94779443867" className="text-[#1B5132] font-semibold underline">
              +94 77 944 3867
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
