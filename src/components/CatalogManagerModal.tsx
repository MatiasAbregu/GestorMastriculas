import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, BookOpen, MapPin, Search, AlertCircle, LogOut } from 'lucide-react';
import { Curso, Distrito } from '../types/matricula';

interface CatalogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cursos' | 'distritos';
  cursos: Curso[];
  distritos: Distrito[];
  onSaveCurso: (curso: Curso) => void;
  onDeleteCurso: (id: string) => void;
  onSaveDistrito: (distrito: Distrito) => void;
  onDeleteDistrito: (id: string) => void;
}

export const CatalogManagerModal: React.FC<CatalogManagerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'cursos',
  cursos,
  distritos,
  onSaveCurso,
  onDeleteCurso,
  onSaveDistrito,
  onDeleteDistrito,
}) => {
  const [activeTab, setActiveTab] = useState<'cursos' | 'distritos'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Course Form State
  const [isEditingCurso, setIsEditingCurso] = useState(false);
  const [cursoFormData, setCursoFormData] = useState<Partial<Curso>>({
    codigo: '',
    nombre: '',
    categoria: 'Desarrollo',
    nivel: 'Profesional',
    duracion: '12 semanas (90 hrs)',
    modalidad: 'Híbrida',
    turnosDisponibles: ['Mañana', 'Noche'],
    cuposTotales: 25,
    cuposDisponibles: 10,
    descripcion: '',
  });
  const [cursoErrors, setCursoErrors] = useState<Record<string, string>>({});

  // District Form State
  const [isEditingDistrito, setIsEditingDistrito] = useState(false);
  const [distritoFormData, setDistritoFormData] = useState<Partial<Distrito>>({
    nombre: '',
    codigoPostal: '',
    zona: 'Centro',
  });
  const [distritoErrors, setDistritoErrors] = useState<Record<string, string>>({});

  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string;
    name: string;
    type: 'curso' | 'distrito';
  } | null>(null);

  if (!isOpen) return null;

  // Course Actions
  const handleStartCreateCurso = () => {
    setCursoFormData({
      codigo: 'CUR-' + Math.floor(100 + Math.random() * 900),
      nombre: '',
      categoria: 'Desarrollo',
      nivel: 'Intermedio',
      duracion: '12 semanas (90 hrs)',
      modalidad: 'Híbrida',
      turnosDisponibles: ['Noche'],
      cuposTotales: 25,
      cuposDisponibles: 10,
      descripcion: '',
    });
    setCursoErrors({});
    setIsEditingCurso(true);
  };

  const handleStartEditCurso = (c: Curso) => {
    setCursoFormData({ ...c });
    setCursoErrors({});
    setIsEditingCurso(true);
  };

  const handleSaveCursoForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!cursoFormData.codigo?.trim()) {
      errors.codigo = 'El código del curso es obligatorio';
    } else if (cursoFormData.codigo.trim().length < 3) {
      errors.codigo = 'El código debe tener al menos 3 caracteres';
    }

    if (!cursoFormData.nombre?.trim()) {
      errors.nombre = 'El nombre del curso es obligatorio';
    } else if (cursoFormData.nombre.trim().length < 5) {
      errors.nombre = 'El nombre debe tener al menos 5 caracteres';
    }

    if (!cursoFormData.duracion?.trim()) {
      errors.duracion = 'Indique la duración aproximada del curso';
    }

    const totales = Number(cursoFormData.cuposTotales);
    const disponibles = Number(cursoFormData.cuposDisponibles);

    if (isNaN(totales) || totales <= 0) {
      errors.cuposTotales = 'Debe ser un número entero mayor a 0';
    }

    if (isNaN(disponibles) || disponibles < 0) {
      errors.cuposDisponibles = 'Debe ser un número mayor o igual a 0';
    } else if (disponibles > totales) {
      errors.cuposDisponibles = 'Los cupos disponibles no pueden superar los cupos totales';
    }

    if (Object.keys(errors).length > 0) {
      setCursoErrors(errors);
      return;
    }

    const saved: Curso = {
      id: cursoFormData.id || 'c-' + Date.now(),
      codigo: cursoFormData.codigo!.trim().toUpperCase(),
      nombre: cursoFormData.nombre!.trim(),
      categoria: cursoFormData.categoria as any || 'Desarrollo',
      nivel: cursoFormData.nivel as any || 'Profesional',
      duracion: cursoFormData.duracion!.trim(),
      modalidad: cursoFormData.modalidad as any || 'Híbrida',
      turnosDisponibles: cursoFormData.turnosDisponibles || ['Noche'],
      cuposTotales: totales,
      cuposDisponibles: disponibles,
      descripcion: cursoFormData.descripcion?.trim() || '',
    };

    onSaveCurso(saved);
    setIsEditingCurso(false);
  };

  // District Actions
  const handleStartCreateDistrito = () => {
    setDistritoFormData({
      nombre: '',
      codigoPostal: '15000',
      zona: 'Centro',
    });
    setDistritoErrors({});
    setIsEditingDistrito(true);
  };

  const handleStartEditDistrito = (d: Distrito) => {
    setDistritoFormData({ ...d });
    setDistritoErrors({});
    setIsEditingDistrito(true);
  };

  const handleSaveDistritoForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!distritoFormData.nombre?.trim()) {
      errors.nombre = 'El nombre del distrito es obligatorio';
    } else if (distritoFormData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!distritoFormData.codigoPostal?.trim()) {
      errors.codigoPostal = 'El código postal es obligatorio';
    } else if (distritoFormData.codigoPostal.trim().length < 3) {
      errors.codigoPostal = 'Ingrese un código postal válido (mínimo 3 caracteres)';
    }

    if (!distritoFormData.zona) {
      errors.zona = 'Seleccione una zona geográfica';
    }

    if (Object.keys(errors).length > 0) {
      setDistritoErrors(errors);
      return;
    }

    const saved: Distrito = {
      id: distritoFormData.id || 'd-' + Date.now(),
      nombre: distritoFormData.nombre!.trim(),
      codigoPostal: distritoFormData.codigoPostal!.trim(),
      zona: distritoFormData.zona as any || 'Centro',
    };

    onSaveDistrito(saved);
    setIsEditingDistrito(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-title"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header with Darker contrast */}
        <div className="p-5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="manager-title" className="text-base font-bold text-slate-900 dark:text-white">
                Administración de Catálogos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión de cursos tecnológicos y distritos de residencia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('cursos');
                setIsEditingCurso(false);
                setIsEditingDistrito(false);
              }}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'cursos'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cursos Tecnológicos ({cursos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('distritos');
                setIsEditingCurso(false);
                setIsEditingDistrito(false);
              }}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'distritos'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Distritos ({distritos.length})</span>
            </button>
          </div>

          <div className="pb-3">
            {activeTab === 'cursos' && !isEditingCurso && (
              <button
                type="button"
                onClick={handleStartCreateCurso}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Curso</span>
              </button>
            )}

            {activeTab === 'distritos' && !isEditingDistrito && (
              <button
                type="button"
                onClick={handleStartCreateDistrito}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Distrito</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
          {/* TAB 1: CURSOS */}
          {activeTab === 'cursos' && (
            <div>
              {isEditingCurso ? (
                <form onSubmit={handleSaveCursoForm} className="space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cursoFormData.id ? 'Modificar Curso' : 'Registrar Nuevo Curso'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingCurso(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Código *
                      </label>
                      <input
                        type="text"
                        value={cursoFormData.codigo || ''}
                        onChange={(e) => {
                          setCursoFormData({ ...cursoFormData, codigo: e.target.value });
                          if (cursoErrors.codigo) setCursoErrors({ ...cursoErrors, codigo: '' });
                        }}
                        placeholder="Ej: FSW-401"
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          cursoErrors.codigo ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {cursoErrors.codigo && <p className="text-[10px] text-rose-500 mt-1">{cursoErrors.codigo}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Nombre del Curso *
                      </label>
                      <input
                        type="text"
                        value={cursoFormData.nombre || ''}
                        onChange={(e) => {
                          setCursoFormData({ ...cursoFormData, nombre: e.target.value });
                          if (cursoErrors.nombre) setCursoErrors({ ...cursoErrors, nombre: '' });
                        }}
                        placeholder="Ej: Full Stack Web Moderno..."
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          cursoErrors.nombre ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {cursoErrors.nombre && <p className="text-[10px] text-rose-500 mt-1">{cursoErrors.nombre}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Categoría *
                      </label>
                      <select
                        value={cursoFormData.categoria || 'Desarrollo'}
                        onChange={(e) => setCursoFormData({ ...cursoFormData, categoria: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Desarrollo">Desarrollo</option>
                        <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="Ciberseguridad">Ciberseguridad</option>
                        <option value="Datos">Datos</option>
                        <option value="Diseño UX/UI">Diseño UX/UI</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Nivel *
                      </label>
                      <select
                        value={cursoFormData.nivel || 'Profesional'}
                        onChange={(e) => setCursoFormData({ ...cursoFormData, nivel: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Inicial">Inicial</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                        <option value="Profesional">Profesional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Modalidad *
                      </label>
                      <select
                        value={cursoFormData.modalidad || 'Híbrida'}
                        onChange={(e) => setCursoFormData({ ...cursoFormData, modalidad: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrida">Híbrida</option>
                        <option value="En línea">En línea</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Duración *
                      </label>
                      <input
                        type="text"
                        value={cursoFormData.duracion || ''}
                        onChange={(e) => {
                          setCursoFormData({ ...cursoFormData, duracion: e.target.value });
                          if (cursoErrors.duracion) setCursoErrors({ ...cursoErrors, duracion: '' });
                        }}
                        placeholder="Ej: 16 semanas (120 hrs)"
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          cursoErrors.duracion ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {cursoErrors.duracion && <p className="text-[10px] text-rose-500 mt-1">{cursoErrors.duracion}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Cupos Disponibles *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cursoFormData.cuposDisponibles ?? 5}
                        onChange={(e) => {
                          setCursoFormData({ ...cursoFormData, cuposDisponibles: Number(e.target.value) });
                          if (cursoErrors.cuposDisponibles) setCursoErrors({ ...cursoErrors, cuposDisponibles: '' });
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          cursoErrors.cuposDisponibles ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {cursoErrors.cuposDisponibles && <p className="text-[10px] text-rose-500 mt-1">{cursoErrors.cuposDisponibles}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Cupos Totales *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cursoFormData.cuposTotales ?? 25}
                        onChange={(e) => {
                          setCursoFormData({ ...cursoFormData, cuposTotales: Number(e.target.value) });
                          if (cursoErrors.cuposTotales) setCursoErrors({ ...cursoErrors, cuposTotales: '' });
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          cursoErrors.cuposTotales ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {cursoErrors.cuposTotales && <p className="text-[10px] text-rose-500 mt-1">{cursoErrors.cuposTotales}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingCurso(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                    >
                      {cursoFormData.id ? 'Guardar Cambios' : 'Crear Curso'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filtrar cursos..."
                      className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3 px-3">Código</th>
                          <th className="py-3 px-3">Nombre</th>
                          <th className="py-3 px-3">Categoría</th>
                          <th className="py-3 px-3">Modalidad</th>
                          <th className="py-3 px-3">Cupos</th>
                          <th className="py-3 px-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {cursos
                          .filter((c) =>
                            c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                {c.codigo}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                                {c.nombre}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {c.categoria}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {c.modalidad}
                              </td>
                              <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                {c.cuposDisponibles}/{c.cuposTotales}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditCurso(c)}
                                    className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    title="Editar curso"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        id: c.id,
                                        name: c.nombre,
                                        type: 'curso',
                                      })
                                    }
                                    className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    title="Eliminar curso"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISTRITOS */}
          {activeTab === 'distritos' && (
            <div>
              {isEditingDistrito ? (
                <form onSubmit={handleSaveDistritoForm} className="space-y-4 max-w-lg mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {distritoFormData.id ? 'Modificar Distrito' : 'Registrar Nuevo Distrito'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingDistrito(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Nombre del Distrito *
                    </label>
                    <input
                      type="text"
                      value={distritoFormData.nombre || ''}
                      onChange={(e) => {
                        setDistritoFormData({ ...distritoFormData, nombre: e.target.value });
                        if (distritoErrors.nombre) setDistritoErrors({ ...distritoErrors, nombre: '' });
                      }}
                      placeholder="Ej: Miraflores, San Isidro, Surco..."
                      className={`w-full px-3 py-2 text-xs rounded-lg border ${
                        distritoErrors.nombre ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                      } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    />
                    {distritoErrors.nombre && <p className="text-[10px] text-rose-500 mt-1">{distritoErrors.nombre}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Código Postal (CP) *
                      </label>
                      <input
                        type="text"
                        value={distritoFormData.codigoPostal || ''}
                        onChange={(e) => {
                          setDistritoFormData({ ...distritoFormData, codigoPostal: e.target.value });
                          if (distritoErrors.codigoPostal) setDistritoErrors({ ...distritoErrors, codigoPostal: '' });
                        }}
                        placeholder="Ej: 15074"
                        className={`w-full px-3 py-2 text-xs rounded-lg border ${
                          distritoErrors.codigoPostal ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700'
                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      />
                      {distritoErrors.codigoPostal && <p className="text-[10px] text-rose-500 mt-1">{distritoErrors.codigoPostal}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Zona Geográfica *
                      </label>
                      <select
                        value={distritoFormData.zona || 'Centro'}
                        onChange={(e) => setDistritoFormData({ ...distritoFormData, zona: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Centro">Centro</option>
                        <option value="Norte">Norte</option>
                        <option value="Sur">Sur</option>
                        <option value="Este">Este</option>
                        <option value="Oeste">Oeste</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingDistrito(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                    >
                      {distritoFormData.id ? 'Guardar Cambios' : 'Crear Distrito'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filtrar distritos..."
                      className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3 px-3">Distrito</th>
                          <th className="py-3 px-3">Código Postal</th>
                          <th className="py-3 px-3">Zona</th>
                          <th className="py-3 px-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {distritos
                          .filter((d) =>
                            d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.codigoPostal.includes(searchTerm)
                          )
                          .map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                                {d.nombre}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                                {d.codigoPostal}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                                {d.zona}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditDistrito(d)}
                                    className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    title="Editar distrito"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        id: d.id,
                                        name: d.nombre,
                                        type: 'distrito',
                                      })
                                    }
                                    className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    title="Eliminar distrito"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {deleteConfirmation && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>
                ¿Confirmar eliminación de {deleteConfirmation.type === 'curso' ? 'curso' : 'distrito'}{' '}
                <strong>"{deleteConfirmation.name}"</strong>?
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmation.type === 'curso') {
                    onDeleteCurso(deleteConfirmation.id);
                  } else {
                    onDeleteDistrito(deleteConfirmation.id);
                  }
                  setDeleteConfirmation(null);
                }}
                className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer shadow-2xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
