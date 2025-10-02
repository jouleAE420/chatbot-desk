const { Router } = require('express');
const { getUsers } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

// Ruta protegida que requiere un token válido
router.get('/', verifyToken, getUsers);

module.exports = router;