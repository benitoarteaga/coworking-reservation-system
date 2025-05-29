// routes/users.js
const express = require('express');
const router = express.Router();
const { getUsuariosConPersona } = require('../controllers/usersController');

router.get('/personas', getUsuariosConPersona);

module.exports = router;
