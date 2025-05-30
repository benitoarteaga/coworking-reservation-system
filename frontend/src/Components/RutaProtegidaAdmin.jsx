import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegidaAdmin({ children }) {
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const verificarRol = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/session', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn && data.user?.role === 'admin') {
            setEsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error al verificar rol:', err);
      } finally {
        setCargando(false);
      }
    };

    verificarRol();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (!esAdmin) return <Navigate to="/" replace />; // Redirige si no es admin

  return children;
}

export default RutaProtegidaAdmin;
