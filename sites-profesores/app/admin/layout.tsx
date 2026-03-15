import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-900 flex text-white font-sans">
            <AdminSidebar />

            {/* Main Content — offset on desktop, full width on mobile */}
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
