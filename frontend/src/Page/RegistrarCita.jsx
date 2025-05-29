import React, { useState, useEffect } from 'react';

function RegistrarCita({ user }) {
  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    motivo: '',
    tipo_cita_id: '',
    user_id: user.id, // por defecto, el usuario actual
  });
  const [usuarios, setUsuarios] = useState([]);
  const [tiposCita, setTiposCita] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // 🔽 Cargar usuarios si es admin
  useEffect(() => {
    if (user.role === 'admin') {
      fetch('http://localhost:4000/api/users/personas', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(err => console.error('Error al cargar usuarios:', err));
    }
  }, [user]);

  // 🔽 Cargar tipos de cita
  useEffect(() => {
    fetch('http://localhost:4000/api/tipos-cita', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTiposCita(data);
        } else {
          console.error('Respuesta no es array:', data);
          setTiposCita([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar tipos de cita:', err);
        setTiposCita([]);
      });
  }, []);

  // 🔽 Cargar horarios disponibles
  useEffect(() => {
    const cargarHorarios = async () => {
      if (form.fecha && form.tipo_cita_id) {
        try {
          const res = await fetch(
            `http://localhost:4000/api/citas/horarios-ocupados?fecha=${form.fecha}&tipo_cita_id=${form.tipo_cita_id}`,
            { credentials: 'include' }
          );
          const ocupadasRaw = await res.json();
          const ocupadas = ocupadasRaw.map(h => h.slice(0, 5));
          setHorasOcupadas(ocupadas);

          const horarios = [];
          for (let h = 8; h <= 17; h++) {
            horarios.push(`${h.toString().padStart(2, '0')}:00`);
            horarios.push(`${h.toString().padStart(2, '0')}:30`);
          }
          horarios.push('18:00');

          const hoy = new Date().toISOString().split('T')[0];
          const ahora = new Date();
          let filtrados = horarios;

          if (form.fecha === hoy) {
            const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${(Math.floor(ahora.getMinutes() / 30) * 30).toString().padStart(2, '0')}`;
            filtrados = horarios.filter(h => h > horaActual);
          }

          const disponibles = filtrados.filter(h => !ocupadas.includes(h));
          setHorariosDisponibles(disponibles);
        } catch (err) {
          console.error('Error al cargar horarios:', err);
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
      setForm({
        fecha: '',
        hora: '',
        motivo: '',
        tipo_cita_id: '',
        user_id: user.id,
      });
      setHorariosDisponibles([]);
      setHorasOcupadas([]);
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h3>Registrar cita {user.role === 'admin' && 'para un paciente'}</h3>

      <form onSubmit={handleSubmit}>
        {user.role === 'admin' && (
          <div className="mb-3">
            <label>Seleccionar Paciente:</label>
            <select
              name="user_id"
              className="form-control"
              value={form.user_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccionar paciente --</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.persona?.nombre} {u.persona?.apellido} - {u.role}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label>Tipo de cita:</label>
          <select name="tipo_cita_id" className="form-control" value={form.tipo_cita_id} onChange={handleChange} required>
            <option value="">-- Seleccionar --</option>
            {tiposCita.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.nombre}</option>
            ))}
          </select>
        </div>

        <input
          type="date"
          name="fecha"
          className="form-control"
          value={form.fecha}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        {form.fecha && form.tipo_cita_id && (
          <div className="mt-3">
            <strong>Horas disponibles:</strong>
            <div style={{ color: "green" }}>
              {horariosDisponibles.length > 0 ? horariosDisponibles.join(", ") : "No hay horas disponibles"}
            </div>

            <strong className="mt-2">Horas ocupadas:</strong>
            <div style={{ color: "red" }}>
              {horasOcupadas.length > 0 ? horasOcupadas.join(", ") : "No hay horas ocupadas"}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label>Hora:</label>
          <select
            name="hora"
            className="form-control"
            value={form.hora}
            onChange={handleChange}
            required
            disabled={horariosDisponibles.length === 0 && horasOcupadas.length === 0}
          >
            <option value="">-- Seleccionar hora --</option>
            {[...Array(21)].map((_, i) => {
              const hour = 8 + Math.floor(i / 2);
              const min = i % 2 === 0 ? '00' : '30';
              const hora = `${hour.toString().padStart(2, '0')}:${min}`;
              return (
                <option key={hora} value={hora} disabled={horasOcupadas.includes(hora)}>
                  {hora}{horasOcupadas.includes(hora) ? ' (Ocupado)' : ''}
                </option>
              );
            })}
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
