const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/controladorSeguro');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas de seguros
router.post('/', verifyToken, isAdmin, insuranceController.createInsurance);
router.get('/', verifyToken, isAdmin, insuranceController.getAllInsurances);
router.get('/:id', verifyToken, isAdmin, insuranceController.getInsuranceById);
router.put('/:id', verifyToken, isAdmin, insuranceController.updateInsurance);
router.delete('/:id', verifyToken, isAdmin, insuranceController.deleteInsurance);

module.exports = router;
