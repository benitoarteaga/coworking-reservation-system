// routes/users.js
const express = require('express');
const router = express.Router();
const { getUsuariosConPersona, actualizarPassword, registrarCliente } = require('../controllers/usersController');

router.get('/personas', getUsuariosConPersona);
router.post('/:id/password', actualizarPassword);
router.post('/registrar-cliente', registrarCliente);

module.exports = router;