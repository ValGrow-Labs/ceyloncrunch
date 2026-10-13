import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-[#f6f3f2] border border-[#EADFD0] flex items-center justify-center text-[#8B5E3C] mb-4">
        <span className="material-symbols-outlined text-[42px]">explore_off</span>
      </div>

      <span className="text-xs uppercase font-bold tracking-widest text-[#8B5E3C]">
        404 · Page Not Found
      </span>

      <h1 className="font-serif text-3xl font-bold text-[#1F3D2B] mt-1 mb-2">
        Harvest Path Untravelled
      </h1>

      <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mb-6">
        The provisions or page you are looking for has moved or does not exist in our catalog.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="h-11 px-6 rounded-full bg-[#1F3D2B] hover:bg-[#162C1F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="h-11 px-6 rounded-full bg-white hover:bg-[#f6f3f2] text-[#1F3D2B] border border-[#EADFD0] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Shop</span>
        </Link>
      </div>
    </div>
  );
};
