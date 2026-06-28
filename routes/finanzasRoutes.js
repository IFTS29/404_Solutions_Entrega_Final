const express = require("express");
const router = express.Router();
const finanzasController = require("../controllers/finanzasController");

// Dashboard principal
router.get("/", finanzasController.resumen);

// Cuentas por cobrar
router.get("/cuentas-cobrar", finanzasController.cuentasPorCobrar);

// Cuentas por pagar
router.get("/cuentas-pagar", finanzasController.cuentasPorPagar);

module.exports = router;
