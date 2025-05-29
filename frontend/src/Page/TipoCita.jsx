import React, { useEffect, useState } from 'react';

// Formulario para crear nuevo tipo de cita (sin imagen)
function FormularioTipoCita({ onCreated, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    const payload = {
      nombre,
      descripcion,
    };

    try {
      const response = await fetch('http://localhost:4000/api/tipos-cita', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear tipo de cita');
      }

      const data = await response.json();
      setMensaje(`Tipo de cita creado con ID: ${data.id}`);
      setNombre('');
      setDescripcion('');

      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <textarea
          id="descripcion"
          className="form-control"
          rows="3"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary">Crear</button>
    </form>
  );
}

// Componente principal que muestra tabla y modal con formulario
function TiposCita() {
  const [tiposCita, setTiposCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTiposCita = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/tipos-cita', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Error al cargar los tipos de cita');
      }
      const data = await res.json();
      setTiposCita(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposCita();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreated = () => {
    fetchTiposCita();
    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-success mb-3" onClick={handleOpenModal}>
        Nuevo
      </button>

      {/* Modal */}
      {modalOpen && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          role="dialog" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Tipo de Cita</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <FormularioTipoCita onCreated={handleCreated} onClose={handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p>Cargando tipos de cita...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : tiposCita.length === 0 ? (
        <p>No hay tipos de cita registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {tiposCita.map(tipo => (
                <tr key={tipo.id}>
                  <td>{tipo.id}</td>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.descripcion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TiposCita;
