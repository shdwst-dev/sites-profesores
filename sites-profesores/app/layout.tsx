// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es">
            <body className="bg-white text-gray-900">{children}</body>
        </html>
    );
}
