import { NextResponse } from 'next/server';
import { uploadToDrive } from '@/lib/drive';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const department = formData.get('department') as string;

        if (!file) {
            return NextResponse.json({ error: 'No se incluyó ningún archivo' }, { status: 400 });
        }

        // Subir a Google Drive
        const buffer = Buffer.from(await file.arrayBuffer());
        const driveUrl = await uploadToDrive(buffer, file.name, file.type, department);

        return NextResponse.json({ url: driveUrl, success: true });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Error al procesar la subida' }, { status: 500 });
    }
}
