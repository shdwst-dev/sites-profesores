-- ============================================================
-- Migración: Correcciones CRUD Panel Admin
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- 1. Agregar columna `tutors` a coordinaciones_tutores
--    Almacena la lista de tutores por grupo en formato JSON:
--    [{ "group": "Grupo A", "tutor": "Nombre Tutor" }, ...]
ALTER TABLE coordinaciones_tutores
    ADD COLUMN IF NOT EXISTS tutors JSONB DEFAULT '[]'::jsonb;

-- 2. Renombrar `extra_data` a `content` en recursos_genericos
--    para unificar la nomenclatura con el frontend.
--    NOTA: Si ya existe la columna `content`, este paso se omite.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'recursos_genericos'
          AND column_name = 'extra_data'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'recursos_genericos'
          AND column_name = 'content'
    ) THEN
        ALTER TABLE recursos_genericos RENAME COLUMN extra_data TO content;
    END IF;
END $$;

-- 3. Si la columna content aún no existe (tabla nueva), crearla directamente
ALTER TABLE recursos_genericos
    ADD COLUMN IF NOT EXISTS content JSONB;

-- ============================================================
-- Verificación (opcional — ejecutar por separado para confirmar)
-- ============================================================
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'coordinaciones_tutores';

-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'recursos_genericos';
