'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut } from 'lucide-react'; // Agrega otros iconos según necesites
import Footer from '@/components/Footer';

export default function RecursosAvisos() {
    const router = useRouter();

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
                                <h1 className="text-xl font-bold text-gray-900">Título de tu Página</h1>
                                <p className="text-sm text-gray-600">Subtítulo o descripción</p>
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
};