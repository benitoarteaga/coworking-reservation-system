const db = require('../database/db');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

exports.getTiposCita = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipos_cita ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tipos de cita' });
  }
};

exports.createTipoCita = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const query = `
      INSERT INTO tipos_cita (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [nombre, descripcion];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear tipo de cita' });
  }
};
