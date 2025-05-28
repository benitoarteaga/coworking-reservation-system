const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/session', authController.getSession);

// Rutas protegidas de ejemplo:
router.get('/admin', isAuthenticated, hasRole('admin'), (req, res) => {
  res.json({ message: 'Bienvenido Admin' });
});

router.get('/cliente', isAuthenticated, hasRole('cliente'), (req, res) => {
  res.json({ message: 'Bienvenido Cliente' });
});

module.exports = router;
