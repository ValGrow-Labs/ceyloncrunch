import React from 'react';
import { ShieldCheck, Check, Sparkles } from 'lucide-react';

export const QualityPromise: React.FC = () => {
  const promises = [
    {
      title: 'Small-Batch Woodfire Roasting',
      desc: 'We never deep-fry or use commercial conveyor tunnels. Our nuts are toasted in small hand-tended pans over wild cinnamon wood embers, giving a nuanced smokiness and golden snap.',
    },
    {
      title: '72-Hour Freshness Window',
      desc: 'All batches are roasted within 72 hours of vacuum-sealing. This locks in the natural plant oils and volatile aromas before the humid tropical atmosphere can soften them.',
    },
    {
      title: 'Zero Chemical Bleaching or Preservatives',
      desc: 'Commercial white cashews are frequently bleached with sulphur or chlorine. Ceylon Crunch maintains the natural ivory and golden-tan tones of real, untouched tree nuts.',
    },
    {
      title: '100% Satisfaction Guarantee',
      desc: 'If any pack fails to deliver exceptional crispness and aroma upon opening, contact our Colombo concierge on WhatsApp within 48 hours for an immediate complimentary replacement.',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
          Our Standard of Excellence
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F3D2B] tracking-tight">
          The Quality Promise
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto">
          Every pack from our Colombo atelier meets rigorous sensory and botanical benchmarks.
        </p>
      </div>

      <div className="bg-white border border-[#EADFD0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#EADFD0] pb-4">
          <div className="w-12 h-12 rounded-full bg-[#c8ebd1] text-[#022111] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1F3D2B]">
              Handcrafted Integrity Charter
            </h2>
            <p className="text-xs text-[#6B6B6B]">Established Colombo, Sri Lanka</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {promises.map((p, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-[#f6f3f2] border border-[#EADFD0] text-[#2E7D4F] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#1F3D2B]">{p.title}</h3>
                <p className="text-xs sm:text-sm text-[#424843] leading-relaxed mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
