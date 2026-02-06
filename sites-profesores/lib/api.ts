
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
    single: boolean = false
): Promise<T | T[] | null> {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return single ? mockData[0] : mockData;

        let query = supabase.from(tableName).select('*');
        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Error fetching ${tableName}:`, error);
            return single ? (Array.isArray(mockData) ? mockData[0] : mockData) : mockData;
        }

        if (!data || data.length === 0) {
            // Fallback if table is empty (dev mode convenience)
            return single ? (Array.isArray(mockData) ? mockData[0] : mockData) : mockData;
        }

        return single ? data[0] : data;
    } catch (e) {
        console.error(`Exception fetching ${tableName}:`, e);
        return single ? (Array.isArray(mockData) ? mockData[0] : mockData) : mockData;
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

export const getEntregables = async (): Promise<Entregable[]> => {
    // Note: Database might sore them differently, but assuming flat list matching type
    return (await fetchWithFallback('entregables', mocks.entregables)) as Entregable[];
};

export const getDocumentosDescarga = async (): Promise<DocumentoDescarga[]> => {
    return (await fetchWithFallback('documentos_descarga', mocks.descargas)) as DocumentoDescarga[];
};

export const getEncargadoTutorias = async (): Promise<EncargadoTutoria> => {
    // If table has multiple, we take the first active one, or just first one
    const data = await fetchWithFallback('encargados_tutorias', [mocks.encargadoTutorias], undefined, true);
    return data as EncargadoTutoria;
};

export const getCoordinaciones = async (): Promise<Coordinacion[]> => {
    // Assuming table 'coordinaciones' has all of them.
    // Mock has specific vars: coordinacionPI. 
    // We might need to filter or return list. 
    // The Page uses specific coordinations. For now, let's return the Mock Object wrapped in array if DB fails.
    // In DB, 'coordinaciones' table should contain rows for 'Proyectos', etc.
    // The page expects a specific structure. Let's assume we fetch all and find the right ones in the component, or genericize.
    // For now, returning the mock single object as a list for compatibility if standard fetch is used.

    // Actually, getCoordinacionPI is better.
    return [mocks.coordinacionPI]; // Placeholder until generic logic is clearer
};

export const getCoordinacionPI = async (): Promise<Coordinacion> => {
    const data = await fetchWithFallback('coordinaciones', [mocks.coordinacionPI]);
    return Array.isArray(data) ? data.find(c => c.title.includes('Proyectos')) || mocks.coordinacionPI : data as Coordinacion;
};

export const getCoordinacionTutores = async (): Promise<CoordinacionTutores> => {
    const data = await fetchWithFallback('coordinaciones_tutores', [mocks.coordinacionTutores], undefined, true);
    return data as CoordinacionTutores;
};

export const getRecursosGenericos = async (type: string): Promise<RecursoGenerico | null> => {
    // This supports Casilleros, AltasBajas, etc. which might be single rows in a 'recursos_genericos' table
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            if (type === 'Casilleros') return mocks.casillerosData;
            // Add other mock mappings if needed, or return null
            return null;
        }

        const { data, error } = await supabase
            .from('recursos_genericos')
            .select('*')
            .eq('type', type)
            .single();

        if (error || !data) {
            if (type === 'Casilleros') return mocks.casillerosData;
            return null;
        }
        return data as RecursoGenerico;
    } catch {
        if (type === 'Casilleros') return mocks.casillerosData;
        return null;
    }
};

export const getCalendario = async (): Promise<CalendarioData> => {
    const data = await fetchWithFallback('calendario_escolar', [mocks.calendarioData], undefined, true);
    return data as CalendarioData;
};

export const getLenguaExtranjera = async (): Promise<LenguaExtranjeraData> => {
    const data = await fetchWithFallback('lengua_extranjera', [mocks.lenguaExtranjera], undefined, true);
    return data as LenguaExtranjeraData;
};

