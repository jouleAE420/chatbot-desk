const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidencias.controller');

// Define las rutas y las conecta con sus funciones controladoras
router.get('/', controller.getIncidencias);
router.put('/:id', controller.updateIncidenciaStatus);

module.exports = router;