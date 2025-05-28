const db = require('../database/db');

exports.getCitasByUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const result = await db.query(`
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

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas' });
  }
};
