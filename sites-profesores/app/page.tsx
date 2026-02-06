'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verifica si el usuario ya está autenticado (tiene sesión válida)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          // Si /api/auth/me devuelve 200, hay sesión válida → ir a /home
          router.push('/home');
        }
      } catch (err) {
        console.error('Session check failed', err);
      }
    };

    checkSession();
  }, [router]);

  // Maneja el login exitoso con Google
  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError('No se recibió el token de Google.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Envía el credential (id_token) de Google al backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'No autorizado.');
        return;
      }

      // Backend seteó la cookie → redirige a /home
      router.push('/home');
    } catch (err) {
      console.error('Error al autenticar', err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Error al iniciar sesión con Google');
    console.error('Error al iniciar sesión con Google');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden selection:bg-blue-500/30">

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse duration-[8s] delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-white rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-500">
              <Image
                src="/UPQ-Logo.png"
                alt="Logo UPQ"
                width={140}
                height={140}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Docente</span>
            </h1>
            <p className="text-gray-400 font-medium text-center uppercase tracking-[0.2em] text-[10px]">
              Universidad Politécnica de Querétaro
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <h2 className="text-xl font-bold text-white mb-8 text-center tracking-tight">
              Bienvenido de nuevo
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-500">
                <p className="text-red-400 text-xs font-bold text-center uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex justify-center transform hover:scale-[1.02] transition-transform duration-300">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  size="large"
                  text="signin_with"
                  logo_alignment="left"
                  width="100%"
                />
              </div>

              {loading && (
                <div className="flex items-center gap-3 text-blue-400 animate-pulse font-bold text-xs uppercase tracking-widest">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Validando credenciales...
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                Acceso Exclusivo Personal
              </p>
              <p className="text-gray-600 text-[9px] leading-relaxed px-4">
                Este sistema es de uso restringido. Al ingresar, usted acepta los términos de uso y políticas de privacidad de la institución.
              </p>
            </div>
          </div>

          <p className="mt-12 text-center text-gray-500 text-[11px] font-medium tracking-wide">
            © {new Date().getFullYear()} Universidad Politécnica de Querétaro. <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
