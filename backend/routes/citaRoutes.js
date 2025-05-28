const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Obtener citas del usuario autenticado
router.get('/', isAuthenticated, citaController.getCitasByUser);

module.exports = router;
