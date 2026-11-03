import React, { useState, useMemo } from 'react';
import { Search, MapPin, Check, ArrowUpRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { Distrito } from '../types/matricula';

interface DistritosCatalogProps {
  distritos: Distrito[];
  selectedDistrito: string;
  onSelectDistrito: (distrito: Distrito) => void;
  onOpenCreate: () => void;
  onEditDistrito?: (distrito: Distrito) => void;
  onDeleteDistrito?: (distrito: Distrito) => void;
}

export const DistritosCatalog: React.FC<DistritosCatalogProps> = ({
  distritos,
  selectedDistrito,
  onSelectDistrito,
  onOpenCreate,
  onEditDistrito,
  onDeleteDistrito,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Todos');

  const zones = ['Todos', 'Centro', 'Norte', 'Sur', 'Este', 'Oeste'];

  const filteredDistritos = useMemo(() => {
    return distritos.filter((dist) => {
      const matchesSearch =
        dist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.codigoPostal.includes(searchTerm);

      const matchesZone =
        selectedZone === 'Todos' || dist.zona === selectedZone;

      return matchesSearch && matchesZone;
    });
  }, [distritos, searchTerm, selectedZone]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Directorio de Distritos
            </h3>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              ({distritos.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zonas de residencia disponibles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por CP o zona..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            title="Añadir nuevo distrito"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Zone filter */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
        {zones.map((zone) => (
          <button
            key={zone}
            type="button"
            onClick={() => setSelectedZone(zone)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedZone === zone
                ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-3 space-y-2 overflow-y-auto max-h-[380px] pr-1">
        {filteredDistritos.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            No se encontraron distritos coincidentes.
          </div>
        ) : (
          filteredDistritos.map((dist) => {
            const isSelected = selectedDistrito === dist.nombre;

            return (
              <div
                key={dist.id}
                onClick={() => onSelectDistrito(dist)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? 'text-indigo-950 dark:text-indigo-200 font-bold'
                            : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}
                      >
                        {dist.nombre}
                      </h4>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                        CP {dist.codigoPostal}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Zona {dist.zona}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {onEditDistrito && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDistrito(dist);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Editar distrito"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onDeleteDistrito && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDistrito(dist);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Eliminar distrito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isSelected ? (
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs ml-1">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors ml-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
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
