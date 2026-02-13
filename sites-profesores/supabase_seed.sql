-- Semilla de datos iniciales (Seed)
-- Copia y ejecuta este script en el Editor SQL de Supabase despues de crear las tablas.

-- 1. Comunicados (General)
INSERT INTO comunicados (title, classification, date, description) VALUES
('Comunicado Dirección General', 'Institucional', '11 de Enero de 2026', 'Se informa sobre las nuevas políticas de movilidad académica y convenios internacionales para el año 2026.'),
('Actualización Sistema de Evaluación', 'Académico', '9 de Enero de 2026', 'Se han implementado mejoras en el sistema de captura de calificaciones. Revisa el manual actualizado.'),
('Convocatoria Proyectos de Investigación', 'Investigación', '8 de Enero de 2026', 'Abierta la convocatoria para proyectos de investigación aplicada. Plazo de inscripción hasta el 31 de enero.');

-- 2. Fechas Importantes (General)
INSERT INTO fechas_importantes (date, title, urgent) VALUES
('12 Ene', 'Fecha límite: Solicitudes y Cartas ETC (Tutores)', true),
('16 Ene', 'Fecha límite: Altas y bajas de materias', true),
('17 Ene', 'Reunión de Academia', false),
('24 Ene', 'Semana 3: Entrega Plan de actividades ETC', false),
('10 Feb', 'Primer corte de evaluación', false);

-- 3. Entregables (TIID)
INSERT INTO entregables (stage, title, deadline, department) VALUES
('Semana 1', 'Plan y Guía de asignatura firmados por estudiantes', 'Cierre: Fin de Semana 1', 'TIID'),
('Semana 1', 'Acta de trabajo en academia', 'Cierre: Fin de Semana 1', 'TIID'),
('Semana 1', 'Registrar códigos, plataformas, fechas de exámenes', 'Semana 1', 'TIID'),
('Plazos especiales', 'Altas y bajas de materias', 'Hasta el 16 de Enero de 2026', 'TIID'),
('Solo tutores', 'Solicitudes de ETC / Solo tutores', 'Cerrado: 12 de Enero de 2026', 'TIID'),
('Solo tutores', 'Cartas de ETC / Solo tutores', 'Cerrado: 12 de Enero de 2026', 'TIID'),
('Semana 3', 'Plan de actividades ETC', 'Semana 3', 'TIID');

-- 3b. Entregables (Sistemas)
INSERT INTO entregables (stage, title, deadline, department) VALUES
('Semana 1', 'Plan y Guía de asignatura firmados por estudiantes', 'Cierre: Fin de Semana 1', 'Sistemas'),
('Semana 1', 'Acta de trabajo en academia', 'Cierre: Fin de Semana 1', 'Sistemas'),
('Semana 1', 'Registrar códigos, plataformas, fechas de exámenes', 'Semana 1', 'Sistemas'),
('Plazos especiales', 'Altas y bajas de materias', 'Hasta el 16 de Enero de 2026', 'Sistemas'),
('Solo tutores', 'Solicitudes de ETC / Solo tutores', 'Cerrado: 12 de Enero de 2026', 'Sistemas'),
('Solo tutores', 'Cartas de ETC / Solo tutores', 'Cerrado: 12 de Enero de 2026', 'Sistemas'),
('Semana 3', 'Plan de actividades ETC', 'Semana 3', 'Sistemas');

-- 4. Documentos Descarga (TIID)
INSERT INTO documentos_descarga (icon, title, link, color, department) VALUES
('Calendar', 'Calendario 25 - 26', '/formatos/calendario.pdf', 'bg-blue-50', 'TIID'),
('FileText', 'CARTA ETC', '/formatos/carta-etc.pdf', 'bg-indigo-50', 'TIID'),
('BookOpen', 'Formato Academia', '/formatos/formato-academia.pdf', 'bg-purple-50', 'TIID'),
('Table', 'Grupos y Horarios', '/formatos/grupos-horarios.pdf', 'bg-cyan-50', 'TIID'),
('Book', 'Guía Asignatura', '/formatos/guia-asignatura.pdf', 'bg-sky-50', 'TIID'),
('FileText', 'Información Estancias', '/formatos/estancias-estadias.pdf', 'bg-blue-50', 'TIID'),
('CheckSquare', 'Asistencias Tutorías', '/formatos/lista-asistencias.pdf', 'bg-emerald-50', 'TIID'),
('BookOpen', 'Manuales Asignatura', '/formatos/manuales.pdf', 'bg-indigo-50', 'TIID'),
('Map', 'Mapa Curricular', '/formatos/mapa-curricular.pdf', 'bg-purple-50', 'TIID'),
('NotebookPen', 'Plan de Asignatura', '/formatos/plan-asignatura.pdf', 'bg-pink-50', 'TIID');

-- 4b. Documentos Descarga (Sistemas)
INSERT INTO documentos_descarga (icon, title, link, color, department) VALUES
('Calendar', 'Calendario 25 - 26', '/formatos/calendario.pdf', 'bg-blue-50', 'Sistemas'),
('FileText', 'CARTA ETC', '/formatos/carta-etc.pdf', 'bg-rose-50', 'Sistemas'),
('BookOpen', 'Formato Academia', '/formatos/formato-academia.pdf', 'bg-orange-50', 'Sistemas'),
('Table', 'Grupos y Horarios', '/formatos/grupos-horarios.pdf', 'bg-amber-50', 'Sistemas'),
('Book', 'Guía Asignatura', '/formatos/guia-asignatura.pdf', 'bg-red-50', 'Sistemas'),
('FileText', 'Información Estancias', '/formatos/estancias-estadias.pdf', 'bg-blue-50', 'Sistemas'),
('CheckSquare', 'Asistencias Tutorías', '/formatos/lista-asistencias.pdf', 'bg-emerald-50', 'Sistemas'),
('BookOpen', 'Manuales Asignatura', '/formatos/manuales.pdf', 'bg-rose-50', 'Sistemas'),
('Map', 'Mapa Curricular', '/formatos/mapa-curricular.pdf', 'bg-orange-50', 'Sistemas'),
('NotebookPen', 'Plan de Asignatura', '/formatos/plan-asignatura.pdf', 'bg-pink-50', 'Sistemas');

-- 5. Encargados Tutorias
INSERT INTO encargados_tutorias (name, correo, ext, image, department) VALUES
('ISC Lilia Jimenez Cruz', 'lilia.jimenez@upq.edu.mx', '120', '', 'TIID'),
('ISC Lilia Jimenez Cruz', 'lilia.jimenez@upq.edu.mx', '120', '', 'Sistemas'); -- Confirmar si es la misma

-- 6. Coordinaciones
INSERT INTO coordinaciones (title, name, correo, image, department) VALUES
('Coordinación de Proyectos Integradores', 'Dra. Cecilia Alvarado Salayanda', 'cecilia.alvarado@upq.mx', '/coordinacionPI.png', 'TIID'),
('Coordinación de Proyectos Integradores', 'Dra. Cecilia Alvarado Salayanda', 'cecilia.alvarado@upq.mx', '/coordinacionPI.png', 'Sistemas');

-- 7. Coordinaciones Tutores
INSERT INTO coordinaciones_tutores (title, period, note, image, department) VALUES
('TUTORES', 'ENERO-ABRIL 2026', 'Consulte la tabla lateral para identificar a los docentes asignados a cada grupo de TIID.', '/tutores-tiid.jpg', 'TIID'),
('Acción Tutorial', 'ENERO-ABRIL 2026', 'Coordinación / Gestión de Docentes', '/coordinacionTutorias.jpg', 'Sistemas');

-- 8. Calendario Escolar
INSERT INTO calendario_escolar (cycle, image, department) VALUES
('Ciclo 2025 - 2026', '/calendario2025-2026.png', 'TIID'),
('Ciclo 2025 - 2026', '/calendario2025-2026.png', 'Sistemas');

-- 9. Lengua Extranjera
INSERT INTO lengua_extranjera (title, report_name, report_email, request_link, department) VALUES
('Avisos de Inglés', 'Dra. Gabriela Aguilera', 'juana.aguilera@upq.mx', 'https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing', 'TIID'),
('Avisos de Inglés', 'Dra. Gabriela Aguilera', 'juana.aguilera@upq.mx', 'https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing', 'Sistemas');

-- 10. Recursos Genericos
INSERT INTO recursos_genericos (type, title, description, link, department) VALUES
('Casilleros', 'Casilleros para Profesores', 'Solicite su espacio personal para el resguardo de materiales académicos en los edificios de TIID.', 'https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform', 'TIID'),
('Casilleros', 'Casilleros para Profesores', 'Solicite su espacio personal para el resguardo de materiales académicos en los edificios de Sistemas.', 'https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform', 'Sistemas'),
('AltasBajas', 'Portal SII Forms', 'Formulario oficial...', 'https://forms.gle/6mzeEmkYbU2MboKBA', 'TIID'),
('AltasBajas', 'Portal SII Forms', 'Formulario oficial...', 'https://forms.gle/6mzeEmkYbU2MboKBA', 'Sistemas');
