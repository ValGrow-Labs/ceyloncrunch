import React from 'react';
import { Search, Compass, Palette, Code2, CheckCheck, Sparkles } from 'lucide-react';
import { ProcessStep } from './types';

export const DesignProcessSection: React.FC = () => {
  const steps: ProcessStep[] = [
    {
      step: '01',
      title: 'Discovery & Research',
      duration: 'Week 1–2',
      description:
        'Audited Sri Lankan direct-to-consumer snacking landscape, analyzed customer ordering patterns on WhatsApp, and interviewed store operators to identify friction points in inventory tracking and payment reconciliation.',
      deliverables: [
        'Operations Audit Report',
        'Customer Journey Maps',
        '25-District Courier Logistics Matrix',
      ],
    },
    {
      step: '02',
      title: 'Experience Architecture',
      duration: 'Week 3–4',
      description:
        'Architected a 1-page checkout flow with automatic phone normalization, frictionless weight variant switching (100g to 1kg), and intuitive self-service package tracking.',
      deliverables: [
        'Low-Fidelity Mobile Wireframes',
        'Interactive Figma Prototype',
        'State Flow Diagrams',
      ],
    },
    {
      step: '03',
      title: 'Visual Design & Design System',
      duration: 'Week 5–6',
      description:
        'Established an artisanal luxury visual identity blending Sri Lankan harvest heritage with high-end editorial aesthetics. Selected Playfair Display serif paired with Inter sans-serif on Canvas Ivory.',
      deliverables: [
        'Semantic Design Tokens',
        'High-Resolution Editorial Mockups',
        'Interactive Component Library',
      ],
    },
    {
      step: '04',
      title: 'Full-Stack Engineering',
      duration: 'Week 7–9',
      description:
        'Built with React 19, TypeScript, and Vite. Implemented Supabase PostgreSQL with Row Level Security, PayHere MD5 signature hashing, encrypted payment slip cloud storage, and Headless CMS settings.',
      deliverables: [
        'Type-Safe Frontend Application',
        'Supabase PostgreSQL Schema & RLS',
        'PayHere Webhook Integration Engine',
      ],
    },
    {
      step: '05',
      title: 'Testing & Optimization',
      duration: 'Week 10',
      description:
        'Simulated high-concurrency order placement to verify atomic inventory locks. Throttled network speeds to 3G to guarantee sub-second mobile hydration, achieving a 95+ Google Lighthouse mobile benchmark.',
      deliverables: [
        'Automated Test Suite (tsx/node:test)',
        'Lighthouse 95+ Performance Audit',
        'Production Deployment on Vercel',
      ],
    },
  ];

  const icons = [Search, Compass, Palette, Code2, CheckCheck];

  return (
    <section id="process" className="py-20 lg:py-28 bg-[#FBF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3D2B]/8 text-[#1F3D2B] text-[11px] font-mono font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
            04 // Engineering Process
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1F3D2B] tracking-[-0.03em] leading-[1.04]">
            Designing the Experience <br className="hidden sm:block" />
            <span className="italic font-normal text-[#8B5E3C] pr-1">from the Ground</span> Up.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#202820]/80 leading-relaxed font-sans tracking-[-0.01em]">
            Our systematic 5-phase engineering methodology ensured zero guesswork — aligning business objectives, merchant ergonomics, and customer conversion rates from discovery to production launch.
          </p>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {/* Subtle connector line on desktop */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-[#EADFD0] -z-0" />

          {steps.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-6 border border-[#EADFD0] hover:border-[#1F3D2B]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative z-10 group"
              >
                <div>
                  {/* Step Bubble & Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] group-hover:bg-[#1F3D2B] text-[#1F3D2B] group-hover:text-[#D9A441] flex items-center justify-center transition-colors shadow-2xs font-mono font-bold text-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8B5E3C] px-2 py-0.5 rounded-full bg-[#FAF6EF]">
                      {item.duration}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#8B5E3C] block mb-1">
                    PHASE {item.step}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1F3D2B] leading-snug mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#202820]/75 leading-relaxed font-sans mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Key Deliverables */}
                <div className="pt-4 border-t border-[#FAF6EF]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5E3C] block mb-2">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5">
                    {item.deliverables.map((d) => (
                      <li key={d} className="text-[11px] text-[#202820]/90 flex items-start gap-1.5 font-sans">
                        <span className="w-1 h-1 rounded-full bg-[#2E7D4F] mt-1.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
