export interface Comunicado {
  id: string | number;
  title: string;
  description: string;
  date: string;
  classification: string; // 'Institucional' | 'Académico' | 'Investigación' | etc.
}

export interface FechaImportante {
  id: string | number;
  date: string; // Format: "12 Ene" or ISO
  title: string;
  urgent?: boolean; // Derived from classification or explicit? Keeping for UI compatibility
}

export interface Tramite {
  id: string | number;
  title: string;
  description: string;
  link?: string;
}

export interface TutorProfesor {
  id: string | number;
  classification: 'Tutor' | 'Profesor';
  title: string; // Text for the link
  link: string;
}

export interface Contacto {
  id: string | number;
  title: string;
  correo: string;
  ext: string;
}

export interface Entregable {
  id: string | number;
  stage: string; // 'Semana 1', 'Plazos especiales', etc.
  title: string;
  deadline: string;
}

export interface DocumentoDescarga {
  id: string | number;
  icon: string; // Name of the lucide icon
  title: string;
  link: string;
  color?: string; // UI class helper
}

// Recursos y Avisos Types

export interface EncargadoTutoria {
  id: string | number;
  image?: string; // photo url
  name: string;
  correo: string;
  ext: string;
}

export interface Coordinacion {
  id: string | number;
  image: string;
  title: string; // 'Coordinación de proyectos integradores'
  name: string;
  correo: string;
}

export interface TutorGroup {
  group: string;
  tutor: string;
}

export interface CoordinacionTutores {
  id: string | number;
  image?: string;
  title: string;
  period: string; // 'Enero-Abril 2026'
  note?: string;
  tutors?: TutorGroup[];
}

export interface RecursoGenerico {
  id: string | number;
  title: string;
  description?: string;
  link?: string;
  type: 'AltasBajas' | 'CriteriosETC' | 'Casilleros';
}

export interface CalendarioData {
  id?: string | number;
  image: string;
  cycle: string;
}

export interface LenguaExtranjeraData {
  id?: string | number;
  title: string;
  reports: {
    name: string;
    correo: string;
  };
  requestLink: string;
}
