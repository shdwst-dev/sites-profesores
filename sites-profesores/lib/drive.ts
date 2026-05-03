import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '1uEvZZy3jhXpj0_67CGelYYyq5cBh45cq';

// Autenticación OAuth2 usando las credenciales del bot (separadas del login)
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback'
);

if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
} else {
    console.warn('⚠️ ADVERTENCIA: Falta GOOGLE_REFRESH_TOKEN en .env.local');
}

const drive = google.drive({ version: 'v3', auth: oauth2Client });


// Cache de IDs de carpetas ya creadas para no buscar cada vez
const folderCache = new Map<string, string>();

/**
 * Busca una subcarpeta por nombre dentro de un parent. Si no existe, la crea.
 */
async function getOrCreateFolder(name: string, parentId: string): Promise<string> {
    const cacheKey = `${parentId}/${name}`;
    if (folderCache.has(cacheKey)) {
        return folderCache.get(cacheKey)!;
    }

    // Buscar si ya existe
    const searchRes = await drive.files.list({
        q: `name='${name}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
        const folderId = searchRes.data.files[0].id!;
        folderCache.set(cacheKey, folderId);
        return folderId;
    }

    // Crear la carpeta
    const createRes = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        },
        fields: 'id',
    });

    const newId = createRes.data.id!;
    folderCache.set(cacheKey, newId);
    return newId;
}

/**
 * Sube un archivo a Drive organizado en: Carpeta raíz / Departamento / Categoría / archivo
 * 
 * @param buffer    - Contenido del archivo
 * @param filename  - Nombre original del archivo
 * @param mimeType  - Tipo MIME
 * @param department - Departamento (TIID, Sistemas, General)
 * @param category  - Categoría/Tipo (Formatos, Recursos, Entregables, etc.)
 * @param uploadedBy - Email o nombre de quien subió el archivo
 */
export async function uploadToDrive(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    department: string,
    category: string = 'General',
    uploadedBy: string = 'Desconocido'
) {
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
        throw new Error('Primero debes autorizar la aplicación entrando a /api/auth/google/login');
    }

    // 1. Obtener/crear carpeta de departamento
    const deptFolderId = await getOrCreateFolder(department, PARENT_FOLDER_ID);

    // 2. Obtener/crear subcarpeta de categoría dentro del departamento
    const catFolderId = await getOrCreateFolder(category, deptFolderId);

    // 3. Preparar nombre con timestamp y usuario
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const cleanUser = uploadedBy.split('@')[0] || uploadedBy; // Solo el nombre antes del @
    const finalFilename = `${timestamp}_${cleanUser}_${filename}`;

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata = {
        name: finalFilename,
        parents: [catFolderId],
        description: `Subido por: ${uploadedBy} | Departamento: ${department} | Categoría: ${category} | Fecha: ${new Date().toLocaleString('es-MX')}`,
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

        // Hacer el archivo público para que se pueda ver sin login
        await drive.permissions.create({
            fileId: file.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return file.data.webViewLink;
    } catch (error: any) {
        console.error('Error uploading to Google Drive:', error);
        throw new Error(`Google Drive API Error: ${error.message}`);
    }
}
