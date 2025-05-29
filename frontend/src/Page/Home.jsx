import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Card from '../Components/Card';
import RegistrarCita from './RegistrarCita';
import Citas from './Citas';
import TiposCita from './TipoCita';

function Home({ user, onLogout }) {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/tipos-cita', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTiposCita(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar tipos de cita:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: 'var(--color-off-white)', minHeight: '100vh' }}
    >
      <div
        className="bg-white p-4 rounded shadow-sm mb-4"
        style={{ borderLeft: '6px solid var(--color-primary)' }}
      >
        <div className="d-flex justify-content-between align-itaems-center flex-wrap">
          <h2 style={{ color: 'var(--color-dark-blue)' }}>
            Bienvenido, {user.username}
          </h2>
          <button
            className="btn mt-2 mt-sm-0"
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
      <div className="d-flex gap-3 mb-4 flex-wrap">
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
            backgroundColor: 'var(--color-dark-blue)',
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
            backgroundColor: 'var(--color-dark-blue)',
            color: 'white',
            fontWeight: '500',
          }}
        >
          Mis Citas
        </Link>

        {/* Botón para crear tipo cita */}
        <Link
          to="/crear-tipo-cita"
          className="btn"
          style={{
            backgroundColor: 'var(--color-dark-blue)',
            color: 'white',
            fontWeight: '500',
          }}
        >
          Crear Tipo Cita
        </Link>
      </div>

      {/* Contenedor para renderizar las rutas internas */}
      <div
        className="bg-white p-4 rounded shadow"
        style={{ borderTop: '4px solid var(--color-gray-soft)' }}
      >
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <p>Cargando tipos de cita...</p>
              ) : tiposCita.length === 0 ? (
                <p>No hay tipos de cita disponibles.</p>
              ) : (
                <div className="row justify-content-center">
                  {tiposCita.map(tc => (
                    <div
                      key={tc.id}
                      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
                    >
                      <Card
                        title={tc.nombre}
                        description={tc.descripcion || 'Sin descripción'}
                        linkTo="/registrar-cita"
                        buttonText="Agendar"
                        imageUrl={tc.imagen_url || 'https://via.placeholder.com/320x180?text=Sin+Imagen'}
                      />
                    </div>
                  ))}
                </div>
              )
            }
          />
          <Route path="/registrar-cita" element={<RegistrarCita user={user} />} />
          <Route path="/citas" element={<Citas user={user} />} />

          {/* Ruta para el formulario de crear tipo cita */}
          <Route path="/crear-tipo-cita" element={<TiposCita />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
