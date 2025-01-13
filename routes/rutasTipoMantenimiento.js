const express = require('express');
const router = express.Router();
const maintenanceTypeController = require('../controllers/controladorTipoMantenimiento');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas de tipos de mantenimiento
router.post('/', verifyToken, isAdmin, maintenanceTypeController.createMaintenanceType);
router.get('/', verifyToken, isAdmin, maintenanceTypeController.getAllMaintenanceTypes);
router.get('/:id', verifyToken, isAdmin, maintenanceTypeController.getMaintenanceTypeById);
router.put('/:id', verifyToken, isAdmin, maintenanceTypeController.updateMaintenanceType);
router.delete('/:id', verifyToken, isAdmin, maintenanceTypeController.deleteMaintenanceType);

module.exports = router;
