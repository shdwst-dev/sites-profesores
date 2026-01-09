import Link from "next/link";
import { Monitor, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Encabezado */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white">Bienvenido, Profesor</h1>
        <p className="text-slate-400 mt-2 text-white">Seleccione el departamento para gestionar sus entregables.</p>
      </header>

      {/* Tarjetas de Selección */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tarjeta Sistemas */}
        <Link href="/sistemas" className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl"></div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Monitor size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Sistemas Computacionales</h2>
            <p className="text-slate-500 text-sm">Ingeniería en Software, Desarrollo Web y Aplicaciones.</p>
            <span className="text-blue-600 font-medium text-sm mt-4 group-hover:translate-x-1 transition-transform inline-block">
              Ver Entregables &rarr;
            </span>
          </div>
        </Link>

        {/* Tarjeta TI */}
        <Link href="/ti" className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-orange-500 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl"></div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Network size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Tecnologías de la Inf.</h2>
            <p className="text-slate-500 text-sm">Redes, Telecomunicaciones e Infraestructura.</p>
            <span className="text-orange-600 font-medium text-sm mt-4 group-hover:translate-x-1 transition-transform inline-block">
              Ver Entregables &rarr;
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}