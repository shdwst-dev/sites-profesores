
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
            console.error(`Error fetching ${tableName}:`, error);
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

export const getCoordinacionTutores = async (department: string = 'TIID'): Promise<CoordinacionTutores> => {
    const mock = department === 'Sistemas' ? [mocks.coordinacionTutoresSistemas] : [mocks.coordinacionTutores];
    const data = await fetchWithFallback('coordinaciones_tutores', mock, undefined, true, department);
    return data as CoordinacionTutores;
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

