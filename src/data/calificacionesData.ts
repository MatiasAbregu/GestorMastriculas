import { RegistroAcademicoEstudiante, EvaluacionDetalle } from '../types/academic';
import { MatriculaData, Curso } from '../types/matricula';

export const REGISTROS_ACADEMICOS_INICIALES: Record<string, RegistroAcademicoEstudiante> = {
  'mat-1001': {
    matriculaId: 'mat-1001',
    alumno: 'Albarracín Morales, Mateo',
    dni: '42.891.302',
    email: 'mateo.albarracin@example.com',
    curso: 'Full Stack Web Moderno: React, Next.js & Node.js',
    codigoCurso: 'FSW-401',
    ciclo: 'Ciclo Regular 2026-I',
    turno: 'Noche',
    modalidad: 'Híbrida',
    docenteTitular: 'Ing. David Valenzuela Reyes',
    aulaOEnlace: 'Laboratorio de Software 402 / Meet CampusTech',
    horarioSemanal: 'Lunes y Miércoles de 19:00 a 22:00 hrs',
    asistenciaPorcentaje: 95,
    sesionesAsistidas: 23,
    sesionesTotales: 24,
    observacionesGenerales: 'Estudiante con excelente desempeño en arquitectura de frontend, despliegue en contenedores y buenas prácticas de TypeScript.',
    evaluaciones: [
      {
        id: 'eval-1',
        codigo: 'EC-01',
        nombre: 'Evaluación Teórico-Práctica: Componentes, Hooks & TypeScript',
        categoria: 'Evaluación Teórica',
        pesoPorcentaje: 15,
        nota: 9.2,
        fecha: '2026-09-12',
        docente: 'Ing. David Valenzuela',
        retroalimentacion: 'Excelente manejo de tipos genéricos y optimización con useCallback y useMemo.',
        estado: 'Calificado',
      },
      {
        id: 'eval-2',
        codigo: 'PC-02',
        nombre: 'Práctica Calificada: State Management y Zustand en Aplicaciones Reales',
        categoria: 'Práctica Calificada',
        pesoPorcentaje: 20,
        nota: 8.5,
        fecha: '2026-09-28',
        docente: 'Ing. David Valenzuela',
        retroalimentacion: 'Muy buena arquitectura de stores y separación de responsabilidades en la lógica de negocio.',
        estado: 'Calificado',
      },
      {
        id: 'eval-3',
        codigo: 'TI-03',
        nombre: 'Trabajo Integrador: Backend RESTful con Node.js, Express & PostgreSQL',
        categoria: 'Trabajo Integrador',
        pesoPorcentaje: 25,
        nota: 9.5,
        fecha: '2026-10-15',
        docente: 'Ing. David Valenzuela',
        retroalimentacion: 'Sobresaliente diseño de esquema de base de datos relacional y manejo limpio de errores HTTP.',
        estado: 'Calificado',
      },
      {
        id: 'eval-4',
        codigo: 'PF-04',
        nombre: 'Proyecto Final de Carrera: Plataforma Web Full Stack Desplegada',
        categoria: 'Proyecto Final',
        pesoPorcentaje: 30,
        nota: 9.0,
        fecha: '2026-10-26',
        docente: 'Ing. David Valenzuela',
        retroalimentacion: 'Implementación completa con CI/CD, autenticación segura y diseño responsivo accesible.',
        estado: 'Calificado',
      },
      {
        id: 'eval-5',
        codigo: 'AS-05',
        nombre: 'Asistencia, Puntualidad y Participación en Laboratorio',
        categoria: 'Asistencia',
        pesoPorcentaje: 10,
        nota: 9.5,
        fecha: '2026-10-28',
        docente: 'Ing. David Valenzuela',
        retroalimentacion: 'Puntualidad ejemplar y participación activa en todas las revisiones de código grupales.',
        estado: 'Calificado',
      },
    ],
  },
  'mat-1002': {
    matriculaId: 'mat-1002',
    alumno: 'Peralta Varela, Camila Lucía',
    dni: '43.112.985',
    email: 'camila.peralta@example.com',
    curso: 'Inteligencia Artificial Aplicada & Machine Learning con Python',
    codigoCurso: 'IA-502',
    ciclo: 'Ciclo Regular 2026-I',
    turno: 'Tarde',
    modalidad: 'En línea',
    docenteTitular: 'Dra. Elena Santillán Ugarte',
    aulaOEnlace: 'Aula Virtual IA-502 / Discord Académico CampusTech',
    horarioSemanal: 'Martes y Jueves de 15:00 a 18:00 hrs',
    asistenciaPorcentaje: 92,
    sesionesAsistidas: 20,
    sesionesTotales: 22,
    observacionesGenerales: 'Destacada capacidad analítica en preprocesamiento de conjuntos de datos y formulación de hiperparámetros.',
    evaluaciones: [
      {
        id: 'eval-201',
        codigo: 'EC-01',
        nombre: 'Fundamentos de Álgebra Lineal, Pandas & Numpy para ML',
        categoria: 'Evaluación Teórica',
        pesoPorcentaje: 20,
        nota: 9.5,
        fecha: '2026-09-15',
        docente: 'Dra. Elena Santillán',
        retroalimentacion: 'Resolución analítica impecable y código Python estructurado según guías PEP8.',
        estado: 'Calificado',
      },
      {
        id: 'eval-202',
        codigo: 'PC-02',
        nombre: 'Modelos de Clasificación & Regresión con Scikit-Learn',
        categoria: 'Práctica Calificada',
        pesoPorcentaje: 25,
        nota: 8.8,
        fecha: '2026-10-02',
        docente: 'Dra. Elena Santillán',
        retroalimentacion: 'Excelente interpretación de curvas ROC y matrices de confusión multiclase.',
        estado: 'Calificado',
      },
      {
        id: 'eval-203',
        codigo: 'TI-03',
        nombre: 'Pipeline de Redes Neuronales & Visión por Computadora con PyTorch',
        categoria: 'Trabajo Integrador',
        pesoPorcentaje: 25,
        nota: 9.0,
        fecha: '2026-10-20',
        docente: 'Dra. Elena Santillán',
        retroalimentacion: 'Estrategia de aumento de datos efectiva para evitar sobreajuste en el clasificador convolucional.',
        estado: 'Calificado',
      },
      {
        id: 'eval-204',
        codigo: 'PF-04',
        nombre: 'Proyecto Capstone: Sistema Predictivo en Producción',
        categoria: 'Proyecto Final',
        pesoPorcentaje: 20,
        nota: 8.3,
        fecha: '2026-10-27',
        docente: 'Dra. Elena Santillán',
        retroalimentacion: 'API FastAPI funcional con inferencia en tiempo real. Buen trabajo de documentación Swagger.',
        estado: 'Calificado',
      },
      {
        id: 'eval-205',
        codigo: 'AS-05',
        nombre: 'Asistencia y Participación en Workshops Semanales',
        categoria: 'Asistencia',
        pesoPorcentaje: 10,
        nota: 9.0,
        fecha: '2026-10-29',
        docente: 'Dra. Elena Santillán',
        retroalimentacion: 'Aportes constructivos en las sesiones de análisis de casos prácticos.',
        estado: 'Calificado',
      },
    ],
  },
  'mat-1003': {
    matriculaId: 'mat-1003',
    alumno: 'Sosa Quiroga, Lucas Valentín',
    dni: '41.670.219',
    email: 'lucas.sosa@example.com',
    curso: 'Cloud Engineering & DevOps (AWS, Docker, Kubernetes & Terraform)',
    codigoCurso: 'CLD-303',
    ciclo: 'Ciclo Regular 2026-I',
    turno: 'Mañana',
    modalidad: 'Híbrida',
    docenteTitular: 'Mg. Carlos Benavides Cruz',
    aulaOEnlace: 'Laboratorio Cloud Hub B-101 / AWS Sandbox',
    horarioSemanal: 'Sábados de 08:30 a 14:30 hrs',
    asistenciaPorcentaje: 88,
    sesionesAsistidas: 14,
    sesionesTotales: 16,
    observacionesGenerales: 'Buen manejo práctico de Dockerfiles y manifiestos de Kubernetes con Helm.',
    evaluaciones: [
      {
        id: 'eval-301',
        codigo: 'EC-01',
        nombre: 'Contenerización Avanzada con Docker & Multi-stage Builds',
        categoria: 'Evaluación Teórica',
        pesoPorcentaje: 20,
        nota: 8.0,
        fecha: '2026-09-18',
        docente: 'Mg. Carlos Benavides',
        retroalimentacion: 'Reducción de tamaño de imágenes efectiva usando Alpine y usuarios sin privilegios root.',
        estado: 'Calificado',
      },
      {
        id: 'eval-302',
        codigo: 'PC-02',
        nombre: 'Orquestación de Contenedores con Kubernetes (Deployments & Services)',
        categoria: 'Práctica Calificada',
        pesoPorcentaje: 25,
        nota: 8.5,
        fecha: '2026-10-05',
        docente: 'Mg. Carlos Benavides',
        retroalimentacion: 'Correcta configuración de ConfigMaps, Secrets y políticas de autoescalado horizontal (HPA).',
        estado: 'Calificado',
      },
      {
        id: 'eval-303',
        codigo: 'TI-03',
        nombre: 'Infraestructura como Código (IaC) con Terraform en AWS',
        categoria: 'Trabajo Integrador',
        pesoPorcentaje: 25,
        nota: 8.2,
        fecha: '2026-10-22',
        docente: 'Mg. Carlos Benavides',
        retroalimentacion: 'Módulos reutilizables para VPC, subredes públicas/privadas y clúster EKS.',
        estado: 'Calificado',
      },
      {
        id: 'eval-304',
        codigo: 'PF-04',
        nombre: 'Pipeline CI/CD Completo en GitHub Actions & Observabilidad',
        categoria: 'Proyecto Final',
        pesoPorcentaje: 20,
        nota: 8.7,
        fecha: '2026-10-28',
        docente: 'Mg. Carlos Benavides',
        retroalimentacion: 'Pipeline automatizado con pruebas unitarias, escaneo de vulnerabilidades Trivy y despliegue continuo.',
        estado: 'Calificado',
      },
      {
        id: 'eval-305',
        codigo: 'AS-05',
        nombre: 'Asistencia y Prácticas en AWS Academy Sandbox',
        categoria: 'Asistencia',
        pesoPorcentaje: 10,
        nota: 8.5,
        fecha: '2026-10-30',
        docente: 'Mg. Carlos Benavides',
        retroalimentacion: 'Cumplimiento adecuado de los laboratorios prácticos en la nube.',
        estado: 'Calificado',
      },
    ],
  },
};

/**
 * Creates an academic record when a new student is enrolled by the coordinator.
 * Grades are on a 1 to 10 scale.
 */
export function createNuevoRegistroAcademico(
  matricula: MatriculaData,
  cursoObj?: Curso
): RegistroAcademicoEstudiante {
  const codigo = cursoObj?.codigo || 'TEC-100';
  const modalidad = cursoObj?.modalidad || 'Híbrida';
  const turno = matricula.turno || 'Noche';

  const defaultEvaluaciones: EvaluacionDetalle[] = [
    {
      id: `eval-new-1-${Date.now()}`,
      codigo: 'EC-01',
      nombre: 'Evaluación Diagnóstica y Fundamentos Teóricos',
      categoria: 'Evaluación Teórica',
      pesoPorcentaje: 20,
      nota: 8.0,
      fecha: new Date().toISOString().split('T')[0],
      docente: 'Docente de Cátedra',
      retroalimentacion: 'Buen inicio de ciclo lectivo. Conceptos fundamentales comprendidos con claridad.',
      estado: 'Calificado',
    },
    {
      id: `eval-new-2-${Date.now()}`,
      codigo: 'PC-02',
      nombre: 'Práctica de Laboratorio Aplicada I',
      categoria: 'Práctica Calificada',
      pesoPorcentaje: 25,
      nota: 8.5,
      fecha: new Date().toISOString().split('T')[0],
      docente: 'Docente de Cátedra',
      retroalimentacion: 'Resolución técnica adecuada de los casos prácticos asignados.',
      estado: 'Calificado',
    },
    {
      id: `eval-new-3-${Date.now()}`,
      codigo: 'TI-03',
      nombre: 'Avance de Trabajo Integrador Modular',
      categoria: 'Trabajo Integrador',
      pesoPorcentaje: 25,
      nota: 7.8,
      fecha: new Date().toISOString().split('T')[0],
      docente: 'Docente de Cátedra',
      retroalimentacion: 'Estructura general aprobada. Reforzar documentación técnica para la entrega final.',
      estado: 'Calificado',
    },
    {
      id: `eval-new-4-${Date.now()}`,
      codigo: 'PF-04',
      nombre: 'Defensa de Proyecto Final & Entregable de Carrera',
      categoria: 'Proyecto Final',
      pesoPorcentaje: 20,
      nota: 9.0,
      fecha: new Date().toISOString().split('T')[0],
      docente: 'Docente de Cátedra',
      retroalimentacion: 'Demostración práctica exitosa ante el panel evaluador.',
      estado: 'Calificado',
    },
    {
      id: `eval-new-5-${Date.now()}`,
      codigo: 'AS-05',
      nombre: 'Asistencia y Participación en Clases',
      categoria: 'Asistencia',
      pesoPorcentaje: 10,
      nota: 9.0,
      fecha: new Date().toISOString().split('T')[0],
      docente: 'Docente de Cátedra',
      retroalimentacion: 'Asistencia regular registrada en la plataforma institucional.',
      estado: 'Calificado',
    },
  ];

  return {
    matriculaId: matricula.id || 'mat-' + Date.now(),
    alumno: matricula.alumno,
    dni: matricula.dni || 'Sin DNI',
    email: matricula.email || `${matricula.alumno.toLowerCase().replace(/[^a-z]/g, '.')}@alumno.campustech.edu.pe`,
    curso: matricula.curso,
    codigoCurso: codigo,
    ciclo: 'Ciclo Regular 2026-I',
    turno: turno,
    modalidad: modalidad,
    docenteTitular: 'Docente Especialista Asignado',
    aulaOEnlace: modalidad === 'En línea' ? 'Campus Virtual / Google Meet' : 'Sede Tecnológica / Aula de Prácticas',
    horarioSemanal: turno === 'Mañana' ? 'Lun y Mié 08:30 a 11:30 hrs' : turno === 'Tarde' ? 'Mar y Jue 14:30 a 17:30 hrs' : 'Lun y Mié 19:00 a 22:00 hrs',
    asistenciaPorcentaje: 92,
    sesionesAsistidas: 11,
    sesionesTotales: 12,
    observacionesGenerales: 'Matrícula activa y expediente académico en curso regular.',
    evaluaciones: defaultEvaluaciones,
  };
}

/**
 * Calculates weighted GPA / average for evaluations on a 1 to 10 scale.
 * Minimum passing score: 6.0
 */
export function calcularPromedioPonderado(evaluaciones: EvaluacionDetalle[]): {
  promedio: number;
  escalaLiteral: string;
  condicion: 'Aprobado' | 'En Riesgo' | 'Desaprobado';
} {
  if (!evaluaciones || evaluaciones.length === 0) {
    return { promedio: 0, escalaLiteral: 'S/N', condicion: 'En Riesgo' };
  }

  let totalPonderado = 0;
  let sumaPesos = 0;

  for (const ev of evaluaciones) {
    if (ev.estado === 'Calificado') {
      totalPonderado += ev.nota * ev.pesoPorcentaje;
      sumaPesos += ev.pesoPorcentaje;
    }
  }

  const promedio = sumaPesos > 0 ? totalPonderado / sumaPesos : 0;
  const promedioRedondeado = Math.round(promedio * 10) / 10;

  let escalaLiteral = 'Regular';
  let condicion: 'Aprobado' | 'En Riesgo' | 'Desaprobado' = 'Aprobado';

  // Scale 1 to 10 criteria
  if (promedioRedondeado >= 9.0) {
    escalaLiteral = 'Sobresaliente';
    condicion = 'Aprobado';
  } else if (promedioRedondeado >= 8.0) {
    escalaLiteral = 'Distinguido';
    condicion = 'Aprobado';
  } else if (promedioRedondeado >= 6.0) {
    escalaLiteral = 'Aprobado';
    condicion = 'Aprobado';
  } else if (promedioRedondeado >= 4.0) {
    escalaLiteral = 'En Recuperatorio';
    condicion = 'En Riesgo';
  } else {
    escalaLiteral = 'Desaprobado';
    condicion = 'Desaprobado';
  }

  return { promedio: promedioRedondeado, escalaLiteral, condicion };
}
