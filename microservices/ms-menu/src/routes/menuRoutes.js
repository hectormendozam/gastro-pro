const express = require('express');
const router = express.Router();
const { registrarPlatillo, obtenerPlatillos, obtenerPlatillosPorCategoria } = require('../controllers/menuController');

// Rutas
router.post('/', registrarPlatillo);
router.get('/', obtenerPlatillos);
router.get('/categoria/:categoria', obtenerPlatillosPorCategoria);

module.exports = router;