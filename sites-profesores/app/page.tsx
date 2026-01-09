import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Portal Docente UPQ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Botón Sistemas */}
        <Link href="/sistemas" className="p-10 bg-white rounded-xl shadow-lg hover:shadow-xl transition border-l-4 border-blue-600">
          <h2 className="text-2xl font-semibold mb-2">Sistemas Computacionales</h2>
          <p className="text-gray-600">Gestión de formatos y recursos</p>
        </Link>

        {/* Botón TI */}
        <Link href="/ti" className="p-10 bg-white rounded-xl shadow-lg hover:shadow-xl transition border-l-4 border-orange-500">
          <h2 className="text-2xl font-semibold mb-2">Tecnologías de la Información</h2>
          <p className="text-gray-600">Gestión de formatos y recursos</p>
        </Link>
      </div>
    </main>
  )
}