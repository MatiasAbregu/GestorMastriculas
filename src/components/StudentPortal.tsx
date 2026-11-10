import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  BookOpen,
  CheckCircle2,
  Printer,
  Search,
  Laptop,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { MatriculaData } from '../types/matricula';
import { RegistroAcademicoEstudiante } from '../types/academic';
import { calcularPromedioPonderado } from '../data/calificacionesData';

interface StudentPortalProps {
  matriculas: MatriculaData[];
  academicRecords: Record<string, RegistroAcademicoEstudiante>;
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
  onViewComprobante: (matricula: MatriculaData) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  matriculas,
  academicRecords,
  selectedStudentId,
  onSelectStudent,
  onViewComprobante,
}) => {
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'matricula' | 'boleta'>('calificaciones');
  const [searchTerm, setSearchTerm] = useState('');

  // Find active student record
  const currentMatricula =
    matriculas.find((m) => m.id === selectedStudentId) ||
    matriculas[0] ||
    null;

  const currentAcademic = currentMatricula
    ? academicRecords[currentMatricula.id || '']
    : null;

  // Guarantee all grades are strictly within the 1-10 scale (convert any cached >10 values)
  const sanitizedEvaluaciones = (currentAcademic?.evaluaciones || []).map((ev) => ({
    ...ev,
    nota: ev.nota > 10 ? Math.round((ev.nota / 2) * 10) / 10 : ev.nota,
  }));

  const { promedio, escalaLiteral, condicion } = currentAcademic
    ? calcularPromedioPonderado(sanitizedEvaluaciones)
    : { promedio: 0, escalaLiteral: 'S/N', condicion: 'Aprobado' as const };

  // Filter students for search dropdown
  const filteredStudents = matriculas.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.alumno.toLowerCase().includes(term) ||
      (m.dni && m.dni.toLowerCase().includes(term)) ||
      m.curso.toLowerCase().includes(term)
    );
  });

  if (!currentMatricula || matriculas.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-2xl mx-auto shadow-xs">
        <GraduationCap className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          No hay estudiantes matriculados registrados
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Para ver el expediente académico, primero inscribe a un alumno desde el Portal de Coordinación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Selector de Estudiante & Bienvenida */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Header bar */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                Portal del Estudiante · CampusTech
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Expediente y Libreta Académica
              </h2>
            </div>
          </div>

          {/* Student Quick Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                aria-label="Seleccionar estudiante activo"
                value={currentMatricula.id || ''}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              >
                {matriculas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.alumno} ({m.dni || 'Sin DNI'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student Profile Ribbon */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-850 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {currentMatricula.alumno
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentMatricula.alumno}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Condición: Regular
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    DNI: <strong className="text-slate-700 dark:text-slate-200">{currentMatricula.dni || 'No registrado'}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {currentMatricula.email || `${currentMatricula.alumno.toLowerCase().replace(/[^a-z]/g, '.')}@alumno.campustech.edu.pe`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentMatricula.distrito || 'Sede Central'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onViewComprobante(currentMatricula)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Comprobante de Matrícula</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('boleta')}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Boleta de Notas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('calificaciones')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calificaciones'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Libreta de Calificaciones & Desempeño</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matricula')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matricula'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curso Matriculado & Horario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('boleta')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'boleta'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Certificado / Boleta Imprimible</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: CALIFICACIONES */}
      {activeTab === 'calificaciones' && (
        <div className="space-y-6">
          {/* KPI Academic Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Promedio Ponderado */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Promedio Ponderado</span>
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {promedio.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
              </div>
              <div className="mt-2 text-xs flex items-center gap-2">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  {escalaLiteral}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {condicion}
                </span>
              </div>
            </div>

            {/* KPI 2: Asistencia Registrada */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Asistencia a Clases</span>
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {currentAcademic?.asistenciaPorcentaje || 95}%
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({currentAcademic?.sesionesAsistidas || 23}/{currentAcademic?.sesionesTotales || 24} sesiones)
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Límite mínimo requerido: <strong className="text-slate-700 dark:text-slate-300">75%</strong>
              </div>
            </div>

            {/* KPI 3: Créditos & Carga Horaria */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Carga Horaria & Créditos</span>
                <BookOpen className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  120
                </span>
                <span className="text-xs text-slate-400 font-medium">Horas Académicas</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Equivalente a <strong className="text-slate-700 dark:text-slate-300">4.5 Créditos Oficiales</strong>
              </div>
            </div>

            {/* KPI 4: Estado Académico */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-semibold">Estado de Matrícula</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Regular Activo
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Folio: <span className="font-mono">{currentMatricula.numeroMatricula || 'MAT-2026'}</span>
              </div>
            </div>
          </div>

          {/* Evaluations Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
            <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Desglose Oficial de Evaluaciones del Ciclo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Escala oficial de calificaciones de 1 a 10 · Mínimo aprobatorio: 6.0
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                <span>Docente: </span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {currentAcademic?.docenteTitular || 'Secretaría Académica'}
                </strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Evaluación / Rubro</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-center">Peso</th>
                    <th className="py-3 px-4 text-center">Calificación</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Comentarios del Docente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sanitizedEvaluaciones.map((ev) => {
                    const isHigh = ev.nota >= 8.0;
                    const isPass = ev.nota >= 6.0;
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                          {ev.codigo}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                          {ev.nombre}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          {ev.categoria}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {ev.pesoPorcentaje}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                              isHigh
                                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                : isPass
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {ev.nota.toFixed(1)} / 10
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {ev.fecha}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs italic">
                          "{ev.retroalimentacion}"
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-slate-700 dark:text-slate-200 font-bold">
                      Promedio Ponderado Final del Ciclo
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                      {sanitizedEvaluaciones.reduce((acc, curr) => acc + (curr.pesoPorcentaje || 0), 0)}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                      {promedio.toFixed(1)}
                    </td>
                    <td colSpan={2} className="py-3 px-4 text-slate-500 dark:text-slate-400 text-right">
                      Condición Final: <strong className="text-emerald-600 dark:text-emerald-400">{condicion}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Teacher General Remarks */}
            {currentAcademic?.observacionesGenerales && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Dictamen Pedagógico & Recomendaciones de Secretaría Académica:
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {currentAcademic.observacionesGenerales}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: CURSO MATRICULADO */}
      {activeTab === 'matricula' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Course Card & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {currentAcademic?.codigoCurso || 'CURSO'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentMatricula.curso}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  {currentAcademic?.modalidad || 'Híbrida'}
                </span>
              </div>

              <div className="p-6 space-y-5 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      Horario & Frecuencia
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{currentAcademic?.horarioSemanal || 'Lunes y Miércoles 19:00 - 22:00'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      Aula / Laboratorio Asignado
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                      <Laptop className="w-4 h-4 text-indigo-600" />
                      <span>{currentAcademic?.aulaOEnlace || 'Laboratorio de Computación 402'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      Docente a Cargo
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{currentAcademic?.docenteTitular || 'Ing. Especialista'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                      Fecha de Inscripción Oficial
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{currentMatricula.fechaMatricula}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    Ejes Temáticos & Competencias del Curso:
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Dominio de herramientas de última generación y estándares de la industria tecnológica.</li>
                    <li>Desarrollo de proyectos basados en casos de estudio reales y metodologías ágiles.</li>
                    <li>Control de versiones, pruebas de calidad de software y documentación técnica.</li>
                    <li>Tutorías personalizadas con el cuerpo docente y acceso a la comunidad de graduados.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Academic Credential & Contact */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              <div className="bg-slate-100/90 dark:bg-slate-800/90 px-5 py-3 border-b border-slate-200 dark:border-slate-700/80">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Credencial Estudiantil Digital
                </h4>
              </div>

              <div className="p-5 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-widest text-indigo-300 font-bold uppercase">
                      CampusTech Académico
                    </span>
                    <GraduationCap className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h5 className="font-bold text-sm tracking-tight">{currentMatricula.alumno}</h5>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">DNI: {currentMatricula.dni || '42.891.302'}</p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-indigo-200">{currentMatricula.distrito}</span>
                    <span className="font-mono text-white/80">{currentMatricula.numeroMatricula}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onViewComprobante(currentMatricula)}
                    className="w-full py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ver Comprobante de Matrícula</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('boleta')}
                    className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Libreta Oficial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: BOLETA OFICIAL IMPRIMIBLE */}
      {activeTab === 'boleta' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
          {/* Actions toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Vista previa para impresión oficial de calificaciones
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Boleta (PDF)</span>
              </button>
            </div>
          </div>

          {/* Transcript Document */}
          <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-8 bg-white dark:bg-slate-900 space-y-6 text-slate-900 dark:text-white">
            {/* Header Document */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-slate-200 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 dark:text-slate-400">
                  Institución de Educación Superior Tecnológica
                </span>
                <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  CAMPUSTECH ACADÉMICO
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Secretaría General & Dirección de Registro Académico
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono block text-slate-500">BOLETA OFICIAL</span>
                <span className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-400">
                  {currentMatricula.numeroMatricula || 'MAT-2026-0841'}
                </span>
                <span className="text-[10px] block text-slate-400 mt-1">
                  Fecha de Emisión: {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            {/* Student Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  Estudiante
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{currentMatricula.alumno}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  Documento / DNI
                </span>
                <p className="font-mono font-bold text-slate-900 dark:text-white">{currentMatricula.dni || 'Sin DNI'}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  Programa de Estudio
                </span>
                <p className="font-medium text-slate-900 dark:text-white truncate">{currentMatricula.curso}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  Condición
                </span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Regular Activo</p>
              </div>
            </div>

            {/* Transcript Evaluation Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300 dark:border-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Cód.</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5">Asignatura / Evaluación</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Peso</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Calificación (1-10)</th>
                  <th className="border border-slate-300 dark:border-slate-700 p-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {sanitizedEvaluaciones.map((ev) => (
                  <tr key={ev.id}>
                    <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-mono text-[11px]">
                      {ev.codigo}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2.5 font-medium">
                      {ev.nombre}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center font-mono">
                      {ev.pesoPorcentaje}%
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center font-mono font-bold">
                      {ev.nota.toFixed(1)}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {ev.nota >= 6.0 ? 'Aprobado' : 'Desaprobado'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold text-xs">
                <tr>
                  <td colSpan={3} className="border border-slate-300 dark:border-slate-700 p-2.5 text-right">
                    PROMEDIO PONDERADO FINAL:
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    {promedio.toFixed(1)}
                  </td>
                  <td className="border border-slate-300 dark:border-slate-700 p-2.5 text-center text-emerald-600 dark:text-emerald-400">
                    {condicion}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Official Signatures & Seal */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="border-b border-slate-400 dark:border-slate-600 w-48 mx-auto pb-6"></div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Ing. David Valenzuela Reyes</p>
                <p className="text-[11px] text-slate-500">Docente Titular de Cátedra</p>
              </div>

              <div className="space-y-1">
                <div className="border-b border-slate-400 dark:border-slate-600 w-48 mx-auto pb-6"></div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Secretaría Académica General</p>
                <p className="text-[11px] text-slate-500">CampusTech Registros & Certificaciones</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
