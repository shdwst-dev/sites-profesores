// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="es" className="h-full">
            <body className="bg-white text-gray-900 h-full flex flex-col">{children}</body>
        </html>
    );
}
