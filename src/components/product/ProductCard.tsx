import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product, getLowestPrice, formatRs } from '../../data/products';
import { useStore } from '../../lib/store';
import { Plus, Check, Lock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useStore();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { price, inStock } = getLowestPrice(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find first in-stock variant
    const firstInStock = product.variants.find((v) => v.stock > 0) || product.variants[0];
    if (firstInStock && inStock) {
      addToCart(product, firstInStock, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const badgeColorClass = (() => {
    if (!inStock) return 'bg-[#e4e2e1] text-[#424843]';
    if (product.badge === 'Best Seller') return 'bg-[#ffdeaa] text-[#271900]';
    if (product.badge === 'Harvest Fresh') return 'bg-[#c8ebd1] text-[#022111]';
    if (product.badge === 'Signature') return 'bg-[#ffdcc5] text-[#301400]';
    if (product.badge === 'Low Stock') return 'bg-[#ffdad6] text-[#93000a]';
    return 'bg-[#FBF7F0] text-[#1F3D2B] border border-[#EADFD0]';
  })();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EADFD0] shadow-[0_4px_20px_-2px_rgba(139,94,60,0.06)] hover:shadow-[0_16px_32px_-4px_rgba(31,61,43,0.14)] hover:border-[#1F3D2B]/30 transition-shadow duration-300"
    >
      <Link to={`/product/${product.slug}`} className="relative w-full aspect-square bg-[#f6f3f2] overflow-hidden block">
        {!imageError && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
              !inStock ? 'grayscale opacity-75' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#EADFD0]/40 text-[#1F3D2B] text-center">
            <span className="material-symbols-outlined text-[32px] text-[#8B5E3C] mb-1">spa</span>
            <span className="font-serif text-xs font-semibold text-[#1F3D2B]">{product.name}</span>
          </div>
        )}

        {/* Subtle Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] font-bold tracking-wider uppercase shadow-xs ${badgeColorClass}`}
            >
              {!inStock ? 'Out of Stock' : product.badge}
            </span>
          </div>
        )}
      </Link>

      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <Link to={`/product/${product.slug}`} className="block">
          <span className="text-[11px] font-medium tracking-wider text-[#8B5E3C] uppercase block truncate mb-0.5">
            {product.subtitle || product.category.replace('-', ' ')}
          </span>
          <h3 className="font-serif text-[15px] leading-snug text-[#1F3D2B] font-semibold line-clamp-1 group-hover:text-[#B5741E] transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5 line-clamp-1">
            {product.origin}
          </p>
        </Link>

        <div className="flex items-center justify-between pt-3 mt-1.5 border-t border-[#EADFD0]/60">
          <div>
            <span className="text-[10px] text-[#6B6B6B] block leading-none font-medium">From</span>
            <span className="font-sans font-bold text-[#1F3D2B] text-[15px] tabular-nums">
              {formatRs(price)}
            </span>
          </div>

          {inStock ? (
            <motion.button
              type="button"
              onClick={handleQuickAdd}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              aria-label={`Add ${product.name} to cart`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                justAdded
                  ? 'bg-[#2E7D4F] text-white'
                  : 'bg-[#1F3D2B] hover:bg-[#B5741E] text-white'
              }`}
            >
              {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </motion.button>
          ) : (
            <button
              type="button"
              disabled
              aria-label={`${product.name} is out of stock`}
              className="w-9 h-9 rounded-full bg-[#f0eded] text-[#6B6B6B] flex items-center justify-center cursor-not-allowed opacity-70"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
