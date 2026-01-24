'use client';

import { useRouter } from 'next/navigation';
import { AlignCenter, ArrowLeft, LogOut } from 'lucide-react';
import Footer from '@/components/Footer';

export default function RecursosAvisos() {
    const router = useRouter();

/* 
Cosas que debe de llevar esta pantalla:
1. Quién el encargado de sistemas computacionales
2. Coordinación de estancias y estadias, coordinación de tutorias
3. Coordinación de proyectos integradores
4. Criterios para solicitar un ETC
5. Calendario escolar
6. Altas y bajas de materias
7. Avisos de lengua extranjera
8. Solicitudes de casilleros para profesores
*/
    return (
        <div style={styles.pageContainer}>
            {/* Header con navegación */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/sistemas-computacionales')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Recursos y avisos</h1>
                                <p className="text-sm text-gray-600">Sistemas computacionales</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main style={styles.main}>
                {/* Tu contenido aquí */}
                <h1 className="text-2xl font-bold mb-4">Recursos y Avisos</h1>
                <div style={styles.contenedorEncargado}>
                    <div style={styles.contenedorEncargadoNombre}>
                        ISC Lilia Jimenez Cruz
                    </div>
                    <div style={styles.contenedorEncargadoContacto}>
                        Contacto: lilia.jimenez@upq.edu.mx
                    </div>
                </div>
                <div style={styles.contenedorCoordinacion}>

                    <div style={styles.contenedorCoordinacion}>

                    </div>

                </div>
            </main>

            {/* Footer reutilizable */}
            <Footer />
        </div>
    );
}

// Estilos básicos
const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        flex: 1,
    },
    main: {
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        width: '100%',
    },
    contenedorEncargado: {
        marginBottom: 16,
        padding: 30,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        backgroundColor: '#e1dfdb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contenedorCoordinacion: {

    },
    contenedorEncargadoNombre: {
        fontSize: 18,
        fontWeight: 600,
    },
    contenedorEncargadoContacto: {
        fontSize: 18,
        fontWeight: 600,
    }
};