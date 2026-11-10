export interface EvaluacionDetalle {
  id: string;
  nombre: string;
  codigo: string;
  categoria: 'Evaluación Teórica' | 'Práctica Calificada' | 'Trabajo Integrador' | 'Proyecto Final' | 'Asistencia';
  pesoPorcentaje: number;
  nota: number; // Escala de 1 al 10
  fecha: string;
  docente: string;
  retroalimentacion: string;
  estado: 'Calificado' | 'Pendiente' | 'En revisión';
}

export interface RegistroAcademicoEstudiante {
  matriculaId: string;
  alumno: string;
  dni: string;
  email: string;
  curso: string;
  codigoCurso: string;
  ciclo: string;
  turno: 'Mañana' | 'Tarde' | 'Noche';
  modalidad: 'Presencial' | 'Híbrida' | 'En línea';
  docenteTitular: string;
  aulaOEnlace: string;
  horarioSemanal: string;
  asistenciaPorcentaje: number;
  sesionesAsistidas: number;
  sesionesTotales: number;
  evaluaciones: EvaluacionDetalle[];
  observacionesGenerales?: string;
}

export type PortalMode = 'coordinador' | 'docente' | 'estudiante';
