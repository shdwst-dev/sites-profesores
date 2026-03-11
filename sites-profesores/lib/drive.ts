import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const PARENT_FOLDER_ID = '1KW-WxcU3bZZ-pQyN8MYWjkmGgmzAUz3E'; // ID proporcionado por el usuario

// Autenticación de Google API
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToDrive(buffer: Buffer, filename: string, mimeType: string, department: string) {
    // 1. Opcional: Crear subcarpeta por departamento si se desea organizar más, 
    //    por ahora usamos la carpeta padre directamente para todo.
    //    Para mayor organización, aquí se podría buscar si existe la carpeta "TIID" o "Sistemas" dentro de PARENT_FOLDER_ID.

    // Por simplicidad en este MVP, todo a la carpeta principal, pero agregando un prefijo al nombre.
    const finalFilename = `[${department}] ${filename}`;

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata = {
        name: finalFilename,
        parents: [PARENT_FOLDER_ID],
    };

    const media = {
        mimeType: mimeType,
        body: stream,
    };

    try {
        const file = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
        });

        // 2. Hacer el archivo público para que se pueda ver sin login
        await drive.permissions.create({
            fileId: file.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Retornar el link para ver el archivo (o descargar)
        return file.data.webViewLink;
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw new Error('Fallo la subida a Google Drive. Verifique las credenciales y permisos.');
    }
}
