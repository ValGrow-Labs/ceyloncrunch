import React from 'react';

/**
 * Ceylon Crunch Module: components/admin/AdminSidebar.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Adminsidebar(props) {
  return (
    <div className="ceylon-crunch-module" data-module="components/admin/AdminSidebar.jsx">
      {props?.children || null}
    </div>
  );
}
