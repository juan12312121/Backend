const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/controladorDevoluciones');
const { isAdmin } = require('../middlewares/authMiddleware');

// Rutas para devoluciones
router.post('/', returnsController.createDevolucion);
router.get('/', returnsController.getAllDevolucionesByUser); // Usuarios ven sus propias devoluciones
router.get('/admin', isAdmin, returnsController.getAllDevoluciones); // Solo admin ve todas las devoluciones
router.delete('/:id', isAdmin, returnsController.deleteDevolucion); // Solo admin puede eliminar

module.exports = router;
