import React, { useState } from 'react';
import {
  Sparkles,
  CreditCard,
  FileCheck,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  UploadCloud,
  FileText,
} from 'lucide-react';

export const PaymentLogisticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payhere' | 'bank' | 'cod'>('payhere');
  const [demoStep, setDemoStep] = useState<number>(2);

  return (
    <section id="payments" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            10 // Financial Settlement
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Local Commerce. <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Global-Grade</span> Engineering.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            We architected a robust multi-rail payment engine tailored to Sri Lanka's domestic e-commerce habits — supporting encrypted card transactions, verifiable deposit slips, and cash on delivery.
          </p>
        </div>

        {/* 3 Integration Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Panel 1: PayHere Online Payments */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Rail 01 · Payment Gateway
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                PayHere Online Card Gateway
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Seamless credit & debit card processing. Employs server-side cryptographic MD5 signature hashing to prevent client tampering.
              </p>

              {/* MD5 Hash Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2">
                <span className="text-[10px] font-mono text-[#8B5E3C] uppercase block font-bold">
                  Tamper-Proof Hash Formulation:
                </span>
                <code className="block text-[11px] font-mono text-[#1F3D2B] bg-white p-2 rounded border border-[#EADFD0] break-all leading-tight">
                  UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(secret))))
                </code>
                <div className="text-[10px] text-[#2E7D4F] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> IPN Webhook Verified with 200 OK
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAF6EF] text-xs text-[#1F3D2B] font-semibold flex items-center justify-between">
              <span>Visa / Mastercard / Amex</span>
              <span className="text-[#2E7D4F]">Zero Fraud Dispute</span>
            </div>
          </div>

          {/* Panel 2: Direct Bank Transfer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Rail 02 · Manual Verification
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                Direct Bank Transfer & Slip Upload
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Enables traditional shoppers to deposit directly to Commercial Bank / Sampath Bank. Receipts are uploaded to encrypted cloud storage buckets.
              </p>

              {/* Slip Upload Demo */}
              <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#1F3D2B] font-semibold">slip_cc_842915.jpg</span>
                  <span className="text-[10px] text-[#2E7D4F] bg-white px-2 py-0.5 rounded border border-[#EADFD0]">
                    Verified
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#EADFD0] flex items-center gap-2 text-[#8B5E3C]">
                  <UploadCloud className="w-4 h-4 text-[#D9A441]" />
                  <span className="text-[11px] font-mono">Presigned URL in Supabase Storage</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAF6EF] text-xs text-[#1F3D2B] font-semibold flex items-center justify-between">
              <span>Admin Slip Viewer</span>
              <span className="text-[#8B5E3C]">1-Click Verification</span>
            </div>
          </div>

          {/* Panel 3: Cash on Delivery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block mb-1">
                Rail 03 · Doorstep Handover
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B] mb-2 leading-snug">
                District-Aware Cash on Delivery
              </h3>
              <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                Available across all 25 districts with courier-specific threshold validation and automated delivery fee inclusion on printed waybills.
              </p>

              {/* Waybill Demo */}
              <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#EADFD0] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B5E3C]">WAYBILL REF:</span>
                  <span className="font-bold text-[#1F3D2B]">CLN-48291054-LK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B5E3C]">COD Collect:</span>
                  <span className="font-bold text-[#2E7D4F]">LKR 4,050.00</span>
                </div>
                <div className="text-[10px] text-[#8B5E3C] pt-1 border-t border-[#EADFD0]">
                  Courier: PromptX Urban Express
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAF6EF] text-xs text-[#1F3D2B] font-semibold flex items-center justify-between">
              <span>National Reach</span>
              <span className="text-[#2E7D4F]">All 25 Districts</span>
            </div>
          </div>
        </div>

        {/* Checkout Payment Flow Sequence Simulator */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block">
              Transaction State Machine
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1F3D2B] mt-0.5">
              Checkout-to-Settlement Sequence
            </h3>
            <p className="text-xs sm:text-sm text-[#202820]/80 mt-1 font-sans">
              Click any step to inspect the state transition and server response:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: '01', title: 'Customer Selection', desc: 'Selects Card / Bank / COD on checkout' },
              { num: '02', title: 'Payment Initiation', desc: 'Computes hash or requests slip upload' },
              { num: '03', title: 'Gateway Processing', desc: 'PayHere 3D Secure / Slip storage write' },
              { num: '04', title: 'IPN Verification', desc: 'Server confirms webhook signature' },
              { num: '05', title: 'Order Confirmed', desc: 'Status set to Confirmed & waybill issued' },
            ].map((s, idx) => (
              <button
                key={s.num}
                onClick={() => setDemoStep(idx + 1)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  demoStep === idx + 1
                    ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md scale-102'
                    : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                }`}
              >
                <span
                  className={`text-xs font-mono font-bold block mb-1 ${
                    demoStep === idx + 1 ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                  }`}
                >
                  Step {s.num}
                </span>
                <h5 className="font-serif text-xs font-bold leading-snug mb-1">{s.title}</h5>
                <p
                  className={`text-[10px] leading-tight font-sans ${
                    demoStep === idx + 1 ? 'text-white/75' : 'text-[#202820]/70'
                  }`}
                >
                  {s.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
