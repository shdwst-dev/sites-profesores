
import { supabase } from './supabase';
import * as mocks from './data';
import {
    Comunicado, FechaImportante, Tramite, TutorProfesor, Contacto,
    Entregable, DocumentoDescarga, EncargadoTutoria, Coordinacion,
    CoordinacionTutores, RecursoGenerico, CalendarioData, LenguaExtranjeraData
} from '@/types';

// Generic fetcher with fallback
async function fetchWithFallback<T>(
    tableName: string,
    mockData: T[],
    orderBy?: { column: string, ascending?: boolean },
    single: boolean = false,
    department?: string
): Promise<T | T[] | null> {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return single ? (Array.isArray(mockData) ? mockData[0] : mockData) : mockData;

        let query = supabase.from(tableName).select('*');

        if (department) {
            query = query.eq('department', department);
        }

        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        const { data, error } = await query;

        if (error) {
            console.warn(`Error fetching ${tableName}:`, error);
            // Return mock if error, but cast to T[] or T correctly
            if (single) {
                return Array.isArray(mockData) ? mockData[0] : mockData;
            }
            return mockData;
        }

        if (!data || data.length === 0) {
            // Fallback if table is empty
            if (single) {
                return Array.isArray(mockData) ? mockData[0] : mockData;
            }
            return mockData;
        }

        return single ? data[0] : data;
    } catch (e) {
        console.error(`Exception fetching ${tableName}:`, e);
        if (single) {
            return Array.isArray(mockData) ? mockData[0] : mockData;
        }
        return mockData;
    }
}

// Data Fetching Functions

export const getComunicados = async (): Promise<Comunicado[]> => {
    return (await fetchWithFallback('comunicados', mocks.comunicados, { column: 'created_at', ascending: false })) as Comunicado[];
};

export const getFechasImportantes = async (): Promise<FechaImportante[]> => {
    return (await fetchWithFallback('fechas_importantes', mocks.fechasImportantes, { column: 'created_at', ascending: true })) as FechaImportante[];
};

export const getTramites = async (): Promise<Tramite[]> => {
    return (await fetchWithFallback('tramites', mocks.tramites)) as Tramite[];
};

export const getTutoresProfesores = async (): Promise<TutorProfesor[]> => {
    return (await fetchWithFallback('tutores_profesores', mocks.tutoresProfesores)) as TutorProfesor[];
};

export const getContactos = async (): Promise<Contacto[]> => {
    return (await fetchWithFallback('contactos', mocks.contactos)) as Contacto[];
};

// TIID

// TIID & Sistemas Generics

export const getEntregables = async (department: string = 'TIID'): Promise<Entregable[]> => {
    const mock = department === 'Sistemas' ? mocks.entregablesSistemas : mocks.entregables;
    return (await fetchWithFallback('entregables', mock, undefined, false, department)) as Entregable[];
};

export const getDocumentosDescarga = async (department: string = 'TIID'): Promise<DocumentoDescarga[]> => {
    const mock = department === 'Sistemas' ? mocks.descargasSistemas : mocks.descargas;
    return (await fetchWithFallback('documentos_descarga', mock, undefined, false, department)) as DocumentoDescarga[];
};

export const getEncargadoTutorias = async (department: string = 'TIID'): Promise<EncargadoTutoria> => {
    const mock = department === 'Sistemas' ? [mocks.encargadoTutoriasSistemas] : [mocks.encargadoTutorias];
    const data = await fetchWithFallback('encargados_tutorias', mock, undefined, true, department);
    return data as EncargadoTutoria;
};

export const getCoordinaciones = async (department: string = 'TIID'): Promise<Coordinacion[]> => {
    const mock = department === 'Sistemas' ? [mocks.coordinacionPISistemas] : [mocks.coordinacionPI];
    return (await fetchWithFallback('coordinaciones', mock, undefined, false, department)) as Coordinacion[];
};

export const getCoordinacionPI = async (department: string = 'TIID'): Promise<Coordinacion> => {
    const mock = department === 'Sistemas' ? [mocks.coordinacionPISistemas] : [mocks.coordinacionPI];
    const data = await fetchWithFallback('coordinaciones', mock, undefined, false, department);

    // If fetching logic returns array, find the PI one, else return single/mock
    if (Array.isArray(data)) {
        return data.find(c => c.title.toLowerCase().includes('proyectos')) || mock[0];
    }
    return data as Coordinacion;
};

export const getCoordinacionEstancias = async (department: string = 'TIID'): Promise<Coordinacion> => {
    const mock = department === 'Sistemas' ? [mocks.coordinacionEstanciasSistemas] : [mocks.coordinacionEstancias];
    const data = await fetchWithFallback('coordinaciones', mock, undefined, false, department);

    // Filter for the Estancias coordination entry
    if (Array.isArray(data)) {
        return data.find(c => c.title.toLowerCase().includes('estancias')) || mock[0];
    }
    return data as Coordinacion;
};

export const getCoordinacionTutores = async (department: string = 'TIID'): Promise<CoordinacionTutores> => {
    const mock = department === 'Sistemas' ? [mocks.coordinacionTutoresSistemas] : [mocks.coordinacionTutores];
    const data = await fetchWithFallback('coordinaciones_tutores', mock, undefined, true, department);

    // Fallback merge: If DB returns data but lacks 'tutors' (because DB schema isn't updated yet),
    // use the local mock tutors to ensure the table renders as requested.
    const result = data as CoordinacionTutores;
    if (result && !result.tutors && mock[0].tutors) {
        return {
            ...result,
            tutors: mock[0].tutors
        };
    }

    return result;
};

export const getRecursosGenericos = async (type: string, department: string = 'TIID'): Promise<RecursoGenerico | null> => {
    const mockCasilleros = department === 'Sistemas' ? mocks.casillerosDataSistemas : mocks.casillerosData;

    // If type is not handled in mocks (like AltasBajas which is often just a link), return null if checking mocks
    // But fetchWithFallback handles array of mocks. 
    // We can simulate fetchWithFallback behavior manually or update fetchWithFallback to filter by two columns?
    // fetchWithFallback only filters by department. 
    // So we use Supabase directly for this specific query as it has 2 filters (type AND department)

    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            if (type === 'Casilleros') return mockCasilleros;
            return null;
        }

        const { data, error } = await supabase
            .from('recursos_genericos')
            .select('*')
            .eq('type', type)
            .eq('department', department)
            .single();

        if (error || !data) {
            if (type === 'Casilleros') return mockCasilleros;
            return null;
        }
        return data as RecursoGenerico;
    } catch {
        if (type === 'Casilleros') return mockCasilleros;
        return null;
    }
};

export const getCalendario = async (department: string = 'TIID'): Promise<CalendarioData> => {
    const mock = department === 'Sistemas' ? [mocks.calendarioDataSistemas] : [mocks.calendarioData];
    const data = await fetchWithFallback('calendario_escolar', mock, undefined, true, department);
    return data as CalendarioData;
};

export const getLenguaExtranjera = async (department: string = 'TIID'): Promise<LenguaExtranjeraData> => {
    const mock = department === 'Sistemas' ? [mocks.lenguaExtranjeraSistemas] : [mocks.lenguaExtranjera];
    const rawData = await fetchWithFallback('lengua_extranjera', mock, undefined, true, department);

    if (!rawData) return mock[0];

    // Map DB flat structure to nested object if necessary
    const r = rawData as any;
    // Check if it has DB specific columns
    if ('report_name' in r) {
        return {
            title: r.title,
            reports: {
                name: r.report_name,
                correo: r.report_email
            },
            requestLink: r.request_link
        } as LenguaExtranjeraData;
    }

    return rawData as LenguaExtranjeraData;
};

// Helper to handle Mock ID (Number) vs Real ID (UUID)
// If ID is number, we assume it's mock data and we need to INSERT a new row.
// If ID is string (UUID), we UPDATE.
// Helper to handle Mock ID (Number) vs Real ID (UUID)
// If ID is number, we assume it's mock data and we need to INSERT a new row.
// If ID is string (UUID), we UPDATE.
async function saveToSupabase(tableName: string, id: string | number, data: any, department: string = 'TIID') {
    console.log(`[saveToSupabase] Attempting to save to ${tableName}. ID: ${id}, Dept: ${department}`);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.error('[saveToSupabase] No Supabase URL found in environment variables.');
        throw new Error('No configuration for database found (NEXT_PUBLIC_SUPABASE_URL missing).');
    }

    if (typeof id === 'number') {
        console.log('[saveToSupabase] ID is number (mock), attempting INSERT...');
        const { id: _, ...insertData } = data;
        const payload = { ...insertData, department };

        // Ensure tutors is saved if present (assuming JSONB column exists)
        // if (Array.isArray(payload.tutors)) {
        //    delete payload.tutors;
        // }

        const { data: inserted, error } = await supabase.from(tableName).insert([payload]).select();
        if (error) {
            console.error('[saveToSupabase] Insert Error:', error);
            throw error;
        }
        console.log('[saveToSupabase] Insert Success:', inserted);
    } else {
        console.log('[saveToSupabase] ID is string (UUID), attempting UPDATE...');
        const { id: _, ...updateData } = data;
        const { data: updated, error } = await supabase.from(tableName).update(updateData).eq('id', id).select();
        if (error) {
            console.error('[saveToSupabase] Update Error:', error.message, error.details || '', error.hint || '');
            throw error;
        }
        console.log('[saveToSupabase] Update Success:', updated);
    }
}

export const updateEncargadoTutorias = async (id: string | number, data: Partial<EncargadoTutoria>, department = 'TIID') => {
    await saveToSupabase('encargados_tutorias', id, data, department);
};

export const updateCoordinacion = async (id: string | number, data: Partial<Coordinacion>, department = 'TIID') => {
    await saveToSupabase('coordinaciones', id, data, department);
};

export const updateCoordinacionTutores = async (id: string | number, data: Partial<CoordinacionTutores>, department = 'TIID') => {
    // We now allow saving tutors array directly
    await saveToSupabase('coordinaciones_tutores', id, data, department);
};

export const updateRecursoGenerico = async (id: string | number, data: Partial<RecursoGenerico>, department = 'TIID') => {
    await saveToSupabase('recursos_genericos', id, data, department);
};

export const updateCalendario = async (id: string | number, data: Partial<CalendarioData>, department = 'TIID') => {
    await saveToSupabase('calendario_escolar', id, data, department);
};

export const updateLenguaExtranjera = async (id: string | number, data: Partial<LenguaExtranjeraData>, department = 'TIID') => {
    const updateData: any = { ...data };

    // Transform nested objects to flat columns
    if (data.reports) {
        updateData.report_name = data.reports.name;
        updateData.report_email = data.reports.correo;
        delete updateData.reports;
    }
    if (data.requestLink) {
        updateData.request_link = data.requestLink;
        delete updateData.requestLink;
    }

    await saveToSupabase('lengua_extranjera', id, updateData, department);
};

// Generic Delete Helper
async function deleteFromSupabase(tableName: string, id: string | number) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    // If mock data (number id), we can't really delete from server unless we track it, 
    // but usually we just return success for UI simulation if dev mode.
    if (typeof id === 'number') {
        console.warn('Cannot delete mock data from server.');
        return;
    }

    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        throw error;
    }
}

// Entregables CRUD
export const createEntregable = async (data: Omit<Entregable, 'id'>, department = 'TIID') => {
    await saveToSupabase('entregables', Date.now(), data, department); // Use dummy ID for saveToSupabase logic which handles insert
};

export const updateEntregable = async (id: string | number, data: Partial<Entregable>, department = 'TIID') => {
    await saveToSupabase('entregables', id, data, department);
};

export const deleteEntregable = async (id: string | number) => {
    await deleteFromSupabase('entregables', id);
};

// Documentos Descarga CRUD
export const createDocumentoDescarga = async (data: Omit<DocumentoDescarga, 'id'>, department = 'TIID') => {
    await saveToSupabase('documentos_descarga', Date.now(), data, department);
};

export const updateDocumentoDescarga = async (id: string | number, data: Partial<DocumentoDescarga>, department = 'TIID') => {
    await saveToSupabase('documentos_descarga', id, data, department);
};

export const deleteDocumentoDescarga = async (id: string | number) => {
    await deleteFromSupabase('documentos_descarga', id);
};

// Comunicados CRUD
export const createComunicado = async (data: Omit<Comunicado, 'id'>) => {
    await saveToSupabase('comunicados', Date.now(), data);
};

export const updateComunicado = async (id: string | number, data: Partial<Comunicado>) => {
    await saveToSupabase('comunicados', id, data);
};

export const deleteComunicado = async (id: string | number) => {
    await deleteFromSupabase('comunicados', id);
};

// Fechas Importantes CRUD
export const createFechaImportante = async (data: Omit<FechaImportante, 'id'>) => {
    await saveToSupabase('fechas_importantes', Date.now(), data);
};

export const updateFechaImportante = async (id: string | number, data: Partial<FechaImportante>) => {
    await saveToSupabase('fechas_importantes', id, data);
};

export const deleteFechaImportante = async (id: string | number) => {
    await deleteFromSupabase('fechas_importantes', id);
};

// Tramites CRUD
export const createTramite = async (data: Omit<Tramite, 'id'>) => {
    await saveToSupabase('tramites', Date.now(), data);
};

export const updateTramite = async (id: string | number, data: Partial<Tramite>) => {
    await saveToSupabase('tramites', id, data);
};

export const deleteTramite = async (id: string | number) => {
    await deleteFromSupabase('tramites', id);
};

// Tutores/Profesores CRUD
export const createTutorProfesor = async (data: Omit<TutorProfesor, 'id'>) => {
    await saveToSupabase('tutores_profesores', Date.now(), data);
};

export const updateTutorProfesor = async (id: string | number, data: Partial<TutorProfesor>) => {
    await saveToSupabase('tutores_profesores', id, data);
};

export const deleteTutorProfesor = async (id: string | number) => {
    await deleteFromSupabase('tutores_profesores', id);
};

// Contactos CRUD
export const createContacto = async (data: Omit<Contacto, 'id'>) => {
    await saveToSupabase('contactos', Date.now(), data);
};

export const updateContacto = async (id: string | number, data: Partial<Contacto>) => {
    await saveToSupabase('contactos', id, data);
};

export const deleteContacto = async (id: string | number) => {
    await deleteFromSupabase('contactos', id);
};

