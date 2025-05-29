import React, { useEffect, useState } from 'react';

function Citas({ user }) {
  const [citas, setCitas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/citas', {
          credentials: 'include',
        });
        const data = await response.json();
        setCitas(data);
      } catch (error) {
        console.error('Error al obtener citas:', error);
      }
    };

    obtenerCitas();
  }, []);

  const citasFiltradas = citas.filter(cita =>
    cita.fecha.includes(filtroFecha)
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">
        {user.role === 'admin' ? 'Todas las Citas' : `Citas de ${user.username}`}
      </h3>

      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
          placeholder="Filtrar por fecha"
        />
      </div>

      {citasFiltradas.length === 0 ? (
        <p>No se encontraron citas para la fecha indicada.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                {user.role === 'admin' && <th>Usuario</th>}
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Tipo de Cita</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita, index) => (
                <tr key={cita.cita_id}>
                  <td>{index + 1}</td>
                  {user.role === 'admin' && <td>{cita.usuario}</td>}
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.tipo_cita}</td>
                  <td>{cita.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Citas;
