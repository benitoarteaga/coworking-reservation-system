import React, { useState } from 'react';
import '../RegistroCliente.css'; // Archivo CSS externo para estilos propios

function RegistroCliente() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    direccion: '',
    telefono: '',
    telefono2: '',
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const camposRequeridos = ['nombre', 'apellido', 'ci', 'telefono', 'username', 'email', 'password'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // Verificar manualmente los campos requeridos
    const camposVacios = camposRequeridos.filter((campo) => form[campo].trim() === '');
    if (camposVacios.length > 0) {
      setMensaje('Por favor, complete todos los campos obligatorios.');
      return;
    }

    setLoading(true);

    try {
      const resPersona = await fetch('http://localhost:4000/api/users/registrar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          ci: form.ci,
          direccion: form.direccion,
          telefono: form.telefono,
          telefono2: form.telefono2,
        }),
      });

      if (!resPersona.ok) throw new Error('Error al crear persona');

      const personaData = await resPersona.json();

      const resUsuario = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role: 'cliente',
          personaId: personaData.id,
        }),
      });

      if (!resUsuario.ok) throw new Error('Error al crear usuario');

      setMensaje('Registro exitoso');
      setForm({
        nombre: '',
        apellido: '',
        ci: '',
        direccion: '',
        telefono: '',
        telefono2: '',
        username: '',
        email: '',
        password: '',
      });
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-form card shadow-lg p-4">
        <h2 className="mb-4 text-center text-primary">Registro de Cliente</h2>

        {mensaje && (
          <div className={`alert ${mensaje.includes('exitoso') ? 'alert-success' : 'alert-danger'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h5 className="text-secondary mb-3">Datos Personales</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Nombre</label>
              <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Apellido</label>
              <input name="apellido" className="form-control" value={form.apellido} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>CI</label>
              <input name="ci" className="form-control" value={form.ci} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Dirección</label>
              <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Teléfono</label>
              <input name="telefono" className="form-control" value={form.telefono} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Teléfono 2</label>
              <input name="telefono2" className="form-control" value={form.telefono2} onChange={handleChange} />
            </div>
          </div>

          <h5 className="text-secondary mb-3 mt-4">Datos de Usuario</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Usuario</label>
              <input name="username" className="form-control" value={form.username} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Contraseña</label>
              <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-primary w-50" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistroCliente;
