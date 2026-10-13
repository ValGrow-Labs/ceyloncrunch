import React from 'react';
import { EthicalHarvestBanner } from '../components/product/EthicalHarvestBanner';
import { MapPin, Trees, Sun, Award } from 'lucide-react';

export const Sourcing: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
          Transparency & Terroir
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F3D2B] tracking-tight">
          Ethical Sourcing Journey
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto">
          Every nut, date, and spice in our catalog has an identifiable geographic lineage.
        </p>
      </div>

      <EthicalHarvestBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-[#EADFD0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-serif font-bold text-base">
            <MapPin className="w-4 h-4 text-[#8B5E3C]" />
            <span>Puttalam Coastal Cashew Belt</span>
          </div>
          <p className="text-xs text-[#424843] leading-relaxed">
            Known for high soil salinity and relentless equatorial sun, Puttalam produces the largest kernel density (Grade W-210) cashews in Asia with naturally creamy sweetness.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#EADFD0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-serif font-bold text-base">
            <Trees className="w-4 h-4 text-[#8B5E3C]" />
            <span>Matale Spice Highlands</span>
          </div>
          <p className="text-xs text-[#424843] leading-relaxed">
            Centuries-old agroforestry home gardens yielding heavy-grade black peppercorns and plump green cardamom pods packed with volatile essential oils.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#EADFD0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-serif font-bold text-base">
            <Sun className="w-4 h-4 text-[#8B5E3C]" />
            <span>Hambantota Traditional Salt Pans</span>
          </div>
          <p className="text-xs text-[#424843] leading-relaxed">
            Lagoon-evaporated mineral crystal salt gathered by hand. Unrefined, mild, and free from microplastics and chemical free-flowing additives.
          </p>
        </div>

        <div className="p-5 bg-white border border-[#EADFD0] rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-serif font-bold text-base">
            <Award className="w-4 h-4 text-[#8B5E3C]" />
            <span>Mirissa True Alba Cinnamon</span>
          </div>
          <p className="text-xs text-[#424843] leading-relaxed">
            True Ceylon cinnamon (Cinnamomum verum) quills scraped paper-thin and cured in ocean shade. Naturally low in coumarin.
          </p>
        </div>
      </div>
    </div>
  );
};
