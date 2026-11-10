import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MatriculaForm } from './components/MatriculaForm';
import { ActionPanel } from './components/ActionPanel';
import { RegistrosTable } from './components/RegistrosTable';
import { DocentePortal } from './components/DocentePortal';
import { StudentPortal } from './components/StudentPortal';
import { GradesManagerModal } from './components/GradesManagerModal';
import { ComprobanteModal } from './components/ComprobanteModal';
import { ConfirmModal } from './components/ConfirmModal';
import { HelpModal } from './components/HelpModal';
import { AccessibilityMenu, ThemeMode, FontScale } from './components/AccessibilityMenu';
import { CatalogManagerModal } from './components/CatalogManagerModal';
import { ToastContainer } from './components/Toast';
import { MatriculaData, FormErrors, ToastNotification, Curso, Distrito } from './types/matricula';
import { PortalMode, RegistroAcademicoEstudiante } from './types/academic';
import { CURSOS_CATALOGO, DISTRITOS_CATALOGO, MATRICULAS_INICIALES } from './data/catalogo';
import { REGISTROS_ACADEMICOS_INICIALES, createNuevoRegistroAcademico } from './data/calificacionesData';

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialFormState: MatriculaData = {
  curso: '',
  fechaMatricula: getTodayString(),
  alumno: '',
  dni: '',
  sexo: '',
  direccion: '',
  distrito: '',
  turno: 'Noche',
};

export default function App() {
  // Current active Portal: 'coordinador' (who inscribes) or 'estudiante' (tracks enrollment & grades)
  const [portal, setPortal] = useState<PortalMode>('coordinador');

  const [activeView, setActiveView] = useState<'formulario' | 'registros'>('formulario');
  const [formData, setFormData] = useState<MatriculaData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Accessibility State (Dark Mode and Font Scale only)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('campustech_theme') as ThemeMode) || 'light';
  });
  const [fontScale, setFontScale] = useState<FontScale>(() => {
    return (localStorage.getItem('campustech_fontscale') as FontScale) || 'md';
  });
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Apply Theme to document
  useEffect(() => {
    localStorage.setItem('campustech_theme', theme);
    const root = document.documentElement;

    const applyDark = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyDark(systemDark);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyDark(theme === 'dark');
    }
  }, [theme]);

  // Apply Font Scale
  useEffect(() => {
    localStorage.setItem('campustech_fontscale', fontScale);
    const root = document.documentElement;
    root.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    root.classList.add(`font-size-${fontScale}`);
  }, [fontScale]);

  // Dynamic Catalogs State
  const [cursos, setCursos] = useState<Curso[]>(() => {
    const saved = localStorage.getItem('campustech_cursos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return CURSOS_CATALOGO;
      }
    }
    return CURSOS_CATALOGO;
  });

  const [distritos, setDistritos] = useState<Distrito[]>(() => {
    const saved = localStorage.getItem('campustech_distritos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DISTRITOS_CATALOGO;
      }
    }
    return DISTRITOS_CATALOGO;
  });

  useEffect(() => {
    localStorage.setItem('campustech_cursos', JSON.stringify(cursos));
  }, [cursos]);

  useEffect(() => {
    localStorage.setItem('campustech_distritos', JSON.stringify(distritos));
  }, [distritos]);

  // Catalog manager modal state
  const [isCatalogManagerOpen, setIsCatalogManagerOpen] = useState(false);
  const [catalogManagerInitialTab, setCatalogManagerInitialTab] = useState<'cursos' | 'distritos'>('cursos');

  // Stored enrollments list
  const [matriculas, setMatriculas] = useState<MatriculaData[]>(() => {
    const saved = localStorage.getItem('campustech_matriculas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MATRICULAS_INICIALES;
      }
    }
    return MATRICULAS_INICIALES;
  });

  useEffect(() => {
    localStorage.setItem('campustech_matriculas', JSON.stringify(matriculas));
  }, [matriculas]);

  // Helper to normalize any stored grades to the 1-10 scale
  const normalizeAcademicRecords = (
    rawRecords: Record<string, RegistroAcademicoEstudiante>
  ): Record<string, RegistroAcademicoEstudiante> => {
    const normalized: Record<string, RegistroAcademicoEstudiante> = {};
    for (const [key, student] of Object.entries(rawRecords)) {
      // If student matches default records and has old scale values (>10), restore default 1-10
      if (REGISTROS_ACADEMICOS_INICIALES[key]) {
        const hasScale20 = student.evaluaciones?.some((ev) => ev.nota > 10);
        if (hasScale20) {
          normalized[key] = {
            ...REGISTROS_ACADEMICOS_INICIALES[key],
            alumno: student.alumno || REGISTROS_ACADEMICOS_INICIALES[key].alumno,
            dni: student.dni || REGISTROS_ACADEMICOS_INICIALES[key].dni,
            curso: student.curso || REGISTROS_ACADEMICOS_INICIALES[key].curso,
          };
          continue;
        }
      }

      normalized[key] = {
        ...student,
        evaluaciones: (student.evaluaciones || []).map((ev) => {
          let nota = typeof ev.nota === 'number' ? ev.nota : parseFloat(String(ev.nota)) || 8.0;
          if (nota > 10) {
            nota = Math.round((nota / 2) * 10) / 10;
          }
          return {
            ...ev,
            nota: Math.min(10, Math.max(1, nota)),
          };
        }),
      };
    }

    // Ensure default initial records exist
    for (const [defKey, defVal] of Object.entries(REGISTROS_ACADEMICOS_INICIALES)) {
      if (!normalized[defKey]) {
        normalized[defKey] = defVal;
      }
    }

    return normalized;
  };

  // Student academic records & evaluations state (Scale 1 to 10)
  const [academicRecords, setAcademicRecords] = useState<Record<string, RegistroAcademicoEstudiante>>(() => {
    const saved = localStorage.getItem('campustech_calificaciones');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = normalizeAcademicRecords(parsed);
        localStorage.setItem('campustech_calificaciones', JSON.stringify(normalized));
        return normalized;
      } catch (e) {
        return REGISTROS_ACADEMICOS_INICIALES;
      }
    }
    return REGISTROS_ACADEMICOS_INICIALES;
  });

  useEffect(() => {
    localStorage.setItem('campustech_calificaciones', JSON.stringify(academicRecords));
  }, [academicRecords]);

  // Currently selected student in Student Portal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => {
    return matriculas[0]?.id || 'mat-1001';
  });

  // Coordinator Grades Manager Modal state
  const [isGradesManagerOpen, setIsGradesManagerOpen] = useState(false);
  const [editingAcademicRecord, setEditingAcademicRecord] = useState<RegistroAcademicoEstudiante | null>(null);

  // Notifications: strictly 1 toast at a time
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Clear any pending timer
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    const newToast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: Date.now(),
    };

    // Replace whatever toast was showing with this single one
    setToasts([newToast]);

    toastTimeoutRef.current = setTimeout(() => {
      setToasts([]);
      toastTimeoutRef.current = null;
    }, 3800);
  };

  const removeToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToasts([]);
  };

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [comprobanteMatricula, setComprobanteMatricula] = useState<MatriculaData | null>(null);
  const [isComprobanteOpen, setIsComprobanteOpen] = useState(false);

  // Confirm modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Handle Form Change
  const handleFormChange = (field: keyof MatriculaData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Quick button to set date to today
  const handleSetToday = () => {
    handleFormChange('fechaMatricula', getTodayString());
    addToast('Fecha actualizada al día de hoy', 'info');
  };

  // CRUD for Courses
  const handleSaveCurso = (curso: Curso) => {
    const exists = cursos.some((c) => c.id === curso.id);
    if (exists) {
      setCursos((prev) => prev.map((c) => (c.id === curso.id ? curso : c)));
      addToast(`Curso "${curso.nombre}" actualizado`, 'success');
    } else {
      setCursos((prev) => [curso, ...prev]);
      addToast(`Nuevo curso "${curso.nombre}" agregado al catálogo`, 'success');
    }
  };

  const handleDeleteCurso = (id: string) => {
    const cursoToDelete = cursos.find((c) => c.id === id);
    setCursos((prev) => prev.filter((c) => c.id !== id));
    if (formData.curso === cursoToDelete?.nombre) {
      handleFormChange('curso', '');
    }
    addToast('Curso eliminado del catálogo', 'warning');
  };

  // CRUD for Districts
  const handleSaveDistrito = (distrito: Distrito) => {
    const exists = distritos.some((d) => d.id === distrito.id);
    if (exists) {
      setDistritos((prev) => prev.map((d) => (d.id === distrito.id ? distrito : d)));
      addToast(`Distrito "${distrito.nombre}" actualizado`, 'success');
    } else {
      setDistritos((prev) => [distrito, ...prev]);
      addToast(`Nuevo distrito "${distrito.nombre}" agregado`, 'success');
    }
  };

  const handleDeleteDistrito = (id: string) => {
    const distToDelete = distritos.find((d) => d.id === id);
    setDistritos((prev) => prev.filter((d) => d.id !== id));
    if (formData.distrito === distToDelete?.nombre) {
      handleFormChange('distrito', '');
    }
    addToast('Distrito eliminado', 'warning');
  };

  // Comprehensive Validations
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Curso
    if (!formData.curso || !formData.curso.trim()) {
      newErrors.curso = 'Debe seleccionar un curso de la lista desplegable';
    }

    // 2. Fecha de matrícula
    if (!formData.fechaMatricula || !formData.fechaMatricula.trim()) {
      newErrors.fechaMatricula = 'La fecha de matrícula es obligatoria';
    } else {
      const matriculaDate = new Date(formData.fechaMatricula);
      if (isNaN(matriculaDate.getTime())) {
        newErrors.fechaMatricula = 'Ingrese una fecha válida en formato AAAA-MM-DD';
      } else {
        const year = matriculaDate.getFullYear();
        if (year < 2020 || year > 2035) {
          newErrors.fechaMatricula = 'El año de matrícula debe estar entre 2020 y 2035';
        }
      }
    }

    // 3. Alumno (Apellidos y Nombres)
    const alumnoTrim = formData.alumno?.trim() || '';
    if (!alumnoTrim) {
      newErrors.alumno = 'Ingrese los apellidos y nombres del alumno';
    } else if (alumnoTrim.length < 5) {
      newErrors.alumno = 'El nombre completo debe tener al menos 5 caracteres';
    } else {
      const parts = alumnoTrim.split(/[\s,]+/).filter(Boolean);
      if (parts.length < 2) {
        newErrors.alumno = 'Debe ingresar al menos un apellido y un nombre';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.'-]+$/.test(alumnoTrim)) {
        newErrors.alumno = 'El nombre sólo debe contener letras, acentos y signos ortográficos habituales';
      }
    }

    // DNI / Documento (Obligatorio)
    const dniTrim = formData.dni?.trim() || '';
    if (!dniTrim) {
      newErrors.dni = 'El número de DNI es obligatorio';
    } else {
      const cleanDni = dniTrim.replace(/[.\-\s]/g, '');
      if (!/^\d+$/.test(cleanDni)) {
        newErrors.dni = 'El DNI sólo debe contener números (puntos o guiones opcionales)';
      } else if (cleanDni.length < 7 || cleanDni.length > 9) {
        newErrors.dni = 'El DNI debe tener entre 7 y 9 dígitos numéricos';
      }
    }

    // 4. Sexo / Género
    if (!formData.sexo) {
      newErrors.sexo = 'Seleccione una opción de sexo / género';
    }

    // 5. Dirección particular
    const dirTrim = formData.direccion?.trim() || '';
    if (!dirTrim) {
      newErrors.direccion = 'La dirección particular es obligatoria';
    } else if (dirTrim.length < 6) {
      newErrors.direccion = 'Indique calle y número de vivienda (mínimo 6 caracteres)';
    }

    // 6. Distrito de residencia
    if (!formData.distrito || !formData.distrito.trim()) {
      newErrors.distrito = 'Seleccione el distrito de residencia del estudiante';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save (Guardar Matrícula por el Coordinador)
  const handleSave = () => {
    if (!validate()) {
      addToast('Por favor corrija los campos requeridos señalados en rojo', 'error');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      let savedRecord: MatriculaData;

      if (isEditing && editingId) {
        savedRecord = {
          ...formData,
          id: editingId,
        };
        setMatriculas((prev) =>
          prev.map((item) => (item.id === editingId ? savedRecord : item))
        );

        // Keep academic record metadata updated in sync
        setAcademicRecords((prev) => {
          const current = prev[editingId];
          if (current) {
            return {
              ...prev,
              [editingId]: {
                ...current,
                alumno: savedRecord.alumno,
                dni: savedRecord.dni || current.dni,
                curso: savedRecord.curso,
                turno: savedRecord.turno || current.turno,
              },
            };
          }
          return prev;
        });

        addToast('Matrícula actualizada exitosamente', 'success');
      } else {
        const nextId = 'mat-' + Math.floor(1000 + Math.random() * 9000);
        const nextFolio = 'MAT-2026-' + Math.floor(1000 + Math.random() * 9000);
        savedRecord = {
          ...formData,
          id: nextId,
          numeroMatricula: nextFolio,
          createdAt: new Date().toISOString(),
        };

        setMatriculas((prev) => [savedRecord, ...prev]);

        // Auto-generate complete initial academic gradebook for new student
        const cursoObj = cursos.find((c) => c.nombre === savedRecord.curso);
        const newAcademic = createNuevoRegistroAcademico(savedRecord, cursoObj);
        setAcademicRecords((prev) => ({ ...prev, [nextId]: newAcademic }));
        setSelectedStudentId(nextId);

        addToast(`Matrícula registrada con éxito (${nextFolio})`, 'success');
      }

      setIsSaving(false);
      setIsDirty(false);
      setIsEditing(false);
      setEditingId(null);

      // Open printable voucher modal
      setComprobanteMatricula(savedRecord);
      setIsComprobanteOpen(true);
    }, 350);
  };

  // Handle Clear (Limpiar Formulario)
  const handleClear = () => {
    if (isDirty) {
      setConfirmConfig({
        isOpen: true,
        title: '¿Limpiar formulario?',
        message: 'Se borrarán todos los datos ingresados actualmente en el formulario.',
        confirmLabel: 'Limpiar campos',
        cancelLabel: 'Seguir editando',
        isDestructive: true,
        onConfirm: () => {
          setFormData(initialFormState);
          setErrors({});
          setIsDirty(false);
          setIsEditing(false);
          setEditingId(null);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          addToast('Formulario restablecido a valores iniciales', 'info');
        },
      });
    } else {
      setFormData(initialFormState);
      setErrors({});
      setIsEditing(false);
      setEditingId(null);
      addToast('Formulario limpio', 'info');
    }
  };

  // Handle Cancel / Descartar Cambios
  const handleCancel = () => {
    if (isEditing) {
      setConfirmConfig({
        isOpen: true,
        title: '¿Descartar cambios de edición?',
        message: 'Se cancelará la edición actual y se descartarán las modificaciones.',
        confirmLabel: 'Descartar cambios',
        cancelLabel: 'Continuar editando',
        isDestructive: true,
        onConfirm: () => {
          setFormData(initialFormState);
          setErrors({});
          setIsDirty(false);
          setIsEditing(false);
          setEditingId(null);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          addToast('Edición cancelada', 'info');
        },
      });
    } else if (isDirty) {
      setConfirmConfig({
        isOpen: true,
        title: '¿Descartar cambios ingresados?',
        message: 'Se restablecerán los campos del formulario.',
        confirmLabel: 'Descartar',
        cancelLabel: 'Mantener datos',
        isDestructive: false,
        onConfirm: () => {
          setFormData(initialFormState);
          setErrors({});
          setIsDirty(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          addToast('Cambios descartados', 'info');
        },
      });
    } else {
      addToast('No hay cambios pendientes por descartar', 'info');
    }
  };

  // Keyboard shortcuts (active in Coordinator view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (portal !== 'coordinador') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleClear();
      } else if (
        e.key === 'Escape' &&
        !isAccessibilityOpen &&
        !isCatalogManagerOpen &&
        !isComprobanteOpen &&
        !confirmConfig.isOpen &&
        !isHelpOpen &&
        !isGradesManagerOpen
      ) {
        if (isDirty || isEditing) {
          handleCancel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    portal,
    formData,
    isEditing,
    editingId,
    isDirty,
    isAccessibilityOpen,
    isCatalogManagerOpen,
    isComprobanteOpen,
    confirmConfig.isOpen,
    isHelpOpen,
    isGradesManagerOpen,
  ]);

  // Handle Exit (Salir)
  const handleExit = () => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Desea salir del sistema?',
      message: 'Se cerrará el módulo de matrícula y se guardará el estado de los registros.',
      confirmLabel: 'Salir',
      cancelLabel: 'Permanecer aquí',
      isDestructive: false,
      onConfirm: () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        addToast('Sesión finalizada correctamente', 'success');
      },
    });
  };

  // Edit from table: loads registered course and district into the form and dropdowns reliably!
  const handleEditRecord = (item: MatriculaData) => {
    setFormData({
      ...item,
      curso: item.curso || '',
      distrito: item.distrito || '',
      alumno: item.alumno || '',
      dni: item.dni || '',
      sexo: item.sexo || '',
      direccion: item.direccion || '',
      fechaMatricula: item.fechaMatricula || getTodayString(),
      turno: item.turno || 'Noche',
    });
    setIsEditing(true);
    setEditingId(item.id || null);
    setIsDirty(false);
    setErrors({});
    setActiveView('formulario');
    addToast(`Cargando matrícula de ${item.alumno}`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete from table
  const handleDeleteRecord = (item: MatriculaData) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar registro de matrícula?',
      message: `Está por eliminar la matrícula de "${item.alumno}" (${item.numeroMatricula}). Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar definitivamente',
      cancelLabel: 'Cancelar',
      isDestructive: true,
      onConfirm: () => {
        setMatriculas((prev) => prev.filter((m) => m.id !== item.id));
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        addToast('Registro de matrícula eliminado', 'warning');
      },
    });
  };

  // Coordinator: Manage grades for a student
  const handleManageGrades = (item: MatriculaData) => {
    const record =
      academicRecords[item.id || ''] ||
      createNuevoRegistroAcademico(
        item,
        cursos.find((c) => c.nombre === item.curso)
      );

    setEditingAcademicRecord(record);
    setIsGradesManagerOpen(true);
  };

  // Save updated grades from Coordinator modal
  const handleSaveAcademicRecord = (updated: RegistroAcademicoEstudiante) => {
    setAcademicRecords((prev) => ({
      ...prev,
      [updated.matriculaId]: updated,
    }));
    addToast(`Calificaciones actualizadas para ${updated.alumno}`, 'success');
  };

  // Batch update academic records (for evaluations creation, edition or deletion across all course students)
  const handleBatchUpdateAcademicRecords = (
    updatedMap: Record<string, RegistroAcademicoEstudiante>,
    message?: string
  ) => {
    setAcademicRecords((prev) => ({
      ...prev,
      ...updatedMap,
    }));
    if (message) {
      addToast(message, 'success');
    }
  };

  // Quick switch from table to Student Portal
  const handleSwitchToStudentPortal = (matriculaId: string) => {
    setSelectedStudentId(matriculaId);
    setPortal('estudiante');
    addToast('Accediendo al Portal del Estudiante', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-200/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header with Portal Switcher */}
      <Header
        portal={portal}
        onPortalChange={setPortal}
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenCatalogManager={() => {
          setCatalogManagerInitialTab('cursos');
          setIsCatalogManagerOpen(true);
        }}
        matriculasCount={matriculas.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ==================================================== */}
        {/* PORTAL 1: COORDINADOR ACADÉMICO (Inscribe al alumno) */}
        {/* ==================================================== */}
        {portal === 'coordinador' && (
          <>
            {activeView === 'formulario' && (
              <div className="animate-in fade-in duration-150">
                {/* Top Workspace Grid: Form with dropdowns (left) + Action Panel matching image.png (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left / Main Section */}
                  <div className="lg:col-span-2">
                    <MatriculaForm
                      formData={formData}
                      errors={errors}
                      isDirty={isDirty}
                      isEditing={isEditing}
                      cursos={cursos}
                      distritos={distritos}
                      onChange={handleFormChange}
                      onSetTodayDate={handleSetToday}
                    />
                  </div>

                  {/* Right Section */}
                  <div className="lg:col-span-1">
                    <ActionPanel
                      formData={formData}
                      isSaving={isSaving}
                      isEditing={isEditing}
                      isDirty={isDirty}
                      onSave={handleSave}
                      onClear={handleClear}
                      onCancel={handleCancel}
                      onExit={handleExit}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: Registros Guardados */}
            {activeView === 'registros' && (
              <div className="animate-in fade-in duration-150">
                <RegistrosTable
                  matriculas={matriculas}
                  onViewComprobante={(item) => {
                    setComprobanteMatricula(item);
                    setIsComprobanteOpen(true);
                  }}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                  onNewMatricula={() => {
                    setFormData(initialFormState);
                    setIsEditing(false);
                    setEditingId(null);
                    setErrors({});
                    setActiveView('formulario');
                  }}
                  onManageGrades={handleManageGrades}
                  onSwitchToStudentPortal={handleSwitchToStudentPortal}
                />
              </div>
            )}
          </>
        )}

        {/* ==================================================== */}
        {/* PORTAL 2: DOCENTE (Carga de Notas 1-10 y Asistencia) */}
        {/* ==================================================== */}
        {portal === 'docente' && (
          <div className="animate-in fade-in duration-150">
            <DocentePortal
              cursos={cursos}
              matriculas={matriculas}
              academicRecords={academicRecords}
              onUpdateAcademicRecord={handleSaveAcademicRecord}
              onBatchUpdateRecords={handleBatchUpdateAcademicRecords}
            />
          </div>
        )}

        {/* ==================================================== */}
        {/* PORTAL 3: ESTUDIANTE (Matrícula y Calificaciones)    */}
        {/* ==================================================== */}
        {portal === 'estudiante' && (
          <div className="animate-in fade-in duration-150">
            <StudentPortal
              matriculas={matriculas}
              academicRecords={academicRecords}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              onViewComprobante={(item) => {
                setComprobanteMatricula(item);
                setIsComprobanteOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">CampusTech Académico</span>
            <span aria-hidden="true">·</span>
            <span>Sistema Integral de Gestión de Admisiones, Cátedra y Calificaciones</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AccessibilityMenu
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
      />

      <CatalogManagerModal
        isOpen={isCatalogManagerOpen}
        onClose={() => setIsCatalogManagerOpen(false)}
        initialTab={catalogManagerInitialTab}
        cursos={cursos}
        distritos={distritos}
        onSaveCurso={handleSaveCurso}
        onDeleteCurso={handleDeleteCurso}
        onSaveDistrito={handleSaveDistrito}
        onDeleteDistrito={handleDeleteDistrito}
      />

      <GradesManagerModal
        isOpen={isGradesManagerOpen}
        onClose={() => setIsGradesManagerOpen(false)}
        academicRecord={editingAcademicRecord}
        onSaveRecord={handleSaveAcademicRecord}
      />

      <ComprobanteModal
        matricula={comprobanteMatricula}
        isOpen={isComprobanteOpen}
        onClose={() => setIsComprobanteOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel={confirmConfig.cancelLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
