import React from 'react';

/**
 * Ceylon Crunch Module: app/admin/layout.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Layout(props) {
  return (
    <div className="ceylon-crunch-module" data-module="app/admin/layout.jsx">
      {props?.children || null}
    </div>
  );
}
