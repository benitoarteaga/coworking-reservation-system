import React, { useEffect, useState } from 'react';

function Citas({ user }) {
  const [citas, setCitas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');

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

  const citasFiltradas = citas.filter(cita => {
    const coincideFecha = filtroFecha ? cita.fecha.includes(filtroFecha) : true;
    const coincideBusqueda = busqueda
      ? (
          cita.usuario?.toLowerCase().includes(busqueda) ||
          cita.tipo_cita?.toLowerCase().includes(busqueda) ||
          cita.motivo?.toLowerCase().includes(busqueda)
        )
      : true;

    return coincideFecha && coincideBusqueda;
  });


  const cancelarCita = async (id) => {
    if (!window.confirm("¿Estás seguro de marcar la cita como realizada?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/citas/cancelar/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setCitas(citas.map(cita =>
          cita.cita_id === id ? { ...cita, estado: 'Realizada' } : cita
        ));
      } else {
        alert(data.message || 'Error al cancelar cita');
      }
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      alert('Error al cancelar cita');
    }
  };

  
  return (
    <div className="container mt-4">
      <h3 className="mb-3">
        {user.role === 'admin' ? 'TODAS LAS CITAS' : `Citas de ${user.username}`}
      </h3>

    <div className="row mb-3 mt-4">
      <div className="col-md-4">
        <label className="form-label">Filtrar por Fecha</label>
        <input
          type="date"
          className="form-control"
          value={filtroFecha}
          onChange={e => setFiltroFecha(e.target.value)}
        />
      </div>
      <div className="col-md-8">
        <label className="form-label">Buscar por Nombre o Tipo de Cita</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej: Juan o Odontología"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value.toLowerCase())}
        />
      </div>
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
                {user.role === 'admin' && <th>Acciones</th>}
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
                  {user.role === 'admin' && (
                    <td className='text-center'>
                      {cita.estado === 'Pendiente' ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => cancelarCita(cita.cita_id)}
                        >
                          <i class="bi bi-check"></i>
                        </button>
                      ) : (
                        <button className="btn btn-primary btn-sm" disabled>
                          <i class="bi bi-check-all"></i>
                        </button>
                      )}
                    </td>
                  )}
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
