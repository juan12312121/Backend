const express = require('express');
const router = express.Router();
const PromotionHistoryController = require('../controllers/controladorHistorialPromocion');
const { verifyToken, isAdmin, isUser } = require('../middlewares/authMiddleware');

// Obtener promociones aplicadas para el usuario autenticado
router.get('/user/promotions', verifyToken, isUser, PromotionHistoryController.getUserPromotions);

// Obtener una promoción del historial por ID
router.get('/:id', verifyToken, PromotionHistoryController.getPromotionById);

// Obtener todas las promociones aplicadas (accesible para administradores)
router.get('/', verifyToken, isAdmin, PromotionHistoryController.getAllPromotions);

// Insertar una nueva promoción en el historial (solo administradores)
router.post('/', verifyToken, isAdmin, PromotionHistoryController.insertPromotion);

// Eliminar un registro del historial por ID (solo administradores)
router.delete('/:id', verifyToken, isAdmin, PromotionHistoryController.deletePromotionById);

module.exports = router;
