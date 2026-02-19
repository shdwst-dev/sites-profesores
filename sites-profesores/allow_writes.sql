-- Allow Public Write Access (Temporary for Development without Auth)
-- Run this in your Supabase SQL Editor

-- Comunicados
create policy "Public insert access" on comunicados for insert with check (true);
create policy "Public update access" on comunicados for update using (true);
create policy "Public delete access" on comunicados for delete using (true);

-- Fechas Importantes
create policy "Public insert access" on fechas_importantes for insert with check (true);
create policy "Public update access" on fechas_importantes for update using (true);
create policy "Public delete access" on fechas_importantes for delete using (true);

-- Tramites
create policy "Public insert access" on tramites for insert with check (true);
create policy "Public update access" on tramites for update using (true);
create policy "Public delete access" on tramites for delete using (true);

-- Tutores Profesores
create policy "Public insert access" on tutores_profesores for insert with check (true);
create policy "Public update access" on tutores_profesores for update using (true);
create policy "Public delete access" on tutores_profesores for delete using (true);

-- Contactos
create policy "Public insert access" on contactos for insert with check (true);
create policy "Public update access" on contactos for update using (true);
create policy "Public delete access" on contactos for delete using (true);

-- Entregables
create policy "Public insert access" on entregables for insert with check (true);
create policy "Public update access" on entregables for update using (true);
create policy "Public delete access" on entregables for delete using (true);

-- Documentos Descarga
create policy "Public insert access" on documentos_descarga for insert with check (true);
create policy "Public update access" on documentos_descarga for update using (true);
create policy "Public delete access" on documentos_descarga for delete using (true);

-- Encargados Tutorias
create policy "Public insert access" on encargados_tutorias for insert with check (true);
create policy "Public update access" on encargados_tutorias for update using (true);
create policy "Public delete access" on encargados_tutorias for delete using (true);

-- Coordinaciones
create policy "Public insert access" on coordinaciones for insert with check (true);
create policy "Public update access" on coordinaciones for update using (true);
create policy "Public delete access" on coordinaciones for delete using (true);

-- Coordinaciones Tutores
create policy "Public insert access" on coordinaciones_tutores for insert with check (true);
create policy "Public update access" on coordinaciones_tutores for update using (true);
create policy "Public delete access" on coordinaciones_tutores for delete using (true);

-- Recursos Genericos
create policy "Public insert access" on recursos_genericos for insert with check (true);
create policy "Public update access" on recursos_genericos for update using (true);
create policy "Public delete access" on recursos_genericos for delete using (true);

-- Calendario Escolar
create policy "Public insert access" on calendario_escolar for insert with check (true);
create policy "Public update access" on calendario_escolar for update using (true);
create policy "Public delete access" on calendario_escolar for delete using (true);

-- Lengua Extranjera
create policy "Public insert access" on lengua_extranjera for insert with check (true);
create policy "Public update access" on lengua_extranjera for update using (true);
create policy "Public delete access" on lengua_extranjera for delete using (true);
