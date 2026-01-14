import React from 'react';

export default function Home() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>¡Bienvenido!</h1>
            <p style={styles.message}>Has iniciado sesión correctamente.</p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
    },
    title: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '1rem'
    },
    message: {
        fontSize: '1.2rem',
        color: '#666'
    }
};
