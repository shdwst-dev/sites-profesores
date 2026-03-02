-- Add content JSONB column to recursos_genericos for flexible data (Recursamientos, Criterios ETC)
ALTER TABLE recursos_genericos ADD COLUMN IF NOT EXISTS content JSONB;

-- Ensure row exists for AltasBajas if not present (upsert concept, but SQL simplified)
INSERT INTO recursos_genericos (title, type, department, link)
SELECT 'Portal de Registro', 'AltasBajas', 'TIID', 'https://forms.gle/...'
WHERE NOT EXISTS (SELECT 1 FROM recursos_genericos WHERE type = 'AltasBajas' AND department = 'TIID');

-- Ensure row exists for Recursamientos
INSERT INTO recursos_genericos (title, type, department, content)
SELECT 'Proceso de Recursamientos', 'Recursamientos', 'TIID', '{"date": "12 al 16 de Mayo, 2025", "cost": "$450.00 MXN", "steps": [{"step": "01", "text": "Descarga de Solicitud..."}, {"step": "02", "text": "Obtención de firma..."}]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM recursos_genericos WHERE type = 'Recursamientos' AND department = 'TIID');

-- Ensure row exists for CriteriosETC
INSERT INTO recursos_genericos (title, type, department, content)
SELECT 'Criterios ETC', 'CriteriosETC', 'TIID', '[{"title": "Promedio", "description": "Mantener promedio..."}, {"title": "Regularidad", "description": "No tener reprobadas..."}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM recursos_genericos WHERE type = 'CriteriosETC' AND department = 'TIID');

-- Also Casilleros if missing
INSERT INTO recursos_genericos (title, type, department, link, description)
SELECT 'Casilleros para Profesores', 'Casilleros', 'TIID', 'https://forms...', 'Solicite su espacio...'
WHERE NOT EXISTS (SELECT 1 FROM recursos_genericos WHERE type = 'Casilleros' AND department = 'TIID');
