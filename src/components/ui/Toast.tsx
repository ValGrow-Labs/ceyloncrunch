import React from 'react';
import { useStore } from '../../lib/store';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useStore();

  if (!toast) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="bg-[#1F3D2B] text-white px-4 py-3 rounded-full shadow-[0_12px_36px_rgba(31,61,43,0.35)] flex items-center justify-between gap-3 border border-[#c8ebd1]/20">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-[#c8ebd1] text-[#022111] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#022111]" />
          </div>
          <p className="font-sans text-[13px] text-white font-medium truncate">
            {toast.message}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                hideToast();
              }}
              className="px-2.5 py-1 rounded-full bg-[#D9A441] text-[#1F3D2B] text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={hideToast}
            aria-label="Dismiss message"
            className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
