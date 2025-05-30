const db = require('../database/db');

const getPersonasDisponibles = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nombre, apellido
      FROM persona
      WHERE id NOT IN (SELECT persona_id FROM users WHERE persona_id IS NOT NULL)
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener personas disponibles:', error.message);
    res.status(500).json({ message: 'Error al obtener personas.' });
  }
};

module.exports = { getPersonasDisponibles };
