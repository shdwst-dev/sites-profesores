'use client';

import { useRouter } from 'next/navigation';
import { AlignCenter, ArrowLeft, LogOut, ChevronUp, Menu, X } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function RecursosAvisos() {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Header con navegación */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/tiid')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Recursos y avisos</h1>
                                <p className="text-sm text-gray-600">Tecnologías de la Información e Innovación Digital</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/home')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all cursor-pointer"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Volver al inicio</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Botón para abrir menú */}
            <div className="max-w-[1200px] mx-auto pt-4 px-6 pb-0 w-full">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center bg-[#1e3a5f] text-white border-none rounded-lg py-3 px-5 text-base font-semibold cursor-pointer shadow-[0_2px_8px_rgba(30,58,95,0.2)] hover:bg-[#2a4a6f] transition-all duration-300"
                    title="Tabla de contenidos"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span className="ml-2">Contenidos</span>
                </button>
            </div>

            {/* Menú desplegable */}
            {menuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[100]"
                        onClick={() => setMenuOpen(false)}
                    />
                    <aside className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e3a5f] text-white p-6 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-[101] min-w-[300px] max-w-[90%] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold m-0 text-inherit">Tabla de Contenidos</h3>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center justify-center rounded transition-all hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <ul className="m-0 p-0 list-none">
                            <li>
                                <a href="#encargado" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Encargado
                                </a>
                            </li>
                            <li>
                                <a href="#coordinaciones" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Coordinaciones
                                </a>
                            </li>
                            <li>
                                <a href="#etc" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    ETC
                                </a>
                            </li>
                            <li>
                                <a href="#calendario" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Calendario
                                </a>
                            </li>
                            <li>
                                <a href="#altasbajas" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Altas y Bajas
                                </a>
                            </li>
                            <li>
                                <a href="#lengua" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Lengua Extranjera
                                </a>
                            </li>
                            <li>
                                <a href="#casilleros" onClick={() => setMenuOpen(false)} className="block text-white no-underline text-base font-medium py-3 px-4 transition-all rounded-md mb-1 hover:underline hover:bg-white/10">
                                    Casilleros
                                </a>
                            </li>
                        </ul>
                    </aside>
                </>
            )}

            {/* Contenido principal */}
            <main className="flex-1 max-w-[1200px] mx-auto p-6 w-full">
                <h1 className="text-2xl font-bold mb-4 text-white">Coordinación de Tutorías</h1>

                <div id="encargado" className="mb-4 py-[30px] px-[30px] border border-gray-200 rounded-lg bg-[#1e3a5f] text-white flex justify-between items-center">
                    <p className="text-lg font-semibold">
                        <strong>ISC Lilia Jimenez Cruz</strong>
                    </p>
                    <p className="text-lg font-semibold">
                        Contacto: <a href="mailto:lilia.jimenez@upq.edu.mx" className="text-inherit underline">lilia.jimenez@upq.edu.mx</a>
                    </p>
                </div>

                {/* Coordinación de Proyectos Integradores */}
                <div className="border border-gray-200 rounded-lg py-5 px-5 bg-[#431d2a] text-white transition-all duration-300 flex gap-5 items-center mt-6">
                    <div className="relative flex-1 h-[450px] rounded-md overflow-hidden">
                        <Image
                            src="/coordinacionPI.png"
                            alt="Logo Proyectos"
                            fill
                            unoptimized
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div className="flex flex-col justify-start text-center flex-1">
                        <p className="mt-4 text-2xl font-semibold text-white text-center">
                            <strong>Coordinación de Proyectos Integradores</strong>
                        </p>
                        <p className="mt-4 text-lg font-semibold text-inherit">
                            <strong>Dra Cecilia Alvarado Salayanda</strong>
                        </p>
                        <p className="mt-4 text-lg font-semibold text-inherit">
                            Contacto: <a href="mailto:cecilia.alvarado@upq.mx" className="text-inherit underline">cecilia.alvarado@upq.mx</a>
                        </p>
                    </div>
                </div>
                {/* Coordinación de Tutorías */}
                <div id="coordinaciones" className="mt-6 py-10 px-[30px] rounded-lg bg-[#e1dfdb] border border-[#d4d2cd] flex flex-row gap-10 items-center">
                    <div className="flex-none flex flex-col justify-center items-center text-center gap-4">
                        <h2 className="text-[32px] font-bold text-[#431d2a] m-0 mb-3 text-left">
                            <strong>TUTORES</strong>
                        </h2>
                        <h3 className="text-[28px] font-bold text-[#431d2a] m-0 text-left">
                            <strong>MAYO-AGOSTO 2025</strong>
                        </h3>
                    </div>
                    <div className="relative flex-1 h-[400px] rounded-lg overflow-hidden">
                        <Image
                            src="/tutores-tiid.jpg"
                            alt="Tabla de Tutores TIID"
                            fill
                            unoptimized
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
                {/*Recursamientos*/}
                <div id="recursamientos" className="mt-6 py-[40px] px-[30px] border border-[#152a45] rounded-xl bg-[#1e3a5f] text-white shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -m-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">
                        Proceso de Recursamientos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6">
                            <div className="bg-white/10 p-5 rounded-lg border-l-4 border-amber-400">
                                <h3 className="text-xl font-bold text-amber-400 mb-2">Periodo Crítico</h3>
                                <p className="text-lg">Las solicitudes se recibirán del <strong>12 al 16 de mayo de 2025</strong>.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-blue-200 uppercase tracking-wider text-sm">Lineamientos Generales</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Solo se permite recursar un máximo de 2 materias por cuatrimestre.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>El costo por materia es de <strong>$450.00 MXN</strong>.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Indispensable no tener adeudos administrativos.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/20 pb-2">Procedimiento paso a paso</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">1</div>
                                    <p className="text-sm">Descarga el formato <strong>"Solicitud de Recursamiento"</strong> en la sección de documentos.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">2</div>
                                    <p className="text-sm">Obtén la validación académica con tu tutor y firma del Director de Programa.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">3</div>
                                    <p className="text-sm">Realiza el pago en el portal de finanzas o cajas de la universidad.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">4</div>
                                    <p className="text-sm">Carga el formato firmado y tu comprobante de pago en el apartado de entregables.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Altas y bajas de materias*/}
                <div id="altasbajas" className="mt-6 py-[30px] px-[30px] border border-[#d4d2cd] rounded-lg bg-[#e1dfdb]">
                    <h2 className="mt-4 text-2xl font-semibold text-[#333] text-center">
                        <strong>Altas y Bajas de Materias</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg text-[#333]'>
                        <li>Revisar carga académica con su tutor.</li>
                        <li>Si tiene asignaturas reprobadas o sin cursar en el ciclo anterior, no podrá cambiar de ciclo de formación.</li>
                        <li>Si hay materias del ciclo que cursará que no le aparecen en el SII, el tutor deberá solicitarlas con el Formato de ALTAS Y BAJAS  a la Dirección de Programa.</li>
                        <li>No es posible dar de alta varias Estancias en el mismo cuatrimestre.</li>
                        <li>Revisar carga académica con sus estudiantes - semana 1</li>
                        <li>Asegurarse de que todos sus alumnos tengan su carga académica al 100% antes de cerrar el período de altas y bajas indicado en el calendario.</li>
                        <li>Pueden solicitar ETC's de INGLÉS</li>
                        <li>Este cuatrimestre se abrirán todos los intensivos de INGLÉS ( Motivemos a que los estudiantes salgan del rezago de inglés)</li>
                        <li>Formulario de Registro:   <a href="https://forms.gle/6mzeEmkYbU2MboKBA" className="underline text-[#431d2a]">https://forms.gle/6mzeEmkYbU2MboKBA</a> </li>
                        <li>Si alguien puede acreditar su inglés con TOEFL, Certificaciones o algún otro curso externo, acercarse a Lengua Extranjera para que validen el caso</li>
                    </ul>
                </div>

                {/* Criterios para solicitar un ETC */}
                <div id="etc" className="mt-6 py-[30px] px-[30px] border border-[#5d3338] rounded-lg bg-[#431d2a] text-white">
                    <h2 className="mt-4 text-2xl font-semibold text-white text-center">
                        <strong>Criterios para solicitar un ETC</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg'>
                        <li>Haber aprobado al menos dos parciales cuando cursó la asignatura por primera vez.</li>
                        <li>No haber solicitado un ETC anteriormente para la misma asignatura.</li>
                        <li>Tener un promedio mínimo de 7.0 en la asignatura.</li>
                    </ul>
                </div>
                {/* Calendario Escolar */}
                <div id="calendario" className="mt-6 py-[30px] px-[30px] border border-[#152a45] rounded-lg bg-[#1e3a5f] text-white">
                    <h2 className="mt-4 text-2xl font-semibold text-white text-center">
                        <strong>Calendario Escolar</strong>
                    </h2>
                    <div className="relative w-full h-[800px] rounded-md overflow-hidden mt-5 bg-white">
                        <Image
                            src="/calendario2025-2026.png"
                            alt="Calendario Escolar"
                            unoptimized
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
                {/*Avisos de lengua extranjera*/}
                <div id="lengua" className="mt-6 py-[30px] px-[30px] border border-[#d4d2cd] rounded-lg bg-[#e1dfdb] text-[#333]">
                    <h2 className="mt-4 text-2xl font-semibold text-[#333] text-center">
                        <strong>Avisos de Lengua Extranjera</strong>
                    </h2>
                    <ul className='list-disc list-inside mt-4 text-lg'>
                        <li>
                            Solicitar ETC's de Inglés en:
                            <a href="https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing" className="underline ml-1 text-inherit">
                                https://docs.google.com/spreadsheets/d/1UmV92-deFOLvl4mZ1KyE5tYnue3bbDLACB3cYxPIhCk/edit?usp=sharing
                            </a>
                        </li>
                        <li>
                            Intensivos de Inglés — FECHA LÍMITE PARA SOLICITAR:
                            <ul className='list-disc list-inside mt-2 ml-4'>
                                <li>Niveles 1-2-3 — Alumnos de 2do y 3er ciclo, generaciones anteriores — Lunes a viernes de 11:10am a 1:40pm.</li>
                                <li>Niveles 4-5-6 — Alumnos de 3er ciclo, generaciones anteriores — Lunes a viernes de 11:10am a 1:40pm.</li>
                                <li>Niveles 7-8-9 — Generaciones 18 y anteriores — Lunes a viernes de 6:10pm a 8:40pm.</li>
                            </ul>
                        </li>
                        <li>
                            Informes: juana.aguilera@upq.mx (Srita. Gabriela Aguilera)
                        </li>
                        <li>Inicio: 16 de septiembre.</li>
                    </ul>
                </div>
                {/* Solicitudes de casilleros para profesores */}
                <div id="casilleros" className="mt-6 mb-10 py-[30px] px-[30px] border border-[#5d3338] rounded-lg bg-[#431d2a] text-white">
                    <h2 className="mt-4 text-2xl font-semibold text-white text-center">
                        <strong>Solicitudes de Casilleros para Profesores</strong>
                    </h2>
                    <p className="mt-4 text-lg leading-[1.8] text-white">
                        Solicitar en el siguiente enlace:
                        <br />
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform " className="underline ml-1 text-white">
                            https://docs.google.com/forms/d/e/1FAIpQLSejOw3kEc2K9DtocoxcX3g83LEYWTugt8H3I02LyYtM4jjgIw/viewform
                        </a>
                    </p>
                </div>
            </main>

            {/* Botón Volver Arriba */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-[#1e3a5f] text-white border-none rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(30,58,95,0.3)] transition-all duration-300 z-50 transform hover:scale-110"
                    title="Volver al inicio"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            <Footer />
        </div>
    );
}