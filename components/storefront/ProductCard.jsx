import React from 'react';

/**
 * Ceylon Crunch Module: components/storefront/ProductCard.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Productcard(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/storefront/ProductCard.jsx">
      {props?.children || null}
    </div>
  );
}
