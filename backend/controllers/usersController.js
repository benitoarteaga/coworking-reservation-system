const db = require('../database/db'); // o const pool = ... si exportas pool
const bcrypt = require('bcrypt');

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

const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'La contraseña es obligatoria' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};

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

  // Validación de campos obligatorios
  // if (!nombre || !apellido || !ci || !telefono || !username || !email || !password) {
  //   return res.status(400).json({ message: 'Faltan campos requeridos' });
  // }

  try {
    // 1. Insertar en tabla persona
    const personaResult = await db.query(
      `INSERT INTO persona (nombre, apellido, ci, direccion, telefono, telefono2)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [nombre, apellido, ci, direccion, telefono, telefono2]
    );

    const personaId = personaResult.rows[0].id;

    // 2. Obtener el id del rol 'cliente'
    const rolResult = await db.query(`SELECT id FROM roles WHERE name = 'cliente'`);
    if (rolResult.rows.length === 0) {
      return res.status(400).json({ message: 'Rol cliente no existe en la base de datos' });
    }
    const rolId = rolResult.rows[0].id;

    // 3. Insertar usuario
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

module.exports = { getUsuariosConPersona, actualizarPassword, registrarCliente };
