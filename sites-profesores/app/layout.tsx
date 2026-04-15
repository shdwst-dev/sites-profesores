// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata = {
    title: 'Portal Docente | UPQ',
    description: 'Gestión académica para profesores de la Universidad Politécnica de Querétaro',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es" className="dark" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#4f46e5" />
                <link rel="apple-touch-icon" href="/UPQ-Logo.png" />
            </head>
            <body className="text-gray-900 min-h-screen flex flex-col">
                <ThemeProvider>
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: -1,
                            background: 'var(--background)',
                        }}
                    />
                    {children}
                </ThemeProvider>

                {/* Service Worker Registration */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                                    }, function(err) {
                                        console.log('ServiceWorker registration failed: ', err);
                                    });
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}
