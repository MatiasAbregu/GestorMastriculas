import React, { useState } from 'react';
import {
  Award,
  Users,
  BookOpen,
  Clock,
  Save,
  CheckCircle2,
  Search,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  FileText,
  AlertCircle,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { MatriculaData, Curso } from '../types/matricula';
import { RegistroAcademicoEstudiante, EvaluacionDetalle } from '../types/academic';
import { calcularPromedioPonderado } from '../data/calificacionesData';

interface DocentePortalProps {
  cursos: Curso[];
  matriculas: MatriculaData[];
  academicRecords: Record<string, RegistroAcademicoEstudiante>;
  onUpdateAcademicRecord: (updated: RegistroAcademicoEstudiante) => void;
  onBatchUpdateRecords?: (
    updatedMap: Record<string, RegistroAcademicoEstudiante>,
    message?: string
  ) => void;
}

export const DocentePortal: React.FC<DocentePortalProps> = ({
  cursos,
  matriculas,
  academicRecords,
  onUpdateAcademicRecord,
  onBatchUpdateRecords,
}) => {
  const teachersList = [
    { id: 't-1', nombre: 'Ing. David Valenzuela Reyes', especialidad: 'Desarrollo Full Stack & Arquitectura' },
    { id: 't-2', nombre: 'Dra. Elena Santillán Ugarte', especialidad: 'Machine Learning & Ciencia de Datos' },
    { id: 't-3', nombre: 'Mg. Carlos Benavides Cruz', especialidad: 'Cloud Engineering & DevOps' },
  ];

  const [selectedTeacher, setSelectedTeacher] = useState(teachersList[0].nombre);
  const [selectedCursoId, setSelectedCursoId] = useState<string>(cursos[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'asistencia'>('calificaciones');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Modal: Create or Edit Evaluation
  const [evaluationModal, setEvaluationModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    evalId?: string;
    formData: {
      codigo: string;
      nombre: string;
      categoria: EvaluacionDetalle['categoria'];
      pesoPorcentaje: number;
      fecha: string;
    };
  }>({
    isOpen: false,
    mode: 'create',
    formData: {
      codigo: '',
      nombre: '',
      categoria: 'Práctica Calificada',
      pesoPorcentaje: 20,
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  // Modal: Delete Evaluation Confirmation
  const [deleteEvalConfirmation, setDeleteEvalConfirmation] = useState<{
    isOpen: boolean;
    evalId: string;
    evalName: string;
  } | null>(null);

  // Modal: Student Evaluation Comment / Feedback
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    studentId: string;
    studentName: string;
    evalId: string;
    evalName: string;
    evalCodigo: string;
    nota: number;
    comment: string;
  } | null>(null);

  // Modal: Student General Dictamen
  const [dictamenModal, setDictamenModal] = useState<{
    isOpen: boolean;
    studentId: string;
    studentName: string;
    dictamen: string;
  } | null>(null);

  // Selected course object
  const currentCurso = cursos.find((c) => c.id === selectedCursoId) || cursos[0];

  // Students enrolled in the selected course
  const enrolledStudents = matriculas.filter((m) => m.curso === currentCurso?.nombre);

  // Filter by search
  const filteredStudents = enrolledStudents.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.alumno.toLowerCase().includes(term) ||
      (m.dni && m.dni.toLowerCase().includes(term))
    );
  });

  // Enrolled academic records
  const enrolledRecords = enrolledStudents
    .map((m) => academicRecords[m.id || ''])
    .filter(Boolean);

  // Course evaluations schema (derived from the first enrolled record)
  const courseEvaluations: EvaluacionDetalle[] =
    enrolledRecords[0]?.evaluaciones || [];

  const totalCourseWeight = courseEvaluations.reduce(
    (sum, e) => sum + (e.pesoPorcentaje || 0),
    0
  );

  const courseAverage =
    enrolledRecords.length > 0
      ? enrolledRecords.reduce((acc, rec) => {
          const { promedio } = calcularPromedioPonderado(rec.evaluaciones);
          return acc + promedio;
        }, 0) / enrolledRecords.length
      : 0;

  const averageAttendance =
    enrolledRecords.length > 0
      ? enrolledRecords.reduce((acc, rec) => acc + (rec.asistenciaPorcentaje || 90), 0) /
        enrolledRecords.length
      : 0;

  const showSaveNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3200);
  };

  // --- Evaluation CRUD operations across all enrolled students in course ---

  const handleOpenCreateEvaluation = () => {
    const nextNum = courseEvaluations.length + 1;
    setEvaluationModal({
      isOpen: true,
      mode: 'create',
      formData: {
        codigo: `EV-0${nextNum}`,
        nombre: '',
        categoria: 'Práctica Calificada',
        pesoPorcentaje: 20,
        fecha: new Date().toISOString().split('T')[0],
      },
    });
  };

  const handleOpenEditEvaluation = (ev: EvaluacionDetalle) => {
    setEvaluationModal({
      isOpen: true,
      mode: 'edit',
      evalId: ev.id,
      formData: {
        codigo: ev.codigo,
        nombre: ev.nombre,
        categoria: ev.categoria,
        pesoPorcentaje: ev.pesoPorcentaje,
        fecha: ev.fecha || new Date().toISOString().split('T')[0],
      },
    });
  };

  const handleSaveEvaluationForm = (e: React.FormEvent) => {
    e.preventDefault();
    const { mode, evalId, formData } = evaluationModal;

    if (!formData.codigo.trim() || !formData.nombre.trim()) {
      alert('Por favor ingrese el código y el nombre de la evaluación');
      return;
    }

    const updatedBatch: Record<string, RegistroAcademicoEstudiante> = {};

    if (mode === 'create') {
      const newEvalId = `eval-${Date.now()}`;
      enrolledStudents.forEach((student) => {
        const studentId = student.id || '';
        const currentRecord = academicRecords[studentId];
        if (currentRecord) {
          const newEvalItem: EvaluacionDetalle = {
            id: newEvalId,
            codigo: formData.codigo.trim().toUpperCase(),
            nombre: formData.nombre.trim(),
            categoria: formData.categoria,
            pesoPorcentaje: Number(formData.pesoPorcentaje) || 20,
            nota: 8.0, // default initial score on scale 1-10
            fecha: formData.fecha || new Date().toISOString().split('T')[0],
            docente: selectedTeacher,
            retroalimentacion: 'Evaluación incorporada por el docente.',
            estado: 'Calificado',
          };
          updatedBatch[studentId] = {
            ...currentRecord,
            evaluaciones: [...(currentRecord.evaluaciones || []), newEvalItem],
          };
        }
      });

      if (onBatchUpdateRecords) {
        onBatchUpdateRecords(
          updatedBatch,
          `Evaluación "${formData.nombre}" creada para todos los estudiantes de ${currentCurso.nombre}`
        );
      } else {
        Object.values(updatedBatch).forEach(onUpdateAcademicRecord);
      }
      showSaveNotification(`Evaluación "${formData.nombre}" agregada al curso`);
    } else if (mode === 'edit' && evalId) {
      enrolledStudents.forEach((student) => {
        const studentId = student.id || '';
        const currentRecord = academicRecords[studentId];
        if (currentRecord) {
          const updatedEvaluaciones = (currentRecord.evaluaciones || []).map((ev) => {
            if (ev.id === evalId) {
              return {
                ...ev,
                codigo: formData.codigo.trim().toUpperCase(),
                nombre: formData.nombre.trim(),
                categoria: formData.categoria,
                pesoPorcentaje: Number(formData.pesoPorcentaje) || 20,
                fecha: formData.fecha,
                docente: selectedTeacher,
              };
            }
            return ev;
          });
          updatedBatch[studentId] = {
            ...currentRecord,
            evaluaciones: updatedEvaluaciones,
          };
        }
      });

      if (onBatchUpdateRecords) {
        onBatchUpdateRecords(
          updatedBatch,
          `Evaluación "${formData.nombre}" actualizada`
        );
      } else {
        Object.values(updatedBatch).forEach(onUpdateAcademicRecord);
      }
      showSaveNotification(`Evaluación actualizada exitosamente`);
    }

    setEvaluationModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmDeleteEvaluation = () => {
    if (!deleteEvalConfirmation) return;
    const { evalId, evalName } = deleteEvalConfirmation;

    const updatedBatch: Record<string, RegistroAcademicoEstudiante> = {};
    enrolledStudents.forEach((student) => {
      const studentId = student.id || '';
      const currentRecord = academicRecords[studentId];
      if (currentRecord) {
        updatedBatch[studentId] = {
          ...currentRecord,
          evaluaciones: (currentRecord.evaluaciones || []).filter((ev) => ev.id !== evalId),
        };
      }
    });

    if (onBatchUpdateRecords) {
      onBatchUpdateRecords(
        updatedBatch,
        `Evaluación "${evalName}" eliminada del curso`
      );
    } else {
      Object.values(updatedBatch).forEach(onUpdateAcademicRecord);
    }

    showSaveNotification(`Evaluación "${evalName}" eliminada`);
    setDeleteEvalConfirmation(null);
  };

  // --- Grade change (1 to 10 scale) ---
  const handleGradeChange = (matriculaId: string, evalId: string, newNota: number) => {
    const record = academicRecords[matriculaId];
    if (!record) return;

    const clamped = Math.min(10, Math.max(1, isNaN(newNota) ? 1 : newNota));
    const updatedEvaluaciones = (record.evaluaciones || []).map((ev) =>
      ev.id === evalId ? { ...ev, nota: Math.round(clamped * 10) / 10 } : ev
    );

    const updated: RegistroAcademicoEstudiante = {
      ...record,
      evaluaciones: updatedEvaluaciones,
    };

    onUpdateAcademicRecord(updated);
    showSaveNotification(`Nota actualizada a ${clamped} para ${record.alumno}`);
  };

  // --- Student Attendance change ---
  const handleAttendanceSessionsChange = (matriculaId: string, asistidas: number) => {
    const record = academicRecords[matriculaId];
    if (!record) return;

    const totales = record.sesionesTotales || 24;
    const clampedAsistidas = Math.min(totales, Math.max(0, isNaN(asistidas) ? 0 : asistidas));
    const porcentaje = Math.round((clampedAsistidas / totales) * 100);

    const updated: RegistroAcademicoEstudiante = {
      ...record,
      sesionesAsistidas: clampedAsistidas,
      asistenciaPorcentaje: porcentaje,
    };

    onUpdateAcademicRecord(updated);
    showSaveNotification(`Asistencia actualizada (${porcentaje}%) para ${record.alumno}`);
  };

  // --- Save Individual Evaluation Comment / Feedback ---
  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentModal) return;

    const { studentId, evalId, comment } = commentModal;
    const record = academicRecords[studentId];
    if (!record) return;

    const updatedEvaluaciones = (record.evaluaciones || []).map((ev) =>
      ev.id === evalId ? { ...ev, retroalimentacion: comment.trim() } : ev
    );

    const updated: RegistroAcademicoEstudiante = {
      ...record,
      evaluaciones: updatedEvaluaciones,
    };

    onUpdateAcademicRecord(updated);
    showSaveNotification(`Comentario guardado para ${record.alumno}`);
    setCommentModal(null);
  };

  // --- Save Student General Dictamen ---
  const handleSaveDictamen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dictamenModal) return;

    const { studentId, dictamen } = dictamenModal;
    const record = academicRecords[studentId];
    if (!record) return;

    const updated: RegistroAcademicoEstudiante = {
      ...record,
      observacionesGenerales: dictamen.trim(),
    };

    onUpdateAcademicRecord(updated);
    showSaveNotification(`Dictamen académico guardado para ${record.alumno}`);
    setDictamenModal(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card: Faculty Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Darker Header */}
        <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                Portal Docente · Cátedra y Calificaciones
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Planilla de Calificaciones y Asistencia (Escala 1 a 10)
              </h2>
            </div>
          </div>

          {/* Teacher Selector */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">Docente Titular</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedTeacher}</span>
            </div>

            <select
              aria-label="Seleccionar docente titular"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              {teachersList.map((t) => (
                <option key={t.id} value={t.nombre}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Filter Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50/20 dark:from-slate-900 dark:to-slate-850 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <label htmlFor="docente-curso-select" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Curso Tecnológico a Cargo:</span>
              </label>
              <select
                id="docente-curso-select"
                value={selectedCursoId}
                onChange={(e) => setSelectedCursoId(e.target.value)}
                className="w-full sm:w-96 px-3.5 py-2.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
              >
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.codigo}] {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Alumnos Matriculados</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {enrolledStudents.length} estudiantes
                </span>
              </div>

              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Promedio del Curso</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {courseAverage > 0 ? courseAverage.toFixed(1) : 'S/N'}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 10</span>
                </div>
              </div>

              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-medium">Asistencia Promedio</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {Math.round(averageAttendance)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs & Search */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('calificaciones')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'calificaciones'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Carga de Calificaciones (1 - 10)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('asistencia')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'asistencia'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Control de Asistencia a Sesiones</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar alumno o DNI..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Real-time Save Confirmation Banner */}
      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hidden sm:inline">
            ● Reflejado inmediatamente en el Portal del Estudiante
          </span>
        </div>
      )}

      {/* 2. GESTIÓN DE EVALUACIONES DEL CURSO (Crear, Editar, Eliminar) */}
      {activeTab === 'calificaciones' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Evaluaciones Oficiales del Curso
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  ({courseEvaluations.length} instancias)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cree, modifique o elimine las instancias evaluativas de la cátedra con sus ponderaciones
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  totalCourseWeight === 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}
                title={totalCourseWeight === 100 ? 'Ponderación completa (100%)' : 'Se recomienda que sume 100%'}
              >
                Ponderación Total: {totalCourseWeight}%
              </span>

              <button
                type="button"
                onClick={handleOpenCreateEvaluation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Evaluación</span>
              </button>
            </div>
          </div>

          {/* Evaluations chips list */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 overflow-x-auto">
            {courseEvaluations.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs shrink-0"
              >
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                  {ev.codigo}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                  {ev.nombre}
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {ev.pesoPorcentaje}%
                </span>
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleOpenEditEvaluation(ev)}
                    title="Editar evaluación"
                    className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteEvalConfirmation({
                        isOpen: true,
                        evalId: ev.id,
                        evalName: ev.nombre,
                      })
                    }
                    title="Eliminar evaluación"
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3. PLANILLA DE CALIFICACIONES INTERACTIVA */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                No hay alumnos registrados en este curso
              </p>
              <p className="mt-1">
                Seleccione otro curso en el selector superior o inscribe alumnos desde el Portal de Coordinación.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4 min-w-[200px]">Alumno / DNI</th>
                    {courseEvaluations.map((ev) => (
                      <th key={ev.id} className="py-3 px-3 text-center min-w-[110px]">
                        <div className="flex items-center justify-center gap-1 font-mono">
                          <span>{ev.codigo}</span>
                          <span className="text-[10px] text-slate-400">({ev.pesoPorcentaje}%)</span>
                        </div>
                        <span className="block text-[9px] font-normal lowercase truncate max-w-[110px]" title={ev.nombre}>
                          {ev.nombre}
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-4 text-center min-w-[100px]">Promedio</th>
                    <th className="py-3 px-4 min-w-[140px]">Condición</th>
                    <th className="py-3 px-4 text-center min-w-[110px]">Dictamen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student) => {
                    const record = academicRecords[student.id || ''];
                    const rawEvaluaciones = record?.evaluaciones || [];
                    const evaluaciones = rawEvaluaciones.map((ev) => ({
                      ...ev,
                      nota: ev.nota > 10 ? Math.round((ev.nota / 2) * 10) / 10 : ev.nota,
                    }));
                    const { promedio, condicion, escalaLiteral } = calcularPromedioPonderado(evaluaciones);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{student.alumno}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            DNI: {student.dni || 'Sin DNI'} · Folio: {student.numeroMatricula}
                          </div>
                        </td>

                        {/* Dynamic Evaluation Cells with Grade Input + Comment Button */}
                        {courseEvaluations.map((courseEv) => {
                          const studentEv = evaluaciones.find((e) => e.id === courseEv.id) || {
                            ...courseEv,
                            nota: 8.0,
                            retroalimentacion: '',
                          };
                          const hasComment = Boolean(studentEv.retroalimentacion?.trim());

                          return (
                            <td key={courseEv.id} className="py-3.5 px-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="0.1"
                                  value={studentEv.nota}
                                  onChange={(e) =>
                                    handleGradeChange(student.id || '', courseEv.id, parseFloat(e.target.value))
                                  }
                                  className={`w-14 px-1.5 py-1 text-center font-mono font-bold text-xs rounded-lg border transition-all ${
                                    studentEv.nota >= 8.0
                                      ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                      : studentEv.nota >= 6.0
                                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                      : 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                                  } focus:outline-hidden focus:ring-2 focus:ring-indigo-500`}
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    setCommentModal({
                                      isOpen: true,
                                      studentId: student.id || '',
                                      studentName: student.alumno,
                                      evalId: courseEv.id,
                                      evalName: courseEv.nombre,
                                      evalCodigo: courseEv.codigo,
                                      nota: studentEv.nota,
                                      comment: studentEv.retroalimentacion || '',
                                    })
                                  }
                                  title={hasComment ? `Comentario: "${studentEv.retroalimentacion}"` : 'Añadir comentario pedagógico'}
                                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                                    hasComment
                                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100'
                                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
                                  }`}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          );
                        })}

                        {/* Calculated Average */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                            {promedio.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">/ 10</span>
                        </td>

                        {/* Status / Condición */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block font-semibold text-[11px] px-2 py-0.5 rounded-md ${
                              condicion === 'Aprobado'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
                                : condicion === 'En Riesgo'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80'
                            }`}
                          >
                            {condicion} ({escalaLiteral})
                          </span>
                        </td>

                        {/* Dictamen General Button */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setDictamenModal({
                                isOpen: true,
                                studentId: student.id || '',
                                studentName: student.alumno,
                                dictamen: record?.observacionesGenerales || '',
                              })
                            }
                            title="Editar Dictamen Pedagógico General"
                            className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
                              record?.observacionesGenerales
                                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <FileText className="w-3 h-3" />
                            <span>{record?.observacionesGenerales ? 'Dictamen ✓' : 'Dictamen'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB CONTENT: Control de Asistencia */}
      {activeTab === 'asistencia' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="bg-slate-100/90 dark:bg-slate-800/90 px-6 py-4 border-b border-slate-200 dark:border-slate-700/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Libro Oficial de Asistencias a Clases y Laboratorios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total de 24 sesiones lectivas programadas en el ciclo · Mínimo reglamentario: 75%
            </p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4 text-center">Sesiones Asistidas</th>
                    <th className="py-3 px-4 text-center">Sesiones Totales</th>
                    <th className="py-3 px-4 text-center">Porcentaje (%)</th>
                    <th className="py-3 px-4">Condición de Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student) => {
                    const record = academicRecords[student.id || ''];
                    const asistidas = record?.sesionesAsistidas ?? 22;
                    const totales = record?.sesionesTotales ?? 24;
                    const porcentaje = Math.round((asistidas / totales) * 100);
                    const cumple = porcentaje >= 75;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">{student.alumno}</p>
                          <span className="text-[11px] text-slate-400 font-mono">DNI: {student.dni || 'Sin DNI'}</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={totales}
                            value={asistidas}
                            onChange={(e) =>
                              handleAttendanceSessionsChange(student.id || '', parseInt(e.target.value))
                            }
                            className="w-18 px-2 py-1.5 text-center font-mono font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {totales} sesiones
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-mono font-extrabold text-sm ${
                              cumple ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {porcentaje}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1 ${
                              cumple
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            {cumple ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{cumple ? 'Habilitado por Asistencia' : 'Inhabilitado por Inasistencias'}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: CREAR / EDITAR EVALUACIÓN */}
      {evaluationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="eval-modal-title"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="eval-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                    {evaluationModal.mode === 'create' ? 'Crear Nueva Evaluación' : 'Editar Evaluación del Curso'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentCurso.nombre}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEvaluationModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluationForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    value={evaluationModal.formData.codigo}
                    onChange={(e) =>
                      setEvaluationModal({
                        ...evaluationModal,
                        formData: { ...evaluationModal.formData, codigo: e.target.value },
                      })
                    }
                    placeholder="Ej: PC-03"
                    className="w-full px-3 py-2 font-mono uppercase rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de la Evaluación *
                  </label>
                  <input
                    type="text"
                    required
                    value={evaluationModal.formData.nombre}
                    onChange={(e) =>
                      setEvaluationModal({
                        ...evaluationModal,
                        formData: { ...evaluationModal.formData, nombre: e.target.value },
                      })
                    }
                    placeholder="Ej: APIs RESTful con Node.js & Zod"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={evaluationModal.formData.categoria}
                    onChange={(e) =>
                      setEvaluationModal({
                        ...evaluationModal,
                        formData: {
                          ...evaluationModal.formData,
                          categoria: e.target.value as EvaluacionDetalle['categoria'],
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Evaluación Teórica">Evaluación Teórica</option>
                    <option value="Práctica Calificada">Práctica Calificada</option>
                    <option value="Trabajo Integrador">Trabajo Integrador</option>
                    <option value="Proyecto Final">Proyecto Final</option>
                    <option value="Asistencia">Asistencia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peso Porcentual (%) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={evaluationModal.formData.pesoPorcentaje}
                    onChange={(e) =>
                      setEvaluationModal({
                        ...evaluationModal,
                        formData: {
                          ...evaluationModal.formData,
                          pesoPorcentaje: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Aplicación / Entrega
                </label>
                <input
                  type="date"
                  value={evaluationModal.formData.fecha}
                  onChange={(e) =>
                    setEvaluationModal({
                      ...evaluationModal,
                      formData: { ...evaluationModal.formData, fecha: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEvaluationModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  {evaluationModal.mode === 'create' ? 'Crear Evaluación' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ELIMINAR EVALUACIÓN */}
      {deleteEvalConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ¿Eliminar evaluación del curso?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Está por eliminar <strong>"{deleteEvalConfirmation.evalName}"</strong>. Se removerá esta columna y sus calificaciones de todos los alumnos matriculados en <strong>{currentCurso.nombre}</strong>.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteEvalConfirmation(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEvaluation}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer shadow-xs"
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: COMENTARIO PEDAGÓGICO POR ALUMNO EN EVALUACIÓN */}
      {commentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Comentario Pedagógico del Docente
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {commentModal.studentName} · {commentModal.evalCodigo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCommentModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveComment} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Evaluación</span>
                  <p className="font-bold text-slate-900 dark:text-white">{commentModal.evalName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Calificación</span>
                  <p className="font-mono font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    {commentModal.nota.toFixed(1)} / 10
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Retroalimentación & Comentarios (Visible para el estudiante):
                </label>
                <textarea
                  rows={4}
                  value={commentModal.comment}
                  onChange={(e) =>
                    setCommentModal({ ...commentModal, comment: e.target.value })
                  }
                  placeholder="Ej: Excelente diseño de endpoints, código limpio y manejo correcto de errores. Prestar atención a la documentación técnica..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCommentModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Guardar Comentario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: DICTAMEN PEDAGÓGICO GENERAL DEL ALUMNO */}
      {dictamenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dictamen Pedagógico & Recomendaciones
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {dictamenModal.studentName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDictamenModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDictamen} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dictamen General del Docente (Aparece en la libreta del estudiante):
                </label>
                <textarea
                  rows={4}
                  value={dictamenModal.dictamen}
                  onChange={(e) =>
                    setDictamenModal({ ...dictamenModal, dictamen: e.target.value })
                  }
                  placeholder="Ingrese el dictamen final, apreciación de competencias adquiridas y recomendaciones..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDictamenModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Guardar Dictamen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
