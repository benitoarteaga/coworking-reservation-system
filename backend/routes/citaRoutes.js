const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Obtener citas dependiendo del rol
router.get('/', isAuthenticated, citaController.getCitasPorRol);
router.post('/', isAuthenticated, citaController.registrarCita);
router.get('/horarios-ocupados', isAuthenticated, citaController.obtenerHorariosOcupados);
router.put('/cancelar/:id', citaController.cancelarCita);

module.exports = router;
