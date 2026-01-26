import { NextResponse } from 'next/server';

// POST /api/auth/logout
// Borra la cookie de sesión para desloguear al usuario
export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada' });
  
  // Borra la cookie de sesión (maxAge=0)
  response.cookies.set('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  
  return response;
}
