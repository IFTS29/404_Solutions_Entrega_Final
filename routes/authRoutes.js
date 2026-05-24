const express = require('express');
const router = express.Router();
const { authController, isGuest, isAuthenticated } = require('../controllers/authController');

// Rutas públicas
router.get('/login', isGuest, authController.loginForm);
router.post('/login', isGuest, authController.login);
router.get('/register', isGuest, authController.registerForm);
router.post('/register', isGuest, authController.register);

// Ruta protegida (requiere autenticación)
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;