import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía una alerta por correo electrónico cuando se agrega contenido nuevo (comunicado, fecha, trámite, etc.)
 * @param table - El nombre de la tabla que se actualizó.
 * @param payload - El contenido nuevo que se insertó.
 */
export async function sendNewContentAlert(table: string, payload: any) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email Alert] No se envió correo: RESEND_API_KEY no existe.');
        return;
    }

    try {
        const title = payload.title || payload.name || 'Nuevo Registro';
        const typeLabel = table.charAt(0).toUpperCase() + table.slice(1).replace('_', ' ');
        const destEmail = process.env.ADMIN_NOTIFY_EMAIL;
        if (!destEmail) {
            console.warn('[Email Alert] No se envió correo: ADMIN_NOTIFY_EMAIL no configurado en .env.local');
            return;
        }

        const { data, error } = await resend.emails.send({
            from: 'Sitio Profesores UPQ <onboarding@resend.dev>', // Si usas dominio propio, cámbialo aquí
            to: [destEmail],
            subject: `📢 Nueva Alerta: ${typeLabel} - ${title}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6366f1;">🔔 Nuevo contenido agregado</h2>
                    <p>Se ha registrado un nuevo <strong>${typeLabel}</strong> en el sistema de administración.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Título:</strong> ${title}</p>
                        ${payload.description ? `<p style="margin: 5px 0;"><strong>Descripción:</strong> ${payload.description}</p>` : ''}
                        ${payload.date ? `<p style="margin: 5px 0;"><strong>Fecha:</strong> ${payload.date}</p>` : ''}
                        ${payload.department ? `<p style="margin: 5px 0;"><strong>Departamento:</strong> ${payload.department}</p>` : ''}
                    </div>
                    <p style="font-size: 12px; color: #666;">Este es un aviso automático generado por el sistema.</p>
                </div>
            `,
        });

        if (error) {
            console.error('[Email Alert Error]:', error);
        } else {
            console.log('[Email Alert Success]:', data?.id);
        }
    } catch (err) {
        console.error('[Email Alert Exception]:', err);
    }
}
