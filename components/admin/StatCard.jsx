import React from 'react';

/**
 * Ceylon Crunch Module: components/admin/StatCard.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Statcard(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/admin/StatCard.jsx">
      {props?.children || null}
    </div>
  );
}
