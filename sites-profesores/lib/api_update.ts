
import { supabase } from './supabase';
import {
    EncargadoTutoria,
    Coordinacion,
    CoordinacionTutores,
    RecursoGenerico,
    CalendarioData,
    LenguaExtranjeraData
} from '@/types';

// Update Functions

export const updateEncargadoTutorias = async (id: string | number, data: Partial<EncargadoTutoria>) => {
    const { error } = await supabase.from('encargados_tutorias').update(data).eq('id', id);
    if (error) throw error;
};

export const updateCoordinacion = async (id: string | number, data: Partial<Coordinacion>) => {
    const { error } = await supabase.from('coordinaciones').update(data).eq('id', id);
    if (error) throw error;
};

export const updateCoordinacionTutores = async (id: string | number, data: Partial<CoordinacionTutores>) => {
    const { error } = await supabase.from('coordinaciones_tutores').update(data).eq('id', id);
    if (error) throw error;
};

export const updateRecursoGenerico = async (id: string | number, data: Partial<RecursoGenerico>) => {
    const { error } = await supabase.from('recursos_genericos').update(data).eq('id', id);
    if (error) throw error;
};

export const updateCalendario = async (id: string | number, data: Partial<CalendarioData>) => {
    const { error } = await supabase.from('calendario_escolar').update(data).eq('id', id);
    if (error) throw error;
};

export const updateLenguaExtranjera = async (id: string | number, data: Partial<LenguaExtranjeraData>) => {
    const updateData: any = { ...data };
    if (data.reports) {
        updateData.report_name = data.reports.name;
        updateData.report_email = data.reports.correo;
        delete updateData.reports;
    }
    if (data.requestLink) {
        updateData.request_link = data.requestLink;
        delete updateData.requestLink;
    }

    const { error } = await supabase.from('lengua_extranjera').update(updateData).eq('id', id);
    if (error) throw error;
};
