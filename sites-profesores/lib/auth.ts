// Utilidades de autenticación con tokens de sesión firmados por HMAC
// Los tokens están basados en JWT pero firmados con una clave secreta del servidor

const SESSION_SECRET = process.env.SESSION_SECRET;
const TOKEN_VERSION = 'v1';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

if (!SESSION_SECRET) {
    throw new Error('Missing SESSION_SECRET');
}

export type SessionPayload = {
    email: string;
    name?: string;
    picture?: string;
    sub?: string;
    exp: number; // Timestamp de expiración
};

// Firma un mensaje HMAC usando SubtleCrypto (funciona en edge runtime)
async function hmacSign(message: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(SESSION_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return Buffer.from(sig).toString('base64url');
}

// Verifica que una firma HMAC sea válida
async function hmacVerify(message: string, signature: string): Promise<boolean> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(SESSION_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );
    return await crypto.subtle.verify('HMAC', key, Buffer.from(signature, 'base64url'), new TextEncoder().encode(message));
}

// Crea un token de sesión firmado
// Formato: v1.base64(payload).signature
export async function signSession(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const fullPayload: SessionPayload = { ...payload, exp };
    const base = `${TOKEN_VERSION}.${Buffer.from(JSON.stringify(fullPayload)).toString('base64url')}`;
    const signature = await hmacSign(base);
    return `${base}.${signature}`;
}

// Verifica y decodifica un token de sesión
// Retorna null si el token es inválido, expirado o la firma no es correcta
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [version, payloadB64, signature] = parts;
    if (version !== TOKEN_VERSION) return null;

    const base = `${version}.${payloadB64}`;
    try {
        // Verifica la firma HMAC
        const isValid = await hmacVerify(base, signature);
        if (!isValid) return null;

        // Decodifica el payload
        const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
        // Verifica que no haya expirado
        if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch (error) {
        console.error('Failed to parse session token', error);
        return null;
    }
}
