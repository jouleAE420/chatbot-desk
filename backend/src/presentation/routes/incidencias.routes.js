const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidencias.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Define las rutas y las conecta con sus funciones controladoras
router.get('/', authMiddleware, controller.getIncidencias);
router.put('/:id', authMiddleware, controller.updateIncidenciaStatus);

module.exports = router;