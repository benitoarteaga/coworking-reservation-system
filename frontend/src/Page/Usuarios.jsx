import React, { useEffect, useState } from 'react';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [personasDisponibles, setPersonasDisponibles] = useState([]);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'cliente',
    persona_id: '',  // <-- nuevo campo para persona asignada
  });

  // Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/users/personas', {
        credentials: 'include',
      });
      const data = await res.json();
      setUsuarios(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar usuarios');
      setLoading(false);
    }
  };

  // Cargar personas disponibles
  const fetchPersonasDisponibles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/personas/disponibles', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo cargar personas disponibles');
      const data = await res.json();
      setPersonasDisponibles(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar usuarios y personas disponibles al cargar componente o abrir modal
  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      fetchPersonasDisponibles();
    }
  }, [modalVisible]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNuevo = async (e) => {
    e.preventDefault();

    if (!form.persona_id) {
      alert('Debe seleccionar una persona para asignar al usuario');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al registrar');

      await fetchUsuarios();
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'cliente',
        persona_id: '',
      });
      setModalVisible(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${id}/password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) throw new Error('Error al actualizar contraseña');

      setEditUserId(null);
      setNewPassword('');
      alert('Contraseña actualizada');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.persona?.nombre || '-'}</td>
                  <td>{u.persona?.apellido || '-'}</td>
                  <td>
                    {editUserId === u.id ? (
                      <div className="d-flex">
                        <input
                          type="password"
                          className="form-control me-2"
                          placeholder="Nueva contraseña"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handlePasswordUpdate(u.id)}
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setEditUserId(u.id)}
                      >
                        Cambiar contraseña
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <hr />
      <button className="btn btn-success mb-3" onClick={() => setModalVisible(true)}>
        Nuevo Usuario
      </button>

      {/* Modal */}
      {modalVisible && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalVisible(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()} // evita que el click dentro del modal cierre el modal
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Nuevo Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <form onSubmit={handleNuevo}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      className="form-control"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="admin">admin</option>
                      <option value="cliente">cliente</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Asignar Persona</label>
                    <select
                      className="form-select"
                      name="persona_id"
                      value={form.persona_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una persona</option>
                      {personasDisponibles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} {p.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
