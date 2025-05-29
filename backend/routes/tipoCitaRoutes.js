// routes/tiposCita.js
const express = require('express');
const router = express.Router();
const tiposCitaController = require('../controllers/TipoCitaController');
const { isAuthenticated } = require('../middleware/authMiddleware');


router.get('/', isAuthenticated, tiposCitaController.getTiposCita);
router.post('/', isAuthenticated, tiposCitaController.createTipoCita);

module.exports = router;