import React from 'react';
import {
  Sparkles,
  Code2,
  Database,
  Radio,
  CreditCard,
  Bot,
  MessageCircle,
  Cpu,
  Layers,
  Shield,
  Palette,
  Zap,
} from 'lucide-react';

export const TechnologyStackSection: React.FC = () => {
  const stackGroups = [
    {
      category: 'Frontend Presentation & UI Core',
      icon: Layers,
      items: [
        {
          name: 'React 19.0.1',
          tag: 'UI Library',
          role: 'Next-generation concurrent rendering engine, optimized component hydration, and clean lifecycle primitives.',
        },
        {
          name: 'TypeScript 7.0',
          tag: 'Type Safety',
          role: 'Strict end-to-end data contracts across products, variants, cart states, and Supabase RPC procedures.',
        },
        {
          name: 'Vite 8.3',
          tag: 'Build Tooling',
          role: 'Sub-second Hot Module Replacement (HMR) and ultra-lean production rollups with minimal payload size.',
        },
        {
          name: 'Tailwind CSS v4',
          tag: 'Design System',
          role: 'CSS-first styling engine utilizing @theme tokens for harmonious brand colors, spacing, and mobile typography.',
        },
        {
          name: 'Framer Motion',
          tag: 'Micro-Interactions',
          role: 'Hardware-accelerated layout transitions, leaf sway animations, and subtle page reveal effects.',
        },
        {
          name: 'Lucide React',
          tag: 'Iconography',
          role: 'Crisp, lightweight SVG icons optimized for high-density mobile displays without bundle overhead.',
        },
      ],
    },
    {
      category: 'Backend, Database & Security Tier',
      icon: Database,
      items: [
        {
          name: 'Supabase PostgreSQL',
          tag: 'Database Core',
          role: 'Relational data store enforcing foreign key constraints, atomic multi-variant stock locking, and ACID guarantees.',
        },
        {
          name: 'Row Level Security (RLS)',
          tag: 'Data Isolation',
          role: 'PostgreSQL-level security policies guaranteeing patrons access only their personal orders and receipts.',
        },
        {
          name: 'Supabase Auth',
          tag: 'Identity & RBAC',
          role: 'Secure JWT authentication managing customer patron logins and multi-tier merchant dashboard permissions.',
        },
        {
          name: 'Supabase Cloud Storage',
          tag: 'Asset CDN & Slips',
          role: 'Encrypted storage buckets for customer bank transfer deposit slips and edge-cached high-resolution product photography.',
        },
        {
          name: 'Supabase Realtime',
          tag: 'WebSockets',
          role: 'Push-based WebSocket channels synchronizing stock deductions to open customer carts and live order feeds to the admin.',
        },
      ],
    },
    {
      category: 'Payment, AI & Logistics Integrations',
      icon: Cpu,
      items: [
        {
          name: 'PayHere Payment Gateway',
          tag: 'Card Settlement',
          role: 'Sri Lanka’s premier payment rail with server-side MD5 signature hashing, 3D Secure, and IPN webhook listeners.',
        },
        {
          name: 'Google Gemini 2.0 API',
          tag: 'Catalog Intelligence',
          role: '@google/genai SDK integration generating culinary tasting notes, food pairing suggestions, and SEO metadata.',
        },
        {
          name: 'WhatsApp Business Protocol',
          tag: 'Conversational Bridge',
          role: 'Deep-link URI generator formatting active cart items, variants, and delivery district into instant chat summaries.',
        },
        {
          name: '25-District Waybill Engine',
          tag: 'Fulfillment Logistics',
          role: 'Automated Sri Lankan phone normalizer (+94) and sequential CLN-XXXXXXXX-LK courier waybill generator.',
        },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            14 // Technology Stack
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            The Technology That <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Powered</span> It.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Every library, framework, and cloud service was carefully evaluated for zero bloat, long-term maintainability, and seamless integration with Sri Lanka's domestic infrastructure.
          </p>
        </div>

        {/* 3 Tech Stack Group Sections */}
        <div className="space-y-12">
          {stackGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.category} className="space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADFD0]">
                  <div className="w-8 h-8 rounded-lg bg-[#1F3D2B] text-[#D9A441] flex items-center justify-center">
                    <GroupIcon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                    {group.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="p-5 rounded-2xl bg-white border border-[#EADFD0] shadow-sm hover:border-[#1F3D2B]/30 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-mono text-sm font-bold text-[#1F3D2B]">
                            {tech.name}
                          </h4>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FAF6EF] text-[#8B5E3C] border border-[#EADFD0]">
                            {tech.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#202820]/75 leading-relaxed font-sans">
                          {tech.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
