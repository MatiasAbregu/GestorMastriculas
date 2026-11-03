import React, { useState, useMemo } from 'react';
import { Search, Check, Layers, Clock, Users, ArrowUpRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { Curso } from '../types/matricula';

interface CursosCatalogProps {
  cursos: Curso[];
  selectedCurso: string;
  onSelectCurso: (curso: Curso) => void;
  onOpenCreate: () => void;
  onEditCurso?: (curso: Curso) => void;
  onDeleteCurso?: (curso: Curso) => void;
}

export const CursosCatalog: React.FC<CursosCatalogProps> = ({
  cursos,
  selectedCurso,
  onSelectCurso,
  onOpenCreate,
  onEditCurso,
  onDeleteCurso,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Desarrollo', 'Inteligencia Artificial', 'Cloud & DevOps', 'Ciberseguridad', 'Datos', 'Diseño UX/UI'];

  const filteredCursos = useMemo(() => {
    return cursos.filter((curso) => {
      const matchesSearch =
        curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'Todos' || curso.categoria === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [cursos, searchTerm, selectedCategory]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Catálogo de Cursos
            </h3>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              ({cursos.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Seleccione un curso o gestione la oferta académica
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar curso o código..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            title="Añadir nuevo curso"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-3 space-y-2 overflow-y-auto max-h-[380px] pr-1">
        {filteredCursos.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            No se encontraron cursos coincidentes.
          </div>
        ) : (
          filteredCursos.map((curso) => {
            const isSelected = selectedCurso === curso.nombre;

            return (
              <div
                key={curso.id}
                onClick={() => onSelectCurso(curso)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                        {curso.codigo}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">{curso.categoria}</span>
                      <span aria-hidden="true">·</span>
                      <span>{curso.nivel}</span>
                    </div>

                    <h4
                      className={`text-sm font-semibold truncate ${
                        isSelected
                          ? 'text-indigo-950 dark:text-indigo-200 font-bold'
                          : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}
                    >
                      {curso.nombre}
                    </h4>

                    {curso.descripcion && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                        {curso.descripcion}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {curso.duracion}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{curso.modalidad}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`flex items-center gap-1 font-mono tabular-nums ${
                          curso.cuposDisponibles <= 4
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-emerald-600 dark:text-emerald-400 font-medium'
                        }`}
                      >
                        <Users className="w-3 h-3" />
                        {curso.cuposDisponibles} cupos
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 mt-1">
                    {onEditCurso && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCurso(curso);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Editar curso"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onDeleteCurso && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCurso(curso);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Eliminar curso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isSelected ? (
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs ml-1">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors ml-1">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
