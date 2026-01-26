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
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <Image 
            src="/UPQ-Logo.png" 
            alt="Logo" 
            width={150} 
            height={40}
            priority
          />
        </div>
        <div style={styles.card}>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          
          {error && <p style={styles.error}>{error}</p>}
          
          <div style={styles.googleButtonContainer}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="outline"
              size="large"
              width="280"
            />
            {loading && <p style={styles.loading}>Validando...</p>}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
//estilos
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(180deg, #1e3a5f 0%, #431d2a 100%)',
    padding: '0',
  },
  card: {
    padding: '2rem', 
    width: '300px', 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: { 
    textAlign: 'center' as const, 
    marginBottom: '1.5rem', 
    color: '#333',
    fontSize: '24px',
    fontWeight: 700,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  googleButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  error: { 
    color: '#c41e3a', 
    fontSize: '0.875rem', 
    marginBottom: '1rem', 
    textAlign: 'center' as const,
    padding: '0.75rem',
    backgroundColor: '#ffe5e5',
    borderRadius: '4px',
    border: '1px solid #ffcccc'
  },
  loading: {
    marginTop: '0.75rem',
    color: '#1e3a5f',
    fontSize: '0.9rem',
  },
};