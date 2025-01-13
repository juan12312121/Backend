const express = require('express');
const router = express.Router();
const rentalCriteriaController = require('../controllers/controladorCriteriosRenta');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Asegúrate de importar verifyToken

// Rutas para criterios de renta
router.get('/', rentalCriteriaController.getAllCriterios); // Obtener todos los criterios de renta

// Middleware verifyToken aplicado antes de isAdmin
router.post('/', verifyToken, isAdmin, rentalCriteriaController.createCriterio); // Crear un nuevo criterio de renta
router.get('/:id', rentalCriteriaController.getCriterioById); // Obtener un criterio de renta por ID
router.put('/:id', verifyToken, isAdmin, rentalCriteriaController.updateCriterio); // Actualizar un criterio de renta
router.delete('/:id', verifyToken, isAdmin, rentalCriteriaController.deleteCriterio); // Eliminar un criterio de renta

module.exports = router;
