import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types/matricula';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  // Solo se muestra estrictamente 1 toast activo a la vez
  const activeToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;
  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'success';
  const isError = activeToast.type === 'error';
  const isWarning = activeToast.type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex justify-end">
      <div
        key={activeToast.id}
        role="status"
        aria-live="polite"
        className={`pointer-events-auto max-w-sm flex items-center gap-3 py-2.5 px-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
          isSuccess
            ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : isError
            ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            : isWarning
            ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
            : 'bg-slate-900/95 dark:bg-slate-800/95 border-slate-700 text-white'
        }`}
      >
        <div className="shrink-0">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-indigo-400" />}
        </div>

        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
          {activeToast.message}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(activeToast.id)}
          className="shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
