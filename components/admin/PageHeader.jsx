import React from 'react';

/**
 * Ceylon Crunch Module: components/admin/PageHeader.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Pageheader(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/admin/PageHeader.jsx">
      {props?.children || null}
    </div>
  );
}
