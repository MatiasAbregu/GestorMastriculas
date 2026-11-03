import React from 'react';
import { Calendar, User, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { MatriculaData, FormErrors, Genero, Curso, Distrito } from '../types/matricula';
import { CursoDropdown } from './CursoDropdown';
import { DistritoDropdown } from './DistritoDropdown';

interface MatriculaFormProps {
  formData: MatriculaData;
  errors: FormErrors;
  isDirty: boolean;
  isEditing: boolean;
  cursos: Curso[];
  distritos: Distrito[];
  onChange: (field: keyof MatriculaData, value: string) => void;
  onSetTodayDate: () => void;
}

export const MatriculaForm: React.FC<MatriculaFormProps> = ({
  formData,
  errors,
  isDirty,
  isEditing,
  cursos,
  distritos,
  onChange,
  onSetTodayDate,
}) => {
  const genderOptions: Genero[] = [
    'Femenino',
    'Masculino',
    'No binario',
    'Prefiero no especificar',
  ];

  const requiredFields: (keyof MatriculaData)[] = [
    'curso',
    'fechaMatricula',
    'alumno',
    'dni',
    'sexo',
    'direccion',
    'distrito',
  ];
  const completedCount = requiredFields.filter((key) => Boolean(formData[key]?.trim())).length;
  const progressPercent = Math.round((completedCount / requiredFields.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Card Header with Darker contrast background */}
      <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Modificar Ficha de Matrícula' : 'Ingreso de Datos de Matrícula'}
            </h2>
            {isDirty && (
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                Cambios sin guardar
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete los campos requeridos para formalizar la inscripción en el sistema
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">Progreso</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {completedCount} de {requiredFields.length} campos
            </span>
          </div>
          <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={completedCount === requiredFields.length ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5 bg-white dark:bg-slate-900">
        {/* Row 1: Curso Dropdown */}
        <div>
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            1. Curso en que se matricula el alumno
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <CursoDropdown
            cursos={cursos}
            selectedCurso={formData.curso}
            onSelect={(curso) => onChange('curso', curso ? curso.nombre : '')}
            error={errors.curso}
          />

          {errors.curso && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.curso}</span>
            </p>
          )}
        </div>

        {/* Row 2: Fecha de matrícula & Turno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="fecha-input" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                2. Fecha de matrícula
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <button
                type="button"
                onClick={onSetTodayDate}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Fijar hoy
              </button>
            </div>
            <input
              id="fecha-input"
              type="date"
              value={formData.fechaMatricula}
              onChange={(e) => onChange('fechaMatricula', e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all shadow-2xs ${
                errors.fechaMatricula
                  ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              } focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.fechaMatricula && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.fechaMatricula}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="turno-select" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Turno horario asignado
            </label>
            <select
              id="turno-select"
              value={formData.turno || 'Noche'}
              onChange={(e) => onChange('turno', e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="Mañana">Turno Mañana (08:30 a 12:30)</option>
              <option value="Tarde">Turno Tarde (14:00 a 18:00)</option>
              <option value="Noche">Turno Noche (18:30 a 22:30)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Franja horaria para cursado y tutorías docentes.
            </p>
          </div>
        </div>

        {/* Row 3: Alumno & DNI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="alumno-input" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              3. Apellidos y Nombres del alumno
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="alumno-input"
              type="text"
              value={formData.alumno}
              onChange={(e) => onChange('alumno', e.target.value)}
              placeholder="Ej: Meneses Correa, Juan Manuel"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all shadow-2xs ${
                errors.alumno
                  ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              } focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.alumno ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.alumno}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Formato sugerido: Apellidos, Nombres (como figura en el documento).
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dni-input" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              DNI / Documento <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="dni-input"
              type="text"
              value={formData.dni || ''}
              onChange={(e) => onChange('dni', e.target.value)}
              placeholder="Ej: 42891302"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs ${
                errors.dni ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.dni ? (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.dni}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Entre 7 y 9 dígitos numéricos obligatorios.
              </p>
            )}
          </div>
        </div>

        {/* Row 4: Sexo / Género */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            4. Sexo / Género
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {genderOptions.map((option) => {
              const isSelected = formData.sexo === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange('sexo', option)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {errors.sexo && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.sexo}</span>
            </p>
          )}
        </div>

        {/* Row 5: Dirección */}
        <div>
          <label htmlFor="direccion-input" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            5. Dirección particular
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="direccion-input"
            type="text"
            value={formData.direccion}
            onChange={(e) => onChange('direccion', e.target.value)}
            placeholder="Ej: Jr. Carlos Richardson Nº 569 o Av. Javier Prado 1420"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all shadow-2xs ${
              errors.direccion
                ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 ring-1 ring-rose-300'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
            } focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.direccion ? (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.direccion}</span>
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Calle, número de vivienda, piso o departamento.
            </p>
          )}
        </div>

        {/* Row 6: Distrito Dropdown */}
        <div>
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            6. Distrito de residencia
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <DistritoDropdown
            distritos={distritos}
            selectedDistrito={formData.distrito}
            onSelect={(distrito) => onChange('distrito', distrito ? distrito.nombre : '')}
            error={errors.distrito}
          />

          {errors.distrito && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.distrito}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
