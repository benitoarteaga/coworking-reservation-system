import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Card from '../Components/Card';
import RegistrarCita from './RegistrarCita';
import Citas from './Citas';

function Home({ user, onLogout }) {
  return (
    <div className="container py-5" style={{ backgroundColor: 'var(--color-off-white)', minHeight: '100vh' }}>
      <div className="bg-white p-4 rounded shadow-sm mb-4" style={{ borderLeft: '6px solid var(--color-primary)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 style={{ color: 'var(--color-dark-blue)' }}>Bienvenido, {user.username}</h2>
          <button
            className="btn"
            style={{
              backgroundColor: 'var(--color-error-red)',
              color: '#fff',
              fontWeight: 'bold',
            }}
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Barra de navegación con botones */}
      <div className="d-flex gap-3 mb-4">
        <Link
          to="/"
          className="btn"
          style={{
            backgroundColor: 'var(--color-dark-blue)',
            color: 'white',
            fontWeight: '500',
          }}
        >
          Inicio
        </Link>

        <Link
          to="/registrar-cita"
          className="btn"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            fontWeight: '500',
          }}
        >
          Registrar Cita
        </Link>

        <Link
          to="/citas"
          className="btn"
          style={{
            backgroundColor: 'var(--color-light-blue)',
            color: 'black',
            fontWeight: '500',
          }}
        >
          Mis Citas
        </Link>
      </div>

      {/* Contenedor para renderizar las rutas internas */}
      <div className="bg-white p-4 rounded shadow" style={{ borderTop: '4px solid var(--color-gray-soft)' }}>
        <Routes>
          <Route path="/" element={<Card />} />
          <Route path="/registrar-cita" element={<RegistrarCita user={user} />} />
          <Route path="/citas" element={<Citas user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
