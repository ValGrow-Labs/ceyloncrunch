import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Lock,
  HardDrive,
  Radio,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const BackendDatabaseSection: React.FC = () => {
  const [activeTable, setActiveTable] = useState<string>('products');

  const tables = [
    {
      name: 'products',
      label: 'Products Catalog',
      desc: 'Master product metadata, slug, category, badges, and origin.',
      fields: ['id (UUID, PK)', 'slug (TEXT, Unique)', 'name (TEXT)', 'category (TEXT)', 'rating (DECIMAL)', 'is_featured (BOOL)'],
      relations: ['1-to-Many -> product_variants', 'Many-to-1 -> categories'],
    },
    {
      name: 'product_variants',
      label: 'Product Variants',
      desc: 'Granular packaging weights (100g to 1kg) with individual pricing and live stock.',
      fields: ['id (UUID, PK)', 'product_id (FK)', 'weight (TEXT)', 'price (DECIMAL)', 'stock (INT)', 'sku (TEXT)'],
      relations: ['Many-to-1 -> products', '1-to-Many -> order_items'],
    },
    {
      name: 'orders',
      label: 'Customer Orders',
      desc: 'Central transactional order header containing customer snapshot, shipping, and total.',
      fields: ['id (TEXT, PK, CC-XXXXXX)', 'customer_id (FK)', 'status (TEXT)', 'subtotal (DECIMAL)', 'delivery_fee (DECIMAL)', 'total (DECIMAL)', 'waybill (TEXT)'],
      relations: ['1-to-Many -> order_items', '1-to-1 -> payments', '1-to-1 -> delivery'],
    },
    {
      name: 'order_items',
      label: 'Order Line Items',
      desc: 'Specific variant line items purchased in an order.',
      fields: ['id (UUID, PK)', 'order_id (FK)', 'variant_id (FK)', 'quantity (INT)', 'price_at_purchase (DECIMAL)'],
      relations: ['Many-to-1 -> orders', 'Many-to-1 -> product_variants'],
    },
    {
      name: 'payments',
      label: 'Payment Records',
      desc: 'Multi-rail payment settlement tracking (PayHere reference, Slip URL, Status).',
      fields: ['id (UUID, PK)', 'order_id (FK)', 'method (card|bank|cod)', 'status (pending|verified)', 'payhere_ref (TEXT)', 'slip_url (TEXT)'],
      relations: ['1-to-1 -> orders'],
    },
    {
      name: 'delivery',
      label: 'Delivery & Logistics',
      desc: '25-district destination details, courier waybill, and estimated arrival.',
      fields: ['id (UUID, PK)', 'order_id (FK)', 'district (TEXT)', 'street (TEXT)', 'waybill_no (TEXT)', 'courier_name (TEXT)'],
      relations: ['1-to-1 -> orders'],
    },
    {
      name: 'site_settings',
      label: 'Headless Site Settings',
      desc: 'Key-value config for banners, announcements, tariffs, and hero copy.',
      fields: ['key (TEXT, PK)', 'value (JSONB)', 'updated_at (TIMESTAMP)', 'updated_by (FK)'],
      relations: ['Standalone global configuration store'],
    },
    {
      name: 'admin_users',
      label: 'Admin Users & RBAC',
      desc: 'Role-based access credentials (Admin, Manager, Staff) mapped to Supabase Auth.',
      fields: ['id (UUID, PK)', 'auth_id (FK)', 'role (TEXT)', 'email (TEXT)', 'full_name (TEXT)'],
      relations: ['1-to-1 -> auth.users'],
    },
  ];

  const currentTable = tables.find((t) => t.name === activeTable) || tables[0];

  return (
    <section id="database" className="py-20 lg:py-28 bg-[#FAF6EF] border-t border-b border-[#EADFD0]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            09 // Database Tier
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Reliability Starts <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">Behind the</span> Interface.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            We utilized Supabase PostgreSQL as the authoritative single source of truth. Strict Row Level Security policies guarantee customer privacy while real-time WebSocket channels broadcast instant stock updates.
          </p>
        </div>

        {/* 4 Pillars of Backend Engineering */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Row Level Security',
              desc: 'Patrons can only read and mutate their own order history and profiles via verified Supabase JWT claims.',
              icon: Lock,
            },
            {
              title: 'Realtime WebSockets',
              desc: 'Instantly syncs variant inventory decreases to storefronts across all active client sessions within milliseconds.',
              icon: Radio,
            },
            {
              title: 'Secure Cloud Storage',
              desc: 'Dedicated encrypted buckets for customer bank transfer deposit slips with private presigned URLs.',
              icon: HardDrive,
            },
            {
              title: 'Atomic RPC Procedures',
              desc: 'Checkout order creation and inventory deductions execute within atomic database transactions to eliminate race conditions.',
              icon: FileCode2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#EADFD0] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] text-[#1F3D2B] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#202820]/75 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive ERD (Entity Relationship Explorer) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#FAF6EF] mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5E3C] block">
                PostgreSQL Schema Explorer
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                Relational Database Entity Model
              </h3>
            </div>
            <div className="text-xs font-mono text-[#8B5E3C] bg-[#FAF6EF] px-3 py-1.5 rounded-full border border-[#EADFD0]">
              * Verified against Ceylon Crunch production schema
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table Selection Pills (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                Select Table to Inspect:
              </span>
              {tables.map((tbl) => (
                <button
                  key={tbl.name}
                  onClick={() => setActiveTable(tbl.name)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${
                    activeTable === tbl.name
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-2xs font-bold'
                      : 'bg-[#FAF6EF] text-[#202820] border-[#EADFD0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 opacity-80" />
                    <span>{tbl.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>

            {/* Table Inspector (8 cols) */}
            <div className="lg:col-span-8 bg-[#FAF6EF] rounded-2xl p-6 border border-[#EADFD0] space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xl font-bold text-[#1F3D2B]">
                    Table: <span className="font-mono text-lg text-[#8B5E3C]">{currentTable.name}</span>
                  </h4>
                  <span className="text-xs font-mono text-[#2E7D4F] bg-white px-2.5 py-1 rounded-md border border-[#EADFD0]">
                    RLS Enabled
                  </span>
                </div>
                <p className="text-xs text-[#202820]/80 mt-1 font-sans">
                  {currentTable.desc}
                </p>
              </div>

              {/* Column Fields */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                  Key Schema Columns:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTable.fields.map((f) => (
                    <div
                      key={f}
                      className="p-2.5 rounded-lg bg-white border border-[#EADFD0] font-mono text-xs text-[#1F3D2B]"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Foreign Relationships */}
              <div className="pt-3 border-t border-[#EADFD0]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                  Entity Relationships & Foreign Keys:
                </span>
                <div className="space-y-1">
                  {currentTable.relations.map((rel) => (
                    <div
                      key={rel}
                      className="text-xs font-mono text-[#8B5E3C] flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3 h-3 text-[#D9A441]" />
                      <span>{rel}</span>
                    </div>
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
