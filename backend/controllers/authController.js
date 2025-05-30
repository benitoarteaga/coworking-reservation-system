const db = require('../database/db');
const bcrypt = require('bcryptjs');

// REGISTRO
exports.register = async (req, res) => {
  const { username, email, password, role, persona_id } = req.body;

  if (!persona_id) {
    return res.status(400).json({ message: 'Debe seleccionar una persona' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, email, password, role_id, persona_id)
       VALUES ($1, $2, $3, (SELECT id FROM roles WHERE name = $4), $5)`,
      [username, email, hashedPassword, role, persona_id]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el registro.' });
  }
};


// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await db.query(
      `SELECT u.id, u.username, u.password, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.username = $1`,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

    req.session.user = { id: user.id, username: user.username, role: user.role };

    res.json({ message: 'Inicio de sesión exitoso', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el login' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Sesión cerrada con éxito' });
  });
};

// GET SESSION INFO
exports.getSession = (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};
