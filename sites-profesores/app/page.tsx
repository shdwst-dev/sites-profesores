'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      
      setError('Por favor ingresa un correo válido.');
      return;
    }

    console.log("Datos válidos, redirigiendo...");
    router.push('/home');
  };

  return (
    
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
        
        <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>
              <label>Correo Electrónico</label>
              <div style={styles.inputWrapper}>
                <Mail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label>Contraseña</label>
              <div style={styles.inputWrapper}>
                <Lock style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="******"
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
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
    background: 'linear-gradient(180deg, #0a3871 0%, #e03c5a 100%)',
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
    color: '#333' 
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  inputGroup: { marginBottom: '1rem' },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.5rem',
    },
    inputWithIcon: {
      width: '100%',
      padding: '0.5rem 0.5rem 0.5rem 2.2rem', // padding-left para el icono
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
      fontSize: '1rem',
    },
    inputIcon: {
      position: 'absolute' as const,
      left: '0.7rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#888',
      width: '1.2rem',
      height: '1.2rem',
      pointerEvents: 'none' as const,
    },
  button: {
    width: '100%', 
    padding: '0.75rem', 
    backgroundColor: '#003B71', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    fontSize: '1rem'
  },
  error: { 
    color: 'red', 
    fontSize: '0.875rem', 
    marginBottom: '1rem', 
    textAlign: 'center' as const 
  }
};