import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const PARENT_FOLDER_ID = '1FVvHCx5s5B6CE1ALFQ_n5MaHqEsme8Sv';

// Verificación temprana de credenciales para ayudar al debugging
const checkCredentials = () => {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn('⚠️ ADVERTENCIA: Faltan credenciales de Google (GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY) en .env.local');
    }
};

checkCredentials();

// Autenticación de Google API
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

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
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Las credenciales de Google Drive no están configuradas en el servidor (.env.local).');
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
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw new Error('Fallo la subida a Google Drive. Verifique las credenciales y permisos.');
    }
}
