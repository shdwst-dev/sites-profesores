import { NextResponse } from 'next/server';
import { uploadToDrive } from '@/lib/drive';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        // 1. Obtener usuario de la sesión
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;
        const session = await verifySessionToken(sessionToken);
        const uploadedBy = session?.email || session?.name || 'Desconocido';

        // 2. Leer datos del formulario
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const department = (formData.get('department') as string) || 'General';
        const category = (formData.get('category') as string) || 'General';

        if (!file) {
            return NextResponse.json({ error: 'No se incluyó ningún archivo' }, { status: 400 });
        }

        // 3. Subir a Google Drive con organización por carpetas
        const buffer = Buffer.from(await file.arrayBuffer());
        const driveUrl = await uploadToDrive(buffer, file.name, file.type, department, category, uploadedBy);

        return NextResponse.json({
            url: driveUrl,
            success: true,
            uploadedBy,
            department,
            category,
        });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Error al procesar la subida' }, { status: 500 });
    }
}
