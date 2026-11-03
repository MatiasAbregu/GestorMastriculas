export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'Desarrollo' | 'Inteligencia Artificial' | 'Cloud & DevOps' | 'Ciberseguridad' | 'Diseño UX/UI' | 'Datos';
  nivel: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Profesional';
  duracion: string;
  modalidad: 'Presencial' | 'Híbrida' | 'En línea';
  turnosDisponibles: ('Mañana' | 'Tarde' | 'Noche')[];
  cuposTotales: number;
  cuposDisponibles: number;
  descripcion: string;
}

export interface Distrito {
  id: string;
  nombre: string;
  codigoPostal: string;
  zona: 'Centro' | 'Norte' | 'Sur' | 'Este' | 'Oeste';
}

export type Genero = 'Femenino' | 'Masculino' | 'No binario' | 'Prefiero no especificar';

export interface MatriculaData {
  id?: string;
  numeroMatricula?: string;
  curso: string;
  fechaMatricula: string;
  alumno: string;
  dni?: string;
  sexo: Genero | '';
  direccion: string;
  distrito: string;
  turno?: 'Mañana' | 'Tarde' | 'Noche';
  email?: string;
  telefono?: string;
  createdAt?: string;
}

export interface FormErrors {
  curso?: string;
  fechaMatricula?: string;
  alumno?: string;
  dni?: string;
  sexo?: string;
  direccion?: string;
  distrito?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}
