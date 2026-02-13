-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Table: comunicados (General)
create table if not exists comunicados (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date text, 
  classification text check (classification in ('Institucional', 'Académico', 'Investigación', 'Otros')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: fechas_importantes (General)
create table if not exists fechas_importantes (
  id uuid default uuid_generate_v4() primary key,
  date text not null, 
  title text not null,
  urgent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: tramites (General)
create table if not exists tramites (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: tutores_profesores (General)
create table if not exists tutores_profesores (
  id uuid default uuid_generate_v4() primary key,
  classification text check (classification in ('Tutor', 'Profesor')),
  title text not null,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: contactos (General)
create table if not exists contactos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  correo text not null,
  ext text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: entregables (Specific by Department)
create table if not exists entregables (
  id uuid default uuid_generate_v4() primary key,
  stage text not null,
  title text not null,
  deadline text,
  department text default 'TIID', -- 'TIID' or 'Sistemas'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: documentos_descarga (Specific by Department)
create table if not exists documentos_descarga (
  id uuid default uuid_generate_v4() primary key,
  icon text,
  title text not null,
  link text,
  color text,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: encargados_tutorias (Specific by Department)
create table if not exists encargados_tutorias (
  id uuid default uuid_generate_v4() primary key,
  image text,
  name text not null,
  correo text,
  ext text,
  active boolean default true,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: coordinaciones (Specific by Department)
create table if not exists coordinaciones (
  id uuid default uuid_generate_v4() primary key,
  image text,
  title text not null,
  name text not null,
  correo text,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: coordinaciones_tutores (Specific by Department)
create table if not exists coordinaciones_tutores (
  id uuid default uuid_generate_v4() primary key,
  image text,
  title text not null,
  period text,
  note text,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: recursos_genericos (Specific by Department)
create table if not exists recursos_genericos (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- 'AltasBajas', 'Casilleros', 'CriteriosETC'
  title text,
  description text,
  link text,
  extra_data jsonb,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: calendario_escolar (Specific by Department)
create table if not exists calendario_escolar (
  id uuid default uuid_generate_v4() primary key,
  cycle text,
  image text,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: lengua_extranjera (Specific by Department)
create table if not exists lengua_extranjera (
  id uuid default uuid_generate_v4() primary key,
  title text,
  report_name text,
  report_email text,
  request_link text,
  department text default 'TIID',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table comunicados enable row level security;
create policy "Public read access" on comunicados for select using (true);

alter table fechas_importantes enable row level security;
create policy "Public read access" on fechas_importantes for select using (true);

alter table tramites enable row level security;
create policy "Public read access" on tramites for select using (true);

alter table tutores_profesores enable row level security;
create policy "Public read access" on tutores_profesores for select using (true);

alter table contactos enable row level security;
create policy "Public read access" on contactos for select using (true);

alter table entregables enable row level security;
create policy "Public read access" on entregables for select using (true);

alter table documentos_descarga enable row level security;
create policy "Public read access" on documentos_descarga for select using (true);

alter table encargados_tutorias enable row level security;
create policy "Public read access" on encargados_tutorias for select using (true);

alter table coordinaciones enable row level security;
create policy "Public read access" on coordinaciones for select using (true);

alter table coordinaciones_tutores enable row level security;
create policy "Public read access" on coordinaciones_tutores for select using (true);

alter table recursos_genericos enable row level security;
create policy "Public read access" on recursos_genericos for select using (true);

alter table calendario_escolar enable row level security;
create policy "Public read access" on calendario_escolar for select using (true);

alter table lengua_extranjera enable row level security;
create policy "Public read access" on lengua_extranjera for select using (true);
