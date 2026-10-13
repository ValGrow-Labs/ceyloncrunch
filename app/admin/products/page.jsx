import React from 'react';

/**
 * Ceylon Crunch Module: app/admin/products/page.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Page(props) {
  return (
    <div className="ceylon-crunch-module" data-module="app/admin/products/page.jsx">
      {props?.children || null}
    </div>
  );
}
