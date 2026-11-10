import React from 'react';
import { BookOpen, GraduationCap, Eye, Layers, ShieldCheck, Award, Users, ChevronRight } from 'lucide-react';
import { PortalMode } from '../types/academic';

interface HeaderProps {
  portal: PortalMode;
  onPortalChange: (portal: PortalMode) => void;
  activeView: 'formulario' | 'registros';
  onViewChange: (view: 'formulario' | 'registros') => void;
  onOpenHelp: () => void;
  onOpenAccessibility: () => void;
  onOpenCatalogManager: () => void;
  matriculasCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  portal,
  onPortalChange,
  activeView,
  onViewChange,
  onOpenHelp,
  onOpenAccessibility,
  onOpenCatalogManager,
  matriculasCount,
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand & Academic Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                CampusTech Académico
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
                Gestión de Admisiones & Calificaciones
              </span>
            </div>
          </div>

          {/* Zone 2: Segmented 3-Portal Switcher (Prolijo & Centrado) */}
          <div className="flex items-center">
            <nav
              aria-label="Selector de portales"
              className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
            >
              {/* 1. Portal Coordinador */}
              <button
                type="button"
                onClick={() => onPortalChange('coordinador')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  portal === 'coordinador'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Coordinación</span>
              </button>

              {/* 2. Portal Docente */}
              <button
                type="button"
                onClick={() => onPortalChange('docente')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  portal === 'docente'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Docentes</span>
              </button>

              {/* 3. Portal Estudiante */}
              <button
                type="button"
                onClick={() => onPortalChange('estudiante')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  portal === 'estudiante'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Estudiantes</span>
              </button>
            </nav>
          </div>

          {/* Zone 3: Contextual Sub-Nav + Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Contextual Coordinator Links */}
            {portal === 'coordinador' && (
              <div className="hidden xl:flex items-center gap-1 mr-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onViewChange('formulario')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeView === 'formulario'
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Ficha
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange('registros')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeView === 'registros'
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>Matrículas</span>
                  <span className="font-mono text-[10px] px-1 py-0.2 bg-slate-200 dark:bg-slate-700 rounded">
                    {matriculasCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onOpenCatalogManager}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Catálogos</span>
                </button>
              </div>
            )}

            {/* Contextual Docente indicator */}
            {portal === 'docente' && (
              <div className="hidden xl:flex items-center gap-1.5 mr-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Libro de Calificaciones (1 a 10)</span>
              </div>
            )}

            {/* Contextual Estudiante indicator */}
            {portal === 'estudiante' && (
              <div className="hidden xl:flex items-center gap-1.5 mr-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Expediente y Libreta de Notas</span>
              </div>
            )}

            {/* Accessibility Button */}
            <button
              type="button"
              onClick={onOpenAccessibility}
              title="Opciones de Accesibilidad"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Accesibilidad</span>
            </button>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
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
