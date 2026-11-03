import React from 'react';
import { Save, RotateCcw, XCircle, LogOut } from 'lucide-react';
import { MatriculaData } from '../types/matricula';

interface ActionPanelProps {
  formData: MatriculaData;
  isSaving: boolean;
  isEditing: boolean;
  isDirty: boolean;
  onSave: () => void;
  onClear: () => void;
  onCancel: () => void;
  onExit: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  formData,
  isSaving,
  isEditing,
  isDirty,
  onSave,
  onClear,
  onCancel,
  onExit,
}) => {
  return (
    <div className="space-y-6">
      {/* Card 1: Acciones de Registro */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Darker Header */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Acciones de Registro
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Control de operaciones de matrícula
          </p>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-3 bg-white dark:bg-slate-900">
          {/* 1. Guardar Matrícula (Primary Button) */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full py-3 px-4 bg-[#5046e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-between cursor-pointer group disabled:opacity-60"
          >
            <span className="flex items-center gap-2.5">
              <Save className="w-4 h-4 transition-transform group-hover:scale-105" />
              <span>{isSaving ? 'Guardando...' : isEditing ? 'Actualizar Matrícula' : 'Guardar Matrícula'}</span>
            </span>
            <kbd className="px-2 py-0.5 text-xs font-medium font-sans bg-black/20 rounded text-white/90">
              Ctrl+S
            </kbd>
          </button>

          {/* 2. Limpiar Formulario */}
          <button
            type="button"
            onClick={onClear}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 active:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Limpiar Formulario</span>
            </span>
            <kbd className="text-slate-400 dark:text-slate-500 text-xs font-mono">
              Ctrl+L
            </kbd>
          </button>

          {/* 3. Descartar Cambios */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 active:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
          >
            <span className="flex items-center gap-2.5">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span>Descartar Cambios</span>
            </span>
            <kbd className="text-slate-400 dark:text-slate-500 text-xs font-mono">
              Esc
            </kbd>
          </button>

          {/* 4. Salir */}
          <button
            type="button"
            onClick={onExit}
            className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Card 2: RESUMEN DE FICHA EN CURSO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Darker Header */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 px-5 py-3 border-b border-slate-200 dark:border-slate-700/80">
          <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            RESUMEN DE FICHA EN CURSO
          </h4>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 bg-white dark:bg-slate-900">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">
              Estudiante
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {formData.alumno ? formData.alumno : 'Esperando datos del alumno...'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">
              Curso tecnológico
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">
              {formData.curso ? formData.curso : 'No seleccionado'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-medium">
              Distrito
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {formData.distrito ? formData.distrito : 'No seleccionado'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Estado</span>
            {isDirty ? (
              <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                Borrador modificado
              </span>
            ) : formData.alumno && formData.curso ? (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Listo para registrar
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 inline-block"></span>
                Formulario inicial
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
