import React from 'react';

/**
 * Ceylon Crunch Module: app/(store)/layout.jsx
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Layout(props) {
  return (
    <div className="ceylon-crunch-module" data-module="app/(store)/layout.jsx">
      {props?.children || null}
    </div>
  );
}
