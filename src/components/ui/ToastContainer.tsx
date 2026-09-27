'use client';

import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300'
                : toast.type === 'error'
                ? 'bg-white/95 dark:bg-slate-900/95 border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-300'
                : toast.type === 'warning'
                ? 'bg-white/95 dark:bg-slate-900/95 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300'
                : 'bg-white/95 dark:bg-slate-900/95 border-indigo-300 dark:border-indigo-500/50 text-indigo-800 dark:text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 transition-opacity text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
