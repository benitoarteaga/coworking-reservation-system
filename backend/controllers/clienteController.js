const db = require('../database/db');
const bcrypt = require('bcrypt');

const registrarCliente = async (req, res) => {
  const {
    nombre,
    apellido,
    ci,
    direccion,
    telefono,
    telefono2,
    username,
    email,
    password
  } = req.body;

  if (!nombre || !apellido || !ci || !telefono || !username || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // 1. Crear persona
    const personaResult = await db.query(
      `INSERT INTO persona (nombre, apellido, ci, direccion, telefono, telefono2)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [nombre, apellido, ci, direccion, telefono, telefono2]
    );

    const personaId = personaResult.rows[0].id;

    // 2. Buscar id del rol cliente
    const rolResult = await db.query(`SELECT id FROM roles WHERE name = 'cliente'`);
    if (rolResult.rows.length === 0) {
      return res.status(400).json({ message: 'Rol cliente no existe en la base de datos' });
    }
    const rolId = rolResult.rows[0].id;

    // 3. Crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users (username, email, password, role_id, persona_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [username, email, hashedPassword, rolId, personaId]
    );

    res.status(201).json({ message: 'Cliente registrado correctamente', personaId });
  } catch (error) {
    console.error('Error al registrar cliente:', error.message);
    res.status(500).json({ message: 'Error al registrar cliente' });
  }
};

module.exports = {
  registrarCliente
};
