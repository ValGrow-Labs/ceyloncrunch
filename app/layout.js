import React from 'react';

/**
 * Ceylon Crunch Module: app/layout.js
 * Framework: Next.js 16 & React 19 | Backend: Supabase (PostgreSQL, Auth, Storage) | Gateway: PayHere
 */
export default function Layout(props) {
  return (
    <div className="ceylon-crunch-module" data-module="app/layout.js">
      {props?.children || null}
    </div>
  );
}
