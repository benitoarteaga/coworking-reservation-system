const db = require('../database/db'); // o const pool = ... si exportas pool

const getUsuariosConPersona = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        r.name AS role,
        p.nombre,
        p.apellido
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN persona p ON u.persona_id = p.id
    `);

    const usuarios = result.rows.map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      persona: row.nombre ? {
        nombre: row.nombre,
        apellido: row.apellido
      } : null
    }));

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios con persona:', error.message);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

module.exports = { getUsuariosConPersona };
