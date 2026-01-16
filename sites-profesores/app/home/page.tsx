import React from 'react';
import Image from 'next/image';
import { Info, Cpu, Globe } from 'lucide-react';


export default function Home() {
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <Image
                        src="/UPQ-Logo.png"
                        alt="Logo UPQ"
                        width={90}
                        height={90}
                    />
                </div>
            </header>
            <div style={styles.container}>
                <h1 style={styles.titulo}>Bienvenido al portal</h1>
                <h2 style={styles.subtitulo}>Seleccione una opción para continuar</h2>
            </div>
            <div style={styles.opciones}>
                <div style={styles.opcion}>
                    <div style={{ ...styles.opcionHeader, backgroundColor: '#004a8f' }}>
                        <div className="icono-wrapper" style={styles.iconoWrapper}>
                            <Info size={48} color="#fff" />
                        </div>
                        <h3 style={styles.opcionTitulo}>Información de Interés</h3>
                    </div>
                    <p style={styles.opcionDescripcion}>Avisos, comunicados y noticias importantes</p>
                </div>
                <div style={styles.opcion}>
                    <div style={{ ...styles.opcionHeader, backgroundColor: '#c41e3a' }}>
                        <div style={styles.iconoWrapper}>
                            <Cpu size={48} color="#fff" />
                        </div>
                        <h3 style={styles.opcionTitulo}>Sistemas Computacionales</h3>
                    </div>
                    <p style={styles.opcionDescripcion}>Gestión de documentos y recursos de la carrera</p>
                </div>
                <div style={styles.opcion}>
                    <div style={{ ...styles.opcionHeader, backgroundColor: '#004a8f' }}>
                        <div style={styles.iconoWrapper}>
                            <Globe size={48} color="#fff" />
                        </div>
                        <h3 style={styles.opcionTitulo}>TIID</h3>
                    </div>
                    <p style={styles.opcionDescripcion}>Gestión de documentos y recursos de la carrera</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logo: {
        objectFit: 'contain',
    },
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '4rem',
        marginBottom: '2rem',
    },
    titulo: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '0.5rem',
    },
    subtitulo: {
        fontSize: '1.2rem',
        color: '#666',
        marginTop: '0.5rem',
    },
    opciones: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'center',
        gap: '2rem',
        padding: '1rem 2rem',
        flexWrap: 'wrap' as const,
    },
    opcion: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: '380px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    opcionTitulo: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#ffffff',
        margin: 0,
        textAlign: 'center' as const,
    },
    opcionHeader: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        gap: '1rem',
        minHeight: '160px',
    },
    opcionDescripcion: {
        fontSize: '1rem',
        color: '#666',
        padding: '1.5rem',
        textAlign: 'center' as const,
        margin: 0,
    },
    iconoWrapper: {
        transition: 'transform 0.3 ease',
        cursor: 'pointer'
    }
};