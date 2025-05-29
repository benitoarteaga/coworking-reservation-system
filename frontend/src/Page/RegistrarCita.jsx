import React, { useState, useEffect } from 'react';

function RegistrarCita({ user }) {
  const [form, setForm] = useState({ fecha: '', hora: '', motivo: '', tipo_cita_id: '' });
  const [mensaje, setMensaje] = useState('');
  const [tiposCita, setTiposCita] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/tipos-cita');
        const data = await res.json();
        setTiposCita(data);
      } catch (err) {
        console.error('Error al cargar tipos de cita:', err);
      }
    };
    cargarTipos();
  }, []);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (form.fecha && form.tipo_cita_id) {
        try {
          const res = await fetch(
            `http://localhost:4000/api/citas/horarios-ocupados?fecha=${form.fecha}&tipo_cita_id=${form.tipo_cita_id}`,
            { credentials: 'include' }
          );
          const ocupadas = await res.json();
          setHorasOcupadas(ocupadas);

          const horarios = [];
          for (let h = 8; h <= 17; h++) {
            horarios.push(`${h.toString().padStart(2, '0')}:00`);
            horarios.push(`${h.toString().padStart(2, '0')}:30`);
          }
          horarios.push('18:00');

          const hoy = new Date().toISOString().split('T')[0];
          const ahora = new Date();
          let horariosFiltrados = horarios;

          if (form.fecha === hoy) {
            const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${(Math.floor(ahora.getMinutes() / 30) * 30).toString().padStart(2, '0')}`;
            horariosFiltrados = horarios.filter(h => h > horaActual);
          }

          // Filtra para quitar horarios ocupados
          const disponibles = horariosFiltrados.filter(h => !ocupadas.includes(h));
          setHorariosDisponibles(disponibles);
        } catch (err) {
          console.error('Error al cargar horarios disponibles:', err);
        }
      } else {
        setHorariosDisponibles([]);
        setHorasOcupadas([]);
      }
    };

    cargarHorarios();
  }, [form.fecha, form.tipo_cita_id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');

    if (horasOcupadas.includes(form.hora)) {
      setMensaje('❌ La hora seleccionada ya está ocupada.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMensaje('✅ Cita registrada correctamente.');
      setForm({ fecha: '', hora: '', motivo: '', tipo_cita_id: '' });
      setHorariosDisponibles([]);
      setHorasOcupadas([]);
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h3>Registrar cita para {user.username}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tipo de cita:</label>
          <select name="tipo_cita_id" className="form-control" value={form.tipo_cita_id} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {tiposCita.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Hora:</label>
          <select
            name="hora"
            className="form-control"
            value={form.hora}
            onChange={handleChange}
            required
            disabled={horariosDisponibles.length == 0}
          >
            <option value="">-- Seleccionar hora --</option>
            {horariosDisponibles.map(hora => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>
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
