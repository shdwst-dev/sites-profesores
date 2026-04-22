-- Agrega las columnas faltantes a la tabla de usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS picture TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
