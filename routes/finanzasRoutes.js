const express = require('express');
const router = express.Router();
const finanzasController = require('../controllers/finanzasController');
const { isAuthenticated } = require('../controllers/authController');

router.get("/", isAuthenticated, finanzasController.resumen);

module.exports = router;