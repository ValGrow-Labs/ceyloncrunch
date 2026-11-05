import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Code2,
  Database,
  CreditCard,
  Bot,
  Truck,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ArchitectureNode } from './types';

export const TechnicalArchitectureSection: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('backend');

  const layers: ArchitectureNode[] = [
    {
      id: 'customer',
      layer: 'Layer 01 · Client Surface',
      title: 'Customer Experience Layer',
      subtitle: 'Mobile Web, PWA & Desktop Storefront',
      technologies: ['Mobile-First Responsive Web', 'Browser Cache & LocalStorage', 'WhatsApp Click-to-Chat'],
      responsibilities: [
        'Render sub-second product pages with zero layout shift',
        'Persist local cart and saved patron delivery preferences',
        'Normalize Sri Lankan mobile phone numbers on client entry',
      ],
      protocols: ['HTTPS / HTTP3 Edge', 'WebP Adaptive Imagery'],
    },
    {
      id: 'frontend',
      layer: 'Layer 02 · Presentation Engine',
      title: 'Frontend Application Layer',
      subtitle: 'Modern React 19 & TypeScript Core',
      technologies: ['React 19.0.1', 'TypeScript 7.0', 'Vite 8.3', 'Tailwind CSS v4', 'Framer Motion'],
      responsibilities: [
        'Single-page client routing via React Router DOM',
        'Stateful StoreContext managing live cart and multi-variant pricing',
        'Dynamic district tariff computation covering 25 administrative areas',
      ],
      protocols: ['ES Modules (HMR)', 'Client-Side Routing', 'Atomic State Hooks'],
    },
    {
      id: 'backend',
      layer: 'Layer 03 · Data & Security Tier',
      title: 'Backend & Database Architecture',
      subtitle: 'Supabase Managed PostgreSQL & Realtime',
      technologies: ['Supabase PostgreSQL', 'Row Level Security (RLS)', 'Supabase Auth', 'Storage Buckets', 'Realtime WebSockets'],
      responsibilities: [
        'Single source of truth for products, orders, and patron accounts',
        'Strict RLS ensuring patrons only access their own order records',
        'Encrypted storage bucket for customer payment slips',
        'WebSocket publication of live stock updates and order status shifts',
      ],
      protocols: ['PostgreSQL 15', 'JSON-RPC', 'TLS 1.3 / WSS', 'JWT Claims'],
    },
    {
      id: 'payments',
      layer: 'Layer 04 · Transaction Rails',
      title: 'Multi-Rail Payment Gateway Layer',
      subtitle: 'PayHere, Slip Uploads & COD Orchestration',
      technologies: ['PayHere Payment Gateway', 'Server-Side MD5 Hasher', 'IPN Webhook Verifier', 'Supabase Storage'],
      responsibilities: [
        'Generate tamper-proof MD5 signatures for PayHere checkout sessions',
        'Receive and verify asynchronous Instant Payment Notifications (IPN)',
        'Store and securely present manual bank transfer slips in admin panel',
      ],
      protocols: ['HMAC / MD5 Signature', 'HTTPS POST Webhook', '200 OK Ack'],
    },
    {
      id: 'ai',
      layer: 'Layer 05 · Intelligence Services',
      title: 'Generative AI Operations Layer',
      subtitle: 'Google Gemini 2.0 API Integration',
      technologies: ['@google/genai SDK', 'Gemini 2.0 Flash', 'Structured JSON Output'],
      responsibilities: [
        'Generate appetizing, artisanal product descriptions from raw ingredients',
        'Synthesize culinary food pairing suggestions and tasting notes',
        'Produce SEO meta descriptions and Open Graph snippets for new SKUs',
      ],
      protocols: ['REST API (Gemini Cloud)', 'Strict Prompt Injection Guardrails'],
    },
    {
      id: 'logistics',
      layer: 'Layer 06 · Fulfillment Engine',
      title: 'Courier & Logistics Dispatch Layer',
      subtitle: '25-District Matrix & Waybill Tracking',
      technologies: ['Automated Waybill Generator', 'District Tariff Lookup', '5-Stage Delivery Pipeline'],
      responsibilities: [
        'Generate unique courier waybills (CLN-XXXXXXXX-LK)',
        'Assign automated package tracking statuses from Placed to Delivered',
        'Export courier dispatch batches for domestic logistics partners',
      ],
      protocols: ['Automated Waybill Numbering', 'SMS API Webhooks'],
    },
    {
      id: 'admin',
      layer: 'Layer 07 · Merchant Operations',
      title: 'Merchant Command Center (Admin CMS)',
      subtitle: 'Headless Operations & Role-Based Control',
      technologies: ['Admin Dashboard UI', 'Headless Site Settings CMS', 'Multi-Variant Stock Controller', 'RBAC Matrix'],
      responsibilities: [
        'Real-time financial KPI analytics (Revenue, AOV, Orders count)',
        'Visual editing of announcement bar, hero banners, and shipping rates',
        'One-click order status progression and bank slip payment verification',
      ],
      protocols: ['Protected Admin Route Guard', 'Supabase Auth Session Validation'],
    },
  ];

  const activeLayerData = layers.find((l) => l.id === selectedLayer) || layers[2];

  return (
    <section id="architecture" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            08 // System Architecture
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            The Engine Behind <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">the Experience</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            A resilient, multi-tiered architecture designed to ensure zero downtime, absolute data integrity across multi-variant inventory, and instant payment settlement.
          </p>
        </div>

        {/* Interactive Architecture Tier Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 7 Interactive Tiers (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {layers.map((item, idx) => {
              const isSelected = item.id === selectedLayer;
              const icons = [Smartphone, Code2, Database, CreditCard, Bot, Truck, LayoutDashboard];
              const Icon = icons[idx];
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedLayer(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md translate-x-1.5'
                      : 'bg-white text-[#202820] border-[#EADFD0] hover:border-[#1F3D2B]/30 hover:bg-[#FAF6EF]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-[#D9A441]' : 'bg-[#FAF6EF] text-[#1F3D2B]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-widest block ${
                          isSelected ? 'text-[#D9A441]' : 'text-[#8B5E3C]'
                        }`}
                      >
                        {item.layer}
                      </span>
                      <h4
                        className={`font-serif text-sm sm:text-base font-bold leading-tight ${
                          isSelected ? 'text-white' : 'text-[#1F3D2B]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-[11px] font-sans ${
                          isSelected ? 'text-white/70' : 'text-[#202820]/60'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[#D9A441] translate-x-1' : 'text-[#EADFD0]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Layer Inspector & Protocol Specs (6 cols) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD0] shadow-[0_16px_40px_rgba(31,61,43,0.08)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#FAF6EF]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block">
                    {activeLayerData.layer}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1F3D2B] mt-0.5">
                    {activeLayerData.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#1F3D2B]/5 text-[#1F3D2B] flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
              </div>

              {/* Technologies Utilized */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                  Key Technologies & Frameworks:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeLayerData.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#FAF6EF] text-[#1F3D2B] border border-[#EADFD0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Responsibilities */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                  System Responsibilities:
                </span>
                <ul className="space-y-2">
                  {activeLayerData.responsibilities.map((r, i) => (
                    <li key={i} className="text-xs text-[#202820]/85 flex items-start gap-2 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protocols & Security */}
              <div className="pt-4 border-t border-[#FAF6EF] bg-[#FAF6EF] rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-1">
                  Protocols & Security Guardrails:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-[#1F3D2B]">
                  {activeLayerData.protocols.map((p) => (
                    <span key={p} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                      <span>{p}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
