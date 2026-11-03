import React from 'react';
import { Sun, Moon, Type, Eye, X } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontScale = 'sm' | 'md' | 'lg';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  fontScale: FontScale;
  onFontScaleChange: (scale: FontScale) => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  fontScale,
  onFontScaleChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 id="accessibility-title" className="text-sm font-bold text-slate-900 dark:text-white">
                Opciones de Accesibilidad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajuste visual de tema y tamaño tipográfico
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Modo Oscuro / Claro */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Tema y Apariencia
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Claro</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Oscuro</span>
              </button>

              <button
                type="button"
                onClick={() => onThemeChange('system')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>Automático</span>
              </button>
            </div>
          </div>

          {/* Tamaño de Fuente */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2 flex items-center justify-between">
              <span>Tamaño de Tipografía</span>
              <span className="font-mono text-[11px] text-slate-400">
                {fontScale === 'sm' ? 'Estándar (100%)' : fontScale === 'md' ? 'Mediano (+15%)' : 'Grande (+30%)'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onFontScaleChange('sm')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  fontScale === 'sm'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-xs block font-bold">A</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Estándar</span>
              </button>

              <button
                type="button"
                onClick={() => onFontScaleChange('md')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  fontScale === 'md'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-sm block font-bold">A+</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Mediano</span>
              </button>

              <button
                type="button"
                onClick={() => onFontScaleChange('lg')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  fontScale === 'lg'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-base block font-bold">A++</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Grande</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Aplicar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
