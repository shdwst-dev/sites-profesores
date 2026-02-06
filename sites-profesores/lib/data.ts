import {
    Comunicado,
    FechaImportante,
    Tramite,
    TutorProfesor,
    Contacto,
    Entregable,
    DocumentoDescarga,
    EncargadoTutoria,
    Coordinacion,
    CoordinacionTutores,
    CalendarioData,
    LenguaExtranjeraData,
    RecursoGenerico
} from '@/types';

// Información de Interés

export const comunicados: Comunicado[] = [
    {
        id: 1,
        title: 'Comunicado Dirección General',
        classification: 'Institucional',
        date: '11 de Enero de 2026',
        description: 'Se informa sobre las nuevas políticas de movilidad académica y convenios internacionales para el año 2026.'
    },
    {
        id: 2,
        title: 'Actualización Sistema de Evaluación',
        classification: 'Académico',
        date: '9 de Enero de 2026',
        description: 'Se han implementado mejoras en el sistema de captura de calificaciones. Revisa el manual actualizado.'
    },
    {
        id: 3,
        title: 'Convocatoria Proyectos de Investigación',
        classification: 'Investigación',
        date: '8 de Enero de 2026',
        description: 'Abierta la convocatoria para proyectos de investigación aplicada. Plazo de inscripción hasta el 31 de enero.'
    }
];

export const fechasImportantes: FechaImportante[] = [
    { id: 1, date: '12 Ene', title: 'Fecha límite: Solicitudes y Cartas ETC (Tutores)', urgent: true },
    { id: 2, date: '16 Ene', title: 'Fecha límite: Altas y bajas de materias', urgent: true },
    { id: 3, date: '17 Ene', title: 'Reunión de Academia', urgent: false },
    { id: 4, date: '24 Ene', title: 'Semana 3: Entrega Plan de actividades ETC', urgent: false },
    { id: 5, date: '10 Feb', title: 'Primer corte de evaluación', urgent: false }
];

export const tramites: Tramite[] = [
    {
        id: 1,
        title: 'Justificantes de Estudiantes',
        description: 'Proceso para validar justificantes médicos y administrativos',
        link: '#'
    },
    {
        id: 2,
        title: 'Solicitud de Material Didáctico',
        description: 'Requisitos para solicitar material y equipo de laboratorio',
        link: '#'
    },
    {
        id: 3,
        title: 'Registro de Actividades Extracurriculares',
        description: 'Formato para documentar actividades complementarias',
        link: '#'
    },
    {
        id: 4,
        title: 'Asesorías y Tutorías',
        description: 'Lineamientos para el registro de horas de asesoría',
        link: '#'
    }
];

export const tutoresProfesores: TutorProfesor[] = [
    { id: 1, classification: 'Tutor', title: '¿Qué son las tutorías académicas?', link: 'https://www.youtube.com/watch?v=1oin1h4kdOg' },
    { id: 2, classification: 'Tutor', title: 'Todo el mundo debería saber programar', link: 'https://www.youtube.com/watch?v=1oin1h4kdOg' },
    { id: 3, classification: 'Tutor', title: 'La vida es maravillosa', link: 'https://www.youtube.com/watch?v=1oin1h4kdOg' },
    { id: 4, classification: 'Profesor', title: 'Estrategias didácticas de vanguardia', link: 'https://www.uniandes.edu.co/es/oferta-academica' },
    { id: 5, classification: 'Profesor', title: 'Mejora de la disciplina en el aula', link: 'https://www.enso.edu.co/biblionline/archivos/3280.pdf' }
];

export const contactos: Contacto[] = [
    { id: 1, title: 'Dirección de Carrera', correo: 'direccion@upq.edu.mx', ext: '100' },
    { id: 2, title: 'Servicios Escolares', correo: 'escolares@upq.edu.mx', ext: '200' },
    { id: 3, title: 'Soporte Técnico', correo: 'soporte@upq.edu.mx', ext: '300' },
];

// TIID

export const entregables: Entregable[] = [
    { id: 1, stage: 'Semana 1', title: 'Plan y Guía de asignatura firmados por estudiantes', deadline: 'Cierre: Fin de Semana 1' },
    { id: 2, stage: 'Semana 1', title: 'Acta de trabajo en academia', deadline: 'Cierre: Fin de Semana 1' },
    { id: 3, stage: 'Semana 1', title: 'Registrar códigos, plataformas, fechas de exámenes', deadline: 'Semana 1' },
    { id: 4, stage: 'Plazos especiales', title: 'Altas y bajas de materias', deadline: 'Hasta el 16 de Enero de 2026' },
    { id: 5, stage: 'Solo tutores', title: 'Solicitudes de ETC / Solo tutores', deadline: 'Cerrado: 12 de Enero de 2026' },
    { id: 6, stage: 'Solo tutores', title: 'Cartas de ETC / Solo tutores', deadline: 'Cerrado: 12 de Enero de 2026' },
    { id: 7, stage: 'Semana 3', title: 'Plan de actividades ETC', deadline: 'Semana 3' }
];

export const descargas: DocumentoDescarga[] = [
    { id: 1, title: 'Calendario 25 - 26', icon: 'Calendar', link: '/formatos/calendario.pdf', color: 'bg-blue-50' },
    { id: 2, title: 'CARTA ETC', icon: 'FileText', link: '/formatos/carta-etc.pdf', color: 'bg-indigo-50' },
    { id: 3, title: 'Formato Academia', icon: 'BookOpen', link: '/formatos/formato-academia.pdf', color: 'bg-purple-50' },
    { id: 4, title: 'Grupos y Horarios', icon: 'Table', link: '/formatos/grupos-horarios.pdf', color: 'bg-cyan-50' },
    { id: 5, title: 'Guía Asignatura', icon: 'Book', link: '/formatos/guia-asignatura.pdf', color: 'bg-sky-50' },
    { id: 6, title: 'Información Estancias', icon: 'FileText', link: '/formatos/estancias-estadias.pdf', color: 'bg-blue-50' },
    { id: 7, title: 'Asistencias Tutorías', icon: 'CheckSquare', link: '/formatos/lista-asistencias.pdf', color: 'bg-emerald-50' },
    { id: 8, title: 'Manuales Asignatura', icon: 'BookOpen', link: '/formatos/manuales.pdf', color: 'bg-indigo-50' },
    { id: 9, title: 'Mapa Curricular', icon: 'Map', link: '/formatos/mapa-curricular.pdf', color: 'bg-purple-50' },
    { id: 10, title: 'Plan de Asignatura', icon: 'NotebookPen', link: '/formatos/plan-asignatura.pdf', color: 'bg-pink-50' }
];

export const encargadoTutorias: EncargadoTutoria = {
    id: 1,
    name: 'ISC Lilia Jimenez Cruz',
    correo: 'lilia.jimenez@upq.edu.mx',
    ext: '120',
    image: '/placeholder-user.jpg' // User mentioned icon/photo
};

export const coordinacionPI: Coordinacion = {
    id: 1,
    title: 'Coordinación de Proyectos Integradores',
    name: 'Dra. Cecilia Alvarado Salayanda',
    correo: 'cecilia.alvarado@upq.mx',
    image: '/coordinacionPI.png'
};

export const coordinacionTutores: CoordinacionTutores = {
    id: 1,
    title: 'TUTORES',
    period: 'ENERO-ABRIL 2026',
    image: '/tutores-tiid.jpg',
    note: 'Consulte la tabla lateral para identificar a los docentes asignados a cada grupo de TIID.'
};

export const altasBajasLink = 'https://forms.gle/6mzeEmkYbU2MboKBA';

export const criteriosETC = [
    { title: 'Parciales', description: 'Aprobar al menos 2 parciales en curso normal.' },
    { title: 'Historial', description: 'No haber solicitado ETC previo de la materia.' },
    { title: 'Promedio', description: 'Tener un promedio mínimo acumulado de 7.0.' }
];

export const calendarioData: CalendarioData = {
    cycle: 'Ciclo 2025 - 2026',
    image: '/calendario2025-2026.png'
};

export const lenguaExtranjera: LenguaExtranjeraData = {
    title: 'Avisos de Inglés',
    reports: {
        name: 'Dra. Gabriela Aguilera',
        correo: 'juana.aguilera@upq.mx'
    },
    requestLink: 'https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing'
};

export const casillerosData: RecursoGenerico = {
    id: 1,
    type: 'Casilleros',
    title: 'Casilleros para Profesores',
    description: 'Solicite su espacio personal para el resguardo de materiales académicos en los edificios de TIID.',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform'
};
