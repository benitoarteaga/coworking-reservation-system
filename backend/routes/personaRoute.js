const express = require('express');
const router = express.Router();
const { getPersonasDisponibles } = require('../controllers/personaController');

router.get('/disponibles', getPersonasDisponibles);

module.exports = router;
