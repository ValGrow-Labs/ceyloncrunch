import React from 'react';

/**
 * Ceylon Crunch Module: components/admin/AdminTopBar.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Admintopbar(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/admin/AdminTopBar.jsx">
      {props?.children || null}
    </div>
  );
}
