import React from 'react';

/**
 * Ceylon Crunch Module: components/storefront/Navbar.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Navbar(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/storefront/Navbar.jsx">
      {props?.children || null}
    </div>
  );
}
