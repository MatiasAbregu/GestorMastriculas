import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, BookOpen, Clock, Users, X } from 'lucide-react';
import { Curso } from '../types/matricula';

interface CursoDropdownProps {
  cursos: Curso[];
  selectedCurso: string;
  onSelect: (curso: Curso | null) => void;
  error?: string;
}

export const CursoDropdown: React.FC<CursoDropdownProps> = ({
  cursos,
  selectedCurso,
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCursos = useMemo(() => {
    return cursos.filter((c) => {
      const matchesSearch =
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === 'Todos' || c.categoria === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [cursos, searchTerm, selectedCategory]);

  // Robust case-insensitive and trimmed match
  const activeCursoObj = useMemo(() => {
    if (!selectedCurso) return null;
    return cursos.find(
      (c) => c.nombre.trim().toLowerCase() === selectedCurso.trim().toLowerCase()
    ) || null;
  }, [cursos, selectedCurso]);

  const categories = ['Todos', 'Desarrollo', 'Inteligencia Artificial', 'Cloud & DevOps', 'Ciberseguridad', 'Datos', 'Diseño UX/UI'];

  const hasSelection = Boolean(selectedCurso && selectedCurso.trim().length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none shadow-2xs ${
          error
            ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300'
            : isOpen
            ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-slate-800'
            : hasSelection
            ? 'border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-400'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:border-slate-400'
        }`}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          {hasSelection ? (
            <div className="flex items-center gap-2 truncate">
              {activeCursoObj && (
                <span className="font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded shrink-0">
                  {activeCursoObj.codigo}
                </span>
              )}
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {activeCursoObj ? activeCursoObj.nombre : selectedCurso}
              </span>
              {activeCursoObj && (
                <span className="hidden sm:inline text-xs text-slate-400 shrink-0">
                  ({activeCursoObj.modalidad})
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">
              Seleccionar curso de computación del catálogo disponible...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {hasSelection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-md cursor-pointer"
              title="Quitar selección"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[420px]">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar curso por nombre, código o tecnología..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses List */}
          <div className="overflow-y-auto p-2 space-y-1 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredCursos.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No se encontraron cursos coincidentes.
              </div>
            ) : (
              filteredCursos.map((c) => {
                const isSelected = selectedCurso?.trim().toLowerCase() === c.nombre.trim().toLowerCase();

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelect(c);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 text-[11px]">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {c.codigo}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">{c.categoria}</span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                        <span className="text-slate-500 dark:text-slate-400">{c.nivel}</span>
                      </div>

                      <h4 className="text-xs font-semibold leading-snug truncate">
                        {c.nombre}
                      </h4>

                      <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {c.duracion}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{c.modalidad}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-mono tabular-nums ${
                            c.cuposDisponibles <= 4
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-emerald-600 dark:text-emerald-400 font-medium'
                          }`}
                        >
                          {c.cuposDisponibles} cupos libres
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {filteredCursos.length} de {cursos.length} cursos disponibles
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
