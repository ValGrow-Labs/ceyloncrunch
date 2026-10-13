import React from 'react';

export const EthicalHarvestBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#f6f3f2] border border-[#EADFD0] rounded-2xl p-5 mb-8 shadow-sm relative overflow-hidden">
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full bg-[#c8ebd1] flex items-center justify-center shrink-0 text-[#082717] shadow-xs">
          <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
        </div>
        <div className="flex-1">
          <span className="font-sans text-[11px] text-[#8B5E3C] uppercase tracking-widest font-bold">
            Single-Origin Commitment
          </span>
          <h3 className="font-serif text-[18px] text-[#1F3D2B] font-semibold mt-0.5">
            Ethically Harvested in Sri Lanka
          </h3>
          <p className="text-[13px] text-[#424843] mt-1 leading-relaxed">
            Every batch of Ceylon Crunch provisions directly supports smallholder family orchards across Puttalam, Batticaloa, and Anuradhapura. Roasted in small pans within 72 hours of harvest and hand-graded for peak whole-nut integrity.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 text-[#1F3D2B] text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#D9A441]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span>100% Chemical-Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#D9A441]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_florist
              </span>
              <span>Small-Batch Roast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#D9A441]" style={{ fontVariationSettings: "'FILL' 1" }}>
                handshake
              </span>
              <span>Direct Fair-Trade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
