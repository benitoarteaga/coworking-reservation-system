const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipos_cita ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tipos de cita' });
  }
});

module.exports = router;
