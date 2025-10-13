const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidencias.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Define las rutas y las conecta con sus funciones controladoras
// Todas las rutas de incidencias requieren autenticación
// router.use(verifyToken);

router.get('/', controller.getIncidencias);
router.put('/:id/status', controller.updateIncidenciaStatus);
router.post('/save', controller.saveIncidencia);
router.post('/save-offline', controller.saveOfflineIncidencias);
router.put('/:id/rating', controller.updateIncidenciaRating); 

module.exports = router;