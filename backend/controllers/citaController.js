const db = require('../database/db');

exports.getCitasPorRol = async (req, res) => {
  const { id: userId, role } = req.session.user;

  try {
    let result;

    if (role === 'admin') {
      // Admin: Ver todas las citas
      result = await db.query(`
        SELECT 
          c.id AS cita_id,
          u.username AS usuario,
          tc.nombre AS tipo_cita,
          c.fecha,
          c.hora,
          c.motivo,
          CASE 
            WHEN c.estado = 1 THEN 'Pendiente'
            ELSE 'Realizada'
          END AS estado
        FROM citas c
        JOIN users u ON c.usuario_id = u.id
        JOIN tipos_cita tc ON c.tipo_cita_id = tc.id
        ORDER BY c.fecha, c.hora;
      `);
    } else {
      // Cliente: Solo sus citas
      result = await db.query(`
        SELECT 
          c.id AS cita_id,
          u.username AS usuario,
          tc.nombre AS tipo_cita,
          c.fecha,
          c.hora,
          c.motivo,
          CASE 
            WHEN c.estado = 1 THEN 'Pendiente'
            ELSE 'Realizada'
          END AS estado
        FROM citas c
        JOIN users u ON c.usuario_id = u.id
        JOIN tipos_cita tc ON c.tipo_cita_id = tc.id
        WHERE c.usuario_id = $1
        ORDER BY c.fecha, c.hora;
      `, [userId]);
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};


exports.registrarCita = async (req, res) => {
  const { fecha, hora, motivo, tipo_cita_id, user_id } = req.body; // <-- recibimos user_id opcional
  const { id: sessionUserId, role } = req.session.user;

  if (!sessionUserId) return res.status(401).json({ message: 'No autorizado' });

  // Si es admin, se usa el user_id enviado por el formulario
  // Si no lo es, se fuerza a usar el ID del usuario logueado
  const usuarioIdFinal = (role === 'admin' && user_id) ? user_id : sessionUserId;

  try {
    if (hora < '08:00' || hora > '18:00') {
      return res.status(400).json({ code: 'HORA_INVALIDA', message: 'La hora debe estar entre 08:00 y 18:00.' });
    }

    const citaExistente = await db.query(
      `SELECT 1 FROM citas 
       WHERE fecha = $1 AND hora = $2 AND tipo_cita_id = $3 AND estado = 1`,
      [fecha, hora, tipo_cita_id]
    );

    if (citaExistente.rowCount > 0) {
      return res.status(409).json({
        code: 'CITA_DUPLICADA',
        message: 'Ya existe una cita registrada en esa fecha, hora y tipo.'
      });
    }

    await db.query(
      `INSERT INTO citas (usuario_id, tipo_cita_id, fecha, hora, motivo, estado) 
       VALUES ($1, $2, $3, $4, $5, 1)`,
      [usuarioIdFinal, tipo_cita_id, fecha, hora, motivo]
    );

    res.status(201).json({ message: 'Cita registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar cita:', error);
    res.status(500).json({ code: 'ERROR_INTERNO', message: 'Error al registrar la cita.' });
  }
};



exports.obtenerHorariosOcupados = async (req, res) => {
  const { fecha, tipo_cita_id } = req.query;

  if (!fecha || !tipo_cita_id) {
    return res.status(400).json({ message: 'Fecha y tipo de cita son requeridos.' });
  }

  try {
    const result = await db.query(
      `SELECT hora FROM citas 
       WHERE fecha = $1 AND tipo_cita_id = $2 AND estado = 1`,
      [fecha, tipo_cita_id]
    );

    const horasOcupadas = result.rows.map(r => r.hora);
    res.json(horasOcupadas);
  } catch (error) {
    console.error('Error al obtener horarios ocupados:', error);
    res.status(500).json({ message: 'Error al obtener horarios ocupados.' });
  }
};

exports.cancelarCita = async (req, res) => {
  const { id } = req.params;

  try {
    // Cambiar el estado a 0 (Realizada o cancelada)
    const result = await db.query(
      `UPDATE citas SET estado = 0 WHERE id = $1 AND estado = 1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cita no encontrada o ya fue realizada/cancelada.' });
    }

    res.json({ message: 'Cita cancelada correctamente.' });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ message: 'Error al cancelar cita.' });
  }
};



