import React, { useState } from 'react';
import { X, Award, Save, Edit3, Plus, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { RegistroAcademicoEstudiante, EvaluacionDetalle } from '../types/academic';
import { calcularPromedioPonderado } from '../data/calificacionesData';

interface GradesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicRecord: RegistroAcademicoEstudiante | null;
  onSaveRecord: (updated: RegistroAcademicoEstudiante) => void;
}

export const GradesManagerModal: React.FC<GradesManagerModalProps> = ({
  isOpen,
  onClose,
  academicRecord,
  onSaveRecord,
}) => {
  if (!isOpen || !academicRecord) return null;

  const [evaluaciones, setEvaluaciones] = useState<EvaluacionDetalle[]>(
    academicRecord.evaluaciones || []
  );
  const [observaciones, setObservaciones] = useState(
    academicRecord.observacionesGenerales || ''
  );
  const [asistencia, setAsistencia] = useState(
    academicRecord.asistenciaPorcentaje || 90
  );

  const { promedio, condicion, escalaLiteral } = calcularPromedioPonderado(evaluaciones);

  const handleUpdateNota = (id: string, newNota: number) => {
    const clamped = Math.min(10, Math.max(1, isNaN(newNota) ? 1 : newNota));
    setEvaluaciones((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, nota: Math.round(clamped * 10) / 10 } : ev))
    );
  };

  const handleUpdateFeedback = (id: string, feedback: string) => {
    setEvaluaciones((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, retroalimentacion: feedback } : ev))
    );
  };

  const handleSave = () => {
    const updated: RegistroAcademicoEstudiante = {
      ...academicRecord,
      evaluaciones,
      observacionesGenerales: observaciones,
      asistenciaPorcentaje: asistencia,
    };
    onSaveRecord(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grades-modal-title"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header with Darker contrast */}
        <div className="p-5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 id="grades-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Registro de Calificaciones & Desempeño
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alumno: <strong className="text-slate-800 dark:text-slate-200">{academicRecord.alumno}</strong> · Curso: {academicRecord.curso}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white dark:bg-slate-900 text-xs">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-400 block text-[11px]">Promedio Calculado</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {promedio.toFixed(1)}
                </span>
                <span className="text-slate-400">/ 10</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Condición del Alumno</span>
              <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                {condicion} ({escalaLiteral})
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Asistencia Global</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={asistencia}
                  onChange={(e) => setAsistencia(Number(e.target.value))}
                  className="w-16 px-2 py-1 font-mono font-bold border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">%</span>
              </div>
            </div>
          </div>

          {/* Evaluations Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Rubro / Evaluación</th>
                  <th className="py-2.5 px-3 text-center">Peso</th>
                  <th className="py-2.5 px-3 text-center">Nota (1-10)</th>
                  <th className="py-2.5 px-3">Retroalimentación del Docente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {evaluaciones.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {ev.codigo}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{ev.nombre}</p>
                      <span className="text-[11px] text-slate-400">{ev.categoria}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {ev.pesoPorcentaje}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={ev.nota}
                        onChange={(e) => handleUpdateNota(ev.id, parseFloat(e.target.value))}
                        className="w-18 px-2 py-1 text-center font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={ev.retroalimentacion}
                        onChange={(e) => handleUpdateFeedback(ev.id, e.target.value)}
                        placeholder="Comentarios pedagógicos..."
                        className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Observations Form */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Observaciones & Dictamen General de Secretaría Académica:
            </label>
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ingrese comentarios sobre el progreso, desempeño o recomendaciones para el alumno..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Cancelar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Calificaciones</span>
          </button>
        </div>
      </div>
    </div>
  );
};
