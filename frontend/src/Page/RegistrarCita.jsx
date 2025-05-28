import React, { useState } from 'react';

function RegistrarCita({ user }) {
  const [form, setForm] = useState({ fecha: '', hora: '', motivo: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí enviarías el form a tu API para guardar la cita
    setMensaje(`Cita registrada para ${form.fecha} a las ${form.hora}`);
  };

  return (
    <div>
      <h3>Registrar cita para {user.username}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Fecha:</label>
          <input type="date" name="fecha" className="form-control" value={form.fecha} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Hora:</label>
          <input type="time" name="hora" className="form-control" value={form.hora} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Motivo:</label>
          <textarea name="motivo" className="form-control" value={form.motivo} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Guardar Cita</button>
      </form>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </div>
  );
}

export default RegistrarCita;
