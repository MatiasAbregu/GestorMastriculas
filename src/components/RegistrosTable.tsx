import React, { useState } from 'react';
import { Search, Printer, Edit2, Trash2, MapPin, FileText, Plus } from 'lucide-react';
import { MatriculaData } from '../types/matricula';

interface RegistrosTableProps {
  matriculas: MatriculaData[];
  onViewComprobante: (matricula: MatriculaData) => void;
  onEdit: (matricula: MatriculaData) => void;
  onDelete: (matricula: MatriculaData) => void;
  onNewMatricula: () => void;
}

export const RegistrosTable: React.FC<RegistrosTableProps> = ({
  matriculas,
  onViewComprobante,
  onEdit,
  onDelete,
  onNewMatricula,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMatriculas = matriculas.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.alumno.toLowerCase().includes(term) ||
      m.curso.toLowerCase().includes(term) ||
      m.distrito.toLowerCase().includes(term) ||
      (m.dni && m.dni.includes(term)) ||
      (m.numeroMatricula && m.numeroMatricula.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Darker Header */}
      <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Registro General de Matrículas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total de {matriculas.length} alumnos registrados en el sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por alumno, DNI o curso..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={onNewMatricula}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Matrícula</span>
          </button>
        </div>
      </div>

      {/* Body Table */}
      <div className="p-6 bg-white dark:bg-slate-900">
        {filteredMatriculas.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sin matrículas registradas</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              No se encontraron registros que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] bg-slate-100/90 dark:bg-slate-800">
                  <th className="py-3 px-4">Folio</th>
                  <th className="py-3 px-4">Alumno</th>
                  <th className="py-3 px-4">Curso Asignado</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Distrito & Dirección</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMatriculas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                      {item.numeroMatricula || 'MAT-2026-X'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{item.alumno}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>DNI: {item.dni || 'Sin DNI'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.sexo || 'Sin género'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{item.curso}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        Turno {item.turno || 'Regular'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {item.fechaMatricula}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.distrito}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate max-w-[180px]">
                        {item.direccion}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewComprobante(item)}
                          title="Ver e Imprimir Comprobante Oficial"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Editar Matrícula"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          title="Eliminar Registro"
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
