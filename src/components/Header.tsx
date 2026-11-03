import React from 'react';
import { BookOpen, GraduationCap, Eye, Layers } from 'lucide-react';

interface HeaderProps {
  activeView: 'formulario' | 'registros';
  onViewChange: (view: 'formulario' | 'registros') => void;
  onOpenHelp: () => void;
  onOpenAccessibility: () => void;
  onOpenCatalogManager: () => void;
  matriculasCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onOpenHelp,
  onOpenAccessibility,
  onOpenCatalogManager,
  matriculasCount,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              CampusTech Académico
            </span>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => onViewChange('formulario')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'formulario'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Ficha de Matrícula
            </button>
            <button
              type="button"
              onClick={() => onViewChange('registros')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'registros'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Matrículas Guardadas</span>
              <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md">
                {matriculasCount}
              </span>
            </button>
            <button
              type="button"
              onClick={onOpenCatalogManager}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gestionar Catálogos</span>
            </button>
          </nav>

          {/* Zone 3: Primary action + Accessibility */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Accessibility Button */}
            <button
              type="button"
              onClick={onOpenAccessibility}
              title="Opciones de Accesibilidad (Modo oscuro, tamaño de fuente, contraste)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Accesibilidad</span>
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Guía</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
