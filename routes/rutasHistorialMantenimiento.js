const express = require('express');
const router = express.Router();
const maintenanceHistoryController = require('../controllers/controladorHistorialMantenimiento');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Crear un nuevo mantenimiento (solo para administradores)
router.post('/', verifyToken, isAdmin, maintenanceHistoryController.createMantenimiento); 

// Obtener todos los mantenimientos (solo para administradores)
router.get('/', verifyToken, isAdmin, maintenanceHistoryController.getAllMantenimientos); 

// Obtener un mantenimiento por ID (solo para administradores)
router.get('/:id', verifyToken, isAdmin, maintenanceHistoryController.getMantenimientoById); 

// Actualizar un mantenimiento (solo para administradores)
router.put('/:id', verifyToken, isAdmin, maintenanceHistoryController.updateMantenimiento); 

// Eliminar un mantenimiento (solo para administradores)
router.delete('/:id', verifyToken, isAdmin, maintenanceHistoryController.deleteMantenimiento); 

module.exports = router;
