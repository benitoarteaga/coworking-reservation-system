import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Page/Login';
import Home from './Page/Home';
import RegistroCliente from './Page/RegistrarCliente';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/session', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => setUser(null));
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Routes>
      {/* Ruta pública: Registro Cliente */}
      <Route path="/registro-cliente" element={<RegistroCliente />} />

      {/* Ruta pública: Login */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />
        }
      />

      {/* Ruta protegida: solo si hay usuario logueado */}
      <Route
        path="/*"
        element={
          user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
