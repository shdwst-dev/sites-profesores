// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es">
            <body className="text-gray-900 min-h-screen flex flex-col">
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -1,
                        background: 'var(--background)',
                    }}
                />
                {children}
            </body>
        </html>
    );
}
