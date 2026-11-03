import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, MapPin, X } from 'lucide-react';
import { Distrito } from '../types/matricula';

interface DistritoDropdownProps {
  distritos: Distrito[];
  selectedDistrito: string;
  onSelect: (distrito: Distrito | null) => void;
  error?: string;
}

export const DistritoDropdown: React.FC<DistritoDropdownProps> = ({
  distritos,
  selectedDistrito,
  onSelect,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Todos');
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

  const filteredDistritos = useMemo(() => {
    return distritos.filter((d) => {
      const matchesSearch =
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.codigoPostal.includes(searchTerm);
      const matchesZone =
        selectedZone === 'Todos' || d.zona === selectedZone;
      return matchesSearch && matchesZone;
    });
  }, [distritos, searchTerm, selectedZone]);

  // Robust case-insensitive and trimmed match
  const activeDistritoObj = useMemo(() => {
    if (!selectedDistrito) return null;
    return distritos.find(
      (d) => d.nombre.trim().toLowerCase() === selectedDistrito.trim().toLowerCase()
    ) || null;
  }, [distritos, selectedDistrito]);

  const zones = ['Todos', 'Centro', 'Norte', 'Sur', 'Este', 'Oeste'];
  const hasSelection = Boolean(selectedDistrito && selectedDistrito.trim().length > 0);

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
          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          {hasSelection ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {activeDistritoObj ? activeDistritoObj.nombre : selectedDistrito}
              </span>
              {activeDistritoObj && (
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                  CP {activeDistritoObj.codigoPostal}
                </span>
              )}
              {activeDistritoObj && (
                <span className="hidden sm:inline text-xs text-slate-400 shrink-0">
                  · Zona {activeDistritoObj.zona}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">
              Seleccionar distrito de residencia...
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
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[380px]">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por distrito o código postal..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Zone Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    selectedZone === zone
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Districts List */}
          <div className="overflow-y-auto p-2 space-y-1 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredDistritos.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No se encontraron distritos coincidentes.
              </div>
            ) : (
              filteredDistritos.map((d) => {
                const isSelected = selectedDistrito?.trim().toLowerCase() === d.nombre.trim().toLowerCase();

                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelect(d);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold truncate">
                          {d.nombre}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          CP {d.codigoPostal}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Zona {d.zona}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
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
              {filteredDistritos.length} de {distritos.length} distritos disponibles
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
