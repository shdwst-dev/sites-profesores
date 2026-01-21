import React from 'react';

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <p style={styles.footerText}>Universidad Politécnica de Querétaro</p>
                <p style={styles.footerText}>DITH Ana Laura Lira Cortes</p>
                <p style={styles.footerText}>ana.lira@upq.mx</p>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#0a4a8c',
        color: '#fff',
        padding: '32px 24px',
        textAlign: 'center' as const,
        marginTop: 'auto',
    },
    footerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    footerText: {
        margin: '8px 0',
        fontSize: '16px',
        fontWeight: 400,
    },
};
